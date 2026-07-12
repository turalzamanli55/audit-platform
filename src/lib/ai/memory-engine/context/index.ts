import type { AiRuntimeContext } from "@/lib/ai/types/context";
import type { AiMemoryEntry } from "@/lib/ai/types/memory";
import type {
  EmeMemoryContext,
  EmeMemoryResolveRequest,
  EmeRankedMemory,
} from "@/lib/ai/memory-engine/types";
import { EME_VERSION } from "@/lib/ai/memory-engine/types";
import type { EmeMemoryStorage } from "@/lib/ai/memory-engine/storage";
import { scopeFromContext } from "@/lib/ai/memory-engine/policies";
import { EmeMemoryRetrievalEngine } from "@/lib/ai/memory-engine/retrieval";
import { EmePreferenceEngine } from "@/lib/ai/memory-engine/preferences";
import { stringifyMemoryValue, tokenEstimate } from "@/lib/ai/memory-engine/utils";

/**
 * Memory Context Builder — ranked memories → prompt-safe context.
 */
export class EmeMemoryContextBuilder {
  private readonly retrieval: EmeMemoryRetrievalEngine;

  constructor(
    storage: EmeMemoryStorage,
    private readonly preferences: EmePreferenceEngine,
  ) {
    this.retrieval = new EmeMemoryRetrievalEngine(storage);
  }

  build(request: EmeMemoryResolveRequest): EmeMemoryContext {
    return this.buildWithSummaries(request, []);
  }

  buildWithSummaries(
    request: EmeMemoryResolveRequest,
    summaries: EmeMemoryContext["summaries"],
  ): EmeMemoryContext {
    const entries = this.retrieval.retrieve(request) as EmeRankedMemory[];
    const preferences = this.preferences.snapshot(request.context);
    const serialized = entries.map((entry) => `${entry.label}: ${stringifyMemoryValue(entry.value)}`).join("\n");
    const summaryText = summaries.map((summary) => summary.summary).join("\n");

    return {
      version: EME_VERSION,
      scope: scopeFromContext(request.context, request.conversationId),
      entries,
      summaries,
      preferences,
      builtAt: new Date().toISOString(),
      tokenEstimate: tokenEstimate(`${serialized}\n${summaryText}`),
    };
  }

  toPromptMemoryEntries(context: EmeMemoryContext): AiMemoryEntry[] {
    return context.entries.map((entry) => ({
      id: entry.id,
      key: `${entry.level}.${entry.key}`,
      value: {
        label: entry.label,
        category: entry.category,
        value: entry.value,
        rankScore: entry.rankScore,
        confidence: entry.policy.confidence,
      },
      createdAt: entry.updatedAt,
    }));
  }
}

export class EmeMemoryContextBuilderWithSummaries extends EmeMemoryContextBuilder {}
