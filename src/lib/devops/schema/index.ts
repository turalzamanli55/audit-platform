import { auditSchemaDrift } from "@/lib/database-governance/schema-drift";
import type { SchemaDriftReport } from "@/lib/database-governance/types";

/**
 * Schema adapter — reuses Schema Drift Policy. Does not reimplement.
 */
export function runSchemaValidation(cwd = process.cwd()): SchemaDriftReport {
  return auditSchemaDrift(cwd);
}

export function formatSchemaArtifact(cwd = process.cwd()): string {
  const report = runSchemaValidation(cwd);
  const lines = [
    "Schema Validation Report",
    "",
    `OK: ${report.ok}`,
    `Migration tables: ${report.tables.migrations.length}`,
    `Supabase type tables: ${report.tables.supabaseTypes.length}`,
    `Repository tables: ${report.tables.repositories.length}`,
    "",
    "Findings:",
    ...report.findings.map(
      (f) => `- [${f.severity}] ${f.layer}/${f.code}: ${f.message}`,
    ),
  ];
  return lines.join("\n");
}
