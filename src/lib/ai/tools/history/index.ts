import { createAiId } from "@/lib/ai/utils/id";
import type { AiToolHistoryRecord, AiToolResult, AiToolExecuteRequest } from "@/lib/ai/tools/types";

/**
 * Tool execution history — session-scoped in-memory records.
 */
export class AiToolHistoryStore {
  private readonly records: AiToolHistoryRecord[] = [];

  record(
    request: AiToolExecuteRequest,
    result: AiToolResult,
    startedAt: string,
  ): AiToolHistoryRecord {
    const entry: AiToolHistoryRecord = {
      id: createAiId("tool_hist"),
      userId: request.userId ?? request.context.userId,
      sessionId: request.sessionId ?? null,
      conversationId: request.conversationId ?? null,
      toolId: request.toolId,
      arguments: request.args ?? {},
      startedAt,
      durationMs: result.durationMs,
      status: result.status,
      resultSummary: result.summary,
      executionMode: result.executionMode,
    };
    this.records.unshift(entry);
    if (this.records.length > 500) this.records.length = 500;
    return entry;
  }

  list(filter?: { toolId?: string; userId?: string; limit?: number }): AiToolHistoryRecord[] {
    return this.records
      .filter((record) => {
        if (filter?.toolId && record.toolId !== filter.toolId) return false;
        if (filter?.userId && record.userId !== filter.userId) return false;
        return true;
      })
      .slice(0, filter?.limit ?? 100);
  }

  clear(): void {
    this.records.length = 0;
  }
}
