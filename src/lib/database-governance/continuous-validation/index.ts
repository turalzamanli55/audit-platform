import { readFileSync } from "node:fs";
import { join } from "node:path";
import { execSync } from "node:child_process";
import { databaseGovernanceEngine } from "@/lib/database-governance/engine";
import { auditSchemaDrift } from "@/lib/database-governance/schema-drift";
import {
  buildDefinitionOfDone,
  verifySupabaseTypesFile,
} from "@/lib/database-governance/lifecycle";
import { ENTERPRISE_DATABASE_RESET_PROCEDURE } from "@/lib/database-governance/reset";
import { projectSyncEngine } from "@/lib/project-sync/engine";
import { capabilityRegistryEngine } from "@/lib/capability-registry/engine";
import type {
  ContinuousValidationReport,
  ContinuousValidationStep,
  DatabaseLifecycleReport,
} from "@/lib/database-governance/types";

const LOCALES = ["en", "az", "ru", "tr"] as const;

function flattenKeys(value: unknown, prefix = ""): string[] {
  if (value === null || typeof value !== "object") return prefix ? [prefix] : [];
  const entries = Object.entries(value as Record<string, unknown>);
  const keys: string[] = [];
  for (const [key, nested] of entries) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (nested !== null && typeof nested === "object" && !Array.isArray(nested)) {
      keys.push(...flattenKeys(nested, path));
    } else {
      keys.push(path);
    }
  }
  return keys;
}

function validateLocalization(cwd: string): ContinuousValidationStep {
  try {
    const basePath = join(cwd, "src", "i18n", "messages", "en.json");
    const base = JSON.parse(readFileSync(basePath, "utf8")) as Record<string, unknown>;
    const baseKeys = new Set(flattenKeys(base));
    const missing: string[] = [];

    for (const locale of LOCALES) {
      if (locale === "en") continue;
      const localePath = join(cwd, "src", "i18n", "messages", `${locale}.json`);
      const localeJson = JSON.parse(readFileSync(localePath, "utf8")) as Record<string, unknown>;
      const localeKeys = new Set(flattenKeys(localeJson));
      for (const key of baseKeys) {
        if (!localeKeys.has(key)) missing.push(`${locale}:${key}`);
      }
    }

    if (missing.length > 0) {
      return {
        id: "localization_validation",
        label: "Localization Validation",
        ok: false,
        message: `${missing.length} missing translation key(s) — first: ${missing[0]}`,
      };
    }

    return {
      id: "localization_validation",
      label: "Localization Validation",
      ok: true,
      message: `Locale parity verified for ${LOCALES.join(", ")}`,
    };
  } catch (error) {
    return {
      id: "localization_validation",
      label: "Localization Validation",
      ok: false,
      message: error instanceof Error ? error.message : "Localization validation failed",
    };
  }
}

function runOptionalCommand(command: string, label: string): ContinuousValidationStep {
  try {
    execSync(command, { stdio: "pipe", cwd: process.cwd() });
    return { id: label as ContinuousValidationStep["id"], label, ok: true, message: `${label} passed` };
  } catch (error) {
    const message =
      error instanceof Error && "stderr" in error
        ? String((error as { stderr?: Buffer }).stderr ?? error.message)
        : "Command failed";
    return {
      id: label as ContinuousValidationStep["id"],
      label,
      ok: false,
      message: message.slice(0, 500),
    };
  }
}

export type ContinuousValidationOptions = {
  cwd?: string;
  runBuild?: boolean;
  runTests?: boolean;
};

/**
 * Permanent validation pipeline — every module must pass before acceptance.
 */
export function runContinuousValidation(
  options: ContinuousValidationOptions = {},
): ContinuousValidationReport {
  const cwd = options.cwd ?? process.cwd();
  const generatedAt = new Date().toISOString();
  const governance = databaseGovernanceEngine.audit(cwd);
  const schemaDrift = auditSchemaDrift(cwd);

  let projectSyncOk = false;
  let platformReadinessOk = false;
  try {
    const sync = projectSyncEngine.synchronize({ cwd, persist: false });
    projectSyncOk = sync.snapshot.domains.length > 0 && sync.snapshot.modules.length > 0;
    platformReadinessOk = sync.snapshot.platformCompletionPct >= 0;
  } catch {
    projectSyncOk = false;
    platformReadinessOk = false;
  }

  let capabilityValidationOk = false;
  try {
    const report = capabilityRegistryEngine.buildReport();
    capabilityValidationOk = report.validation.ok;
  } catch {
    capabilityValidationOk = false;
  }

  const supabaseTypesOk = verifySupabaseTypesFile(cwd);

  const steps: ContinuousValidationStep[] = [
    {
      id: "migration_validation",
      label: "Migration Validation",
      ok: governance.dryRun.ok,
      message: governance.dryRun.ok
        ? `Dry-run #1→#${governance.migrations.length} OK`
        : "Migration dry-run failed",
    },
    {
      id: "schema_validation",
      label: "Schema Validation",
      ok: schemaDrift.ok,
      message: schemaDrift.ok
        ? "Schema layers aligned"
        : `${schemaDrift.findings.filter((f) => f.severity === "error").length} drift error(s)`,
    },
    {
      id: "governance_validation",
      label: "Governance Validation",
      ok: governance.accepted,
      message: governance.accepted ? "Governance accepted" : "Governance rejected",
    },
    {
      id: "capability_validation",
      label: "Capability Validation",
      ok: capabilityValidationOk,
      message: capabilityValidationOk
        ? "Capability registry valid"
        : "Capability registry validation failed",
    },
    {
      id: "project_bible_sync",
      label: "Project Bible Sync",
      ok: projectSyncOk,
      message: projectSyncOk ? "EPBSE synchronized" : "EPBSE sync failed",
    },
    validateLocalization(cwd),
    {
      id: "type_validation",
      label: "Type Validation",
      ok: supabaseTypesOk,
      message: supabaseTypesOk ? "Supabase types file valid" : "Supabase types invalid",
    },
  ];

  if (options.runBuild) {
    steps.push(runOptionalCommand("npm run build", "build_validation"));
  } else {
    steps.push({
      id: "build_validation",
      label: "Build Validation",
      ok: true,
      message: "Skipped — pass runBuild: true to execute",
      skipped: true,
    });
  }

  if (options.runTests) {
    steps.push(runOptionalCommand("npm run test", "test_validation"));
  } else {
    steps.push({
      id: "test_validation",
      label: "Test Validation",
      ok: true,
      message: "Skipped — pass runTests: true to execute",
      skipped: true,
    });
  }

  steps.push({
    id: "platform_readiness_validation",
    label: "Platform Readiness Validation",
    ok: platformReadinessOk,
    message: platformReadinessOk
      ? "Platform readiness synchronized"
      : "Platform readiness unavailable",
  });

  const definitionOfDone = buildDefinitionOfDone({
    governance,
    schemaDrift,
    projectSyncOk,
    capabilityValidationOk,
    platformReadinessOk,
    supabaseTypesOk,
    buildOk: steps.find((step) => step.id === "build_validation" && !step.skipped)?.ok,
    testsOk: steps.find((step) => step.id === "test_validation" && !step.skipped)?.ok,
  });

  const hardSteps = steps.filter((step) => !step.skipped);
  const ok = hardSteps.every((step) => step.ok) && definitionOfDone.ok;

  return {
    ok,
    generatedAt,
    steps,
    definitionOfDone,
    governance,
    schemaDrift,
  };
}

export function buildDatabaseLifecycleReport(
  options: ContinuousValidationOptions = {},
): DatabaseLifecycleReport {
  const validation = runContinuousValidation(options);
  const governance = validation.governance;
  const orderingErrors = governance.orderingIssues.filter(
    (finding) => finding.severity === "error",
  ).length;

  return {
    generatedAt: validation.generatedAt,
    policyVersion: "16.0.0",
    definitionOfDone: validation.definitionOfDone,
    continuousValidation: validation,
    resetProcedure: ENTERPRISE_DATABASE_RESET_PROCEDURE,
    acceptanceCriteria: {
      ok:
        governance.dryRun.ok &&
        validation.schemaDrift.ok &&
        orderingErrors === 0 &&
        governance.health.healthScore >= 95 &&
        governance.health.dependencyHealth === 100 &&
        governance.accepted,
      freshToLastOk: governance.dryRun.ok,
      noMissingObjects: governance.accepted,
      noSchemaDrift: validation.schemaDrift.ok,
      noOrderingIssues: orderingErrors === 0,
      migrationHealthGte95: governance.health.healthScore >= 95,
      dependencyHealthEq100: governance.health.dependencyHealth === 100,
    },
  };
}

export function formatDatabaseLifecycleReport(report: DatabaseLifecycleReport): string {
  const lines = [
    "Database Lifecycle Report",
    "",
    `Generated: ${report.generatedAt}`,
    `Policy Version: ${report.policyVersion}`,
    "",
    "Definition of Done:",
  ];

  for (const step of report.definitionOfDone.steps) {
    lines.push(`  ${step.ok ? "✓" : "✗"} ${step.label} — ${step.message}`);
  }

  lines.push(
    "",
    "Acceptance Criteria:",
    `  Fresh → Last: ${report.acceptanceCriteria.freshToLastOk ? "PASS" : "FAIL"}`,
    `  No Missing Objects: ${report.acceptanceCriteria.noMissingObjects ? "PASS" : "FAIL"}`,
    `  No Schema Drift: ${report.acceptanceCriteria.noSchemaDrift ? "PASS" : "FAIL"}`,
    `  No Ordering Issues: ${report.acceptanceCriteria.noOrderingIssues ? "PASS" : "FAIL"}`,
    `  Migration Health ≥ 95: ${report.acceptanceCriteria.migrationHealthGte95 ? "PASS" : "FAIL"} (${report.definitionOfDone.migrationHealth})`,
    `  Dependency Health = 100: ${report.acceptanceCriteria.dependencyHealthEq100 ? "PASS" : "FAIL"} (${report.definitionOfDone.dependencyHealth})`,
    `  Overall: ${report.acceptanceCriteria.ok ? "HEALTHY" : "UNHEALTHY"}`,
    "",
    "Continuous Validation:",
  );

  for (const step of report.continuousValidation.steps) {
    const suffix = step.skipped ? " [skipped]" : "";
    lines.push(`  ${step.ok ? "✓" : "✗"} ${step.label}${suffix} — ${step.message}`);
  }

  return lines.join("\n");
}
