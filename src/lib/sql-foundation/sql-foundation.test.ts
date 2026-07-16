import { describe, expect, it } from "vitest";
import {
  formatMissingObjectReport,
  formatSqlFoundationReport,
  sqlFoundationEngine,
  SQL_FOUNDATION_REQUIRED_HELPERS,
} from "@/lib/sql-foundation";
import { databaseGovernanceEngine } from "@/lib/database-governance";

describe("Enterprise SQL Foundation Engine", () => {
  it("provides required shared helpers before dependents", () => {
    const report = sqlFoundationEngine.audit();
    expect(report.foundationMigrationId).toContain("enterprise_sql_foundation");
    expect(report.coverage.missingHelpers).toEqual([]);
    expect(report.coverage.coveragePct).toBe(100);
    for (const helper of [
      "user_can_access_workspace",
      "has_permission",
      "current_user_id",
      "soft_delete",
      "restore_deleted",
    ]) {
      expect(report.helpers).toContain(helper);
    }
    expect(SQL_FOUNDATION_REQUIRED_HELPERS.length).toBeGreaterThan(20);
  });

  it("detects no missing SQL objects on the current chain", () => {
    const { ok, report } = sqlFoundationEngine.validate();
    expect(formatSqlFoundationReport(report)).toContain("SQL Foundation Report");
    expect(formatMissingObjectReport(report)).toContain("None");
    expect(ok).toBe(true);
    expect(report.missingObjects).toEqual([]);
  });

  it("fails governance when SQL foundation objects are missing from dependents", () => {
    const report = databaseGovernanceEngine.audit();
    expect(report.accepted).toBe(true);
    expect(report.dryRun.ok).toBe(true);
    const fsMapping = report.migrations.find((migration) =>
      migration.filename.includes("fs_mapping_foundation"),
    );
    const sqlFoundation = report.migrations.find((migration) =>
      migration.filename.includes("enterprise_sql_foundation"),
    );
    expect(sqlFoundation).toBeTruthy();
    expect(fsMapping).toBeTruthy();
    expect(sqlFoundation!.timestamp < fsMapping!.timestamp).toBe(true);
  });
});
