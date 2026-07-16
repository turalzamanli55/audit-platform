import type {
  DatabaseBaselineReport,
  MigrationDependency,
  MigrationGovernanceReport,
  MigrationHealthReport,
  ParsedMigration,
} from "@/lib/database-governance/types";

export function formatDependencyReport(
  dependencies: MigrationDependency[],
): string {
  const lines = ["Migration Dependency Report", ""];
  for (const edge of dependencies) {
    lines.push(`${edge.migrationId}`);
    lines.push(`  ↓`);
    lines.push(`  ${edge.requiresMigrationId}`);
    lines.push(`  Reason: ${edge.reason}`);
    lines.push("");
  }
  return lines.join("\n");
}

export function formatHealthReport(health: MigrationHealthReport): string {
  return [
    "Migration Health Report",
    "",
    `Migration Health Score: ${health.healthScore}`,
    `Migration Risk: ${health.migrationRisk}`,
    `Dependency Risk: ${health.dependencyRisk}`,
    `Compatibility Risk: ${health.compatibilityRisk}`,
    `Schema Drift: ${health.schemaDrift}`,
    `Missing Coverage: ${health.missingCoverage}`,
    "",
    `Migrations: ${health.totals.migrations}`,
    `Errors: ${health.totals.errors}`,
    `Warnings: ${health.totals.warnings}`,
    `Dependencies: ${health.totals.dependencies}`,
    "",
    "Findings:",
    ...health.findings.map(
      (finding) =>
        `- [${finding.severity}] ${finding.code} @ ${finding.migrationId}: ${finding.message}`,
    ),
  ].join("\n");
}

export function formatBaselineReport(baseline: DatabaseBaselineReport): string {
  const lines = [
    "Database Baseline Report",
    "",
    `Coverage: ${baseline.coveragePct}%`,
    "",
  ];
  for (const layer of baseline.layers) {
    lines.push(
      `${layer.layer}: ${layer.present ? "PRESENT" : "INCOMPLETE"}`,
    );
    lines.push(`  migrations: ${layer.migrations.join(", ") || "(none)"}`);
    lines.push(`  tables: ${layer.tables.join(", ") || "(none)"}`);
    if (layer.gaps.length > 0) {
      lines.push(`  gaps: ${layer.gaps.join(", ")}`);
    }
    lines.push("");
  }
  return lines.join("\n");
}

export function formatGovernanceSummary(report: MigrationGovernanceReport): string {
  return [
    `Generated: ${report.generatedAt}`,
    `Migrations: ${report.migrations.length}`,
    `Accepted: ${report.accepted}`,
    `Dry-run OK: ${report.dryRun.ok}`,
    `Health Score: ${report.health.healthScore}`,
    `Baseline Coverage: ${report.baseline.coveragePct}%`,
  ].join("\n");
}

export function buildMigrationIndex(migrations: ParsedMigration[]): string {
  return migrations
    .map(
      (migration, index) =>
        `${index + 1}. ${migration.filename} [${migration.layer}] (${migration.bytes} bytes)`,
    )
    .join("\n");
}
