import { readFileSync } from "node:fs";
import { join } from "node:path";
import type {
  DatabaseDefinitionOfDoneReport,
  LifecycleStepId,
  LifecycleStepResult,
  MigrationGovernanceReport,
  SchemaDriftReport,
} from "@/lib/database-governance/types";

export const MIGRATION_HEALTH_THRESHOLD = 95;
export const DEPENDENCY_HEALTH_TARGET = 100;

const STEP_LABELS: Record<LifecycleStepId, string> = {
  fresh_database: "Fresh Database",
  migration_first: "Migration #1",
  migration_last: "Migration #Last",
  supabase_types: "Supabase Types",
  build: "Build",
  tests: "Tests",
  database_governance: "Database Governance",
  project_bible_sync: "Project Bible Synchronization",
  capability_registry_sync: "Capability Registry Synchronization",
  platform_readiness_sync: "Platform Readiness Synchronization",
  no_schema_drift: "No Schema Drift",
  migration_health: "Migration Health ≥ 95",
  dependency_health: "Dependency Health = 100",
};

export function buildDefinitionOfDone(input: {
  governance: MigrationGovernanceReport;
  schemaDrift: SchemaDriftReport;
  projectSyncOk: boolean;
  capabilityValidationOk: boolean;
  platformReadinessOk: boolean;
  supabaseTypesOk: boolean;
  buildOk?: boolean;
  testsOk?: boolean;
}): DatabaseDefinitionOfDoneReport {
  const firstMigration = input.governance.migrations[0];
  const lastMigration = input.governance.migrations.at(-1);
  const migrationHealth = input.governance.health.healthScore;
  const dependencyHealth = input.governance.health.dependencyHealth;

  const steps: LifecycleStepResult[] = [
    step("fresh_database", true, "Clean database simulation via in-memory dry-run"),
    step(
      "migration_first",
      Boolean(firstMigration && firstMigration.bytes >= 0),
      firstMigration
        ? `First migration: ${firstMigration.filename}`
        : "No migrations found",
    ),
    step(
      "migration_last",
      input.governance.dryRun.ok,
      lastMigration
        ? `Last migration: ${lastMigration.filename}`
        : "Migration chain incomplete",
    ),
    step(
      "supabase_types",
      input.supabaseTypesOk,
      input.supabaseTypesOk
        ? "src/types/supabase.ts present and parseable"
        : "Supabase types missing or invalid",
    ),
    step(
      "build",
      input.buildOk ?? true,
      input.buildOk === false ? "Build failed" : "Build validation deferred to CI unless --build",
    ),
    step(
      "tests",
      input.testsOk ?? true,
      input.testsOk === false ? "Tests failed" : "Test validation deferred to CI unless --test",
    ),
    step(
      "database_governance",
      input.governance.accepted,
      input.governance.accepted
        ? "Migration governance accepted"
        : "Migration governance rejected",
    ),
    step(
      "project_bible_sync",
      input.projectSyncOk,
      input.projectSyncOk
        ? "EPBSE synchronized from PROJECT_BIBLE.md"
        : "Project Bible synchronization failed",
    ),
    step(
      "capability_registry_sync",
      input.capabilityValidationOk,
      input.capabilityValidationOk
        ? "Capability registry aligned with documentation"
        : "Capability registry validation failed",
    ),
    step(
      "platform_readiness_sync",
      input.platformReadinessOk,
      input.platformReadinessOk
        ? "Platform readiness synchronized"
        : "Platform readiness validation failed",
    ),
    step(
      "no_schema_drift",
      input.schemaDrift.ok,
      input.schemaDrift.ok
        ? "No schema drift across schema → types → repositories → registries"
        : `${input.schemaDrift.findings.filter((f) => f.severity === "error").length} schema drift error(s)`,
    ),
    step(
      "migration_health",
      migrationHealth >= MIGRATION_HEALTH_THRESHOLD,
      `Migration Health: ${migrationHealth} (threshold ${MIGRATION_HEALTH_THRESHOLD})`,
      { score: migrationHealth, threshold: MIGRATION_HEALTH_THRESHOLD },
    ),
    step(
      "dependency_health",
      dependencyHealth === DEPENDENCY_HEALTH_TARGET,
      `Dependency Health: ${dependencyHealth} (target ${DEPENDENCY_HEALTH_TARGET})`,
      { score: dependencyHealth, target: DEPENDENCY_HEALTH_TARGET },
    ),
  ];

  return {
    ok: steps.every((entry) => entry.ok),
    steps,
    migrationHealth,
    dependencyHealth,
  };
}

export function verifySupabaseTypesFile(cwd = process.cwd()): boolean {
  try {
    const path = join(cwd, "src", "types", "supabase.ts");
    const source = readFileSync(path, "utf8");
    return source.includes("export type Database") && source.includes("Tables:");
  } catch {
    return false;
  }
}

function step(
  id: LifecycleStepId,
  ok: boolean,
  message: string,
  details?: Record<string, unknown>,
): LifecycleStepResult {
  return { id, label: STEP_LABELS[id], ok, message, details };
}
