/**
 * EPIRE — Enterprise Platform Inventory & Readiness Engine types.
 * PROJECT_BIBLE.md is the only source of truth.
 * Completion comes only from verified implementation (EIIE contracts).
 */

export const READINESS_LEVELS = [
  "prototype",
  "alpha",
  "beta",
  "release_candidate",
  "production_ready",
  "enterprise_certified",
] as const;

export type ReadinessLevel = (typeof READINESS_LEVELS)[number];

export const FEATURE_STATUSES = [
  "implemented",
  "partial",
  "blocked",
  "missing",
  "future",
  "deprecated",
] as const;

export type FeatureStatus = (typeof FEATURE_STATUSES)[number];

export const MODULE_DIMENSIONS = [
  "database",
  "repositories",
  "serverActions",
  "workspace",
  "ui",
  "workflow",
  "permissions",
  "localization",
  "history",
  "versioning",
  "notifications",
  "exports",
  "imports",
  "tests",
  "ai",
  "security",
  "devops",
  "documentation",
] as const;

export type ModuleDimension = (typeof MODULE_DIMENSIONS)[number];

/** Maps EPIRE module dimensions → EIIE contract clauses. */
export const DIMENSION_TO_CLAUSES: Record<ModuleDimension, string[]> = {
  database: ["migration", "database"],
  repositories: ["repository"],
  serverActions: ["serverAction"],
  workspace: ["workspace"],
  ui: ["route", "component"],
  workflow: ["workflow"],
  permissions: ["permission"],
  localization: ["localization"],
  history: ["history"],
  versioning: ["versioning"],
  notifications: ["notification"],
  exports: ["export"],
  imports: ["import"],
  tests: ["tests"],
  ai: ["ai"],
  security: ["permission", "validation"],
  devops: ["devops"],
  documentation: ["documentation"],
};

export type DimensionScore = {
  dimension: ModuleDimension;
  required: number;
  verified: number;
  missing: number;
  blocked: number;
  completionPct: number;
};

export type InventoryCounts = {
  domains: number;
  modules: number;
  features: number;
  capabilities: number;
  migrations: number;
  repositories: number;
  serverActions: number;
  routes: number;
  workspaces: number;
  components: number;
  permissions: number;
  tests: number;
  locales: number;
  aiArtifacts: number;
  devopsArtifacts: number;
};

export type DomainInventoryItem = {
  id: string;
  name: string;
  description: string;
  moduleIds: string[];
  capabilityCount: number;
  completionPct: number;
  readiness: ReadinessLevel;
  source: "EPBSE" | "ECIE";
};

export type ModuleInventoryItem = {
  id: string;
  name: string;
  domainId: string;
  description: string;
  featureIds: string[];
  capabilityIds: string[];
  dimensions: DimensionScore[];
  completionPct: number;
  readiness: ReadinessLevel;
  certifiedCapabilityIds: string[];
  remainingCapabilityIds: string[];
  blockedCapabilityIds: string[];
  implemented: string[];
  remaining: string[];
  nextRequiredWork: string[];
  dependsOn: string[];
  blocks: string[];
  blockedBy: string[];
};

export type FeatureInventoryItem = {
  id: string;
  name: string;
  moduleId: string;
  domainId: string;
  capabilityIds: string[];
  status: FeatureStatus;
  completionPct: number;
  certifiedCount: number;
  remainingCount: number;
};

export type CapabilityInventoryItem = {
  id: string;
  name: string;
  moduleId: string;
  domainId: string;
  featureId: string;
  required: boolean;
  implemented: boolean;
  certified: boolean;
  remaining: string[];
  blocked: boolean;
  blockedBy: string[];
  lifecycle: string;
  completionPct: number;
  weight: string;
  bibleSection: string;
};

export type PlatformHealth = {
  architecture: number;
  database: number;
  backend: number;
  frontend: number;
  ai: number;
  security: number;
  testing: number;
  localization: number;
  devops: number;
  documentation: number;
  overall: number;
  source: "EPAC";
};

export type DependencyView = {
  dependsOn: Array<{ from: string; to: string; kind: string }>;
  blocks: Array<{ from: string; to: string }>;
  blockedBy: Array<{ id: string; blockedBy: string[] }>;
  criticalPath: string[];
};

export type InputSources = {
  epbse: "live" | "snapshot" | "missing";
  epac: "live" | "snapshot" | "missing";
  ecie: "live" | "snapshot" | "missing";
  eiie: "live" | "snapshot" | "missing";
};

export type PlatformInventoryReport = {
  generatedAt: string;
  sources: InputSources;
  inventory: InventoryCounts;
  domains: DomainInventoryItem[];
  modules: ModuleInventoryItem[];
  features: FeatureInventoryItem[];
  capabilities: CapabilityInventoryItem[];
  health: PlatformHealth;
  dependency: DependencyView;
  /** Authoritative — EIIE verified implementation contracts only. */
  overallPlatformReadinessPct: number;
  overallReadiness: ReadinessLevel;
  overallCertification: string;
  enterpriseCertified: boolean;
  metrics: {
    modulesPrototype: number;
    modulesAlpha: number;
    modulesBeta: number;
    modulesReleaseCandidate: number;
    modulesProductionReady: number;
    modulesEnterpriseCertified: number;
    capabilitiesRequired: number;
    capabilitiesCertified: number;
    capabilitiesBlocked: number;
    featuresImplemented: number;
    featuresPartial: number;
    featuresMissing: number;
    featuresBlocked: number;
    featuresFuture: number;
    criticalPathLength: number;
  };
  remainingWork: string[];
};

export type PlatformInventoryDashboardModel = {
  generatedAt: string;
  source: "live" | "snapshot";
  report: PlatformInventoryReport;
};

export function averagePct(values: number[]): number {
  if (values.length === 0) return 0;
  const sum = values.reduce((a, b) => a + b, 0);
  return Number((sum / values.length).toFixed(2));
}

export function deriveReadinessLevel(completionPct: number, allCertified: boolean): ReadinessLevel {
  if (allCertified && completionPct >= 95) return "enterprise_certified";
  if (completionPct >= 85) return "production_ready";
  if (completionPct >= 70) return "release_candidate";
  if (completionPct >= 50) return "beta";
  if (completionPct >= 25) return "alpha";
  return "prototype";
}
