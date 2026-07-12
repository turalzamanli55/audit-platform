import type { EmeMemoryStorage } from "@/lib/ai/memory-engine/storage";
import type { EmeMemoryTelemetry } from "@/lib/ai/memory-engine/telemetry";

/**
 * Memory statistics — derived metrics from storage + telemetry.
 */
export class EmeMemoryStatistics {
  constructor(
    private readonly storage: EmeMemoryStorage,
    private readonly telemetry: EmeMemoryTelemetry,
  ) {}

  snapshot() {
    const telemetry = this.telemetry.snapshot(this.storage);
    const active = this.storage.listRecords({ status: "active", limit: 5000 }).length;
    const pinned = this.storage.listRecords({ status: "active", limit: 5000 }).filter((r) => r.pinned).length;
    const candidates = this.storage.listCandidates(true).length;
    const summaries = this.storage.listSummaries().length;
    return {
      activeMemories: active,
      pinnedMemories: pinned,
      pendingCandidates: candidates,
      summaryCount: summaries,
      telemetry,
    };
  }
}
