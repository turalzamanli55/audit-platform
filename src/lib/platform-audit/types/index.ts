/**
 * EPAC — Enterprise Platform Audit, Certification & Readiness Engine types.
 * Completion is calculated only from implementation evidence. Never estimate.
 */

export const EPAC_EVIDENCE_DIMENSIONS = [
  "database",
  "migration",
  "repository",
  "serverAction",
  "route",
  "workspace",
  "component",
  "localization",
  "tests",
  "permissions",
  "workflow",
  "documentation",
] as const;

export type EpacEvidenceDimension = (typeof EPAC_EVIDENCE_DIMENSIONS)[number];
export type EpacEvidence = Record<EpacEvidenceDimension, boolean>;

export type EvidencePathMap = Partial<Record<EpacEvidenceDimension, string[]>>;

export type AuditPhaseId =
  | "documentation"
  | "architecture"
  | "database"
  | "backend"
  | "frontend"
  | "localization"
  | "ai"
  | "devops"
  | "security"
  | "testing"
  | "modules"
  | "capabilities"
  | "production_readiness"
  | "technical_debt"
  | "roadmap";

export type FindingSeverity = "blocker" | "error" | "warning" | "info";

export type AuditFinding = {
  phase: AuditPhaseId;
  code: string;
  severity: FindingSeverity;
  message: string;
  rootCause: string;
  evidencePaths?: string[];
  entityId?: string;
};

export type PhaseHealth = {
  phase: AuditPhaseId;
  label: string;
  ok: boolean;
  scorePct: number;
  findings: AuditFinding[];
  metrics: Record<string, number | string | boolean | null>;
  durationMs: number;
};

export type CertificationLevel =
  | "prototype"
  | "alpha"
  | "beta"
  | "release_candidate"
  | "production_ready"
  | "enterprise_certified";

export type CompletionStatus = "missing" | "partial" | "complete";

export type DocumentExtraction = {
  domains: Array<{ id: string; name: string; section: string }>;
  modules: Array<{ id: string; name: string; domainId: string; section: string }>;
  features: Array<{ id: string; name: string; moduleId: string; section: string }>;
  capabilities: Array<{ id: string; name: string; moduleId: string; featureId: string; section: string }>;
  requirements: Array<{ id: string; text: string; section: string }>;
  businessRules: Array<{ id: string; text: string; section: string }>;
  architectureRules: Array<{ id: string; text: string; section: string }>;
  workflowRules: Array<{ id: string; text: string; section: string }>;
  securityRules: Array<{ id: string; text: string; section: string }>;
  localizationRules: Array<{ id: string; text: string; section: string }>;
  documentHashes: Record<string, string>;
};

export type ModuleDimensionStatus = {
  dimension: string;
  present: boolean;
  paths: string[];
};

export type ModuleReadiness = {
  id: string;
  name: string;
  domainId: string;
  dimensions: ModuleDimensionStatus[];
  evidence: EpacEvidence;
  evidencePaths: EvidencePathMap;
  completionPct: number;
  /** Average evidence confidence (0–100). */
  confidencePct: number;
  /** Completion from verified/strong evidence only. */
  verifiedCompletionPct: number;
  aliases: string[];
  matchedRoots: string[];
  status: CompletionStatus;
  remainingWork: string[];
  findings: AuditFinding[];
};

export type CapabilityCoverage = {
  id: string;
  name: string;
  domain: string;
  module: string;
  feature: string;
  evidence: EpacEvidence;
  evidencePaths: EvidencePathMap;
  completionPct: number;
  confidencePct: number;
  verifiedCompletionPct: number;
  status: CompletionStatus;
  missingEvidence: EpacEvidenceDimension[];
  rootCause: string | null;
};

export type RoadmapItemStatus = "completed" | "in_progress" | "blocked" | "planned" | "future";

export type RoadmapItem = {
  id: string;
  kind: "module" | "capability" | "finding";
  name: string;
  status: RoadmapItemStatus;
  completionPct: number;
  blockedBy: string[];
  evidenceSummary: string;
};

export type TechnicalDebtItem = {
  code: string;
  kind:
    | "dead_code"
    | "unused_module"
    | "duplicate_logic"
    | "duplicate_repository"
    | "duplicate_ui"
    | "unused_route"
    | "unused_type"
    | "unused_permission"
    | "deprecated"
    | "marker";
  severity: FindingSeverity;
  /** Classified debt severity for v2 weighting. */
  debtSeverity?: "critical" | "high" | "medium" | "low" | "informational";
  message: string;
  rootCause: string;
  paths: string[];
  weight?: number;
};

export type FalsePositiveReportItem = {
  code: string;
  severity: "critical" | "high" | "medium" | "low" | "informational";
  message: string;
  rootCause: string;
  entityId?: string;
  correctedBy?: string;
};

export type EvidenceResolutionSummary = {
  symbolsScanned: number;
  filesScanned: number;
  importEdges: number;
  moduleConfidencePct: number;
  capabilityConfidencePct: number;
  verifiedCompletionPct: number;
  evidenceCoveragePct: number;
  falsePositiveCount: number;
  aiAreasPresent: number;
  aiAreasExpected: number;
  graphNodes: number;
  graphEdges: number;
};

export type PlatformAuditReport = {
  generatedAt: string;
  overallCompletionPct: number;
  /** Verified/strong evidence only. */
  verifiedCompletionPct: number;
  evidenceConfidencePct: number;
  certification: CertificationLevel;
  enterpriseCertified: boolean;
  phases: PhaseHealth[];
  documentation: DocumentExtraction;
  modules: ModuleReadiness[];
  capabilities: CapabilityCoverage[];
  technicalDebt: TechnicalDebtItem[];
  falsePositives: FalsePositiveReportItem[];
  evidenceResolution: EvidenceResolutionSummary;
  roadmap: RoadmapItem[];
  findings: AuditFinding[];
  remainingWork: string[];
  health: {
    overall: number;
    architecture: number;
    database: number;
    backend: number;
    frontend: number;
    ai: number;
    localization: number;
    security: number;
    testing: number;
    devops: number;
    technicalDebt: number;
    moduleReadiness: number;
    capabilityCoverage: number;
    documentationCoverage: number;
    evidenceConfidence: number;
    verifiedCompletion: number;
  };
};

export type PlatformAuditDashboardModel = {
  generatedAt: string;
  source: "live" | "snapshot";
  report: PlatformAuditReport;
};

export function emptyEpacEvidence(overrides: Partial<EpacEvidence> = {}): EpacEvidence {
  return {
    database: false,
    migration: false,
    repository: false,
    serverAction: false,
    route: false,
    workspace: false,
    component: false,
    localization: false,
    tests: false,
    permissions: false,
    workflow: false,
    documentation: false,
    ...overrides,
  };
}

export function calculateEvidenceCompletionPct(evidence: EpacEvidence): number {
  const total = EPAC_EVIDENCE_DIMENSIONS.length;
  const satisfied = EPAC_EVIDENCE_DIMENSIONS.reduce(
    (count, dimension) => count + (evidence[dimension] ? 1 : 0),
    0,
  );
  return Number(((satisfied / total) * 100).toFixed(2));
}

export function deriveCompletionStatus(completionPct: number): CompletionStatus {
  if (completionPct <= 0) return "missing";
  if (completionPct >= 100) return "complete";
  return "partial";
}

export function deriveCertificationLevel(overallCompletionPct: number): CertificationLevel {
  if (overallCompletionPct >= 95) return "enterprise_certified";
  if (overallCompletionPct >= 85) return "production_ready";
  if (overallCompletionPct >= 70) return "release_candidate";
  if (overallCompletionPct >= 50) return "beta";
  if (overallCompletionPct >= 25) return "alpha";
  return "prototype";
}

export function averagePct(values: number[]): number {
  if (values.length === 0) return 0;
  return Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2));
}
