/**
 * Database Migration Governance — shared types.
 */

export type MigrationLayer =
  | "foundation"
  | "rbac"
  | "organizations"
  | "workspaces"
  | "companies"
  | "engagements"
  | "accounting"
  | "audit"
  | "ai"
  | "financial_reporting"
  | "import_engine"
  | "compatibility"
  | "other";

export type FindingSeverity = "error" | "warning" | "info";

export type MigrationFinding = {
  code: string;
  severity: FindingSeverity;
  migrationId: string;
  message: string;
  details?: Record<string, unknown>;
};

export type ParsedMigration = {
  id: string;
  filename: string;
  absolutePath: string;
  timestamp: string;
  name: string;
  bytes: number;
  hash: string;
  sql: string;
  layer: MigrationLayer;
  creates: {
    extensions: string[];
    enums: string[];
    tables: string[];
    functions: string[];
    views: string[];
    triggers: string[];
    indexes: string[];
    policies: string[];
    types: string[];
  };
  alters: {
    tables: string[];
    addColumns: Array<{ table: string; column: string }>;
  };
  foreignKeys: Array<{ table: string; column: string; references: string }>;
  grants: string[];
  permissionInserts: Array<{ columns: string[] }>;
  enablesRls: string[];
  storageBuckets: string[];
  requiredTables: string[];
  requiredFunctions: string[];
  requiredEnums: string[];
};

export type MigrationDependency = {
  migrationId: string;
  requiresMigrationId: string;
  reason: string;
};

export type SchemaObjectKind =
  | "extension"
  | "enum"
  | "table"
  | "column"
  | "function"
  | "view"
  | "index"
  | "policy"
  | "trigger"
  | "grant"
  | "storage_bucket";

export type InMemorySchema = {
  extensions: Set<string>;
  enums: Set<string>;
  tables: Map<string, Set<string>>;
  functions: Set<string>;
  views: Set<string>;
  indexes: Set<string>;
  policies: Set<string>;
  triggers: Set<string>;
  grants: Set<string>;
  storageBuckets: Set<string>;
};

export type DryRunStepResult = {
  migrationId: string;
  ok: boolean;
  errors: MigrationFinding[];
  warnings: MigrationFinding[];
};

export type DryRunResult = {
  ok: boolean;
  steps: DryRunStepResult[];
  schema: {
    extensionCount: number;
    enumCount: number;
    tableCount: number;
    functionCount: number;
    viewCount: number;
    indexCount: number;
    policyCount: number;
    triggerCount: number;
    grantCount: number;
    storageBucketCount: number;
  };
};

export type MigrationHealthReport = {
  healthScore: number;
  migrationRisk: number;
  dependencyRisk: number;
  compatibilityRisk: number;
  schemaDrift: number;
  missingCoverage: number;
  totals: {
    migrations: number;
    errors: number;
    warnings: number;
    dependencies: number;
  };
  findings: MigrationFinding[];
};

export type LayerBaseline = {
  layer: MigrationLayer;
  present: boolean;
  migrations: string[];
  tables: string[];
  gaps: string[];
};

export type DatabaseBaselineReport = {
  layers: LayerBaseline[];
  coveragePct: number;
};

export type MigrationGovernanceReport = {
  generatedAt: string;
  migrations: ParsedMigration[];
  dependencies: MigrationDependency[];
  orderingIssues: MigrationFinding[];
  dryRun: DryRunResult;
  health: MigrationHealthReport;
  baseline: DatabaseBaselineReport;
  accepted: boolean;
};
