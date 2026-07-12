import type {
  AiOrchestratorError,
  AiOrchestratorStep,
  AiOrchestratorStepStatus,
} from "@/lib/ai/orchestrator/types";

export function createOrchestratorError(
  code: string,
  message: string,
  extras?: { stepId?: string; details?: Record<string, unknown> },
): AiOrchestratorError {
  return {
    code,
    message,
    stepId: extras?.stepId,
    details: extras?.details,
  };
}

export function isTerminalStepStatus(status: AiOrchestratorStepStatus): boolean {
  return (
    status === "succeeded" ||
    status === "failed" ||
    status === "skipped" ||
    status === "cancelled"
  );
}

export function cloneStep(step: AiOrchestratorStep): AiOrchestratorStep {
  return {
    ...step,
    dependencies: [...step.dependencies],
    toolIds: [...step.toolIds],
    output: step.output ? { ...step.output } : null,
    error: step.error ? { ...step.error } : null,
    conditionalOn: step.conditionalOn
      ? {
          stepId: step.conditionalOn.stepId,
          statusIn: [...step.conditionalOn.statusIn],
        }
      : undefined,
  };
}
