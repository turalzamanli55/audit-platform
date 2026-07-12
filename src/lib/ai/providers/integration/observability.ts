/**
 * LLM observability — latency, tokens, cost, retries. Never logs prompts/responses.
 */

import type { LlmProviderId, LlmTokenUsage } from "@/lib/ai/providers/provider";

export type LlmObservationEvent = {
  providerId: LlmProviderId;
  modelId: string;
  operation: "chat" | "stream" | "vision" | "embeddings" | "toolCall" | "structuredOutput" | "health";
  success: boolean;
  latencyMs: number;
  streamingDurationMs?: number;
  usage?: LlmTokenUsage;
  estimatedCostUsd?: number;
  retries: number;
  errorCode?: string;
  recordedAt: string;
};

export type LlmObservabilitySnapshot = {
  totalOperations: number;
  successCount: number;
  failureCount: number;
  totalRetries: number;
  totalLatencyMs: number;
  averageLatencyMs: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  totalEstimatedCostUsd: number;
  byProvider: Record<string, number>;
  byModel: Record<string, number>;
};

export class LlmObservability {
  private readonly events: LlmObservationEvent[] = [];
  private totalOperations = 0;
  private successCount = 0;
  private failureCount = 0;
  private totalRetries = 0;
  private totalLatencyMs = 0;
  private totalInputTokens = 0;
  private totalOutputTokens = 0;
  private totalEstimatedCostUsd = 0;
  private readonly byProvider: Record<string, number> = {};
  private readonly byModel: Record<string, number> = {};

  record(event: Omit<LlmObservationEvent, "recordedAt">): LlmObservationEvent {
    const full: LlmObservationEvent = {
      ...event,
      recordedAt: new Date().toISOString(),
    };
    this.events.unshift(full);
    if (this.events.length > 500) this.events.length = 500;

    this.totalOperations += 1;
    this.totalLatencyMs += event.latencyMs;
    this.totalRetries += event.retries;
    this.byProvider[event.providerId] = (this.byProvider[event.providerId] ?? 0) + 1;
    this.byModel[event.modelId] = (this.byModel[event.modelId] ?? 0) + 1;
    if (event.usage) {
      this.totalInputTokens += event.usage.inputTokens;
      this.totalOutputTokens += event.usage.outputTokens;
    }
    if (typeof event.estimatedCostUsd === "number") {
      this.totalEstimatedCostUsd += event.estimatedCostUsd;
    }
    if (event.success) this.successCount += 1;
    else this.failureCount += 1;
    return full;
  }

  snapshot(): LlmObservabilitySnapshot {
    return {
      totalOperations: this.totalOperations,
      successCount: this.successCount,
      failureCount: this.failureCount,
      totalRetries: this.totalRetries,
      totalLatencyMs: this.totalLatencyMs,
      averageLatencyMs:
        this.totalOperations === 0
          ? 0
          : Number((this.totalLatencyMs / this.totalOperations).toFixed(2)),
      totalInputTokens: this.totalInputTokens,
      totalOutputTokens: this.totalOutputTokens,
      totalEstimatedCostUsd: Number(this.totalEstimatedCostUsd.toFixed(6)),
      byProvider: { ...this.byProvider },
      byModel: { ...this.byModel },
    };
  }

  recent(limit = 20): LlmObservationEvent[] {
    return this.events.slice(0, limit);
  }

  reset(): void {
    this.events.length = 0;
    this.totalOperations = 0;
    this.successCount = 0;
    this.failureCount = 0;
    this.totalRetries = 0;
    this.totalLatencyMs = 0;
    this.totalInputTokens = 0;
    this.totalOutputTokens = 0;
    this.totalEstimatedCostUsd = 0;
    for (const key of Object.keys(this.byProvider)) delete this.byProvider[key];
    for (const key of Object.keys(this.byModel)) delete this.byModel[key];
  }
}

export const llmObservability = new LlmObservability();
