import { createAiId } from "@/lib/ai/utils/id";
import type {
  AiOrchestratorHistoryRecord,
  AiOrchestratorRequest,
  AiOrchestratorResult,
} from "@/lib/ai/orchestrator/types";

/**
 * Orchestrator history — session-scoped in-memory store only.
 */
export class AiOrchestratorHistoryStore {
  private readonly records: AiOrchestratorHistoryRecord[] = [];

  record(
    request: AiOrchestratorRequest,
    result: AiOrchestratorResult,
  ): AiOrchestratorHistoryRecord {
    const entry: AiOrchestratorHistoryRecord = {
      id: createAiId("orch_hist"),
      executionId: result.executionId,
      conversationId: request.conversationId ?? null,
      sessionId: request.sessionId ?? null,
      userId: request.userId ?? request.context.userId,
      utterance: request.utterance,
      state: result.state,
      strategy: result.strategy,
      intentPrimary: result.intent.primary,
      planId: result.plan.id,
      stepCount: result.steps.length,
      success: result.success,
      summary: result.summary,
      errors: result.errors,
      durationMs: result.durationMs,
      usage: result.usage,
      recordedAt: new Date().toISOString(),
    };
    this.records.unshift(entry);
    if (this.records.length > 200) this.records.length = 200;
    return entry;
  }

  list(filter?: {
    conversationId?: string;
    userId?: string;
    limit?: number;
  }): AiOrchestratorHistoryRecord[] {
    return this.records
      .filter((record) => {
        if (filter?.conversationId && record.conversationId !== filter.conversationId) {
          return false;
        }
        if (filter?.userId && record.userId !== filter.userId) return false;
        return true;
      })
      .slice(0, filter?.limit ?? 50);
  }

  clear(): void {
    this.records.length = 0;
  }
}
