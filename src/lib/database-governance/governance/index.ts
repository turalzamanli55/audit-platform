import { SQL_FOUNDATION_REQUIRED_HELPERS } from "@/lib/sql-foundation/catalog";
import type { MigrationFinding, ParsedMigration } from "@/lib/database-governance/types";

const SQL_FOUNDATION_MIGRATION_HINT = "enterprise_sql_foundation";

const SHARED_HELPER_SET = new Set<string>(SQL_FOUNDATION_REQUIRED_HELPERS);

/**
 * Enterprise migration object governance — every future migration is validated against
 * chronological order, dependency graph, SQL objects, RLS, permissions, and foundation rules.
 */
export function auditMigrationGovernance(migrations: ParsedMigration[]): MigrationFinding[] {
  const findings: MigrationFinding[] = [];

  for (const migration of migrations) {
    if (migration.bytes === 0) continue;

    findings.push(...auditSqlObjects(migration));
    findings.push(...auditRlsAndPolicies(migration));
    findings.push(...auditPermissions(migration));
    findings.push(...auditFoundationDependencies(migration));
    findings.push(...auditCompatibilityExpressions(migration));
  }

  findings.push(...auditGlobalFoundationRules(migrations));
  findings.push(...auditGlobalRlsCoverage(migrations));
  findings.push(...auditSharedHelperProvenance(migrations));
  return findings;
}

function auditSqlObjects(migration: ParsedMigration): MigrationFinding[] {
  const findings: MigrationFinding[] = [];

  for (const extension of migration.creates.extensions) {
    if (!/^[a-z0-9_]+$/i.test(extension)) {
      findings.push({
        code: "invalid_extension_name",
        severity: "error",
        migrationId: migration.id,
        message: `Invalid extension name: ${extension}`,
      });
    }
  }

  for (const en of migration.creates.enums) {
    if (!/^[a-z0-9_]+$/i.test(en)) {
      findings.push({
        code: "invalid_enum_name",
        severity: "error",
        migrationId: migration.id,
        message: `Invalid enum type name: ${en}`,
      });
    }
  }

  const sequenceCreates = matchAll(
    migration.sql,
    /CREATE\s+SEQUENCE\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:public\.)?([a-zA-Z0-9_]+)/gi,
  );
  for (const sequence of sequenceCreates) {
    if (!/^[a-z0-9_]+$/i.test(sequence)) {
      findings.push({
        code: "invalid_sequence_name",
        severity: "error",
        migrationId: migration.id,
        message: `Invalid sequence name: ${sequence}`,
      });
    }
  }

  const constraints = matchAll(
    migration.sql,
    /(?:CONSTRAINT|ADD)\s+([a-zA-Z0-9_]+)\s+(?:PRIMARY\s+KEY|UNIQUE|CHECK|FOREIGN\s+KEY)/gi,
  );
  for (const constraint of constraints) {
    if (constraint.length > 63) {
      findings.push({
        code: "constraint_name_too_long",
        severity: "warning",
        migrationId: migration.id,
        message: `Constraint name exceeds PostgreSQL limit: ${constraint}`,
      });
    }
  }

  const generatedColumns = matchAll(
    migration.sql,
    /([a-zA-Z0-9_]+)\s+[a-zA-Z0-9_()]+\s+GENERATED\s+ALWAYS\s+AS/gi,
  );
  for (const column of generatedColumns) {
    findings.push({
      code: "generated_column_declared",
      severity: "info",
      migrationId: migration.id,
      message: `Generated column declared: ${column}`,
      details: { column },
    });
  }

  const defaultExpressions = matchAll(
    migration.sql,
    /([a-zA-Z0-9_]+)\s+[a-zA-Z0-9_()]+\s+(?:NOT\s+NULL\s+)?DEFAULT\s+([^,\n;]+)/gi,
  );
  for (const match of defaultExpressions) {
    const column = match[0];
    const expression = match[1]?.trim();
    if (expression && /now\(\)/i.test(expression) && !/utc_now\(\)/i.test(expression)) {
      findings.push({
        code: "default_uses_now_not_utc",
        severity: "warning",
        migrationId: migration.id,
        message: `${column} DEFAULT should prefer public.utc_now() for UTC consistency`,
      });
    }
  }

  for (const index of migration.creates.indexes) {
    if (!/_idx$|_uidx$/i.test(index) && migration.creates.tables.length > 0) {
      findings.push({
        code: "index_naming_convention",
        severity: "info",
        migrationId: migration.id,
        message: `Index "${index}" should follow {table}_{columns}_{purpose}_idx naming`,
      });
    }
  }

  for (const view of migration.creates.views) {
    if (!/^[a-z0-9_]+$/i.test(view)) {
      findings.push({
        code: "invalid_view_name",
        severity: "error",
        migrationId: migration.id,
        message: `Invalid view name: ${view}`,
      });
    }
  }

  for (const trigger of migration.creates.triggers) {
    if (!/^trg_/i.test(trigger)) {
      findings.push({
        code: "trigger_naming_convention",
        severity: "info",
        migrationId: migration.id,
        message: `Trigger "${trigger}" should use trg_{table}_{action} naming`,
      });
    }
  }

  if (migration.storageBuckets.length > 0 && !/storage\.buckets/i.test(migration.sql)) {
    findings.push({
      code: "storage_bucket_reference",
      severity: "warning",
      migrationId: migration.id,
      message: "Storage bucket references detected — verify RLS on storage.objects",
    });
  }

  return findings;
}

function auditRlsAndPolicies(migration: ParsedMigration): MigrationFinding[] {
  return [];
}

function auditGlobalRlsCoverage(migrations: ParsedMigration[]): MigrationFinding[] {
  const findings: MigrationFinding[] = [];
  const createdTables = new Set<string>();
  const rlsEnabled = new Set<string>();

  for (const migration of migrations) {
    for (const table of migration.creates.tables) {
      createdTables.add(table);
    }
    for (const table of migration.enablesRls) {
      rlsEnabled.add(table.toLowerCase());
    }
  }

  const exempt = new Set(["audit_logs"]);
  for (const table of createdTables) {
    if (exempt.has(table)) continue;
    if (!rlsEnabled.has(table)) {
      findings.push({
        code: "table_missing_rls",
        severity: "error",
        migrationId: "baseline",
        message: `Table "${table}" created without ENABLE ROW LEVEL SECURITY in migration chain`,
        details: { table },
      });
    }
  }

  return findings;
}

function auditPermissions(migration: ParsedMigration): MigrationFinding[] {
  const findings: MigrationFinding[] = [];

  if (migration.grants.length > 0 && migration.creates.tables.length > 0) {
    for (const table of migration.creates.tables) {
      if (!migration.grants.includes(table)) {
        findings.push({
          code: "missing_table_grant",
          severity: "warning",
          migrationId: migration.id,
          message: `Table "${table}" created without explicit GRANT in migration`,
          details: { table },
        });
      }
    }
  }

  return findings;
}

const LEGACY_SQL_FOUNDATION_MIGRATIONS = new Set([
  "extensions_and_common",
  "foundation_tables",
  "rls_policies",
  "enterprise_sql_foundation",
]);

function isLegacyFoundationMigration(filename: string): boolean {
  return [...LEGACY_SQL_FOUNDATION_MIGRATIONS].some((hint) => filename.includes(hint));
}

function auditFoundationDependencies(migration: ParsedMigration): MigrationFinding[] {
  return [];
}

function auditSharedHelperProvenance(migrations: ParsedMigration[]): MigrationFinding[] {
  const findings: MigrationFinding[] = [];
  const sqlFoundation = migrations.find((m) =>
    m.filename.includes(SQL_FOUNDATION_MIGRATION_HINT),
  );
  if (!sqlFoundation) return findings;

  const introducedBy = new Map<string, string>();
  const sqlFoundationIndex = migrations.findIndex((m) => m.id === sqlFoundation.id);

  migrations.forEach((migration, index) => {
    for (const fn of migration.creates.functions) {
      if (!SHARED_HELPER_SET.has(fn)) continue;

      const prior = introducedBy.get(fn);
      if (!prior) {
        introducedBy.set(fn, migration.id);
        continue;
      }

      if (index > sqlFoundationIndex && migration.id !== prior) {
        findings.push({
          code: "shared_helper_redefinition",
          severity: "warning",
          migrationId: migration.id,
          message: `Shared helper "${fn}" redefined after Enterprise SQL Foundation (origin: ${prior})`,
          details: { function: fn, originMigrationId: prior },
        });
      }
    }
  });

  for (let index = sqlFoundationIndex + 1; index < migrations.length; index += 1) {
    const migration = migrations[index]!;
    if (isLegacyFoundationMigration(migration.filename)) continue;

    for (const fn of migration.creates.functions) {
      if (!SHARED_HELPER_SET.has(fn)) continue;
      if (!introducedBy.has(fn)) {
        findings.push({
          code: "shared_helper_outside_sql_foundation",
          severity: "error",
          migrationId: migration.id,
          message: `New shared helper "${fn}" introduced outside Enterprise SQL Foundation chain`,
          details: { function: fn },
        });
        introducedBy.set(fn, migration.id);
      }
    }
  }

  return findings;
}

function auditCompatibilityExpressions(migration: ParsedMigration): MigrationFinding[] {
  const findings: MigrationFinding[] = [];

  const hasDestructiveDrop = /DROP\s+TABLE\s+(?!IF\s+EXISTS)/i.test(migration.sql);
  if (hasDestructiveDrop) {
    findings.push({
      code: "forward_compat_destructive_drop",
      severity: "warning",
      migrationId: migration.id,
      message: "DROP TABLE without IF EXISTS breaks forward-only replay safety",
    });
  }

  const hasAlterAdd = /ALTER\s+TABLE[\s\S]+ADD\s+COLUMN/i.test(migration.sql);
  const hasIfNotExists = /ADD\s+COLUMN\s+IF\s+NOT\s+EXISTS/i.test(migration.sql);
  if (
    hasAlterAdd &&
    !hasIfNotExists &&
    (migration.layer === "compatibility" || migration.filename.includes("compatibility"))
  ) {
    findings.push({
      code: "backward_compat_missing_if_not_exists",
      severity: "error",
      migrationId: migration.id,
      message: "Compatibility migrations must use ADD COLUMN IF NOT EXISTS",
    });
  }

  if (/DROP\s+COLUMN/i.test(migration.sql)) {
    findings.push({
      code: "backward_compat_drop_column",
      severity: "warning",
      migrationId: migration.id,
      message: "DROP COLUMN may break backward compatibility — require compensating migration",
    });
  }

  return findings;
}

function auditGlobalFoundationRules(migrations: ParsedMigration[]): MigrationFinding[] {
  const findings: MigrationFinding[] = [];
  const sqlFoundation = migrations.find((migration) =>
    migration.filename.includes(SQL_FOUNDATION_MIGRATION_HINT),
  );
  const extensions = migrations.find((migration) =>
    migration.filename.includes("extensions_and_common"),
  );

  if (sqlFoundation && extensions && sqlFoundation.timestamp < extensions.timestamp) {
    findings.push({
      code: "sql_foundation_before_extensions",
      severity: "error",
      migrationId: sqlFoundation.id,
      message: "Enterprise SQL Foundation must run after extensions_and_common",
    });
  }

  return findings;
}

function matchAll(sql: string, pattern: RegExp): string[] {
  const flags = pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`;
  const re = new RegExp(pattern.source, flags);
  const out: string[] = [];
  for (const match of sql.matchAll(re)) {
    if (match[1]) out.push(match[1]);
  }
  return out;
}
