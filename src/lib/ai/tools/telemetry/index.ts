import type { AiToolResult, AiToolTelemetrySnapshot } from "@/lib/ai/tools/types";

/**
 * Tool telemetry — in-process counters only.
 */
export class AiToolTelemetry {
  private totalExecutions = 0;
  private successCount = 0;
  private failureCount = 0;
  private permissionFailures = 0;
  private validationFailures = 0;
  private confirmationRequests = 0;
  private totalDurationMs = 0;

  observe(result: AiToolResult): void {
    this.totalExecutions += 1;
    this.totalDurationMs += result.durationMs;
    if (result.status === "confirmation_required") {
      this.confirmationRequests += 1;
    }
    if (result.status === "denied") {
      this.permissionFailures += 1;
      this.failureCount += 1;
      return;
    }
    if (result.status === "validation_failed") {
      this.validationFailures += 1;
      this.failureCount += 1;
      return;
    }
    if (result.success) {
      this.successCount += 1;
      return;
    }
    this.failureCount += 1;
  }

  snapshot(): AiToolTelemetrySnapshot {
    const averageDurationMs =
      this.totalExecutions === 0 ? 0 : this.totalDurationMs / this.totalExecutions;
    const successRate =
      this.totalExecutions === 0 ? 0 : this.successCount / this.totalExecutions;
    const failureRate =
      this.totalExecutions === 0 ? 0 : this.failureCount / this.totalExecutions;
    return {
      totalExecutions: this.totalExecutions,
      successCount: this.successCount,
      failureCount: this.failureCount,
      permissionFailures: this.permissionFailures,
      validationFailures: this.validationFailures,
      confirmationRequests: this.confirmationRequests,
      averageDurationMs: Number(averageDurationMs.toFixed(2)),
      successRate: Number(successRate.toFixed(4)),
      failureRate: Number(failureRate.toFixed(4)),
    };
  }

  reset(): void {
    this.totalExecutions = 0;
    this.successCount = 0;
    this.failureCount = 0;
    this.permissionFailures = 0;
    this.validationFailures = 0;
    this.confirmationRequests = 0;
    this.totalDurationMs = 0;
  }
}
