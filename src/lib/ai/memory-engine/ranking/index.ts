import type { EmeMemoryRankInput, EmeRankedMemory } from "@/lib/ai/memory-engine/types";
import { clamp01, isMemoryExpired } from "@/lib/ai/memory-engine/utils";

const WEIGHTS = {
  confidence: 0.3,
  freshness: 0.2,
  frequency: 0.15,
  workspaceRelevance: 0.15,
  organizationRelevance: 0.1,
  engagementRelevance: 0.1,
  pinBoost: 0.25,
};

/**
 * Memory Ranking — confidence, freshness, frequency, scope relevance.
 */
export class EmeMemoryRankingEngine {
  rank(input: EmeMemoryRankInput): EmeRankedMemory {
    const now = input.now ?? Date.now();
    const { record, context } = input;

    const confidence = clamp01(record.policy.confidence);
    const freshness = this.freshnessScore(record.updatedAt, record.policy.expiresAt, now);
    const frequency = clamp01(Math.log10(record.frequency + 1) / 2);
    const workspaceRelevance = this.scopeMatch(record.policy.workspaceId, context.workspaceId);
    const organizationRelevance = this.scopeMatch(record.policy.organizationId, context.organizationId);
    const engagementRelevance = this.scopeMatch(record.policy.engagementId, context.engagementId);
    const pinBoost = record.pinned ? 1 : 0;

    const rankScore =
      confidence * WEIGHTS.confidence +
      freshness * WEIGHTS.freshness +
      frequency * WEIGHTS.frequency +
      workspaceRelevance * WEIGHTS.workspaceRelevance +
      organizationRelevance * WEIGHTS.organizationRelevance +
      engagementRelevance * WEIGHTS.engagementRelevance +
      pinBoost * WEIGHTS.pinBoost +
      clamp01(record.policy.importance) * 0.1;

    return {
      ...record,
      rankScore: Number(rankScore.toFixed(4)),
      rankFactors: {
        confidence,
        freshness,
        frequency,
        workspaceRelevance,
        organizationRelevance,
        engagementRelevance,
        pinBoost,
      },
    };
  }

  rankMany(inputs: EmeMemoryRankInput[]): EmeRankedMemory[] {
    return inputs
      .map((input) => this.rank(input))
      .sort((a, b) => b.rankScore - a.rankScore);
  }

  private freshnessScore(updatedAt: string, expiresAt: string | null, now: number): number {
    if (isMemoryExpired(expiresAt, now)) return 0;
    const ageMs = now - Date.parse(updatedAt);
    const dayMs = 24 * 60 * 60 * 1000;
    if (ageMs <= dayMs) return 1;
    if (ageMs <= 7 * dayMs) return 0.75;
    if (ageMs <= 30 * dayMs) return 0.5;
    return 0.25;
  }

  private scopeMatch(recordScope: string | null, contextScope: string | null): number {
    if (!recordScope) return 0.5;
    if (!contextScope) return 0.25;
    return recordScope === contextScope ? 1 : 0;
  }
}
