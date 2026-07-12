import type { AiRuntimeContext } from "@/lib/ai/types/context";
import type { AiMemoryEntry } from "@/lib/ai/types/memory";
import {
  EME_VERSION,
  type EmeLearningSignal,
  type EmeMemoryExportBundle,
  type EmeMemoryHumanAction,
  type EmeMemoryRecord,
  type EmeMemoryResolveRequest,
  type EmeMemorySearchQuery,
  type EmeMemoryWriteInput,
} from "@/lib/ai/memory-engine/types";
import { EmeMemoryStorage } from "@/lib/ai/memory-engine/storage";
import { EmeMemoryRegistry } from "@/lib/ai/memory-engine/registry";
import { EmeSessionMemoryStore } from "@/lib/ai/memory-engine/sessions";
import { EmeUserMemoryStore } from "@/lib/ai/memory-engine/users";
import { EmeWorkspaceMemoryStore } from "@/lib/ai/memory-engine/workspace";
import { EmeCompanyMemoryStore } from "@/lib/ai/memory-engine/companies";
import { EmeEngagementMemoryStore } from "@/lib/ai/memory-engine/engagements";
import { EmeOrganizationMemoryStore } from "@/lib/ai/memory-engine/organizations";
import { EmePreferenceEngine } from "@/lib/ai/memory-engine/preferences";
import { EmeLearningMemoryStore } from "@/lib/ai/memory-engine/learning";
import { EmeLearningRulesEngine } from "@/lib/ai/memory-engine/learning-rules";
import { EmeMemoryResolver } from "@/lib/ai/memory-engine/resolver";
import { EmeMemorySearchEngine } from "@/lib/ai/memory-engine/search";
import { EmeMemoryCleanupEngine } from "@/lib/ai/memory-engine/cleanup";
import { EmeMemoryScheduler } from "@/lib/ai/memory-engine/scheduler";
import { EmeMemoryTelemetry } from "@/lib/ai/memory-engine/telemetry";
import { EmeMemoryStatistics } from "@/lib/ai/memory-engine/statistics";
import { EmeMemoryHistoryStore } from "@/lib/ai/memory-engine/history";
import { EmeMemoryContextBuilderWithSummaries } from "@/lib/ai/memory-engine/context";
import { scopeFromContext } from "@/lib/ai/memory-engine/policies";
import { createEmeError, utcNow } from "@/lib/ai/memory-engine/utils";

/**
 * Enterprise Memory Engine — provider-independent facade.
 * Conversation → Resolver → Ranking → Context Builder → Prompt Builder
 */
export class EnterpriseMemoryEngine {
  readonly version = EME_VERSION;
  readonly registry: EmeMemoryRegistry;
  readonly storage: EmeMemoryStorage;
  readonly resolver: EmeMemoryResolver;
  readonly searchEngine: EmeMemorySearchEngine;
  readonly cleanup: EmeMemoryCleanupEngine;
  readonly scheduler: EmeMemoryScheduler;
  readonly telemetry: EmeMemoryTelemetry;
  readonly statistics: EmeMemoryStatistics;
  readonly history: EmeMemoryHistoryStore;
  readonly sessions: EmeSessionMemoryStore;
  readonly users: EmeUserMemoryStore;
  readonly workspace: EmeWorkspaceMemoryStore;
  readonly companies: EmeCompanyMemoryStore;
  readonly engagements: EmeEngagementMemoryStore;
  readonly organizations: EmeOrganizationMemoryStore;
  readonly preferences: EmePreferenceEngine;
  readonly learning: EmeLearningMemoryStore;
  private readonly rules = new EmeLearningRulesEngine();
  private readonly contextBuilder: EmeMemoryContextBuilderWithSummaries;

  constructor(storage: EmeMemoryStorage = new EmeMemoryStorage()) {
    this.storage = storage;
    this.registry = new EmeMemoryRegistry();
    this.telemetry = new EmeMemoryTelemetry();
    this.history = new EmeMemoryHistoryStore();
    this.resolver = new EmeMemoryResolver(storage, this.telemetry, this.history);
    this.searchEngine = new EmeMemorySearchEngine(storage);
    this.cleanup = new EmeMemoryCleanupEngine(storage);
    this.scheduler = new EmeMemoryScheduler();
    this.statistics = new EmeMemoryStatistics(storage, this.telemetry);
    this.sessions = new EmeSessionMemoryStore(storage);
    this.users = new EmeUserMemoryStore(storage);
    this.workspace = new EmeWorkspaceMemoryStore(storage);
    this.companies = new EmeCompanyMemoryStore(storage);
    this.engagements = new EmeEngagementMemoryStore(storage);
    this.organizations = new EmeOrganizationMemoryStore(storage);
    this.preferences = new EmePreferenceEngine(storage);
    this.learning = new EmeLearningMemoryStore(storage);
    this.contextBuilder = new EmeMemoryContextBuilderWithSummaries(storage, this.preferences);

    this.scheduler.register(
      { id: "eme_cleanup", intervalMs: 60 * 60 * 1000, enabled: false },
      () => {
        const report = this.cleanup.run();
        this.telemetry.observeCompression(report.summariesCreated);
        return report;
      },
    );
  }

  remember(context: AiRuntimeContext, input: EmeMemoryWriteInput): EmeMemoryRecord | { ok: false; error: ReturnType<typeof createEmeError> } {
    const validated = this.rules.validateWrite(input, context);
    if (!validated.ok) return validated;

    const store = this.storeForLevel(input.level);
    if (input.level === "session") {
      if (!input.conversationId) {
        return { ok: false, error: createEmeError("missing_conversation", "Session memory requires conversationId.") };
      }
      const record = this.sessions.remember(context, input.conversationId, input.key, input.value, input.category);
      this.telemetry.observeCreated(record.policy.confidence);
      this.resolver.invalidateCache(context, input.conversationId);
      return record;
    }
    if (!store) {
      return { ok: false, error: createEmeError("unsupported_level", `Unsupported memory level: ${input.level}`) };
    }
    const record = store.remember(context, input);
    this.telemetry.observeCreated(record.policy.confidence);
    this.history.record({
      kind: "created",
      memoryId: record.id,
      userId: context.userId,
      workspaceId: context.workspaceId,
      detail: `Created ${record.level}.${record.key}`,
    });
    this.resolver.invalidateCache(context, input.conversationId);
    return record;
  }

  resolve(request: EmeMemoryResolveRequest) {
    return this.resolver.resolve(request);
  }

  toPromptMemory(request: EmeMemoryResolveRequest): AiMemoryEntry[] {
    const context = this.resolve(request);
    return this.contextBuilder.toPromptMemoryEntries(context);
  }

  ingestLearningSignal(context: AiRuntimeContext, signal: EmeLearningSignal, interactionId?: string | null) {
    const result = this.learning.ingestSignal(context, signal, interactionId);
    if (result.ok) this.telemetry.observeCandidate("pending");
    return result;
  }

  promoteCandidate(context: AiRuntimeContext, candidateId: string, reviewerId: string) {
    const record = this.learning.promote(context, candidateId, reviewerId);
    if (record) {
      this.telemetry.observeCandidate("accepted");
      this.telemetry.observeCreated(record.policy.confidence);
    }
    return record;
  }

  rejectCandidate(candidateId: string, reviewerId: string) {
    const ok = this.learning.reject(candidateId, reviewerId);
    if (ok) this.telemetry.observeCandidate("rejected");
    return ok;
  }

  captureWorkspaceContext(context: AiRuntimeContext) {
    return this.workspace.rememberSelection(context);
  }

  search(query: EmeMemorySearchQuery) {
    return this.searchEngine.search(query);
  }

  applyHumanAction(context: AiRuntimeContext, action: EmeMemoryHumanAction): boolean | EmeMemoryRecord | null {
    switch (action.action) {
      case "pin": {
        const record = this.storage.get(action.memoryId);
        if (!record) return false;
        const updated = this.storage.put({ ...record, pinned: true, status: "pinned", updatedAt: utcNow() });
        this.history.record({ kind: "pinned", memoryId: record.id, userId: context.userId, workspaceId: context.workspaceId, detail: "Pinned memory" });
        this.resolver.invalidateCache(context);
        return updated;
      }
      case "edit": {
        const record = this.storage.get(action.memoryId);
        if (!record) return null;
        const updated = this.storage.put({
          ...record,
          ...action.patch,
          updatedAt: utcNow(),
        });
        this.history.record({ kind: "edited", memoryId: record.id, userId: context.userId, workspaceId: context.workspaceId, detail: "Edited memory" });
        this.resolver.invalidateCache(context);
        return updated;
      }
      case "forget": {
        const record = this.storage.get(action.memoryId);
        if (!record) return false;
        this.storage.put({ ...record, status: "forgotten", updatedAt: utcNow() });
        this.history.record({ kind: "forgotten", memoryId: record.id, userId: context.userId, workspaceId: context.workspaceId, detail: "Forgot memory" });
        this.resolver.invalidateCache(context);
        return true;
      }
      case "disable_learning": {
        const records = this.storage.listRecords({ scope: { userId: action.userId }, limit: 500 });
        for (const record of records) {
          this.storage.put({
            ...record,
            policy: { ...record.policy, learningEnabled: false },
            updatedAt: utcNow(),
          });
        }
        return true;
      }
      case "reset": {
        const removed = this.storage.clearScope(action.scope, action.levels);
        this.resolver.invalidateCache(context);
        return removed > 0;
      }
      default:
        return false;
    }
  }

  exportMemories(context: AiRuntimeContext): EmeMemoryExportBundle {
    const scope = scopeFromContext(context);
    const bundle = this.storage.exportBundle(scope);
    return {
      version: EME_VERSION,
      exportedAt: utcNow(),
      scope,
      records: bundle.records.filter((record) => record.status !== "forgotten"),
      summaries: bundle.summaries,
    };
  }

  importMemories(context: AiRuntimeContext, bundle: EmeMemoryExportBundle): number {
    if (bundle.scope.organizationId && context.organizationId && bundle.scope.organizationId !== context.organizationId) {
      return 0;
    }
    const count = this.storage.importRecords(
      bundle.records.filter((record) => {
        const validated = this.rules.validateWrite(
          {
            key: record.key,
            level: record.level,
            category: record.category,
            label: record.label,
            value: record.value,
          },
          context,
        );
        return validated.ok;
      }),
    );
    this.history.record({
      kind: "imported",
      memoryId: null,
      userId: context.userId,
      workspaceId: context.workspaceId,
      detail: `Imported ${count} memories`,
    });
    this.resolver.invalidateCache(context);
    return count;
  }

  listMemories(context: AiRuntimeContext, limit = 100): EmeMemoryRecord[] {
    return this.storage.listRecords({
      scope: scopeFromContext(context),
      status: "active",
      limit,
    });
  }

  stats() {
    return this.statistics.snapshot();
  }

  private storeForLevel(level: EmeMemoryWriteInput["level"]) {
    switch (level) {
      case "session":
        return null;
      case "user":
        return this.users;
      case "workspace":
        return this.workspace;
      case "company":
        return this.companies;
      case "engagement":
        return this.engagements;
      case "organization":
        return this.organizations;
      case "preference":
        return this.preferences;
      case "learning":
        return this.learning;
      case "persistent":
      case "temporary":
        return this.users;
      default:
        return null;
    }
  }
}

let singleton: EnterpriseMemoryEngine | null = null;

export function getEnterpriseMemoryEngine(): EnterpriseMemoryEngine {
  if (!singleton) singleton = new EnterpriseMemoryEngine();
  return singleton;
}

export function bootstrapEnterpriseMemoryEngine(storage?: EmeMemoryStorage): EnterpriseMemoryEngine {
  const engine = new EnterpriseMemoryEngine(storage);
  singleton = engine;
  return engine;
}
