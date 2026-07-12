import type { AiOrchestratorStep, AiOrchestratorStepStatus } from "@/lib/ai/orchestrator/types";
import { AiOrchestratorScheduler } from "@/lib/ai/orchestrator/scheduler";
import { createOrchestratorError, isTerminalStepStatus } from "@/lib/ai/orchestrator/utils";

export type PipelineStepHandler = (step: AiOrchestratorStep) => {
  status: Extract<AiOrchestratorStepStatus, "succeeded" | "failed" | "skipped" | "waiting">;
  output?: Record<string, unknown> | null;
  error?: ReturnType<typeof createOrchestratorError> | null;
};

export type PipelineRunOptions = {
  cancelRequested?: boolean;
  onStepStart?: (step: AiOrchestratorStep) => void;
  onStepFinish?: (step: AiOrchestratorStep) => void;
};

/**
 * Pipeline engine — sequential, parallel batching, conditional skip, retry, cancel.
 */
export class AiOrchestratorPipeline {
  private readonly scheduler = new AiOrchestratorScheduler();

  run(
    steps: AiOrchestratorStep[],
    handler: PipelineStepHandler,
    options: PipelineRunOptions = {},
  ): { steps: AiOrchestratorStep[]; cancelled: boolean; retries: number } {
    let cancelled = false;
    let retries = 0;
    const working = steps;

    while (working.some((s) => !isTerminalStepStatus(s.status))) {
      if (options.cancelRequested) {
        cancelled = true;
        for (const step of working) {
          if (!isTerminalStepStatus(step.status)) {
            step.status = "cancelled";
            step.completedAt = new Date().toISOString();
            step.error = createOrchestratorError("cancelled", "Orchestration cancelled.");
          }
        }
        break;
      }

      for (const step of working) {
        if (step.status !== "pending") continue;
        if (this.scheduler.shouldSkipConditional(step, working)) {
          step.status = "skipped";
          step.completedAt = new Date().toISOString();
          step.durationMs = 0;
          step.output = { skipped: true, reason: "conditional_gate" };
          options.onStepFinish?.(step);
        } else if (this.scheduler.blockedByFailure(step, working)) {
          step.status = "skipped";
          step.completedAt = new Date().toISOString();
          step.durationMs = 0;
          step.output = { skipped: true, reason: "dependency_failed" };
          step.error = createOrchestratorError(
            "dependency_failed",
            "Skipped because a dependency failed.",
            { stepId: step.id },
          );
          options.onStepFinish?.(step);
        }
      }

      const ready = this.scheduler.readySteps(working).filter((s) => s.status !== "skipped");
      if (ready.length === 0) {
        const pending = working.filter((s) => !isTerminalStepStatus(s.status));
        if (pending.length > 0) {
          for (const step of pending) {
            step.status = "failed";
            step.completedAt = new Date().toISOString();
            step.error = createOrchestratorError(
              "pipeline_deadlock",
              "No ready steps remaining; pipeline deadlocked.",
              { stepId: step.id },
            );
          }
        }
        break;
      }

      const parallelBatch = ready.filter((s) => s.pipelineMode === "parallel");
      const sequentialBatch = ready.filter((s) => s.pipelineMode !== "parallel");
      const batch =
        parallelBatch.length > 0
          ? parallelBatch
          : sequentialBatch.slice(0, 1);

      for (const step of batch) {
        this.executeWithRetry(step, handler, options, () => {
          retries += 1;
        });
      }
    }

    return { steps: working, cancelled, retries };
  }

  private executeWithRetry(
    step: AiOrchestratorStep,
    handler: PipelineStepHandler,
    options: PipelineRunOptions,
    onRetry: () => void,
  ): void {
    while (true) {
      step.status = "running";
      step.startedAt = step.startedAt ?? new Date().toISOString();
      options.onStepStart?.(step);
      const started = Date.now();

      try {
        const outcome = handler(step);
        step.durationMs = Date.now() - started;
        step.completedAt = new Date().toISOString();
        step.output = outcome.output ?? null;
        step.error = outcome.error ?? null;
        step.status = outcome.status;

        if (outcome.status === "failed" && step.retryCount < step.retryLimit) {
          step.retryCount += 1;
          onRetry();
          step.status = "pending";
          step.completedAt = null;
          step.error = null;
          continue;
        }

        options.onStepFinish?.(step);
        return;
      } catch (error) {
        step.durationMs = Date.now() - started;
        step.completedAt = new Date().toISOString();
        step.error = createOrchestratorError(
          "step_exception",
          error instanceof Error ? error.message : "Step handler failed.",
          { stepId: step.id },
        );
        if (step.retryCount < step.retryLimit) {
          step.retryCount += 1;
          onRetry();
          step.status = "pending";
          step.completedAt = null;
          continue;
        }
        step.status = "failed";
        options.onStepFinish?.(step);
        return;
      }
    }
  }
}
