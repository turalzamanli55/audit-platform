import type { AiHostExecutionPlan, AiHostPlanRequest } from "@/lib/ai/host/types";
import { createHostError } from "@/lib/ai/host/utils";

/**
 * Host validation — structural checks only.
 */
export class AiHostValidationEngine {
  validatePlan(plan: AiHostExecutionPlan): { ok: true } | { ok: false; error: ReturnType<typeof createHostError> } {
    if (!plan.id.trim()) {
      return { ok: false, error: createHostError("invalid_plan", "Execution plan id is required.") };
    }
    if (!plan.serverActionId.trim()) {
      return {
        ok: false,
        error: createHostError("invalid_plan", "Execution plan requires a registered server action id."),
      };
    }
    if (!plan.title.trim()) {
      return { ok: false, error: createHostError("invalid_plan", "Execution plan title is required.") };
    }
    return { ok: true };
  }

  validatePlanRequest(
    request: AiHostPlanRequest,
  ): { ok: true } | { ok: false; error: ReturnType<typeof createHostError> } {
    if (!request.context.workspaceId) {
      return {
        ok: false,
        error: createHostError("missing_workspace", "Workspace context is required for host execution."),
      };
    }
    if (!request.serverActionId && !request.toolId && !request.toolResult) {
      return {
        ok: false,
        error: createHostError(
          "invalid_request",
          "Host plan requires a server action id, tool id, or tool result.",
        ),
      };
    }
    return { ok: true };
  }
}
