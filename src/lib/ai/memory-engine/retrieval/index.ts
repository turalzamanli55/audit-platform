import type { EmeMemoryRecord, EmeMemoryResolveRequest, EmeRankedMemory } from "@/lib/ai/memory-engine/types";
import type { EmeMemoryStorage } from "@/lib/ai/memory-engine/storage";
import { EmeMemoryPolicyEngine } from "@/lib/ai/memory-engine/policies";
import { EmeMemoryRankingEngine } from "@/lib/ai/memory-engine/ranking";
import { isMemoryExpired } from "@/lib/ai/memory-engine/utils";

/**
 * Memory Retrieval — gather scoped memories for resolver/context builder.
 */
export class EmeMemoryRetrievalEngine {
  private readonly policies = new EmeMemoryPolicyEngine();
  private readonly ranking = new EmeMemoryRankingEngine();

  constructor(private readonly storage: EmeMemoryStorage) {}

  retrieve(request: EmeMemoryResolveRequest): EmeRankedMemory[] {
    const { context, conversationId, moduleId, limit = 40 } = request;
    const levels = new Set<EmeMemoryRecord["level"]>([
      "session",
      "user",
      "workspace",
      "preference",
      "company",
      "engagement",
      "organization",
      "learning",
      "persistent",
    ]);

    const raw = this.storage.listRecords({
      scope: {
        organizationId: context.organizationId,
        workspaceId: context.workspaceId,
        userId: context.userId,
        companyId: context.companyId,
        engagementId: context.engagementId,
        conversationId: conversationId ?? undefined,
      },
      limit: 500,
    });

    const filtered = raw.filter((record) => {
      if (!levels.has(record.level)) return false;
      if (record.status !== "active" && record.status !== "pinned") return false;
      if (isMemoryExpired(record.policy.expiresAt)) return false;
      if (moduleId && record.moduleId && record.moduleId !== moduleId && record.moduleId !== context.moduleId) {
        return false;
      }
      const readable = this.policies.assertReadable(record, context);
      return readable.ok;
    });

    return this.ranking.rankMany(filtered.map((record) => ({ record, context }))).slice(0, limit);
  }
}

export type { EmeRankedMemory };
