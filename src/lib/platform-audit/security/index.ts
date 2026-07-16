/**
 * EPAC Phase 9 — Security Audit.
 * Evidence-only: RLS/policies via governance, auth/permissions modules, secrets hygiene.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { databaseGovernanceEngine } from "@/lib/database-governance/engine";
import { walkFiles, toRepoPath, directoryHasFiles } from "@/lib/platform-audit/utils";
import type { AuditFinding, PhaseHealth } from "@/lib/platform-audit/types";
import { auditSchemaDrift } from "@/lib/database-governance/schema-drift";

export function auditSecurity(cwd = process.cwd()): PhaseHealth {
  const started = Date.now();
  const findings: AuditFinding[] = [];

  const authPresent = directoryHasFiles(join(cwd, "src", "lib", "auth"), [".ts"]);
  const securityLib = directoryHasFiles(join(cwd, "src", "lib", "security"), [".ts"]);
  const permissionRepo = directoryHasFiles(join(cwd, "src", "repositories", "permission"), [".ts"]);
  const roleRepo = directoryHasFiles(join(cwd, "src", "repositories", "role"), [".ts"]);

  const governance = databaseGovernanceEngine.audit(cwd);
  const drift = auditSchemaDrift(cwd);
  const rlsPolicyMentions = walkFiles(join(cwd, "supabase", "migrations"), [".sql"]).filter(
    (file) => {
      const source = readFileSync(file, "utf8");
      return /ENABLE ROW LEVEL SECURITY|CREATE POLICY/i.test(source);
    },
  ).length;
  const governanceErrors = governance.orderingIssues.filter(
    (finding) => finding.severity === "error",
  );

  if (!authPresent) {
    findings.push({
      phase: "security",
      code: "auth_module_missing",
      severity: "blocker",
      message: "Auth module missing evidence under src/lib/auth",
      rootCause: "Authentication/authorization implementation absent",
    });
  }
  if (!permissionRepo && !roleRepo) {
    findings.push({
      phase: "security",
      code: "permission_repositories_missing",
      severity: "error",
      message: "Permission/role repositories missing",
      rootCause: "No repository evidence for permissions model",
    });
  }
  if (rlsPolicyMentions === 0) {
    findings.push({
      phase: "security",
      code: "rls_policy_evidence_missing",
      severity: "error",
      message: "No RLS enablement/policy statements found in migrations",
      rootCause: "Migrations lack ENABLE ROW LEVEL SECURITY / CREATE POLICY evidence",
    });
  }
  if (governanceErrors.length > 0) {
    findings.push({
      phase: "security",
      code: "migration_governance_errors",
      severity: "warning",
      message: `${governanceErrors.length} migration ordering/governance errors`,
      rootCause: "Database governance ordering issues may affect security objects",
    });
  }
  if (drift.findings.some((finding) => /rls|policy|permission/i.test(finding.code))) {
    findings.push({
      phase: "security",
      code: "security_related_schema_drift",
      severity: "warning",
      message: "Schema drift includes security-related findings",
      rootCause: "Security objects may be out of sync across layers",
    });
  }

  // Secrets hygiene — ensure .env is gitignored and no hardcoded service keys in src
  const gitignore = existsSync(join(cwd, ".gitignore"))
    ? readFileSync(join(cwd, ".gitignore"), "utf8")
    : "";
  if (!/\.env/i.test(gitignore)) {
    findings.push({
      phase: "security",
      code: "env_not_gitignored",
      severity: "blocker",
      message: ".env patterns not present in .gitignore",
      rootCause: "Secrets files may be version-controlled",
    });
  }

  let secretSuspects = 0;
  for (const file of walkFiles(join(cwd, "src"), [".ts", ".tsx"]).slice(0, 500)) {
    const source = readFileSync(file, "utf8");
    if (/sk-[a-zA-Z0-9]{20,}|supabase_service_role|BEGIN PRIVATE KEY/i.test(source)) {
      secretSuspects += 1;
      findings.push({
        phase: "security",
        code: "secret_like_literal",
        severity: "blocker",
        message: `Secret-like literal in ${toRepoPath(cwd, file)}`,
        rootCause: "Hardcoded credential pattern detected",
        evidencePaths: [toRepoPath(cwd, file)],
      });
    }
  }

  const evidenceFlags = [
    authPresent,
    securityLib,
    permissionRepo || roleRepo,
    rlsPolicyMentions > 0,
    secretSuspects === 0,
  ];
  const scorePct = Number(
    ((evidenceFlags.filter(Boolean).length / evidenceFlags.length) * 100).toFixed(2),
  );

  return {
    phase: "security",
    label: "Security Audit",
    ok: findings.every((finding) => finding.severity !== "blocker"),
    scorePct,
    findings,
    metrics: {
      authPresent,
      securityLibPresent: securityLib,
      permissionRepoPresent: permissionRepo,
      roleRepoPresent: roleRepo,
      rlsPolicyMentions,
      governanceErrors: governanceErrors.length,
      secretSuspects,
    },
    durationMs: Date.now() - started,
  };
}
