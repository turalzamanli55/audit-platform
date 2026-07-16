import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { databaseGovernanceEngine } from "@/lib/database-governance/engine";
import { auditSchemaDrift } from "@/lib/database-governance/schema-drift";
import { verifySupabaseTypesFile } from "@/lib/database-governance/lifecycle";
import { sqlFoundationEngine } from "@/lib/sql-foundation";
import { projectSyncEngine } from "@/lib/project-sync/engine";
import { capabilityRegistryEngine } from "@/lib/capability-registry/engine";
import { platformRegistryEngine } from "@/lib/platform-registry/engine";
import type {
  PipelineRunOptions,
  PipelineStageId,
  PipelineStageResult,
} from "@/lib/devops/types";

const LOCALES = ["en", "az", "ru", "tr"] as const;

const STAGE_LABELS: Record<PipelineStageId, string> = {
  source_validation: "Source Validation",
  migration_validation: "Migration Validation",
  sql_foundation_validation: "SQL Foundation Validation",
  schema_validation: "Schema Validation",
  supabase_types_validation: "Supabase Types Validation",
  repository_validation: "Repository Validation",
  localization_validation: "Localization Validation",
  capability_validation: "Capability Validation",
  project_bible_sync: "Project Bible Synchronization",
  platform_readiness_sync: "Platform Readiness Synchronization",
  build_validation: "Build Validation",
  unit_tests: "Unit Tests",
  integration_tests: "Integration Tests",
  governance_validation: "Governance Validation",
  release_validation: "Release Validation",
  ai_validation: "AI Validation",
};

function timed(
  id: PipelineStageId,
  severity: PipelineStageResult["severity"],
  fn: () => Omit<PipelineStageResult, "id" | "label" | "durationMs" | "severity">,
): PipelineStageResult {
  const started = Date.now();
  const result = fn();
  return {
    id,
    label: STAGE_LABELS[id],
    severity,
    durationMs: Date.now() - started,
    ...result,
  };
}

function flattenKeys(value: unknown, prefix = ""): string[] {
  if (value === null || typeof value !== "object") return prefix ? [prefix] : [];
  const keys: string[] = [];
  for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (nested !== null && typeof nested === "object" && !Array.isArray(nested)) {
      keys.push(...flattenKeys(nested, path));
    } else {
      keys.push(path);
    }
  }
  return keys;
}

function walkTsFiles(dir: string, files: string[] = []): string[] {
  if (!existsSync(dir)) return files;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const absolute = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (["node_modules", ".next", "dist"].includes(entry.name)) continue;
      walkTsFiles(absolute, files);
    } else if (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx")) {
      files.push(absolute);
    }
  }
  return files;
}

/** Source Validation — governance docs + package integrity. */
export function validateSource(cwd: string): PipelineStageResult {
  return timed("source_validation", "blocker", () => {
    const required = [
      "docs/PROJECT_BIBLE.md",
      "docs/MASTER_PRD.md",
      "docs/SYSTEM_ARCHITECTURE.md",
      "docs/IMPLEMENTATION_STANDARD.md",
      "package.json",
      "tsconfig.json",
    ];
    const missing = required.filter((path) => !existsSync(join(cwd, path)));
    if (missing.length > 0) {
      return {
        ok: false,
        message: `Missing source artifacts: ${missing.join(", ")}`,
        details: { missing },
      };
    }
    const pkg = JSON.parse(readFileSync(join(cwd, "package.json"), "utf8")) as {
      name?: string;
      scripts?: Record<string, string>;
    };
    if (!pkg.scripts?.build || !pkg.scripts?.test) {
      return { ok: false, message: "package.json missing build/test scripts" };
    }
    return {
      ok: true,
      message: "Governance documents and package scripts present",
    };
  });
}

/** Migration Validation — delegates to Database Governance dry-run. */
export function validateMigrations(cwd: string): PipelineStageResult {
  return timed("migration_validation", "blocker", () => {
    const report = databaseGovernanceEngine.audit(cwd);
    return {
      ok: report.dryRun.ok,
      message: report.dryRun.ok
        ? `Dry-run #1→#${report.migrations.length} OK`
        : "Migration dry-run failed",
      details: {
        migrations: report.migrations.length,
        healthScore: report.health.healthScore,
        dependencyHealth: report.health.dependencyHealth,
      },
    };
  });
}

/** SQL Foundation Validation — delegates to ESFE. */
export function validateSqlFoundation(cwd: string): PipelineStageResult {
  return timed("sql_foundation_validation", "blocker", () => {
    const report = sqlFoundationEngine.audit(cwd);
    const ok =
      report.dryRunOk &&
      report.coverage.missingHelpers.length === 0 &&
      Boolean(report.foundationMigrationId);
    return {
      ok,
      message: ok
        ? `SQL Foundation coverage ${report.coverage.coveragePct}%`
        : `SQL Foundation incomplete — missing helpers: ${report.coverage.missingHelpers.join(", ") || "none"}`,
      details: {
        foundationMigrationId: report.foundationMigrationId,
        coveragePct: report.coverage.coveragePct,
        healthScore: report.healthScore,
      },
    };
  });
}

/** Schema Validation — delegates to schema drift audit. */
export function validateSchema(cwd: string): PipelineStageResult {
  return timed("schema_validation", "blocker", () => {
    const drift = auditSchemaDrift(cwd);
    const errors = drift.findings.filter((f) => f.severity === "error");
    return {
      ok: drift.ok,
      message: drift.ok
        ? "Schema layers aligned"
        : `${errors.length} schema drift error(s)`,
      details: {
        errorCount: errors.length,
        warningCount: drift.findings.filter((f) => f.severity === "warning").length,
      },
    };
  });
}

/** Supabase Types Validation. */
export function validateSupabaseTypes(cwd: string): PipelineStageResult {
  return timed("supabase_types_validation", "blocker", () => {
    const ok = verifySupabaseTypesFile(cwd);
    return {
      ok,
      message: ok
        ? "src/types/supabase.ts present and parseable"
        : "Supabase types file missing or invalid",
    };
  });
}

/** Repository Validation — .from() tables must exist in migrations. */
export function validateRepositories(cwd: string): PipelineStageResult {
  return timed("repository_validation", "error", () => {
    const drift = auditSchemaDrift(cwd);
    const repoErrors = drift.findings.filter(
      (f) =>
        f.severity === "error" &&
        (f.code === "repository_table_not_in_migrations" ||
          f.code === "repository_table_missing_in_types"),
    );
    return {
      ok: repoErrors.length === 0,
      message:
        repoErrors.length === 0
          ? "Repository table references compatible with schema/types"
          : `${repoErrors.length} repository compatibility error(s)`,
      details: { errors: repoErrors.slice(0, 10) },
    };
  });
}

/** Localization Validation — locale key parity. */
export function validateLocalization(cwd: string): PipelineStageResult {
  return timed("localization_validation", "error", () => {
    try {
      const messagesDir = join(cwd, "src", "i18n", "messages");
      const base = JSON.parse(
        readFileSync(join(messagesDir, "en.json"), "utf8"),
      ) as Record<string, unknown>;
      const baseKeys = new Set(flattenKeys(base));
      const missing: string[] = [];
      for (const locale of LOCALES) {
        if (locale === "en") continue;
        const localeJson = JSON.parse(
          readFileSync(join(messagesDir, `${locale}.json`), "utf8"),
        ) as Record<string, unknown>;
        const localeKeys = new Set(flattenKeys(localeJson));
        for (const key of baseKeys) {
          if (!localeKeys.has(key)) missing.push(`${locale}:${key}`);
        }
      }

      const srcFiles = walkTsFiles(join(cwd, "src", "components")).slice(0, 200);
      let hardcodedHits = 0;
      for (const file of srcFiles) {
        const source = readFileSync(file, "utf8");
        if (
          /["'][A-Z][a-z]+ [a-z]+/.test(source) &&
          !file.includes("test") &&
          source.includes("useTranslations") === false &&
          source.includes("dictionary") === false
        ) {
          hardcodedHits += 1;
        }
      }

      if (missing.length > 0) {
        return {
          ok: false,
          message: `${missing.length} missing translation key(s)`,
          details: { missing: missing.slice(0, 20), hardcodedHits },
        };
      }
      return {
        ok: true,
        message: `Locale parity verified for ${LOCALES.join(", ")}`,
        details: { hardcodedHits },
      };
    } catch (error) {
      return {
        ok: false,
        message: error instanceof Error ? error.message : "Localization validation failed",
      };
    }
  });
}

/** Capability Validation — capability registry. */
export function validateCapability(cwd: string): PipelineStageResult {
  return timed("capability_validation", "blocker", () => {
    try {
      capabilityRegistryEngine.resyncFromDocumentation(cwd);
      const report = capabilityRegistryEngine.buildReport();
      return {
        ok: report.validation.ok,
        message: report.validation.ok
          ? "Capability registry valid"
          : `Capability errors: ${report.validation.errors.slice(0, 3).join("; ")}`,
        details: {
          platformCompletionPct: report.platformCompletionPct,
          errorCount: report.validation.errors.length,
        },
      };
    } catch (error) {
      return {
        ok: false,
        message: error instanceof Error ? error.message : "Capability validation failed",
      };
    }
  });
}

/** Project Bible Synchronization — EPBSE. */
export function validateProjectSync(cwd: string): PipelineStageResult {
  return timed("project_bible_sync", "blocker", () => {
    try {
      const sync = projectSyncEngine.synchronize({ cwd, persist: false });
      const ok =
        sync.snapshot.domains.length > 0 &&
        sync.snapshot.modules.length > 0 &&
        sync.report.validation.ok;
      return {
        ok,
        message: ok
          ? `EPBSE synchronized — ${sync.snapshot.modules.length} modules`
          : "EPBSE synchronization incomplete",
        details: {
          domains: sync.snapshot.domains.length,
          modules: sync.snapshot.modules.length,
          platformCompletionPct: sync.snapshot.platformCompletionPct,
        },
      };
    } catch (error) {
      return {
        ok: false,
        message: error instanceof Error ? error.message : "Project sync failed",
      };
    }
  });
}

/** Platform Readiness Synchronization. */
export function validatePlatformReadiness(cwd: string): PipelineStageResult {
  return timed("platform_readiness_sync", "blocker", () => {
    try {
      const completion = platformRegistryEngine.getPlatformCompletion();
      const report = platformRegistryEngine.buildReport();
      const ok = report.validation.ok && completion >= 0;
      return {
        ok,
        message: ok
          ? `Platform readiness synchronized — completion ${completion}%`
          : "Platform readiness validation failed",
        details: {
          platformCompletionPct: completion,
          moduleCount: report.modules.length,
        },
      };
    } catch (error) {
      return {
        ok: false,
        message: error instanceof Error ? error.message : "Platform readiness failed",
      };
    }
  });
}

/** Governance Validation — full database governance acceptance. */
export function validateGovernance(cwd: string): PipelineStageResult {
  return timed("governance_validation", "blocker", () => {
    const { ok, report } = databaseGovernanceEngine.validateBeforeAccept(cwd);
    return {
      ok,
      message: ok
        ? `Governance accepted — health ${report.health.healthScore}`
        : "Database governance rejected",
      details: {
        healthScore: report.health.healthScore,
        dependencyHealth: report.health.dependencyHealth,
        accepted: report.accepted,
      },
    };
  });
}

/** AI Validation — required AI platform modules exist and export. */
export function validateAi(cwd: string): PipelineStageResult {
  return timed("ai_validation", "error", () => {
    const required = [
      "src/lib/ai/registry",
      "src/lib/ai/skills/registry",
      "src/lib/ai/knowledge-graph",
      "src/lib/ai/tools/registry",
      "src/lib/ai/context-resolvers",
      "src/lib/ai/providers",
      "src/lib/ai/orchestrator",
      "src/lib/ai/pipeline",
      "src/lib/ai/host",
      "src/lib/ai/memory-engine",
    ];
    const missing = required.filter((path) => {
      const absolute = join(cwd, path);
      return !existsSync(absolute) && !existsSync(`${absolute}/index.ts`);
    });
    return {
      ok: missing.length === 0,
      message:
        missing.length === 0
          ? "AI platform modules present"
          : `Missing AI modules: ${missing.join(", ")}`,
      details: { missing },
    };
  });
}

/** Build Validation — TypeScript project references + Next.js config presence. */
export function validateBuild(cwd: string, options: PipelineRunOptions): PipelineStageResult {
  return timed("build_validation", "blocker", () => {
    if (!options.runBuild) {
      const hasNextConfig =
        existsSync(join(cwd, "next.config.ts")) ||
        existsSync(join(cwd, "next.config.js")) ||
        existsSync(join(cwd, "next.config.mjs"));
      const hasTsconfig = existsSync(join(cwd, "tsconfig.json"));
      const hasEslint =
        existsSync(join(cwd, "eslint.config.mjs")) ||
        existsSync(join(cwd, "eslint.config.js")) ||
        existsSync(join(cwd, ".eslintrc.json"));
      const appDir = join(cwd, "src", "app");
      const routeCount = walkTsFiles(appDir).filter((f) => f.endsWith("page.tsx")).length;
      const ok = hasNextConfig && hasTsconfig && hasEslint && routeCount > 0;
      return {
        ok,
        skipped: true,
        message: ok
          ? `Build structural checks OK (${routeCount} routes) — full build deferred`
          : "Build structural checks failed",
        details: { hasNextConfig, hasTsconfig, hasEslint, routeCount },
      };
    }
    try {
      const { execSync } = require("node:child_process") as typeof import("node:child_process");
      execSync("npm run build", { cwd, stdio: "pipe" });
      return { ok: true, message: "npm run build passed" };
    } catch (error) {
      return {
        ok: false,
        message: error instanceof Error ? error.message.slice(0, 400) : "Build failed",
      };
    }
  });
}

/** Unit Tests. */
export function validateUnitTests(
  cwd: string,
  options: PipelineRunOptions,
): PipelineStageResult {
  return timed("unit_tests", "blocker", () => {
    if (!options.runUnitTests) {
      const testFiles = walkTsFiles(join(cwd, "src")).filter((f) =>
        f.includes(".test."),
      );
      return {
        ok: testFiles.length > 0,
        skipped: true,
        message: `${testFiles.length} test files present — execution deferred`,
        details: { testFileCount: testFiles.length },
      };
    }
    try {
      const { execSync } = require("node:child_process") as typeof import("node:child_process");
      execSync("npm run test", { cwd, stdio: "pipe" });
      return { ok: true, message: "Unit tests passed" };
    } catch (error) {
      return {
        ok: false,
        message: error instanceof Error ? error.message.slice(0, 400) : "Unit tests failed",
      };
    }
  });
}

/** Integration Tests — governance + lifecycle suite presence. */
export function validateIntegrationTests(
  cwd: string,
  options: PipelineRunOptions,
): PipelineStageResult {
  return timed("integration_tests", "error", () => {
    const requiredSuites = [
      "src/lib/database-governance/database-governance.test.ts",
      "src/lib/database-governance/database-lifecycle.test.ts",
      "src/lib/sql-foundation/sql-foundation.test.ts",
      "src/lib/devops/devops.test.ts",
    ];
    const missing = requiredSuites.filter((path) => !existsSync(join(cwd, path)));
    if (missing.length > 0) {
      return {
        ok: false,
        message: `Missing integration suites: ${missing.join(", ")}`,
        details: { missing },
      };
    }
    if (!options.runIntegrationTests) {
      return {
        ok: true,
        skipped: true,
        message: "Integration suites present — execution deferred to CI",
      };
    }
    try {
      const { execSync } = require("node:child_process") as typeof import("node:child_process");
      execSync("npm run validate:database", { cwd, stdio: "pipe" });
      return { ok: true, message: "Integration validation suites passed" };
    } catch (error) {
      return {
        ok: false,
        message:
          error instanceof Error
            ? error.message.slice(0, 400)
            : "Integration tests failed",
      };
    }
  });
}

/** Release Validation — aggregates blockers from prior stages. */
export function validateRelease(
  prior: PipelineStageResult[],
): PipelineStageResult {
  return timed("release_validation", "blocker", () => {
    const blockers = prior.filter(
      (stage) => !stage.ok && !stage.skipped && stage.severity === "blocker",
    );
    const errors = prior.filter(
      (stage) => !stage.ok && !stage.skipped && stage.severity === "error",
    );
    const ok = blockers.length === 0 && errors.length === 0;
    return {
      ok,
      message: ok
        ? "Release validation passed — no blockers or errors"
        : `Release blocked — ${blockers.length} blocker(s), ${errors.length} error(s)`,
      details: {
        failedStages: [...blockers, ...errors].map((s) => s.id),
      },
    };
  });
}

export function runAllValidationStages(
  options: PipelineRunOptions = {},
): PipelineStageResult[] {
  const cwd = options.cwd ?? process.cwd();
  const stages: PipelineStageResult[] = [];

  const runners: Array<() => PipelineStageResult> = [
    () => validateSource(cwd),
    () => validateMigrations(cwd),
    () => validateSqlFoundation(cwd),
    () => validateSchema(cwd),
    () => validateSupabaseTypes(cwd),
    () => validateRepositories(cwd),
    () => validateLocalization(cwd),
    () => validateCapability(cwd),
    () => validateProjectSync(cwd),
    () => validatePlatformReadiness(cwd),
    () => validateBuild(cwd, options),
    () => validateUnitTests(cwd, options),
    () => validateIntegrationTests(cwd, options),
    () => validateGovernance(cwd),
    () => validateAi(cwd),
  ];

  for (const run of runners) {
    const result = run();
    stages.push(result);
    if (options.failFast && !result.ok && !result.skipped && result.severity === "blocker") {
      break;
    }
  }

  stages.push(validateRelease(stages));
  return stages;
}

export { STAGE_LABELS };
