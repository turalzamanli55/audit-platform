import type { RollbackPlan } from "@/lib/devops/types";

/**
 * Rollback — application redeploy + forward compensating migration (never edit applied migrations).
 */
export function buildRollbackPlan(): RollbackPlan {
  return {
    application: "redeploy_previous_artifact",
    database: "forward_compensating_migration",
    tested: true,
    authority: "Engineering lead + operations (PROJECT_BIBLE §62.5)",
  };
}

export function formatRollbackPlan(plan: RollbackPlan = buildRollbackPlan()): string {
  return [
    "Rollback Plan",
    "",
    `Application: ${plan.application}`,
    `Database: ${plan.database}`,
    `Tested: ${plan.tested}`,
    `Authority: ${plan.authority}`,
  ].join("\n");
}
