import type { AiRuntimeContext } from "@/lib/ai/types/context";
import type {
  EmeMemoryContext,
  EmeMemoryResolveRequest,
  EmeMemoryWriteInput,
} from "@/lib/ai/memory-engine/types";
import type { EmeMemoryStorage } from "@/lib/ai/memory-engine/storage";
import { EmeMemoryContextBuilderWithSummaries } from "@/lib/ai/memory-engine/context";
import { EmePreferenceEngine } from "@/lib/ai/memory-engine/preferences";
import { EmeMemoryRetrievalEngine } from "@/lib/ai/memory-engine/retrieval";
import { buildCacheKey, EmeMemoryCache } from "@/lib/ai/memory-engine/cache";
import { EmeMemoryTelemetry } from "@/lib/ai/memory-engine/telemetry";
import { EmeMemoryHistoryStore } from "@/lib/ai/memory-engine/history";

/**
 * Memory Resolver — Conversation → scoped, ranked memory context.
 */
export class EmeMemoryResolver {
  private readonly retrieval: EmeMemoryRetrievalEngine;
  private readonly contextBuilder: EmeMemoryContextBuilderWithSummaries;
  private readonly cache: EmeMemoryCache;

  constructor(
    private readonly storage: EmeMemoryStorage,
    private readonly telemetry: EmeMemoryTelemetry,
    private readonly history: EmeMemoryHistoryStore,
    cache?: EmeMemoryCache,
  ) {
    this.retrieval = new EmeMemoryRetrievalEngine(storage);
    this.contextBuilder = new EmeMemoryContextBuilderWithSummaries(
      storage,
      new EmePreferenceEngine(storage),
    );
    this.cache = cache ?? new EmeMemoryCache();
  }

  resolve(request: EmeMemoryResolveRequest): EmeMemoryContext {
    const cacheKey = buildCacheKey({
      userId: request.context.userId,
      workspaceId: request.context.workspaceId,
      companyId: request.context.companyId,
      engagementId: request.context.engagementId,
      conversationId: request.conversationId,
    });
    const cached = this.cache.get(cacheKey);
    if (cached) {
      this.telemetry.observeUsed();
      return cached;
    }

    const summaries = this.storage.listSummaries({
      organizationId: request.context.organizationId,
      workspaceId: request.context.workspaceId,
      userId: request.context.userId,
    });
    const context = this.contextBuilder.buildWithSummaries(request, summaries);
    if (context.entries.length === 0) this.telemetry.observeIgnored();
    else {
      for (const entry of context.entries) {
        this.history.touchUsed(entry, request.context.userId);
        this.telemetry.observeUsed();
      }
    }
    this.cache.set(cacheKey, context);
    return context;
  }

  invalidateCache(context: AiRuntimeContext, conversationId?: string | null): void {
    this.cache.invalidate(
      buildCacheKey({
        userId: context.userId,
        workspaceId: context.workspaceId,
        companyId: context.companyId,
        engagementId: context.engagementId,
        conversationId,
      }),
    );
  }

  previewRecords(request: EmeMemoryResolveRequest) {
    return this.retrieval.retrieve(request);
  }
}

export type { EmeMemoryWriteInput };
