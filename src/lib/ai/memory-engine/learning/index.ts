import type { AiRuntimeContext } from "@/lib/ai/types/context";
import type { EmeLearningSignal, EmeMemoryRecord } from "@/lib/ai/memory-engine/types";
import type { EmeMemoryStorage } from "@/lib/ai/memory-engine/storage";
import { EmeLearningRulesEngine } from "@/lib/ai/memory-engine/learning-rules";
import { EmeScopedMemoryStore } from "@/lib/ai/memory-engine/utils/scoped-store";
import { createEmeCandidateId, utcNow } from "@/lib/ai/memory-engine/utils";

/**
 * Learning memory — approved/rejected patterns, habits, frequent actions.
 * Never auto-persists: produces candidates for review.
 */
export class EmeLearningMemoryStore {
  private readonly rules = new EmeLearningRulesEngine();
  private readonly scoped: EmeScopedMemoryStore;

  constructor(private readonly storage: EmeMemoryStorage) {
    this.scoped = new EmeScopedMemoryStore(storage, { level: "learning", defaultVisibility: "private" });
  }

  ingestSignal(context: AiRuntimeContext, signal: EmeLearningSignal, interactionId?: string | null) {
    const validated = this.rules.validateSignal(signal, context);
    if (!validated.ok) return validated;

    const categoryMap: Record<EmeLearningSignal["kind"], string> = {
      approved_mapping: "approved_mapping",
      approved_suggestion: "approved_suggestion",
      rejected_suggestion: "rejected_suggestion",
      tool_usage: "tool_usage",
      workflow_order: "workflow_order",
      navigation_habit: "navigation_habit",
      repeated_prompt: "repeated_prompt",
      frequent_action: "frequent_action",
    };

    const candidate = this.storage.putCandidate({
      id: createEmeCandidateId(),
      record: {
        key: signal.key,
        level: "learning",
        category: categoryMap[signal.kind],
        label: signal.key,
        value: signal.value,
        valueType: typeof signal.value === "string" ? "string" : "json",
        keywords: [signal.key, signal.kind, signal.moduleId ?? "global"].filter(Boolean) as string[],
        moduleId: signal.moduleId ?? context.moduleId,
        policy: {
          visibility: "private",
          ownerId: context.userId,
          workspaceId: context.workspaceId,
          organizationId: context.organizationId,
          companyId: context.companyId,
          engagementId: context.engagementId,
          expiresAt: null,
          confidence: signal.confidence,
          source: "learning",
          importance: 0.6,
          learningEnabled: true,
        },
        pinned: false,
        conversationId: null,
      },
      interactionId: interactionId ?? null,
      reviewDecision: "pending",
      reviewedAt: null,
      reviewedBy: null,
      createdAt: utcNow(),
    });

    return { ok: true as const, candidate };
  }

  promote(context: AiRuntimeContext, candidateId: string, reviewerId: string): EmeMemoryRecord | null {
    const candidate = this.storage.getCandidate(candidateId);
    if (!candidate || candidate.reviewDecision !== "pending") return null;
    const record = this.scoped.remember(context, {
      key: candidate.record.key,
      level: "learning",
      category: candidate.record.category,
      label: candidate.record.label,
      value: candidate.record.value,
      keywords: candidate.record.keywords,
      moduleId: candidate.record.moduleId,
      policy: { ...candidate.record.policy, source: "learning" },
    });
    this.storage.putCandidate({
      ...candidate,
      reviewDecision: "accepted",
      reviewedAt: utcNow(),
      reviewedBy: reviewerId,
    });
    return record;
  }

  reject(candidateId: string, reviewerId: string): boolean {
    const candidate = this.storage.getCandidate(candidateId);
    if (!candidate || candidate.reviewDecision !== "pending") return false;
    this.storage.putCandidate({
      ...candidate,
      reviewDecision: "rejected",
      reviewedAt: utcNow(),
      reviewedBy: reviewerId,
    });
    return true;
  }

  list(context: AiRuntimeContext): EmeMemoryRecord[] {
    return this.storage.listRecords({
      scope: { organizationId: context.organizationId, userId: context.userId },
      level: "learning",
      status: "active",
    });
  }

  remember(context: AiRuntimeContext, input: Parameters<EmeScopedMemoryStore["remember"]>[1]): EmeMemoryRecord {
    return this.scoped.remember(context, { ...input, level: "learning" });
  }
}
