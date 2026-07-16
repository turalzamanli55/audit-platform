import { loadMigrations } from "@/lib/database-governance/audit";
import { dryRunMigrations } from "@/lib/database-governance/validation";
import { buildSqlObjectDependencyGraph } from "@/lib/sql-foundation/dependency";
import {
  calculateFoundationCoverage,
  listFoundationArtifacts,
} from "@/lib/sql-foundation/coverage";
import type { SqlFoundationReport } from "@/lib/sql-foundation/types";

/**
 * Enterprise SQL Foundation Engine (ESFE)
 * Ensures shared SQL infrastructure exists before dependent migrations.
 */
export class SqlFoundationEngine {
  audit(cwd = process.cwd()): SqlFoundationReport {
    const migrations = loadMigrations(cwd);
    const artifacts = listFoundationArtifacts(migrations);
    const coverage = calculateFoundationCoverage(migrations);
    const { dependencies, missing, circular } = buildSqlObjectDependencyGraph(migrations);
    const dryRun = dryRunMigrations(migrations);

    const functionErrors = dryRun.steps.flatMap((step) =>
      step.errors.filter((error) =>
        ["missing_function", "missing_sql_function"].includes(error.code),
      ),
    );

    const allMissing = [
      ...missing,
      ...coverage.missingHelpers.map((helper) => ({
        object: { kind: "function" as const, name: helper, schema: "public" },
        referencedByMigrationId: "sql-foundation-coverage",
        reason: `Required foundation helper public.${helper}() is missing`,
      })),
    ];

    const healthScore = Number(
      (
        100 -
        allMissing.length * 8 -
        functionErrors.length * 10 -
        (artifacts.foundationMigrationId ? 0 : 25) -
        circular.length * 15
      ).toFixed(2),
    );

    return {
      generatedAt: new Date().toISOString(),
      foundationMigrationId: artifacts.foundationMigrationId,
      helpers: artifacts.helpers,
      extensions: artifacts.extensions,
      enums: artifacts.enums,
      coverage,
      missingObjects: allMissing,
      dependencies,
      circular,
      dryRunOk: dryRun.ok && allMissing.length === 0 && functionErrors.length === 0,
      healthScore: Math.max(0, Math.min(100, healthScore)),
    };
  }

  validate(cwd = process.cwd()): { ok: boolean; report: SqlFoundationReport } {
    const report = this.audit(cwd);
    return {
      ok:
        report.dryRunOk &&
        report.missingObjects.length === 0 &&
        report.foundationMigrationId != null &&
        report.coverage.missingHelpers.length === 0,
      report,
    };
  }
}

export const sqlFoundationEngine = new SqlFoundationEngine();
