/**
 * Normalized SQL operations consumed by governance rules.
 * Rules must never inspect raw migration SQL — only these operations.
 */

export type NormalizedOperationKind =
  | "EnableRLS"
  | "DisableRLS"
  | "Grant"
  | "Revoke"
  | "CreatePolicy"
  | "DropPolicy"
  | "CreateIndex"
  | "DropIndex"
  | "CreateTrigger"
  | "DropTrigger"
  | "CreateTable"
  | "CreateFunction"
  | "CreateView"
  | "CreateEnum"
  | "CreateExtension"
  | "CreateSequence"
  | "AddColumn"
  | "DropColumn"
  | "DropTable"
  | "AddConstraint"
  | "InsertPermissions"
  | "ReferenceStorageBucket"
  | "GeneratedColumn"
  | "ColumnDefault"
  | "OnConflict"
  | "ForeignKey";

export type OperationSourceMode = "static" | "dynamic";

export type OperationSource = {
  mode: OperationSourceMode;
  /** Human-readable origin inside the migration (e.g. "foreach:t=organizations"). */
  location: string;
  /** Original format/template string when resolved from dynamic SQL. */
  template?: string;
};

export type NormalizedOperation = {
  kind: NormalizedOperationKind;
  objectType: string;
  schema: string;
  table?: string;
  name?: string;
  operation: NormalizedOperationKind;
  metadata: Record<string, unknown>;
  migrationId: string;
  source: OperationSource;
};

export type ExtractedStatement = {
  sql: string;
  source: OperationSource;
};

export type ResolvedSqlUnit = {
  /** Concrete SQL after dynamic expansion (or original static text). */
  sql: string;
  source: OperationSource;
};

export type MigrationParseResult = {
  operations: NormalizedOperation[];
  /** Static SQL view with dynamic EXECUTE templates removed (avoids false captures). */
  staticView: string;
  /** Fully expanded SQL units (static + resolved dynamic). */
  units: ResolvedSqlUnit[];
};
