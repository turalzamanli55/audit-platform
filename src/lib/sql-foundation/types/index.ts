/**
 * Enterprise SQL Foundation Engine (ESFE) — types
 */

export type SqlObjectKind =
  | "extension"
  | "enum"
  | "function"
  | "view"
  | "trigger"
  | "policy"
  | "operator"
  | "domain"
  | "sequence"
  | "index"
  | "constraint";

export type SqlObjectRef = {
  kind: SqlObjectKind;
  name: string;
  schema: string;
};

export type SqlObjectDependency = {
  object: SqlObjectRef;
  requiredObject: SqlObjectRef;
  migrationId: string;
  reason: string;
};

export type MissingSqlObject = {
  object: SqlObjectRef;
  referencedByMigrationId: string;
  reason: string;
};

export type SqlFoundationCoverage = {
  requiredHelpers: string[];
  presentHelpers: string[];
  missingHelpers: string[];
  coveragePct: number;
};

export type SqlFoundationReport = {
  generatedAt: string;
  foundationMigrationId: string | null;
  helpers: string[];
  extensions: string[];
  enums: string[];
  coverage: SqlFoundationCoverage;
  missingObjects: MissingSqlObject[];
  dependencies: SqlObjectDependency[];
  circular: string[];
  dryRunOk: boolean;
  healthScore: number;
};
