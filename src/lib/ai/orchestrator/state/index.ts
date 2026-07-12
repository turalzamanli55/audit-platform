import type { AiOrchestratorState } from "@/lib/ai/orchestrator/types";
import { createOrchestratorError } from "@/lib/ai/orchestrator/utils";

const ALLOWED_TRANSITIONS: Record<AiOrchestratorState, readonly AiOrchestratorState[]> = {
  created: ["planning", "cancelled", "failed"],
  planning: ["resolving", "waiting", "cancelled", "failed", "completed"],
  resolving: ["waiting", "executing", "cancelled", "failed"],
  waiting: ["executing", "resolving", "cancelled", "failed"],
  executing: ["waiting", "completed", "failed", "cancelled"],
  completed: [],
  failed: [],
  cancelled: [],
};

/**
 * Orchestrator state machine — structural transitions only.
 */
export class AiOrchestratorStateMachine {
  private state: AiOrchestratorState = "created";

  get current(): AiOrchestratorState {
    return this.state;
  }

  reset(): void {
    this.state = "created";
  }

  canTransition(to: AiOrchestratorState): boolean {
    return ALLOWED_TRANSITIONS[this.state].includes(to);
  }

  transition(to: AiOrchestratorState): { ok: true; state: AiOrchestratorState } | {
    ok: false;
    error: ReturnType<typeof createOrchestratorError>;
  } {
    if (!this.canTransition(to)) {
      return {
        ok: false,
        error: createOrchestratorError(
          "invalid_state_transition",
          `Cannot transition from ${this.state} to ${to}.`,
          { details: { from: this.state, to } },
        ),
      };
    }
    this.state = to;
    return { ok: true, state: this.state };
  }

  force(to: AiOrchestratorState): void {
    this.state = to;
  }
}
