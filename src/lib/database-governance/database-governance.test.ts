import { describe, expect, it } from "vitest";
import {
  databaseGovernanceEngine,
  formatBaselineReport,
  formatDependencyReport,
  formatHealthReport,
} from "@/lib/database-governance";

describe("Database Migration Governance Engine", () => {
  it("loads and audits the full migration chain", () => {
    const report = databaseGovernanceEngine.audit();
    expect(report.migrations.length).toBeGreaterThan(40);
    expect(report.migrations[0]?.timestamp <= report.migrations.at(-1)!.timestamp).toBe(
      true,
    );
  });

  it("places permissions compatibility before module-using inserts", () => {
    const report = databaseGovernanceEngine.audit();
    const compatIndex = report.migrations.findIndex((migration) =>
      migration.filename.includes("permissions_schema_compatibility"),
    );
    const fsMappingIndex = report.migrations.findIndex((migration) =>
      migration.filename.includes("fs_mapping_foundation"),
    );
    expect(compatIndex).toBeGreaterThanOrEqual(0);
    expect(fsMappingIndex).toBeGreaterThan(compatIndex);
    expect(
      report.health.findings.some((finding) => finding.code === "module_column_too_late"),
    ).toBe(false);
  });

  it("dry-runs migration #1 through #last without blocking errors", () => {
    const { ok, report } = databaseGovernanceEngine.validateBeforeAccept();
    expect(report.dryRun.ok).toBe(true);
    expect(ok).toBe(true);
    expect(report.health.compatibilityRisk).toBe(0);
    expect(report.baseline.coveragePct).toBeGreaterThan(80);
  });

  it("emits dependency and health reports", () => {
    const report = databaseGovernanceEngine.audit();
    expect(formatDependencyReport(report.dependencies)).toContain("Reason:");
    expect(formatHealthReport(report.health)).toContain("Migration Health Score:");
    expect(formatBaselineReport(report.baseline)).toContain("foundation:");
  });
});
