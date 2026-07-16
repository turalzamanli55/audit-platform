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
  dependencyHealth: number;
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

export type SchemaDriftLayer =
  | "database_schema"
  | "supabase_types"
  | "repositories"
  | "project_bible"
  | "capability_registry"
  | "platform_registry"
  | "implementation";

export type SchemaDriftFinding = {
  layer: SchemaDriftLayer;
  code: string;
  severity: FindingSeverity;
  message: string;
  object?: string;
  details?: Record<string, unknown>;
};

export type SchemaDriftReport = {
  ok: boolean;
  findings: SchemaDriftFinding[];
  tables: {
    migrations: string[];
    supabaseTypes: string[];
    repositories: string[];
  };
};

export type LifecycleStepId =
  | "fresh_database"
  | "migration_first"
  | "migration_last"
  | "supabase_types"
  | "build"
  | "tests"
  | "database_governance"
  | "project_bible_sync"
  | "capability_registry_sync"
  | "platform_readiness_sync"
  | "no_schema_drift"
  | "migration_health"
  | "dependency_health";

export type LifecycleStepResult = {
  id: LifecycleStepId;
  label: string;
  ok: boolean;
  message: string;
  details?: Record<string, unknown>;
};

export type DatabaseDefinitionOfDoneReport = {
  ok: boolean;
  steps: LifecycleStepResult[];
  migrationHealth: number;
  dependencyHealth: number;
};

export type ContinuousValidationId =
  | "migration_validation"
  | "schema_validation"
  | "governance_validation"
  | "capability_validation"
  | "project_bible_sync"
  | "localization_validation"
  | "type_validation"
  | "build_validation"
  | "test_validation"
  | "platform_readiness_validation";

export type ContinuousValidationStep = {
  id: ContinuousValidationId;
  label: string;
  ok: boolean;
  message: string;
  skipped?: boolean;
};

export type ContinuousValidationReport = {
  ok: boolean;
  generatedAt: string;
  steps: ContinuousValidationStep[];
  definitionOfDone: DatabaseDefinitionOfDoneReport;
  governance: MigrationGovernanceReport;
  schemaDrift: SchemaDriftReport;
};

export type ResetProcedureStepId =
  | "backup_verification"
  | "remote_reset"
  | "migration_replay"
  | "supabase_types_generation"
  | "seed_execution"
  | "validation"
  | "build"
  | "tests"
  | "platform_readiness"
  | "capability_registry"
  | "project_sync"
  | "migration_governance"
  | "sql_foundation"
  | "health_verification";

export type ResetProcedureStep = {
  id: ResetProcedureStepId;
  order: number;
  title: string;
  command?: string;
  description: string;
  automated: boolean;
};

export type DatabaseLifecycleReport = {
  generatedAt: string;
  policyVersion: string;
  definitionOfDone: DatabaseDefinitionOfDoneReport;
  continuousValidation: ContinuousValidationReport;
  resetProcedure: ResetProcedureStep[];
  acceptanceCriteria: {
    ok: boolean;
    freshToLastOk: boolean;
    noMissingObjects: boolean;
    noSchemaDrift: boolean;
    noOrderingIssues: boolean;
    migrationHealthGte95: boolean;
    dependencyHealthEq100: boolean;
  };
};
