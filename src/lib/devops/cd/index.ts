import { buildCiBlueprint } from "@/lib/devops/ci";
import { canDeploy } from "@/lib/devops/deployment";
import { buildRollbackPlan } from "@/lib/devops/rollback";
import type { CiProvider, PipelineRunReport, ReleaseChecklistReport } from "@/lib/devops/types";

/**
 * CD orchestration — promotion rules over CI blueprints.
 */
export function buildCdPromotionPlan(input: {
  provider: CiProvider;
  pipeline: PipelineRunReport;
  checklist: ReleaseChecklistReport;
  environment: "development" | "staging" | "production";
}) {
  const ci = buildCiBlueprint(input.provider);
  const deploy = canDeploy({
    pipelineOk: input.pipeline.ok,
    checklistOk: input.checklist.ok,
    environment: input.environment,
  });
  const rollback = buildRollbackPlan();

  return {
    provider: input.provider,
    environment: input.environment,
    ciStages: ci.stages,
    deploy,
    rollback,
    promote: deploy.ok,
  };
}
