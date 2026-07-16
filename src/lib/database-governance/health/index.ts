import { average, clampPct } from "@/lib/database-governance/utils";
import type {
  DatabaseBaselineReport,
  DryRunResult,
  LayerBaseline,
  MigrationDependency,
  MigrationFinding,
  MigrationHealthReport,
  MigrationLayer,
  ParsedMigration,
} from "@/lib/database-governance/types";

export function calculateMigrationHealth(input: {
  migrations: ParsedMigration[];
  dependencies: MigrationDependency[];
  findings: MigrationFinding[];
  dryRun: DryRunResult;
}): MigrationHealthReport {
  const errors = input.findings.filter((finding) => finding.severity === "error");
  const warnings = input.findings.filter((finding) => finding.severity === "warning");
  const dryRunErrors = input.dryRun.steps.flatMap((step) => step.errors);

  const migrationRisk = clampPct(
    (errors.length + dryRunErrors.length) * 12 + warnings.length * 3,
  );
  const dependencyRisk = clampPct(
    input.findings.filter((finding) => finding.code.includes("dependency")).length * 20,
  );
  const compatibilityRisk = clampPct(
    input.findings.filter((finding) =>
      ["module_column_too_late", "missing_module_column_provider", "missing_column"].includes(
        finding.code,
      ),
    ).length * 25,
  );
  const failedSteps = input.dryRun.steps.filter((step) => !step.ok).length;
  const schemaDrift = clampPct((failedSteps / Math.max(1, input.migrations.length)) * 100);

  const expectedArtifacts = [
    "CREATE TABLE",
    "ENABLE ROW LEVEL SECURITY",
    "CREATE POLICY",
    "GRANT ",
    "INSERT INTO public.permissions",
  ];
  let missingCoverageHits = 0;
  let coverageChecks = 0;
  for (const migration of input.migrations) {
    if (!migration.filename.includes("_foundation.sql")) continue;
    if (migration.layer === "compatibility" || migration.bytes === 0) continue;
    coverageChecks += 1;
    const hasTable = /CREATE\s+TABLE/i.test(migration.sql);
    const hasRls = /ENABLE\s+ROW\s+LEVEL\s+SECURITY/i.test(migration.sql);
    const hasPolicy = /CREATE\s+POLICY/i.test(migration.sql);
    const hasGrant = /GRANT\s+/i.test(migration.sql);
    const hasPerms = /INSERT\s+INTO\s+(?:public\.)?permissions/i.test(migration.sql);
    const score =
      Number(hasTable) + Number(hasRls) + Number(hasPolicy) + Number(hasGrant) + Number(hasPerms);
    if (score < 3) missingCoverageHits += 1;
    void expectedArtifacts;
  }
  const missingCoverage = clampPct(
    (missingCoverageHits / Math.max(1, coverageChecks)) * 100,
  );

  const healthScore = clampPct(
    100 -
      average([
        migrationRisk,
        dependencyRisk,
        compatibilityRisk,
        schemaDrift,
        missingCoverage,
      ]),
  );

  return {
    healthScore,
    migrationRisk,
    dependencyRisk,
    compatibilityRisk,
    schemaDrift,
    missingCoverage,
    totals: {
      migrations: input.migrations.length,
      errors: errors.length + dryRunErrors.length,
      warnings: warnings.length,
      dependencies: input.dependencies.length,
    },
    findings: [...input.findings, ...dryRunErrors],
  };
}

const LAYER_EXPECTATIONS: Array<{
  layer: MigrationLayer;
  requiredTables: string[];
  filenameHints: string[];
}> = [
  {
    layer: "foundation",
    requiredTables: ["organizations", "workspaces", "companies", "permissions", "roles"],
    filenameHints: ["extensions_and_common", "foundation_tables", "rls_policies"],
  },
  {
    layer: "rbac",
    requiredTables: ["role_permissions", "memberships"],
    filenameHints: ["role_permissions", "foundation_tables"],
  },
  {
    layer: "organizations",
    requiredTables: ["organizations", "organization_settings"],
    filenameHints: ["foundation_tables"],
  },
  {
    layer: "workspaces",
    requiredTables: ["workspaces", "workspace_settings"],
    filenameHints: ["foundation_tables"],
  },
  {
    layer: "companies",
    requiredTables: ["companies"],
    filenameHints: ["foundation_tables", "company_foundation"],
  },
  {
    layer: "engagements",
    requiredTables: ["engagements"],
    filenameHints: ["engagement_foundation"],
  },
  {
    layer: "accounting",
    requiredTables: ["trial_balance_packages"],
    filenameHints: ["trial_balance_foundation"],
  },
  {
    layer: "audit",
    requiredTables: ["audit_plans", "fieldwork_packages", "review_packages", "completion_packages"],
    filenameHints: ["planning_foundation", "fieldwork_foundation", "review_foundation", "completion_foundation"],
  },
  {
    layer: "ai",
    requiredTables: [],
    filenameHints: ["uaie_intelligence"],
  },
  {
    layer: "financial_reporting",
    requiredTables: [
      "reporting_packages",
      "financial_statement_packages",
      "financial_statement_mapping_sets",
      "ifrs_note_packages",
    ],
    filenameHints: [
      "reporting_foundation",
      "financial_statements_foundation",
      "fs_mapping_foundation",
      "ifrs_notes_foundation",
    ],
  },
  {
    layer: "import_engine",
    requiredTables: ["uaie_import_sessions"],
    filenameHints: ["uaie_foundation"],
  },
];

export function buildDatabaseBaseline(
  migrations: ParsedMigration[],
): DatabaseBaselineReport {
  const createdTables = new Set(
    migrations.flatMap((migration) => migration.creates.tables),
  );
  const layers: LayerBaseline[] = LAYER_EXPECTATIONS.map((expectation) => {
    const matched = migrations.filter((migration) =>
      expectation.filenameHints.some((hint) => migration.filename.includes(hint)),
    );
    const gaps = expectation.requiredTables.filter((table) => !createdTables.has(table));
    return {
      layer: expectation.layer,
      present: matched.length > 0 && gaps.length === 0,
      migrations: matched.map((migration) => migration.id),
      tables: expectation.requiredTables.filter((table) => createdTables.has(table)),
      gaps,
    };
  });

  const coveragePct = clampPct(
    (layers.filter((layer) => layer.present).length / Math.max(1, layers.length)) * 100,
  );

  return { layers, coveragePct };
}
