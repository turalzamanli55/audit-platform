import type {
  DryRunResult,
  DryRunStepResult,
  InMemorySchema,
  MigrationFinding,
  ParsedMigration,
} from "@/lib/database-governance/types";

function emptySchema(): InMemorySchema {
  return {
    extensions: new Set(),
    enums: new Set(),
    tables: new Map(),
    functions: new Set(),
    views: new Set(),
    indexes: new Set(),
    policies: new Set(),
    triggers: new Set(),
    grants: new Set(),
    storageBuckets: new Set(),
  };
}

function ensureTable(schema: InMemorySchema, table: string) {
  if (!schema.tables.has(table)) {
    schema.tables.set(table, new Set());
  }
}

/**
 * In-memory dry-run: apply migration effects in order and verify prerequisites.
 * Auth/storage external schemas are treated as available platform primitives.
 */
export function dryRunMigrations(migrations: ParsedMigration[]): DryRunResult {
  const schema = emptySchema();
  // Platform primitives available in Supabase
  schema.tables.set("users", new Set(["id"])); // auth.users alias awareness
  schema.storageBuckets.add("placeholder");

  const steps: DryRunStepResult[] = [];
  let ok = true;

  for (const migration of migrations) {
    const errors: MigrationFinding[] = [];
    const warnings: MigrationFinding[] = [];

    if (migration.bytes === 0) {
      warnings.push({
        code: "empty_migration",
        severity: "warning",
        migrationId: migration.id,
        message: "Empty migration skipped (no-op)",
      });
      steps.push({ migrationId: migration.id, ok: true, errors, warnings });
      continue;
    }

    // Validate required tables already exist (except ones this migration creates)
    const createdHere = new Set(migration.creates.tables);
    for (const table of migration.requiredTables) {
      if (
        table === "auth" ||
        table === "storage" ||
        table === "users" ||
        table === "buckets" ||
        table === "objects" ||
        table === "column"
      ) {
        continue;
      }
      // Skip noisy false positives from SQL keyword scraping
      if (
        [
          "authenticated",
          "service_role",
          "anon",
          "public",
          "true",
          "false",
          "null",
          "active",
          "workspace",
          "organization",
          "platform",
          "company",
        ].includes(table)
      ) {
        continue;
      }
      if (!schema.tables.has(table) && !createdHere.has(table)) {
        // Only error for clearly known domain tables / alter targets
        const isAlterTarget = migration.alters.tables.includes(table);
        const isFkTarget = migration.foreignKeys.some((fk) => fk.references === table);
        if (isAlterTarget || isFkTarget) {
          errors.push({
            code: "missing_table",
            severity: "error",
            migrationId: migration.id,
            message: `Required table "${table}" does not exist before this migration`,
          });
        }
      }
    }

    for (const insert of migration.permissionInserts) {
      const columns = schema.tables.get("permissions");
      if (!columns) {
        errors.push({
          code: "missing_permissions_table",
          severity: "error",
          migrationId: migration.id,
          message: "permissions table missing for INSERT",
        });
        continue;
      }
      for (const column of insert.columns) {
        if (!columns.has(column)) {
          errors.push({
            code: "missing_column",
            severity: "error",
            migrationId: migration.id,
            message: `permissions.${column} missing for INSERT`,
          });
        }
      }
    }

    for (const fn of migration.requiredFunctions) {
      if (migration.creates.tables.includes(fn)) continue;
      if (!schema.functions.has(fn) && !migration.creates.functions.includes(fn)) {
        // Skip known relations already registered as tables
        if (schema.tables.has(fn)) continue;
        errors.push({
          code: "missing_sql_function",
          severity: "error",
          migrationId: migration.id,
          message: `Referenced function public.${fn}() does not exist before this migration`,
        });
      }
    }

    // Apply creates
    for (const extension of migration.creates.extensions) {
      schema.extensions.add(extension);
    }
    for (const en of migration.creates.enums) {
      schema.enums.add(en);
    }
    for (const table of migration.creates.tables) {
      ensureTable(schema, table);
      // Seed common enterprise columns for later ALTER awareness
      const cols = schema.tables.get(table)!;
      for (const column of [
        "id",
        "organization_id",
        "workspace_id",
        "company_id",
        "engagement_id",
        "created_at",
        "updated_at",
        "status",
        "version",
        "deleted_at",
      ]) {
        cols.add(column);
      }
    }
    for (const fn of migration.creates.functions) {
      schema.functions.add(fn);
    }
    for (const view of migration.creates.views) {
      schema.views.add(view);
    }
    for (const index of migration.creates.indexes) {
      schema.indexes.add(index);
    }
    for (const policy of migration.creates.policies) {
      schema.policies.add(policy);
    }
    for (const trigger of migration.creates.triggers) {
      schema.triggers.add(trigger);
    }
    for (const grant of migration.grants) {
      schema.grants.add(grant);
    }
    for (const bucket of migration.storageBuckets) {
      schema.storageBuckets.add(bucket);
    }
    for (const column of migration.alters.addColumns) {
      ensureTable(schema, column.table);
      schema.tables.get(column.table)!.add(column.column);
    }

    // Parse CREATE TABLE column lists roughly for permissions etc.
    if (migration.creates.tables.includes("permissions")) {
      const cols = schema.tables.get("permissions")!;
      for (const column of [
        "id",
        "code",
        "name",
        "description",
        "scope",
        "resource",
        "status",
        "created_at",
        "updated_at",
        "version",
        "deleted_at",
      ]) {
        cols.add(column);
      }
    }
    if (migration.creates.tables.includes("roles")) {
      const cols = schema.tables.get("roles")!;
      for (const column of ["id", "slug", "name", "scope", "status", "organization_id"]) {
        cols.add(column);
      }
    }
    if (migration.creates.tables.includes("role_permissions")) {
      const cols = schema.tables.get("role_permissions")!;
      for (const column of ["id", "role_id", "permission_id", "status"]) {
        cols.add(column);
      }
    }

    if (errors.length > 0) ok = false;
    steps.push({
      migrationId: migration.id,
      ok: errors.length === 0,
      errors,
      warnings,
    });
  }

  return {
    ok,
    steps,
    schema: {
      extensionCount: schema.extensions.size,
      enumCount: schema.enums.size,
      tableCount: schema.tables.size,
      functionCount: schema.functions.size,
      viewCount: schema.views.size,
      indexCount: schema.indexes.size,
      policyCount: schema.policies.size,
      triggerCount: schema.triggers.size,
      grantCount: schema.grants.size,
      storageBucketCount: Math.max(0, schema.storageBuckets.size - 1),
    },
  };
}

export function validateFoundationLayers(migrations: ParsedMigration[]): MigrationFinding[] {
  const findings: MigrationFinding[] = [];
  const filenames = migrations.map((migration) => migration.filename).join("\n");
  const required = [
    { key: "extensions_and_common", label: "Foundation extensions" },
    { key: "foundation_tables", label: "Foundation tables (org/workspace/company/RBAC)" },
    { key: "rls_policies", label: "Foundation RLS" },
    { key: "enterprise_sql_foundation", label: "Enterprise SQL Foundation helpers" },
    { key: "company_foundation", label: "Companies" },
    { key: "engagement_foundation", label: "Engagements" },
    { key: "planning_foundation", label: "Audit planning" },
    { key: "uaie_foundation", label: "Import engine" },
    { key: "trial_balance_foundation", label: "Accounting / trial balance" },
    { key: "reporting_foundation", label: "Financial reporting" },
    { key: "uaie_intelligence", label: "AI intelligence" },
  ];
  for (const entry of required) {
    if (!filenames.includes(entry.key)) {
      findings.push({
        code: "missing_foundation_layer",
        severity: "error",
        migrationId: "baseline",
        message: `Missing required layer migration: ${entry.label} (${entry.key})`,
      });
    }
  }
  return findings;
}
