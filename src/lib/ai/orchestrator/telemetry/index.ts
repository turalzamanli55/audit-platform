import type {
  AiOrchestratorResult,
  AiOrchestratorTelemetrySnapshot,
} from "@/lib/ai/orchestrator/types";

/**
 * Orchestrator telemetry — in-process counters only.
 */
export class AiOrchestratorTelemetry {
  private totalExecutions = 0;
  private successCount = 0;
  private failureCount = 0;
  private cancelledCount = 0;
  private totalDurationMs = 0;
  private totalSteps = 0;
  private totalRetries = 0;
  private skillResolutions = 0;
  private knowledgeResolutions = 0;
  private toolResolutions = 0;

  observe(result: AiOrchestratorResult): void {
    this.totalExecutions += 1;
    this.totalDurationMs += result.durationMs;
    this.totalSteps += result.usage.stepsExecuted;
    this.totalRetries += result.usage.retries;
    if (result.usage.skills.length > 0) this.skillResolutions += 1;
    if (result.usage.knowledgeNodeIds.length > 0 || result.knowledgeRetrieval) {
      this.knowledgeResolutions += 1;
    }
    if (result.usage.tools.length > 0 || result.toolResolution) {
      this.toolResolutions += 1;
    }
    if (result.state === "cancelled") {
      this.cancelledCount += 1;
      return;
    }
    if (result.success) {
      this.successCount += 1;
      return;
    }
    this.failureCount += 1;
  }

  snapshot(): AiOrchestratorTelemetrySnapshot {
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
      cancelledCount: this.cancelledCount,
      totalDurationMs: this.totalDurationMs,
      averageDurationMs: Number(averageDurationMs.toFixed(2)),
      totalSteps: this.totalSteps,
      totalRetries: this.totalRetries,
      skillResolutions: this.skillResolutions,
      knowledgeResolutions: this.knowledgeResolutions,
      toolResolutions: this.toolResolutions,
      successRate: Number(successRate.toFixed(4)),
      failureRate: Number(failureRate.toFixed(4)),
    };
  }

  reset(): void {
    this.totalExecutions = 0;
    this.successCount = 0;
    this.failureCount = 0;
    this.cancelledCount = 0;
    this.totalDurationMs = 0;
    this.totalSteps = 0;
    this.totalRetries = 0;
    this.skillResolutions = 0;
    this.knowledgeResolutions = 0;
    this.toolResolutions = 0;
  }
}
