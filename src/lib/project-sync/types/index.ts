/**
 * EPBSE — Enterprise Project Bible Synchronization Engine types.
 * Documentation is the only source of truth. Registries synchronize one-way from docs.
 */

export const GOVERNANCE_DOCUMENTS = [
  "PROJECT_BIBLE",
  "MASTER_PRD",
  "SYSTEM_ARCHITECTURE",
  "IMPLEMENTATION_STANDARD",
  "MASTER_IMPLEMENTATION_TEMPLATE",
  "DESIGN_SYSTEM",
] as const;

export type GovernanceDocumentId = (typeof GOVERNANCE_DOCUMENTS)[number];

export type DocumentAuthority =
  | "primary"
  | "functional"
  | "architectural"
  | "implementation"
  | "implementation_template"
  | "design";

export const PROJECT_SYNC_EVIDENCE_DIMENSIONS = [
  "database",
  "repository",
  "serverAction",
  "rules",
  "validation",
  "workspace",
  "ui",
  "permissions",
  "localization",
  "tests",
  "documentation",
  "integration",
  "security",
  "performance",
  "monitoring",
  "telemetry",
] as const;

export type ProjectSyncEvidenceDimension = (typeof PROJECT_SYNC_EVIDENCE_DIMENSIONS)[number];
export type ProjectSyncEvidence = Record<ProjectSyncEvidenceDimension, boolean>;

export type SyncEntityKind =
  | "domain"
  | "module"
  | "feature"
  | "capability"
  | "requirement";

export type SyncChangeKind =
  | "added"
  | "removed"
  | "modified"
  | "moved"
  | "renamed"
  | "deprecated"
  | "merged"
  | "split"
  | "unchanged";

export type ImmutableIdentity = {
  id: string;
  kind: SyncEntityKind;
  canonicalName: string;
  aliases: string[];
  createdAt: string;
  updatedAt: string;
  deprecated: boolean;
};

export type ExtractedDomain = {
  id: string;
  name: string;
  description: string;
  sourceDocument: GovernanceDocumentId;
  sourceSection: string;
};

export type ExtractedModule = {
  id: string;
  name: string;
  description: string;
  domainId: string;
  group: string;
  sourceDocument: GovernanceDocumentId;
  sourceSection: string;
  dependencies: string[];
};

export type ExtractedFeature = {
  id: string;
  name: string;
  description: string;
  moduleId: string;
  domainId: string;
  sourceDocument: GovernanceDocumentId;
  sourceSection: string;
  capabilityIds: string[];
};

export type ExtractedCapability = {
  id: string;
  name: string;
  description: string;
  moduleId: string;
  domainId: string;
  featureId: string;
  category: string;
  priority: "critical" | "high" | "medium" | "low";
  sourceDocument: GovernanceDocumentId;
  sourceSection: string;
  dependencies: string[];
  parent: string | null;
  children: string[];
};

export type ExtractedRequirement = {
  id: string;
  name: string;
  description: string;
  sourceDocument: GovernanceDocumentId;
  sourceSection: string;
  relatedCapabilityIds: string[];
};

export type CodebaseEvidenceIndex = {
  scannedAt: string;
  tables: string[];
  repositories: string[];
  serverActions: string[];
  components: string[];
  pages: string[];
  routes: string[];
  permissions: string[];
  tests: string[];
  migrations: string[];
  locales: string[];
  libModules: string[];
  todoMarkers: Array<{ file: string; marker: string; line: number }>;
  placeholderMarkers: Array<{ file: string; marker: string; line: number }>;
};

export type SynchronizedCapability = ExtractedCapability & {
  evidence: ProjectSyncEvidence;
  evidencePaths: Partial<Record<ProjectSyncEvidenceDimension, string[]>>;
  completionPct: number;
  healthScore: number;
  status:
    | "planned"
    | "foundation"
    | "partial"
    | "production"
    | "enterprise"
    | "completed"
    | "deprecated";
};

export type SyncDiffEntry = {
  kind: SyncEntityKind;
  id: string;
  name: string;
  change: SyncChangeKind;
  before?: Record<string, unknown> | null;
  after?: Record<string, unknown> | null;
};

export type SyncSnapshot = {
  id: string;
  timestamp: string;
  documentVersions: Record<GovernanceDocumentId, { path: string; hash: string; bytes: number }>;
  identities: ImmutableIdentity[];
  domains: ExtractedDomain[];
  modules: ExtractedModule[];
  features: ExtractedFeature[];
  capabilities: SynchronizedCapability[];
  requirements: ExtractedRequirement[];
  evidenceIndex: CodebaseEvidenceIndex;
  platformCompletionPct: number;
  architectureHealthPct: number;
  implementationHealthPct: number;
  documentationCoveragePct: number;
  testingCoveragePct: number;
  localizationCoveragePct: number;
  securityCoveragePct: number;
  performanceCoveragePct: number;
  integrationCoveragePct: number;
  technicalDebtScore: number;
};

export type SyncRunReport = {
  snapshotId: string;
  timestamp: string;
  incremental: boolean;
  previousSnapshotId: string | null;
  diff: SyncDiffEntry[];
  counts: {
    domains: number;
    modules: number;
    features: number;
    capabilities: number;
    requirements: number;
    added: number;
    removed: number;
    modified: number;
    renamed: number;
  };
  platformCompletionPct: number;
  validation: {
    ok: boolean;
    errors: string[];
    warnings: string[];
  };
  technicalDebt: {
    todos: number;
    fixmes: number;
    placeholders: number;
    missingTests: number;
    missingLocalization: number;
    missingPermissions: number;
    architectureViolations: number;
  };
  roadmap: {
    completed: number;
    inProgress: number;
    blocked: number;
    planned: number;
    future: number;
  };
};

export function emptyProjectSyncEvidence(
  overrides: Partial<ProjectSyncEvidence> = {},
): ProjectSyncEvidence {
  return {
    database: false,
    repository: false,
    serverAction: false,
    rules: false,
    validation: false,
    workspace: false,
    ui: false,
    permissions: false,
    localization: false,
    tests: false,
    documentation: false,
    integration: false,
    security: false,
    performance: false,
    monitoring: false,
    telemetry: false,
    ...overrides,
  };
}
