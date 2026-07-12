import type { EmeMemoryRecord, EmeMemorySummary } from "@/lib/ai/memory-engine/types";
import type { EmeMemoryStorage } from "@/lib/ai/memory-engine/storage";
import { createEmeSummaryId, stringifyMemoryValue, utcNow } from "@/lib/ai/memory-engine/utils";

export type EmeCompressionResult = {
  summary: EmeMemorySummary;
  archivedIds: string[];
};

/**
 * Memory Summarization / Compression — old memories → long-term summaries.
 * Deterministic compression only. No LLM.
 */
export class EmeMemoryCompressionEngine {
  constructor(private readonly storage: EmeMemoryStorage) {}

  compressCategory(
    records: EmeMemoryRecord[],
    options?: { minAgeDays?: number; minCount?: number },
  ): EmeCompressionResult | null {
    const minAgeDays = options?.minAgeDays ?? 30;
    const minCount = options?.minCount ?? 5;
    if (records.length < minCount) return null;

    const cutoff = Date.now() - minAgeDays * 24 * 60 * 60 * 1000;
    const stale = records.filter((record) => Date.parse(record.updatedAt) <= cutoff);
    if (stale.length < minCount) return null;

    const first = stale[0];
    const lines = stale.slice(0, 20).map((record) => `- ${record.label}: ${stringifyMemoryValue(record.value)}`);
    const summary: EmeMemorySummary = {
      id: createEmeSummaryId(),
      level: first.level,
      category: first.category,
      summary: `Compressed ${stale.length} ${first.category} memories:\n${lines.join("\n")}`,
      memoryCount: stale.length,
      compressedAt: utcNow(),
      policy: {
        organizationId: first.policy.organizationId,
        workspaceId: first.policy.workspaceId,
        ownerId: first.policy.ownerId,
      },
    };

    const archivedIds: string[] = [];
    for (const record of stale) {
      this.storage.put({
        ...record,
        status: "archived",
        updatedAt: utcNow(),
      });
      archivedIds.push(record.id);
    }
    this.storage.putSummary(summary);

    return { summary, archivedIds };
  }
}
