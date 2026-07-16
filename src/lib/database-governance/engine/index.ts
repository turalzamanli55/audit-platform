import { loadMigrations } from "@/lib/database-governance/audit";
import {
  buildMigrationDependencyGraph,
  detectCircularDependencies,
} from "@/lib/database-governance/dependency";
import { validateMigrationOrdering } from "@/lib/database-governance/ordering";
import { auditCompatibility } from "@/lib/database-governance/compatibility";
import {
  dryRunMigrations,
  validateFoundationLayers,
} from "@/lib/database-governance/validation";
import {
  buildDatabaseBaseline,
  calculateMigrationHealth,
} from "@/lib/database-governance/health";
import { auditMigrationGovernance } from "@/lib/database-governance/governance";
import {
  MIGRATION_HEALTH_THRESHOLD,
  DEPENDENCY_HEALTH_TARGET,
} from "@/lib/database-governance/lifecycle";
import { sqlFoundationEngine } from "@/lib/sql-foundation";
import type { MigrationFinding, MigrationGovernanceReport } from "@/lib/database-governance/types";

/**
 * Database Migration Governance Engine
 * Validates chronological order, dependencies, compatibility, SQL foundation, and clean rebuild readiness.
 */
export class DatabaseGovernanceEngine {
  audit(cwd = process.cwd()): MigrationGovernanceReport {
    const migrations = loadMigrations(cwd);
    const dependencies = buildMigrationDependencyGraph(migrations);
    const orderingIssues = validateMigrationOrdering(migrations, dependencies);
    const circular = detectCircularDependencies(dependencies);
    const compatibility = auditCompatibility(migrations);
    const foundation = validateFoundationLayers(migrations);
    const objectGovernance = auditMigrationGovernance(migrations);
    const dryRun = dryRunMigrations(migrations);
    const sqlFoundation = sqlFoundationEngine.audit(cwd);

    const sqlFoundationFindings: MigrationFinding[] = [
      ...sqlFoundation.missingObjects.map((missing) => ({
        code: "missing_sql_object",
        severity: "error" as const,
        migrationId: missing.referencedByMigrationId,
        message: missing.reason,
        details: { object: missing.object },
      })),
      ...(sqlFoundation.foundationMigrationId
        ? []
        : [
            {
              code: "missing_sql_foundation_migration",
              severity: "error" as const,
              migrationId: "baseline",
              message: "Enterprise SQL Foundation migration is missing",
            },
          ]),
    ];

    const findings: MigrationFinding[] = [
      ...orderingIssues,
      ...circular,
      ...compatibility,
      ...foundation,
      ...objectGovernance,
      ...sqlFoundationFindings,
    ];

    const health = calculateMigrationHealth({
      migrations,
      dependencies,
      findings,
      dryRun,
    });
    const baseline = buildDatabaseBaseline(migrations);

    const accepted =
      dryRun.ok &&
      findings.every((finding) => finding.severity !== "error") &&
      health.compatibilityRisk === 0 &&
      health.healthScore >= MIGRATION_HEALTH_THRESHOLD &&
      health.dependencyHealth === DEPENDENCY_HEALTH_TARGET &&
      sqlFoundation.coverage.missingHelpers.length === 0 &&
      sqlFoundation.missingObjects.filter((entry) =>
        entry.referencedByMigrationId !== "sql-foundation-coverage",
      ).length === 0;

    return {
      generatedAt: new Date().toISOString(),
      migrations,
      dependencies,
      orderingIssues: [...orderingIssues, ...circular],
      dryRun,
      health,
      baseline,
      accepted,
    };
  }

  /**
   * Gate for future migrations — reject if governance fails.
   */
  validateBeforeAccept(cwd = process.cwd()): {
    ok: boolean;
    report: MigrationGovernanceReport;
  } {
    const report = this.audit(cwd);
    return { ok: report.accepted, report };
  }
}

export const databaseGovernanceEngine = new DatabaseGovernanceEngine();
