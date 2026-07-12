import type {
  EmeMemoryCandidate,
  EmeMemoryLevel,
  EmeMemoryRecord,
  EmeMemoryScope,
  EmeMemorySummary,
} from "@/lib/ai/memory-engine/types";
import { dedupeKey } from "@/lib/ai/memory-engine/utils";

/**
 * Unified in-process memory storage — tenant/workspace isolated indexes.
 * No database. No vector store.
 */
export class EmeMemoryStorage {
  private readonly records = new Map<string, EmeMemoryRecord>();
  private readonly candidates = new Map<string, EmeMemoryCandidate>();
  private readonly summaries = new Map<string, EmeMemorySummary>();
  private readonly dedupeIndex = new Map<string, string>();

  put(record: EmeMemoryRecord): EmeMemoryRecord {
    this.records.set(record.id, record);
    this.dedupeIndex.set(dedupeKey(record), record.id);
    return record;
  }

  get(id: string): EmeMemoryRecord | undefined {
    return this.records.get(id);
  }

  findByDedupeKey(key: string): EmeMemoryRecord | undefined {
    const id = this.dedupeIndex.get(key);
    return id ? this.records.get(id) : undefined;
  }

  delete(id: string): boolean {
    const existing = this.records.get(id);
    if (!existing) return false;
    this.records.delete(id);
    this.dedupeIndex.delete(dedupeKey(existing));
    return true;
  }

  listRecords(filter?: {
    scope?: Partial<EmeMemoryScope>;
    level?: EmeMemoryLevel;
    status?: EmeMemoryRecord["status"];
    limit?: number;
  }): EmeMemoryRecord[] {
    return [...this.records.values()]
      .filter((record) => this.matchesScope(record, filter?.scope))
      .filter((record) => (filter?.level ? record.level === filter.level : true))
      .filter((record) => (filter?.status ? record.status === filter.status : true))
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .slice(0, filter?.limit ?? 500);
  }

  putCandidate(candidate: EmeMemoryCandidate): EmeMemoryCandidate {
    this.candidates.set(candidate.id, candidate);
    return candidate;
  }

  getCandidate(id: string): EmeMemoryCandidate | undefined {
    return this.candidates.get(id);
  }

  listCandidates(pendingOnly = true): EmeMemoryCandidate[] {
    return [...this.candidates.values()]
      .filter((c) => (pendingOnly ? c.reviewDecision === "pending" : true))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  deleteCandidate(id: string): boolean {
    return this.candidates.delete(id);
  }

  putSummary(summary: EmeMemorySummary): EmeMemorySummary {
    this.summaries.set(summary.id, summary);
    return summary;
  }

  listSummaries(scope?: Partial<EmeMemoryScope>): EmeMemorySummary[] {
    return [...this.summaries.values()].filter((summary) => {
      if (!scope) return true;
      if (scope.organizationId && summary.policy.organizationId !== scope.organizationId) return false;
      if (scope.workspaceId && summary.policy.workspaceId !== scope.workspaceId) return false;
      if (scope.userId && summary.policy.ownerId !== scope.userId) return false;
      return true;
    });
  }

  clearScope(scope: Partial<EmeMemoryScope>, levels?: EmeMemoryLevel[]): number {
    let removed = 0;
    for (const record of this.records.values()) {
      if (!this.matchesScope(record, scope)) continue;
      if (levels && !levels.includes(record.level)) continue;
      if (this.delete(record.id)) removed += 1;
    }
    return removed;
  }

  countByLevel(): Record<EmeMemoryLevel, number> {
    const counts = Object.fromEntries(
      (["session", "user", "workspace", "company", "engagement", "organization", "preference", "learning", "temporary", "persistent"] as EmeMemoryLevel[]).map(
        (level) => [level, 0],
      ),
    ) as Record<EmeMemoryLevel, number>;
    for (const record of this.records.values()) {
      counts[record.level] += 1;
    }
    return counts;
  }

  exportBundle(scope: Partial<EmeMemoryScope>): {
    records: EmeMemoryRecord[];
    summaries: EmeMemorySummary[];
  } {
    return {
      records: this.listRecords({ scope, limit: 5000 }),
      summaries: this.listSummaries(scope),
    };
  }

  importRecords(records: EmeMemoryRecord[]): number {
    let imported = 0;
    for (const record of records) {
      this.put(record);
      imported += 1;
    }
    return imported;
  }

  private matchesScope(record: EmeMemoryRecord, scope?: Partial<EmeMemoryScope>): boolean {
    if (!scope) return true;
    if (scope.organizationId && record.policy.organizationId !== scope.organizationId) return false;
    if (scope.workspaceId && record.policy.workspaceId !== scope.workspaceId) return false;
    if (scope.userId && record.policy.ownerId !== scope.userId) return false;
    if (scope.companyId && record.policy.companyId !== scope.companyId) return false;
    if (scope.engagementId && record.policy.engagementId !== scope.engagementId) return false;
    if (scope.conversationId && record.conversationId !== scope.conversationId) return false;
    return true;
  }
}
