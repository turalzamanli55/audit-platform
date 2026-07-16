import type { MigrationFinding, ParsedMigration } from "@/lib/database-governance/types";

/**
 * Detect compatibility assumptions that break clean rebuilds.
 */
export function auditCompatibility(migrations: ParsedMigration[]): MigrationFinding[] {
  const findings: MigrationFinding[] = [];
  const moduleProviderIndex = migrations.findIndex((migration) =>
    migration.alters.addColumns.some(
      (column) => column.table === "permissions" && column.column === "module",
    ),
  );

  migrations.forEach((migration, index) => {
    for (const insert of migration.permissionInserts) {
      if (insert.columns.includes("module")) {
        if (moduleProviderIndex < 0) {
          findings.push({
            code: "missing_module_column_provider",
            severity: "error",
            migrationId: migration.id,
            message:
              "Inserts permissions.module but no migration adds permissions.module",
          });
        } else if (moduleProviderIndex > index) {
          findings.push({
            code: "module_column_too_late",
            severity: "error",
            migrationId: migration.id,
            message:
              "Inserts permissions.module before compatibility migration that adds the column",
            details: {
              provider: migrations[moduleProviderIndex]?.id,
            },
          });
        }
      }

      const usesModuleStyle =
        insert.columns.includes("module") && !insert.columns.includes("scope");
      const usesClassicStyle =
        insert.columns.includes("scope") && insert.columns.includes("resource");
      if (!usesModuleStyle && !usesClassicStyle && insert.columns.length > 0) {
        findings.push({
          code: "permissions_insert_shape",
          severity: "warning",
          migrationId: migration.id,
          message: `Unrecognized permissions insert columns: ${insert.columns.join(", ")}`,
        });
      }
    }

    if (/ON CONFLICT\s*\(\s*code\s*\)/i.test(migration.sql)) {
      findings.push({
        code: "on_conflict_code_partial_index",
        severity: "warning",
        migrationId: migration.id,
        message:
          "ON CONFLICT (code) may not match partial unique index permissions_code_active_uidx",
      });
    }
  });

  return findings;
}
