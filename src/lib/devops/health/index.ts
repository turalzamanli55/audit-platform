import { databaseGovernanceEngine } from "@/lib/database-governance/engine";
import { auditSchemaDrift } from "@/lib/database-governance/schema-drift";
import { projectSyncEngine } from "@/lib/project-sync/engine";
import { getPlatformCompletionPct } from "@/lib/devops/platform-sync";
import type {
  DevOpsHealthReport,
  PipelineRunReport,
} from "@/lib/devops/types";

/**
 * Health — aggregates existing governance + pipeline signals.
 */
export function calculateDevOpsHealth(
  pipeline: PipelineRunReport,
  cwd = process.cwd(),
): DevOpsHealthReport {
  const governance = databaseGovernanceEngine.audit(cwd);
  const drift = auditSchemaDrift(cwd);
  const sync = projectSyncEngine.synchronize({ cwd, persist: false });
  const platformCompletionPct = getPlatformCompletionPct();

  const buildStage = pipeline.stages.find((s) => s.id === "build_validation");
  const unitStage = pipeline.stages.find((s) => s.id === "unit_tests");
  const localizationOk =
    pipeline.stages.find((s) => s.id === "localization_validation")?.ok ?? false;
  const aiOk = pipeline.stages.find((s) => s.id === "ai_validation")?.ok ?? false;

  const passed = pipeline.stages.filter((s) => s.ok).length;
  const releaseReadiness = Number(
    ((passed / Math.max(1, pipeline.stages.length)) * 100).toFixed(2),
  );

  const platformHealth = Number(
    (
      (governance.health.healthScore +
        governance.health.dependencyHealth +
        releaseReadiness +
        (drift.ok ? 100 : 60) +
        sync.snapshot.documentationCoveragePct) /
      5
    ).toFixed(2),
  );

  return {
    platformHealth,
    releaseReadiness,
    migrationHealth: governance.health.healthScore,
    dependencyHealth: governance.health.dependencyHealth,
    schemaDriftOk: drift.ok,
    documentationCoverage: sync.snapshot.documentationCoveragePct,
    implementationCoverage: sync.snapshot.implementationHealthPct,
    buildOk: buildStage?.skipped ? null : (buildStage?.ok ?? null),
    testOk: unitStage?.skipped ? null : (unitStage?.ok ?? null),
    localizationOk,
    aiOk,
    platformCompletionPct,
    generatedAt: new Date().toISOString(),
  };
}
