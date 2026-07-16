/**
 * EPAC Phase 8 — DevOps Audit.
 * Orchestrates EDRP / Database Governance / registries without reimplementation.
 */
import { existsSync } from "node:fs";
import { join } from "node:path";
import { databaseGovernanceEngine } from "@/lib/database-governance/engine";
import { auditSchemaDrift } from "@/lib/database-governance/schema-drift";
import { projectSyncEngine } from "@/lib/project-sync/engine";
import { capabilityRegistryEngine } from "@/lib/capability-registry/engine";
import { platformRegistryEngine } from "@/lib/platform-registry/engine";
import type { AuditFinding, PhaseHealth } from "@/lib/platform-audit/types";

function driftCounts(drift: ReturnType<typeof auditSchemaDrift>) {
  const errors = drift.findings.filter((finding) => finding.severity === "error").length;
  const warnings = drift.findings.filter((finding) => finding.severity === "warning").length;
  return { errors, warnings };
}

export function auditDevops(cwd = process.cwd()): PhaseHealth {
  const started = Date.now();
  const findings: AuditFinding[] = [];

  const devopsPresent = existsSync(join(cwd, "src", "lib", "devops"));
  const ciBlueprints = [
    join(cwd, ".github", "workflows"),
    join(cwd, "azure-pipelines.yml"),
    join(cwd, ".gitlab-ci.yml"),
    join(cwd, "ci", "self-hosted"),
  ].filter((path) => existsSync(path));

  if (!devopsPresent) {
    findings.push({
      phase: "devops",
      code: "devops_module_missing",
      severity: "blocker",
      message: "EDRP module missing at src/lib/devops",
      rootCause: "DevOps orchestration layer not present",
    });
  }

  const governance = databaseGovernanceEngine.audit(cwd);
  const drift = auditSchemaDrift(cwd);
  const { errors: driftErrors, warnings: driftWarnings } = driftCounts(drift);
  const sync = projectSyncEngine.synchronize({ cwd, persist: false });
  const capability = capabilityRegistryEngine.buildReport();
  const platform = platformRegistryEngine.buildReport();

  if (!governance.dryRun.ok) {
    findings.push({
      phase: "devops",
      code: "governance_dry_run_failed",
      severity: "error",
      message: "Database governance dry-run failed",
      rootCause: "Migration pipeline not replay-safe",
    });
  }
  if (!drift.ok || driftErrors > 0) {
    findings.push({
      phase: "devops",
      code: "schema_drift_or_repo_incompatibility",
      severity: "error",
      message: `Schema drift / repository compatibility errors=${driftErrors}`,
      rootCause: "Types/repositories diverge from migrations",
    });
  }
  if (!sync.report.validation.ok) {
    findings.push({
      phase: "devops",
      code: "project_sync_validation_failed",
      severity: "error",
      message: "Project Bible synchronization validation failed",
      rootCause: "EPBSE validation errors",
    });
  }
  if (!capability.validation.ok) {
    findings.push({
      phase: "devops",
      code: "capability_registry_invalid",
      severity: "warning",
      message: "Capability registry validation failed",
      rootCause: "Capability catalog inconsistencies",
    });
  }

  const scores = [
    devopsPresent ? 100 : 0,
    governance.health.healthScore,
    drift.ok && driftErrors === 0 ? 100 : 0,
    sync.report.validation.ok ? 100 : 0,
    capability.validation.ok ? 100 : 50,
    platform.platformCompletionPct,
    ciBlueprints.length > 0 ? 100 : 40,
  ];
  const scorePct = Number(
    (scores.reduce((sum, value) => sum + value, 0) / scores.length).toFixed(2),
  );

  return {
    phase: "devops",
    label: "DevOps Audit",
    ok: findings.every((finding) => finding.severity !== "blocker"),
    scorePct,
    findings,
    metrics: {
      devopsModulePresent: devopsPresent,
      ciBlueprintSurfaces: ciBlueprints.length,
      migrationHealth: governance.health.healthScore,
      schemaDriftErrors: driftErrors,
      schemaDriftWarnings: driftWarnings,
      projectSyncOk: sync.report.validation.ok,
      capabilityValidationOk: capability.validation.ok,
      platformCompletionPct: platform.platformCompletionPct,
      capabilityCompletionPct: capability.platformCompletionPct,
    },
    durationMs: Date.now() - started,
  };
}
