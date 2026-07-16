/**
 * Enterprise DevOps & Release Platform (EDRP) — shared types.
 * Orchestrates existing governance engines; does not duplicate their logic.
 */

export type PipelineStageId =
  | "source_validation"
  | "migration_validation"
  | "sql_foundation_validation"
  | "schema_validation"
  | "supabase_types_validation"
  | "repository_validation"
  | "localization_validation"
  | "capability_validation"
  | "project_bible_sync"
  | "platform_readiness_sync"
  | "build_validation"
  | "unit_tests"
  | "integration_tests"
  | "governance_validation"
  | "release_validation"
  | "ai_validation";

export type StageSeverity = "blocker" | "error" | "warning" | "info";

export type PipelineStageResult = {
  id: PipelineStageId;
  label: string;
  ok: boolean;
  severity: StageSeverity;
  message: string;
  durationMs: number;
  details?: Record<string, unknown>;
  skipped?: boolean;
};

export type PipelineRunOptions = {
  cwd?: string;
  runBuild?: boolean;
  runUnitTests?: boolean;
  runIntegrationTests?: boolean;
  failFast?: boolean;
};

export type PipelineRunReport = {
  generatedAt: string;
  ok: boolean;
  stages: PipelineStageResult[];
  blockers: number;
  errors: number;
  warnings: number;
  durationMs: number;
};

export type VersionManifest = {
  platformVersion: string;
  schemaVersion: string;
  migrationVersion: string;
  migrationCount: number;
  capabilityVersion: string;
  documentationVersion: string;
  aiVersion: string;
  generatedAt: string;
};

export type ReleaseCandidate = {
  id: string;
  version: string;
  createdAt: string;
  status: "draft" | "validated" | "rejected" | "released";
  versions: VersionManifest;
  pipelineOk: boolean;
  checklistOk: boolean;
  readinessScore: number;
  breakingChanges: string[];
  databaseChanges: string[];
  notes: string[];
};

export type ChecklistItemId =
  | "fresh_database_replay"
  | "sql_foundation"
  | "migration_replay"
  | "supabase_types"
  | "build"
  | "tests"
  | "localization"
  | "capability_registry"
  | "project_sync"
  | "platform_readiness"
  | "governance"
  | "release_health";

export type ChecklistItem = {
  id: ChecklistItemId;
  label: string;
  ok: boolean;
  required: boolean;
  message: string;
};

export type ReleaseChecklistReport = {
  ok: boolean;
  items: ChecklistItem[];
  failedRequired: ChecklistItemId[];
};

export type ArtifactKind =
  | "validation"
  | "migration"
  | "build"
  | "testing"
  | "coverage"
  | "localization"
  | "platform_readiness"
  | "release";

export type DevOpsArtifact = {
  kind: ArtifactKind;
  title: string;
  generatedAt: string;
  body: string;
  ok: boolean;
};

export type DevOpsHealthReport = {
  platformHealth: number;
  releaseReadiness: number;
  migrationHealth: number;
  dependencyHealth: number;
  schemaDriftOk: boolean;
  documentationCoverage: number;
  implementationCoverage: number;
  buildOk: boolean | null;
  testOk: boolean | null;
  localizationOk: boolean;
  aiOk: boolean;
  platformCompletionPct: number;
  generatedAt: string;
};

export type DevOpsDashboardModel = {
  generatedAt: string;
  health: DevOpsHealthReport;
  pipeline: PipelineRunReport;
  checklist: ReleaseChecklistReport;
  versions: VersionManifest;
  release: ReleaseCandidate;
  artifacts: DevOpsArtifact[];
};

export type CiProvider = "github_actions" | "azure_devops" | "gitlab_ci" | "self_hosted";

export type CiCdBlueprint = {
  provider: CiProvider;
  stages: PipelineStageId[];
  commands: string[];
  notes: string[];
};

export type DeploymentPlan = {
  environment: "development" | "staging" | "production";
  strategy: "forward_only" | "progressive" | "blue_green";
  requiresApproval: boolean;
  healthGate: boolean;
  rollbackReady: boolean;
};

export type RollbackPlan = {
  application: "redeploy_previous_artifact";
  database: "forward_compensating_migration";
  tested: boolean;
  authority: string;
};

export type MonitoringSnapshot = {
  pipelineLastOk: boolean;
  migrationHealth: number;
  dependencyHealth: number;
  schemaDriftOk: boolean;
  releaseReadiness: number;
  alerts: string[];
};
