import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { loadMigrations } from "@/lib/database-governance/audit";
import type { SchemaDriftFinding, SchemaDriftReport } from "@/lib/database-governance/types";

const MODULE_ANCHOR_TABLES: Record<string, string> = {
  engagement: "engagements",
  planning: "audit_plans",
  fieldwork: "fieldwork_packages",
  "risk-assessment": "risk_assessments",
  materiality: "materiality_packages",
  review: "review_packages",
  completion: "completion_packages",
  reporting: "reporting_packages",
  opinion: "opinion_packages",
  "financial-statements": "financial_statement_packages",
  "trial-balance": "trial_balance_packages",
  "fs-mapping": "financial_statement_mapping_sets",
  "fs-rendering": "financial_statement_presentations",
  "ifrs-notes": "ifrs_note_packages",
  uaie: "uaie_import_sessions",
  organization: "organizations",
  workspace: "workspaces",
  company: "companies",
};

function uniqueSorted(values: Iterable<string>): string[] {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

function extractTablesFromSupabaseTypes(cwd: string): string[] {
  const path = join(cwd, "src", "types", "supabase.ts");
  const source = readFileSync(path, "utf8");
  const tables: string[] = [];
  const tablesBlock = source.match(/Tables:\s*\{([\s\S]*?)\n\s{4}Views:/);
  if (!tablesBlock?.[1]) return tables;
  for (const match of tablesBlock[1].matchAll(/^\s{6}([a-zA-Z0-9_]+):\s*\{/gm)) {
    tables.push(match[1]!.toLowerCase());
  }
  return uniqueSorted(tables);
}

function extractTablesFromRepositories(cwd: string): string[] {
  const dir = join(cwd, "src", "repositories");
  const tables: string[] = [];

  function walk(current: string) {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const absolute = join(current, entry.name);
      if (entry.isDirectory()) {
        walk(absolute);
        continue;
      }
      if (!entry.name.endsWith(".ts")) continue;
      const source = readFileSync(absolute, "utf8");
      for (const match of source.matchAll(/\.from\(\s*["']([a-zA-Z0-9_]+)["']\s*\)/g)) {
        tables.push(match[1]!.toLowerCase());
      }
    }
  }

  walk(dir);
  return uniqueSorted(tables);
}

function extractTablesFromMigrations(cwd: string): string[] {
  const migrations = loadMigrations(cwd);
  return uniqueSorted(migrations.flatMap((migration) => migration.creates.tables));
}

function extractCapabilityAnchorTables(): string[] {
  return uniqueSorted(Object.values(MODULE_ANCHOR_TABLES));
}

function extractPlatformRegistryModuleIds(cwd: string): string[] {
  const path = join(cwd, "src", "lib", "platform-registry", "catalog", "index.ts");
  const source = readFileSync(path, "utf8");
  const ids: string[] = [];
  for (const match of source.matchAll(/id:\s*["']([a-zA-Z0-9_-]+)["']/g)) {
    ids.push(match[1]!);
  }
  return uniqueSorted(ids);
}

/**
 * Detect drift across Database Schema → Supabase Types → Repositories → governance registries.
 */
export function auditSchemaDrift(cwd = process.cwd()): SchemaDriftReport {
  const findings: SchemaDriftFinding[] = [];
  const migrationTables = extractTablesFromMigrations(cwd);
  const supabaseTables = extractTablesFromSupabaseTypes(cwd);
  const repositoryTables = extractTablesFromRepositories(cwd);
  const capabilityTables = extractCapabilityAnchorTables();
  const platformModules = extractPlatformRegistryModuleIds(cwd);

  const migrationSet = new Set(migrationTables);
  const supabaseSet = new Set(supabaseTables);
  const repositorySet = new Set(repositoryTables);

  for (const table of repositoryTables) {
    if (!migrationSet.has(table)) {
      findings.push({
        layer: "repositories",
        code: "repository_table_not_in_migrations",
        severity: "error",
        message: `Repository references table "${table}" not created by migrations`,
        object: table,
      });
    }
    if (!supabaseSet.has(table)) {
      findings.push({
        layer: "supabase_types",
        code: "repository_table_missing_in_types",
        severity: "error",
        message: `Repository table "${table}" missing from src/types/supabase.ts`,
        object: table,
      });
    }
  }

  for (const table of migrationTables) {
    if (table === "users") continue;
    if (!supabaseSet.has(table)) {
      const severity = repositorySet.has(table) ? "error" : "warning";
      findings.push({
        layer: "supabase_types",
        code: "migration_table_missing_in_types",
        severity,
        message: `Migration creates "${table}" but supabase types omit it`,
        object: table,
      });
    }
  }

  for (const table of supabaseTables) {
    if (!migrationSet.has(table) && !["users"].includes(table)) {
      findings.push({
        layer: "database_schema",
        code: "types_table_not_in_migrations",
        severity: "warning",
        message: `supabase.ts declares "${table}" without migration CREATE TABLE`,
        object: table,
      });
    }
  }

  for (const table of capabilityTables) {
    if (!migrationSet.has(table)) {
      findings.push({
        layer: "capability_registry",
        code: "capability_table_not_in_schema",
        severity: "error",
        message: `Capability registry expects table "${table}" not present in migrations`,
        object: table,
      });
    }
    if (!repositorySet.has(table) && !table.endsWith("_history")) {
      findings.push({
        layer: "implementation",
        code: "capability_table_without_repository",
        severity: "warning",
        message: `Capability table "${table}" has no repository .from() reference yet`,
        object: table,
      });
    }
  }

  const ifrsNotesInPlatform = platformModules.includes("ifrs-notes");
  const ifrsNotesInMigrations = migrationSet.has("ifrs_note_packages");
  if (ifrsNotesInPlatform && !ifrsNotesInMigrations) {
    findings.push({
      layer: "platform_registry",
      code: "platform_module_without_schema",
      severity: "error",
      message: "Platform registry lists ifrs-notes without ifrs_note_packages migration",
      object: "ifrs-notes",
    });
  }

  const lifecycleChapterPresent = readFileSync(join(cwd, "docs", "PROJECT_BIBLE.md"), "utf8").includes(
    "Enterprise Database Lifecycle",
  );
  if (!lifecycleChapterPresent) {
    findings.push({
      layer: "project_bible",
      code: "missing_lifecycle_chapter",
      severity: "error",
      message: "PROJECT_BIBLE.md missing Enterprise Database Lifecycle chapter",
    });
  }

  const sqlFoundationMentioned = readFileSync(join(cwd, "docs", "PROJECT_BIBLE.md"), "utf8").includes(
    "Enterprise SQL Foundation",
  );
  if (!sqlFoundationMentioned && lifecycleChapterPresent) {
    findings.push({
      layer: "project_bible",
      code: "sql_foundation_not_documented",
      severity: "warning",
      message: "PROJECT_BIBLE should document enterprise_sql_foundation as root dependency",
    });
  }

  const errors = findings.filter((finding) => finding.severity === "error");
  return {
    ok: errors.length === 0,
    findings,
    tables: {
      migrations: migrationTables,
      supabaseTypes: supabaseTables,
      repositories: repositoryTables,
    },
  };
}
