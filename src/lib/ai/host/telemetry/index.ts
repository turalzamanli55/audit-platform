import type {
  AiHostExecutionResult,
  AiHostRiskLevel,
  AiHostTelemetrySnapshot,
} from "@/lib/ai/host/types";

/**
 * Host telemetry — in-process counters only.
 */
export class AiHostTelemetry {
  private totalPlans = 0;
  private pendingCount = 0;
  private approvedCount = 0;
  private executedCount = 0;
  private succeededCount = 0;
  private failedCount = 0;
  private cancelledCount = 0;
  private rejectedCount = 0;
  private autoApprovedCount = 0;
  private totalDurationMs = 0;
  private readonly byRiskLevel: Record<AiHostRiskLevel, number> = {
    low: 0,
    medium: 0,
    high: 0,
    critical: 0,
  };
  private readonly byServerAction: Record<string, number> = {};

  observePlanCreated(risk: AiHostRiskLevel, autoApproved: boolean): void {
    this.totalPlans += 1;
    this.pendingCount += autoApproved ? 0 : 1;
    this.approvedCount += autoApproved ? 1 : 0;
    this.autoApprovedCount += autoApproved ? 1 : 0;
    this.byRiskLevel[risk] += 1;
  }

  observeApproval(kind: "approved" | "rejected" | "cancelled"): void {
    if (kind === "approved") {
      this.approvedCount += 1;
      this.pendingCount = Math.max(0, this.pendingCount - 1);
      return;
    }
    if (kind === "rejected") {
      this.rejectedCount += 1;
      this.pendingCount = Math.max(0, this.pendingCount - 1);
      return;
    }
    this.cancelledCount += 1;
    this.pendingCount = Math.max(0, this.pendingCount - 1);
  }

  observeExecution(result: AiHostExecutionResult, serverActionId: string): void {
    this.executedCount += 1;
    this.totalDurationMs += result.durationMs;
    this.byServerAction[serverActionId] = (this.byServerAction[serverActionId] ?? 0) + 1;
    if (result.success) this.succeededCount += 1;
    else if (result.queueState === "cancelled") this.cancelledCount += 1;
    else this.failedCount += 1;
  }

  snapshot(): AiHostTelemetrySnapshot {
    return {
      totalPlans: this.totalPlans,
      pendingCount: this.pendingCount,
      approvedCount: this.approvedCount,
      executedCount: this.executedCount,
      succeededCount: this.succeededCount,
      failedCount: this.failedCount,
      cancelledCount: this.cancelledCount,
      rejectedCount: this.rejectedCount,
      autoApprovedCount: this.autoApprovedCount,
      averageDurationMs:
        this.executedCount === 0
          ? 0
          : Number((this.totalDurationMs / this.executedCount).toFixed(2)),
      byRiskLevel: { ...this.byRiskLevel },
      byServerAction: { ...this.byServerAction },
    };
  }

  reset(): void {
    this.totalPlans = 0;
    this.pendingCount = 0;
    this.approvedCount = 0;
    this.executedCount = 0;
    this.succeededCount = 0;
    this.failedCount = 0;
    this.cancelledCount = 0;
    this.rejectedCount = 0;
    this.autoApprovedCount = 0;
    this.totalDurationMs = 0;
    for (const key of Object.keys(this.byRiskLevel) as AiHostRiskLevel[]) {
      this.byRiskLevel[key] = 0;
    }
    for (const key of Object.keys(this.byServerAction)) delete this.byServerAction[key];
  }
}
