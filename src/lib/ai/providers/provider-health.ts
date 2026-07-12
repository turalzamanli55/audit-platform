/**
 * Provider health tracking — status only, no network probes until configured.
 */

import type { LlmHealthCheckResult, LlmHealthStatus, LlmProviderId } from "@/lib/ai/providers/provider";

export type LlmProviderHealthRecord = LlmHealthCheckResult & {
  consecutiveFailures: number;
  updatedAt: string;
};

export class LlmProviderHealthTracker {
  private readonly records = new Map<LlmProviderId, LlmProviderHealthRecord>();

  record(result: LlmHealthCheckResult): LlmProviderHealthRecord {
    const previous = this.records.get(result.providerId);
    const consecutiveFailures =
      result.status === "healthy"
        ? 0
        : (previous?.consecutiveFailures ?? 0) + (result.status === "unknown" ? 0 : 1);

    const record: LlmProviderHealthRecord = {
      ...result,
      consecutiveFailures,
      updatedAt: new Date().toISOString(),
    };
    this.records.set(result.providerId, record);
    return record;
  }

  get(providerId: LlmProviderId): LlmProviderHealthRecord | undefined {
    return this.records.get(providerId);
  }

  list(): LlmProviderHealthRecord[] {
    return [...this.records.values()];
  }

  isRoutable(providerId: LlmProviderId): boolean {
    const record = this.records.get(providerId);
    if (!record) return true;
    return record.status === "healthy" || record.status === "unknown";
  }

  mark(providerId: LlmProviderId, status: LlmHealthStatus, message?: string): LlmProviderHealthRecord {
    return this.record({
      providerId,
      status,
      checkedAt: new Date().toISOString(),
      message,
    });
  }
}
