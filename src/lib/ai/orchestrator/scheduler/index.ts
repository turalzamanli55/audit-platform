import type { AiOrchestratorStep } from "@/lib/ai/orchestrator/types";
import { isTerminalStepStatus } from "@/lib/ai/orchestrator/utils";

/**
 * Scheduler — dependency-aware readiness without business rules.
 */
export class AiOrchestratorScheduler {
  readySteps(steps: AiOrchestratorStep[]): AiOrchestratorStep[] {
    const byId = new Map(steps.map((step) => [step.id, step]));
    return steps
      .filter((step) => step.status === "pending" || step.status === "ready")
      .filter((step) => {
        if (step.conditionalOn) {
          const gate = byId.get(step.conditionalOn.stepId);
          if (!gate || !step.conditionalOn.statusIn.includes(gate.status)) {
            return false;
          }
        }
        return step.dependencies.every((depId) => {
          const dep = byId.get(depId);
          return dep != null && isTerminalStepStatus(dep.status) && dep.status !== "failed";
        });
      })
      .sort((a, b) => a.order - b.order);
  }

  shouldSkipConditional(step: AiOrchestratorStep, steps: AiOrchestratorStep[]): boolean {
    if (!step.conditionalOn) return false;
    const gate = steps.find((s) => s.id === step.conditionalOn!.stepId);
    if (!gate) return true;
    if (!isTerminalStepStatus(gate.status)) return false;
    return !step.conditionalOn.statusIn.includes(gate.status);
  }

  blockedByFailure(step: AiOrchestratorStep, steps: AiOrchestratorStep[]): boolean {
    const byId = new Map(steps.map((s) => [s.id, s]));
    return step.dependencies.some((depId) => byId.get(depId)?.status === "failed");
  }
}
