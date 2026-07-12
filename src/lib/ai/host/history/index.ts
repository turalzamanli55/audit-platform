import type {
  AiHostExecutionPlan,
  AiHostExecutionResult,
  AiHostHistoryRecord,
} from "@/lib/ai/host/types";
import { createHostHistoryId } from "@/lib/ai/host/utils";

/**
 * Host execution audit history — session only.
 */
export class AiHostHistoryStore {
  private readonly records: AiHostHistoryRecord[] = [];

  record(
    plan: AiHostExecutionPlan,
    result: Pick<AiHostExecutionResult, "success" | "summary" | "durationMs" | "errors">,
  ): AiHostHistoryRecord {
    const entry: AiHostHistoryRecord = {
      id: createHostHistoryId(),
      planId: plan.id,
      serverActionId: plan.serverActionId,
      toolId: plan.toolId,
      requestedBy: plan.requestedBy,
      approvedBy: plan.approvedBy,
      executedBy: plan.executedBy,
      riskLevel: plan.riskLevel,
      approvalState: plan.approvalState,
      queueState: plan.queueState,
      durationMs: result.durationMs,
      success: result.success,
      summary: result.summary,
      errors: result.errors,
      workspaceId: plan.workspaceId,
      organizationId: plan.organizationId,
      recordedAt: new Date().toISOString(),
    };
    this.records.unshift(entry);
    if (this.records.length > 300) this.records.length = 300;
    return entry;
  }

  list(filter?: {
    planId?: string;
    workspaceId?: string;
    limit?: number;
  }): AiHostHistoryRecord[] {
    return this.records
      .filter((record) => {
        if (filter?.planId && record.planId !== filter.planId) return false;
        if (filter?.workspaceId && record.workspaceId !== filter.workspaceId) return false;
        return true;
      })
      .slice(0, filter?.limit ?? 50);
  }

  clear(): void {
    this.records.length = 0;
  }
}
