import type {
  DevOpsArtifact,
  DevOpsDashboardModel,
  DevOpsHealthReport,
  MonitoringSnapshot,
  PipelineRunReport,
  ReleaseCandidate,
  VersionManifest,
} from "@/lib/devops/types";

export type HistoryKind =
  | "validation"
  | "release"
  | "build"
  | "migration"
  | "platform"
  | "operation";

export type DevOpsHistoryEntry = {
  id: string;
  kind: HistoryKind;
  ok: boolean;
  generatedAt: string;
  durationMs: number;
  summary: string;
  details?: Record<string, unknown>;
};

export type HealthTrendPoint = {
  generatedAt: string;
  platformHealth: number;
  migrationHealth: number;
  dependencyHealth: number;
  releaseReadiness: number;
  ok: boolean;
  durationMs: number;
};

export type HealthMonitoringReport = {
  generatedAt: string;
  successRate: number;
  failureCount: number;
  successCount: number;
  averageBuildDurationMs: number;
  averageMigrationDurationMs: number;
  averageValidationDurationMs: number;
  recentFailures: DevOpsHistoryEntry[];
  trend: HealthTrendPoint[];
};

export type DatabaseLifecycleStepId =
  | "backup_check"
  | "db_reset"
  | "db_push"
  | "gen_types"
  | "schema_validation"
  | "migration_replay_verification";

export type DatabaseLifecycleStepResult = {
  id: DatabaseLifecycleStepId;
  label: string;
  ok: boolean;
  skipped: boolean;
  message: string;
  durationMs: number;
  command?: string;
};

export type DatabaseLifecycleAutomationReport = {
  generatedAt: string;
  ok: boolean;
  steps: DatabaseLifecycleStepResult[];
  durationMs: number;
};

export type OperationalReleaseReport = {
  generatedAt: string;
  ok: boolean;
  durationMs: number;
  lifecycle: DatabaseLifecycleAutomationReport;
  dashboard: DevOpsDashboardModel;
  monitoring: MonitoringSnapshot;
  healthTrends: HealthMonitoringReport;
  persistedPaths: string[];
};

export type OperationalRunOptions = {
  cwd?: string;
  /** Attempt live supabase reset/push/types. Default true for edrp:operate. */
  runDatabaseLifecycle?: boolean;
  /** Prefer linked remote reset over local. */
  preferLinked?: boolean;
  runBuild?: boolean;
  runUnitTests?: boolean;
  runIntegrationTests?: boolean;
  /** Persist artifacts and history. Default true. */
  persist?: boolean;
  /** Skip destructive reset; still verify migrations via governance. */
  skipReset?: boolean;
};

export type PersistedDevOpsSnapshot = {
  id: string;
  generatedAt: string;
  ok: boolean;
  dashboard: DevOpsDashboardModel;
  monitoring: MonitoringSnapshot;
  versions: VersionManifest;
  release: ReleaseCandidate;
  pipeline: PipelineRunReport;
  health: DevOpsHealthReport;
  artifacts: DevOpsArtifact[];
  lifecycle?: DatabaseLifecycleAutomationReport;
};
