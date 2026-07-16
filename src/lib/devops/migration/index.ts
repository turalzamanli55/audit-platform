import { databaseGovernanceEngine } from "@/lib/database-governance/engine";
import {
  buildDatabaseLifecycleReport,
  formatDatabaseLifecycleReport,
} from "@/lib/database-governance/continuous-validation";
import { ENTERPRISE_DATABASE_RESET_PROCEDURE } from "@/lib/database-governance/reset";
import type { DatabaseLifecycleReport } from "@/lib/database-governance/types";

/**
 * Migration adapter — reuses Database Governance + Lifecycle. Does not reimplement.
 */
export function runMigrationValidation(cwd = process.cwd()) {
  return databaseGovernanceEngine.audit(cwd);
}

export function runDatabaseLifecycle(cwd = process.cwd()): DatabaseLifecycleReport {
  return buildDatabaseLifecycleReport({ cwd });
}

export function formatMigrationArtifact(cwd = process.cwd()): string {
  const lifecycle = runDatabaseLifecycle(cwd);
  const governance = runMigrationValidation(cwd);
  return [
    formatDatabaseLifecycleReport(lifecycle),
    "",
    `Migrations: ${governance.migrations.length}`,
    `Accepted: ${governance.accepted}`,
    `Migration Health: ${governance.health.healthScore}`,
    `Dependency Health: ${governance.health.dependencyHealth}`,
    "",
    "Reset Procedure Steps:",
    ...ENTERPRISE_DATABASE_RESET_PROCEDURE.map(
      (step) => `  ${step.order}. ${step.title}`,
    ),
  ].join("\n");
}
