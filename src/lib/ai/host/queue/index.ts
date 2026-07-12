import type { AiHostExecutionPlan, AiHostQueueState } from "@/lib/ai/host/types";
import { createHostError } from "@/lib/ai/host/utils";

/**
 * Host Execution Queue — session-scoped plan store.
 */
export class AiHostExecutionQueue {
  private readonly plans = new Map<string, AiHostExecutionPlan>();

  enqueue(plan: AiHostExecutionPlan): AiHostExecutionPlan {
    this.plans.set(plan.id, plan);
    return plan;
  }

  get(planId: string): AiHostExecutionPlan | undefined {
    return this.plans.get(planId);
  }

  require(planId: string): AiHostExecutionPlan {
    const plan = this.get(planId);
    if (!plan) {
      throw new Error(`Host execution plan "${planId}" was not found.`);
    }
    return plan;
  }

  update(plan: AiHostExecutionPlan): AiHostExecutionPlan {
    const next = { ...plan, updatedAt: new Date().toISOString() };
    this.plans.set(next.id, next);
    return next;
  }

  setQueueState(planId: string, queueState: AiHostQueueState): AiHostExecutionPlan {
    const plan = this.require(planId);
    return this.update({ ...plan, queueState });
  }

  list(filter?: {
    queueState?: AiHostQueueState;
    workspaceId?: string | null;
    limit?: number;
  }): AiHostExecutionPlan[] {
    return [...this.plans.values()]
      .filter((plan) => {
        if (filter?.queueState && plan.queueState !== filter.queueState) return false;
        if (filter?.workspaceId && plan.workspaceId !== filter.workspaceId) return false;
        return true;
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, filter?.limit ?? 100);
  }

  remove(planId: string): boolean {
    return this.plans.delete(planId);
  }

  clear(): void {
    this.plans.clear();
  }
}

export function assertQueueTransition(
  from: AiHostQueueState,
  to: AiHostQueueState,
): { ok: true } | { ok: false; error: ReturnType<typeof createHostError> } {
  const allowed: Record<AiHostQueueState, AiHostQueueState[]> = {
    pending: ["approved", "cancelled"],
    approved: ["executing", "cancelled"],
    executing: ["succeeded", "failed", "cancelled"],
    succeeded: [],
    failed: [],
    cancelled: [],
  };
  if (!allowed[from].includes(to)) {
    return {
      ok: false,
      error: createHostError("invalid_queue_transition", `Cannot move queue from ${from} to ${to}.`),
    };
  }
  return { ok: true };
}
