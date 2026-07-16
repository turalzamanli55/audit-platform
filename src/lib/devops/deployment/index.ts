import type { DeploymentPlan } from "@/lib/devops/types";

/**
 * Deployment governance — environment-specific promotion rules.
 */
export function buildDeploymentPlan(
  environment: DeploymentPlan["environment"],
): DeploymentPlan {
  switch (environment) {
    case "development":
      return {
        environment,
        strategy: "forward_only",
        requiresApproval: false,
        healthGate: true,
        rollbackReady: true,
      };
    case "staging":
      return {
        environment,
        strategy: "progressive",
        requiresApproval: true,
        healthGate: true,
        rollbackReady: true,
      };
    case "production":
      return {
        environment,
        strategy: "progressive",
        requiresApproval: true,
        healthGate: true,
        rollbackReady: true,
      };
  }
}

export function canDeploy(input: {
  pipelineOk: boolean;
  checklistOk: boolean;
  environment: DeploymentPlan["environment"];
}): { ok: boolean; reason: string; plan: DeploymentPlan } {
  const plan = buildDeploymentPlan(input.environment);
  if (!input.pipelineOk) {
    return { ok: false, reason: "Pipeline failed", plan };
  }
  if (!input.checklistOk) {
    return { ok: false, reason: "Release checklist failed", plan };
  }
  if (plan.requiresApproval && input.environment === "production") {
    return {
      ok: true,
      reason: "Ready for production — approval required before deploy",
      plan,
    };
  }
  return { ok: true, reason: "Deployment gates satisfied", plan };
}
