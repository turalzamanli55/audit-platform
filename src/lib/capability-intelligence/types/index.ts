/**
 * ECIE — Enterprise Capability Intelligence Engine types.
 * Completion is calculated only from required, verified evidence for in-scope capabilities.
 */

export const CAPABILITY_CLASSES = [
  "required",
  "optional",
  "future",
  "planned",
  "experimental",
  "enterprise_only",
  "internal",
  "infrastructure",
  "ui",
  "ai",
  "security",
  "compliance",
  "database",
  "workflow",
] as const;

export type CapabilityClass = (typeof CAPABILITY_CLASSES)[number];

export const IMPLEMENTATION_PHASES = [
  "foundation",
  "alpha",
  "beta",
  "release_candidate",
  "production",
  "enterprise",
  "future",
] as const;

export type ImplementationPhase = (typeof IMPLEMENTATION_PHASES)[number];

export const BUSINESS_WEIGHTS = [
  "critical",
  "high",
  "medium",
  "low",
  "informational",
] as const;

export type BusinessWeight = (typeof BUSINESS_WEIGHTS)[number];

export const LIFECYCLE_STATES = [
  "not_started",
  "in_progress",
  "blocked",
  "implemented",
  "verified",
  "certified",
  "deprecated",
  "future",
] as const;

export type LifecycleState = (typeof LIFECYCLE_STATES)[number];

export const EVIDENCE_KINDS = [
  "migration",
  "repository",
  "route",
  "workspace",
  "permission",
  "tests",
  "localization",
  "workflow",
  "history",
  "versioning",
  "serverAction",
  "ai",
  "documentation",
  "database",
  "component",
] as const;

export type EvidenceKind = (typeof EVIDENCE_KINDS)[number];

export const WEIGHT_NUMERIC: Record<BusinessWeight, number> = {
  critical: 5,
  high: 4,
  medium: 3,
  low: 2,
  informational: 1,
};

export type ParsedCapability = {
  id: string;
  name: string;
  description: string;
  purpose: string;
  moduleId: string;
  domainId: string;
  featureId: string;
  dependencies: string[];
  sourceSection: string;
  priority: BusinessWeight;
  category: string;
};

export type EvidenceRequirement = {
  kind: EvidenceKind;
  required: boolean;
  reason: string;
};

export type EvidenceSatisfaction = {
  kind: EvidenceKind;
  required: boolean;
  present: boolean;
  verified: boolean;
  confidencePct: number;
  paths: string[];
  reason: string;
};

export type IntelligentCapability = {
  id: string;
  name: string;
  description: string;
  purpose: string;
  moduleId: string;
  domainId: string;
  featureId: string;
  classes: CapabilityClass[];
  primaryClass: CapabilityClass;
  phase: ImplementationPhase;
  weight: BusinessWeight;
  weightNumeric: number;
  lifecycle: LifecycleState;
  dependencies: string[];
  blockedBy: string[];
  requiredEvidence: EvidenceRequirement[];
  evidence: EvidenceSatisfaction[];
  /** Completion among required evidence only (0 if blocked/future/optional-excluded). */
  requiredCompletionPct: number;
  /** Whether this capability counts toward platform/module completion. */
  countsTowardCompletion: boolean;
  /** Whether this capability can block certification. */
  blocksCertification: boolean;
  falsePenalty: boolean;
  falsePenaltyReason: string | null;
  explainability: string[];
};

export type IntelligentModule = {
  id: string;
  name: string;
  domainId: string;
  capabilityIds: string[];
  requiredCapabilityIds: string[];
  completionPct: number;
  readiness:
    | "prototype"
    | "alpha"
    | "beta"
    | "release_candidate"
    | "production_ready"
    | "enterprise_certified";
  blockedCapabilityIds: string[];
  futureCapabilityIds: string[];
  optionalCapabilityIds: string[];
};

export type IntelligentDomain = {
  id: string;
  name: string;
  moduleIds: string[];
  completionPct: number;
};

export type DependencyEdge = {
  from: string;
  to: string;
  kind: "capability" | "module";
};

export type DependencyIntelligence = {
  edges: DependencyEdge[];
  blockedCapabilities: string[];
  blockingReasons: Record<string, string[]>;
  criticalPath: string[];
};

export type RoadmapIntelligence = {
  nextModules: Array<{ id: string; name: string; reason: string }>;
  blockedModules: Array<{ id: string; name: string; blockedBy: string[] }>;
  criticalPath: string[];
  futureModules: Array<{ id: string; name: string }>;
  recommendedSprint: Array<{
    id: string;
    kind: "capability" | "module";
    name: string;
    weight: BusinessWeight;
    reason: string;
  }>;
};

export type FalsePenaltyFinding = {
  capabilityId: string;
  code: string;
  message: string;
  rootCause: string;
};

export type CertificationIntelligence = {
  level:
    | "prototype"
    | "alpha"
    | "beta"
    | "release_candidate"
    | "production_ready"
    | "enterprise_certified";
  enterpriseCertified: boolean;
  requiredCompletionPct: number;
  requiredCapabilityCount: number;
  requiredSatisfiedCount: number;
  optionalIgnoredCount: number;
  futureIgnoredCount: number;
  blockedCount: number;
  explainability: string[];
};

export type CapabilityGraph = {
  nodes: Array<{
    id: string;
    kind: "domain" | "module" | "capability" | "evidence" | "dependency" | "completion" | "certification";
    label: string;
    meta?: Record<string, string | number | boolean>;
  }>;
  edges: Array<{ from: string; to: string; relation: string }>;
};

export type CapabilityIntelligenceReport = {
  generatedAt: string;
  capabilities: IntelligentCapability[];
  modules: IntelligentModule[];
  domains: IntelligentDomain[];
  dependencies: DependencyIntelligence;
  roadmap: RoadmapIntelligence;
  falsePenalties: FalsePenaltyFinding[];
  certification: CertificationIntelligence;
  graph: CapabilityGraph;
  /** Platform completion from required verified capabilities only. */
  platformCompletionPct: number;
  metrics: {
    total: number;
    required: number;
    optional: number;
    future: number;
    blocked: number;
    certified: number;
    verified: number;
    inProgress: number;
    notStarted: number;
  };
};

export function averageWeighted(
  items: Array<{ value: number; weight: number }>,
): number {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  if (totalWeight <= 0) return 0;
  const sum = items.reduce((acc, item) => acc + item.value * item.weight, 0);
  return Number((sum / totalWeight).toFixed(2));
}
