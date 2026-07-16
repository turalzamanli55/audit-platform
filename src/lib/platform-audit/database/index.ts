/**
 * EPAC Phase 3 — Database Audit.
 * Orchestrates Database Governance + SQL Foundation + schema drift. Does not reimplement.
 */
import { databaseGovernanceEngine } from "@/lib/database-governance/engine";
import { auditSchemaDrift } from "@/lib/database-governance/schema-drift";
import { sqlFoundationEngine } from "@/lib/sql-foundation";
import { readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import type { AuditFinding, PhaseHealth } from "@/lib/platform-audit/types";

function driftCounts(drift: ReturnType<typeof auditSchemaDrift>) {
  const errors = drift.findings.filter((finding) => finding.severity === "error").length;
  const warnings = drift.findings.filter((finding) => finding.severity === "warning").length;
  return { errors, warnings };
}

export function auditDatabase(cwd = process.cwd()): PhaseHealth {
  const started = Date.now();
  const findings: AuditFinding[] = [];
  const governance = databaseGovernanceEngine.audit(cwd);
  const drift = auditSchemaDrift(cwd);
  const { errors: driftErrors, warnings: driftWarnings } = driftCounts(drift);
  const foundation = sqlFoundationEngine.audit(cwd);
  const foundationOk =
    foundation.dryRunOk && foundation.coverage.missingHelpers.length === 0;

  const migrationsDir = join(cwd, "supabase", "migrations");
  const migrationCount = existsSync(migrationsDir)
    ? readdirSync(migrationsDir).filter((name) => name.endsWith(".sql")).length
    : 0;

  if (!governance.dryRun.ok) {
    findings.push({
      phase: "database",
      code: "migration_dry_run_failed",
      severity: "blocker",
      message: "Migration dry-run failed",
      rootCause: "Database Governance dry-run reported failure",
    });
  }
  if (governance.health.healthScore < 95) {
    findings.push({
      phase: "database",
      code: "migration_health_below_threshold",
      severity: "error",
      message: `Migration health ${governance.health.healthScore} below 95`,
      rootCause: "Migration governance findings reduce health score",
    });
  }
  if (!drift.ok || driftErrors > 0) {
    findings.push({
      phase: "database",
      code: "schema_drift_detected",
      severity: "blocker",
      message: `Schema drift errors=${driftErrors} warnings=${driftWarnings}`,
      rootCause: "Migrations, types, and repositories are out of sync",
    });
  }
  if (!foundationOk) {
    findings.push({
      phase: "database",
      code: "sql_foundation_incomplete",
      severity: "error",
      message: "SQL Foundation audit failed",
      rootCause: "Required shared SQL helpers missing or misordered",
    });
  }

  const foundationCoverage = foundation.coverage.coveragePct;
  const scores = [
    governance.health.healthScore,
    governance.health.dependencyHealth,
    drift.ok && driftErrors === 0 ? 100 : 0,
    foundationOk ? 100 : foundationCoverage,
  ];
  const scorePct = Number(
    (scores.reduce((sum, value) => sum + value, 0) / scores.length).toFixed(2),
  );

  return {
    phase: "database",
    label: "Database Audit",
    ok: findings.every((finding) => finding.severity !== "blocker"),
    scorePct,
    findings,
    metrics: {
      migrationCount,
      migrationHealth: governance.health.healthScore,
      dependencyHealth: governance.health.dependencyHealth,
      schemaDriftErrors: driftErrors,
      schemaDriftWarnings: driftWarnings,
      sqlFoundationOk: foundationOk,
      sqlFoundationCoveragePct: foundationCoverage,
      dryRunOk: governance.dryRun.ok,
    },
    durationMs: Date.now() - started,
  };
}
