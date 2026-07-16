import type { SqlFoundationReport } from "@/lib/sql-foundation/types";

export function formatSqlFoundationReport(report: SqlFoundationReport): string {
  return [
    "SQL Foundation Report",
    "",
    `Foundation migration: ${report.foundationMigrationId ?? "(missing)"}`,
    `Helpers: ${report.helpers.length}`,
    `Extensions: ${report.extensions.join(", ")}`,
    `Enums: ${report.enums.join(", ")}`,
    `Coverage: ${report.coverage.coveragePct}%`,
    `Missing helpers: ${report.coverage.missingHelpers.join(", ") || "(none)"}`,
    `Missing objects: ${report.missingObjects.length}`,
    `Dependencies: ${report.dependencies.length}`,
    `Dry-run OK: ${report.dryRunOk}`,
    `Health score: ${report.healthScore}`,
  ].join("\n");
}

export function formatMissingObjectReport(report: SqlFoundationReport): string {
  const lines = ["Missing Object Report", ""];
  if (report.missingObjects.length === 0) {
    lines.push("None");
    return lines.join("\n");
  }
  for (const missing of report.missingObjects) {
    lines.push(`${missing.object.kind}:${missing.object.schema}.${missing.object.name}`);
    lines.push(`  ↓ referenced by ${missing.referencedByMigrationId}`);
    lines.push(`  Reason: ${missing.reason}`);
    lines.push("");
  }
  return lines.join("\n");
}

export function formatSqlDependencyReport(report: SqlFoundationReport): string {
  const lines = ["Dependency Report", ""];
  for (const edge of report.dependencies.slice(0, 200)) {
    lines.push(`${edge.object.schema}.${edge.object.name}`);
    lines.push(`  ↓`);
    lines.push(`  required by migration ${edge.migrationId}`);
    lines.push(`  Reason: ${edge.reason}`);
    lines.push("");
  }
  if (report.dependencies.length > 200) {
    lines.push(`… ${report.dependencies.length - 200} more edges`);
  }
  return lines.join("\n");
}
