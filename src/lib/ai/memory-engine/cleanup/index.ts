import type { EmeMemoryLevel, EmeMemoryRecord } from "@/lib/ai/memory-engine/types";
import type { EmeMemoryStorage } from "@/lib/ai/memory-engine/storage";
import { EmeMemoryCompressionEngine } from "@/lib/ai/memory-engine/compression";
import { dedupeKey, isMemoryExpired, utcNow } from "@/lib/ai/memory-engine/utils";

export type EmeCleanupReport = {
  expiredArchived: number;
  duplicatesMerged: number;
  lowConfidenceArchived: number;
  summariesCreated: number;
};

/**
 * Memory Cleanup — archive expired, duplicated, obsolete, low-confidence memories.
 */
export class EmeMemoryCleanupEngine {
  private readonly compression: EmeMemoryCompressionEngine;

  constructor(private readonly storage: EmeMemoryStorage) {
    this.compression = new EmeMemoryCompressionEngine(storage);
  }

  run(options?: {
    lowConfidenceThreshold?: number;
    compress?: boolean;
  }): EmeCleanupReport {
    const threshold = options?.lowConfidenceThreshold ?? 0.25;
    let expiredArchived = 0;
    let duplicatesMerged = 0;
    let lowConfidenceArchived = 0;
    let summariesCreated = 0;

    const active = this.storage.listRecords({ status: "active", limit: 5000 });
    const seen = new Map<string, EmeMemoryRecord>();

    for (const record of active) {
      if (isMemoryExpired(record.policy.expiresAt)) {
        this.archive(record);
        expiredArchived += 1;
        continue;
      }
      if (record.policy.confidence < threshold && !record.pinned) {
        this.archive(record);
        lowConfidenceArchived += 1;
        continue;
      }
      const key = dedupeKey(record);
      const existing = seen.get(key);
      if (existing) {
        this.storage.put({
          ...existing,
          frequency: existing.frequency + record.frequency,
          updatedAt: utcNow(),
        });
        this.storage.delete(record.id);
        duplicatesMerged += 1;
        continue;
      }
      seen.set(key, record);
    }

    if (options?.compress !== false) {
      const byCategory = new Map<string, EmeMemoryRecord[]>();
      for (const record of this.storage.listRecords({ status: "active", limit: 5000 })) {
        const bucket = `${record.level}:${record.category}`;
        const list = byCategory.get(bucket) ?? [];
        list.push(record);
        byCategory.set(bucket, list);
      }
      for (const records of byCategory.values()) {
        const result = this.compression.compressCategory(records);
        if (result) summariesCreated += 1;
      }
    }

    return { expiredArchived, duplicatesMerged, lowConfidenceArchived, summariesCreated };
  }

  archiveByLevels(scope: Partial<{ organizationId: string; workspaceId: string; userId: string }>, levels: EmeMemoryLevel[]): number {
    const records = this.storage.listRecords({ scope, limit: 5000 }).filter((record) => levels.includes(record.level));
    for (const record of records) this.archive(record);
    return records.length;
  }

  private archive(record: EmeMemoryRecord): void {
    this.storage.put({ ...record, status: "archived", updatedAt: utcNow() });
  }
}
