import { describe, expect, it } from "vitest";
import {
  buildDatabaseLifecycleReport,
  databaseGovernanceEngine,
  formatDatabaseLifecycleReport,
  formatResetProcedure,
  runContinuousValidation,
} from "@/lib/database-governance";
import { MIGRATION_HEALTH_THRESHOLD, DEPENDENCY_HEALTH_TARGET } from "@/lib/database-governance/lifecycle";

describe("Enterprise Database Lifecycle", () => {
  it("passes migration governance with health thresholds", () => {
    const report = databaseGovernanceEngine.audit();
    expect(report.health.healthScore).toBeGreaterThanOrEqual(MIGRATION_HEALTH_THRESHOLD);
    expect(report.health.dependencyHealth).toBe(DEPENDENCY_HEALTH_TARGET);
    expect(report.dryRun.ok).toBe(true);
  });

  it("runs continuous validation pipeline", { timeout: 30000 }, () => {
    const validation = runContinuousValidation();
    expect(validation.steps.length).toBeGreaterThanOrEqual(10);
    expect(validation.steps.find((step) => step.id === "migration_validation")?.ok).toBe(true);
    expect(validation.steps.find((step) => step.id === "governance_validation")?.ok).toBe(true);
  });

  it("builds database lifecycle report with acceptance criteria", { timeout: 30000 }, () => {
    const report = buildDatabaseLifecycleReport();
    expect(report.policyVersion).toBe("16.0.0");
    expect(report.resetProcedure.length).toBe(14);
    expect(report.acceptanceCriteria.freshToLastOk).toBe(true);
    expect(report.acceptanceCriteria.noOrderingIssues).toBe(true);
    expect(formatDatabaseLifecycleReport(report)).toContain("Database Lifecycle Report");
    expect(formatResetProcedure()).toContain("Backup Verification");
  });

  it("definition of done includes full pipeline steps", { timeout: 30000 }, () => {
    const report = buildDatabaseLifecycleReport();
    const stepIds = report.definitionOfDone.steps.map((step) => step.id);
    expect(stepIds).toContain("fresh_database");
    expect(stepIds).toContain("migration_last");
    expect(stepIds).toContain("no_schema_drift");
    expect(stepIds).toContain("dependency_health");
  });
});
