import { ValidationError } from "@/lib/errors";
import type { IsaPhase } from "@/constants/audit-engine";
import { ISA_PHASES, AUDIT_OPINION_TYPES, type AuditOpinionType } from "@/constants/audit-engine";

/** Audit planning — strategy must cover scope, risk, and materiality before fieldwork. */
export type AuditPlanningPackage = {
  engagementId: string;
  scopeDefined: boolean;
  riskAssessed: boolean;
  materialitySet: boolean;
  teamAssigned: boolean;
  strategyApproved: boolean;
};

export function isAuditPlanningReady(pkg: AuditPlanningPackage): boolean {
  return (
    pkg.scopeDefined &&
    pkg.riskAssessed &&
    pkg.materialitySet &&
    pkg.teamAssigned &&
    pkg.strategyApproved
  );
}

export function assertAuditPlanningReady(pkg: AuditPlanningPackage): void {
  if (!pkg.engagementId.trim()) {
    throw new ValidationError("Engagement is required for audit planning");
  }
  if (!isAuditPlanningReady(pkg)) {
    throw new ValidationError(
      "Audit planning is incomplete — define scope, risk, materiality, team, and approved strategy",
    );
  }
}

/** Audit program execution — procedure status transitions. */
export const AUDIT_PROGRAM_PROCEDURE_STATUSES = [
  "not_started",
  "in_progress",
  "submitted",
  "cleared",
  "blocked",
] as const;

export type AuditProgramProcedureStatus = (typeof AUDIT_PROGRAM_PROCEDURE_STATUSES)[number];

const PROGRAM_TRANSITIONS: Record<AuditProgramProcedureStatus, AuditProgramProcedureStatus[]> = {
  not_started: ["in_progress", "blocked"],
  in_progress: ["submitted", "blocked", "not_started"],
  submitted: ["cleared", "in_progress"],
  cleared: [],
  blocked: ["in_progress", "not_started"],
};

export function canTransitionAuditProgramProcedure(
  from: AuditProgramProcedureStatus,
  to: AuditProgramProcedureStatus,
): boolean {
  return PROGRAM_TRANSITIONS[from]?.includes(to) ?? false;
}

export function assertAuditProgramProcedureTransition(
  from: AuditProgramProcedureStatus,
  to: AuditProgramProcedureStatus,
): void {
  if (!canTransitionAuditProgramProcedure(from, to)) {
    throw new ValidationError(`Invalid audit program transition "${from}" → "${to}"`);
  }
}

/** Evidence management — evidence must link to a procedure or working paper. */
export type EvidenceLinkage = {
  name: string;
  procedureId?: string | null;
  workingPaperId?: string | null;
};

export function assertEvidenceLinkage(input: EvidenceLinkage): void {
  if (!input.name.trim()) {
    throw new ValidationError("Evidence name is required");
  }
  if (!input.procedureId && !input.workingPaperId) {
    throw new ValidationError("Evidence must link to an audit procedure or working paper");
  }
}

/** Review workflow — preparer → reviewer → clearance. */
export const REVIEW_WORKFLOW_STATES = [
  "draft",
  "submitted",
  "under_review",
  "returned",
  "cleared",
] as const;

export type ReviewWorkflowState = (typeof REVIEW_WORKFLOW_STATES)[number];

const REVIEW_TRANSITIONS: Record<ReviewWorkflowState, ReviewWorkflowState[]> = {
  draft: ["submitted"],
  submitted: ["under_review", "returned"],
  under_review: ["cleared", "returned"],
  returned: ["submitted", "draft"],
  cleared: [],
};

export function assertReviewWorkflowTransition(from: ReviewWorkflowState, to: ReviewWorkflowState): void {
  if (!(REVIEW_TRANSITIONS[from] ?? []).includes(to)) {
    throw new ValidationError(`Invalid review workflow transition "${from}" → "${to}"`);
  }
}

/** Quality review support — EQCR / second partner review gates. */
export type QualityReviewGate = {
  engagementRisk: "normal" | "elevated" | "listed";
  eqcrRequired: boolean;
  eqcrCompleted: boolean;
  outstandingNotes: number;
};

export function isQualityReviewCleared(gate: QualityReviewGate): boolean {
  if (gate.outstandingNotes > 0) return false;
  if (gate.eqcrRequired && !gate.eqcrCompleted) return false;
  return true;
}

export function assertQualityReviewCleared(gate: QualityReviewGate): void {
  if (!isQualityReviewCleared(gate)) {
    throw new ValidationError(
      "Quality review is not cleared — resolve outstanding notes and complete required EQCR",
    );
  }
}

export function requiresEqcr(engagementRisk: QualityReviewGate["engagementRisk"]): boolean {
  return engagementRisk === "elevated" || engagementRisk === "listed";
}

/** Audit opinion formation — ISA opinion type selection rules. */
export type OpinionFormationInput = {
  opinionType: AuditOpinionType;
  misstatementsMaterial: boolean;
  misstatementsPervasive: boolean;
  scopeLimitation: boolean;
  goingConcernMaterialUncertainty: boolean;
};

export function deriveAuditOpinionType(input: Omit<OpinionFormationInput, "opinionType">): AuditOpinionType {
  if (input.scopeLimitation && input.misstatementsPervasive) return "disclaimer";
  if (input.scopeLimitation) return "qualified";
  if (input.misstatementsMaterial && input.misstatementsPervasive) return "adverse";
  if (input.misstatementsMaterial) return "qualified";
  return "unqualified";
}

export function assertOpinionTypeConsistency(input: OpinionFormationInput): void {
  if (!(AUDIT_OPINION_TYPES as readonly string[]).includes(input.opinionType)) {
    throw new ValidationError("Invalid audit opinion type");
  }
  const derived = deriveAuditOpinionType(input);
  if (derived !== input.opinionType) {
    throw new ValidationError(
      `Selected opinion "${input.opinionType}" is inconsistent with facts (expected "${derived}")`,
    );
  }
}

/** ISA-aligned methodology — phase sequencing. */
export function assertIsaPhaseOrder(completed: IsaPhase[], next: IsaPhase): void {
  const index = ISA_PHASES.indexOf(next);
  if (index < 0) {
    throw new ValidationError("Unknown ISA phase");
  }
  for (let i = 0; i < index; i += 1) {
    const required = ISA_PHASES[i]!;
    if (!completed.includes(required)) {
      throw new ValidationError(`ISA phase "${next}" requires prior completion of "${required}"`);
    }
  }
}

export function nextIsaPhase(completed: IsaPhase[]): IsaPhase | null {
  for (const phase of ISA_PHASES) {
    if (!completed.includes(phase)) return phase;
  }
  return null;
}

/** Analytical procedures — expectation vs recorded variance. */
export type AnalyticalProcedureResult = {
  accountCode: string;
  recorded: number;
  expectation: number;
  thresholdPct: number;
};

export function analyticalVariancePct(result: AnalyticalProcedureResult): number {
  if (result.expectation === 0) {
    return result.recorded === 0 ? 0 : 100;
  }
  return Math.abs((result.recorded - result.expectation) / result.expectation) * 100;
}

export function isAnalyticalVarianceSignificant(result: AnalyticalProcedureResult): boolean {
  return analyticalVariancePct(result) > result.thresholdPct;
}

export function assertAnalyticalProcedureInput(result: AnalyticalProcedureResult): void {
  if (!result.accountCode.trim()) {
    throw new ValidationError("Account code is required for analytical procedures");
  }
  if (result.thresholdPct < 0) {
    throw new ValidationError("Analytical threshold must be non-negative");
  }
}

/** Sampling support — sample size and coverage. */
export type SamplingPlan = {
  populationSize: number;
  sampleSize: number;
  riskFactor: number;
};

export function recommendedSampleSize(populationSize: number, riskFactor: number): number {
  if (populationSize <= 0) return 0;
  const factor = Math.min(Math.max(riskFactor, 0.5), 3);
  return Math.min(populationSize, Math.max(1, Math.ceil(Math.sqrt(populationSize) * factor * 2)));
}

export function assertSamplingPlan(plan: SamplingPlan): void {
  if (plan.populationSize <= 0) {
    throw new ValidationError("Population size must be positive");
  }
  if (plan.sampleSize <= 0 || plan.sampleSize > plan.populationSize) {
    throw new ValidationError("Sample size must be between 1 and population size");
  }
}

/** Finding and recommendation tracking. */
export const FINDING_SEVERITIES = ["low", "medium", "high", "critical"] as const;
export type FindingSeverity = (typeof FINDING_SEVERITIES)[number];

export type FindingRecord = {
  title: string;
  severity: FindingSeverity;
  recommendation: string;
  ownerId?: string | null;
  dueDate?: string | null;
};

export function assertFindingRecord(finding: FindingRecord): void {
  if (!finding.title.trim()) {
    throw new ValidationError("Finding title is required");
  }
  if (!(FINDING_SEVERITIES as readonly string[]).includes(finding.severity)) {
    throw new ValidationError("Invalid finding severity");
  }
  if (!finding.recommendation.trim()) {
    throw new ValidationError("Every finding requires a recommendation");
  }
  if ((finding.severity === "high" || finding.severity === "critical") && !finding.ownerId) {
    throw new ValidationError("High/critical findings require an owner");
  }
}

/** Audit committee dashboards — KPI completeness. */
export type AuditCommitteeDashboardKpis = {
  openFindings: number;
  overdueRecommendations: number;
  unclearedReviews: number;
  opinionStatus: "pending" | "drafted" | "issued";
};

export function auditCommitteeRiskScore(kpis: AuditCommitteeDashboardKpis): number {
  let score = kpis.openFindings * 2 + kpis.overdueRecommendations * 3 + kpis.unclearedReviews * 4;
  if (kpis.opinionStatus === "pending") score += 5;
  return score;
}

export function assertAuditCommitteeDashboardKpis(kpis: AuditCommitteeDashboardKpis): void {
  if (kpis.openFindings < 0 || kpis.overdueRecommendations < 0 || kpis.unclearedReviews < 0) {
    throw new ValidationError("Dashboard KPIs cannot be negative");
  }
}

/** Audit report generation — package readiness. */
export type AuditReportPackage = {
  opinionApproved: boolean;
  findingsClosedOrAccepted: boolean;
  financialStatementsApproved: boolean;
  representationLetterReceived: boolean;
};

export function isAuditReportReady(pkg: AuditReportPackage): boolean {
  return (
    pkg.opinionApproved &&
    pkg.findingsClosedOrAccepted &&
    pkg.financialStatementsApproved &&
    pkg.representationLetterReceived
  );
}

export function assertAuditReportReady(pkg: AuditReportPackage): void {
  if (!isAuditReportReady(pkg)) {
    throw new ValidationError(
      "Audit report cannot be generated until opinion, findings, FS, and representation letter are complete",
    );
  }
}

/** Audit log access — export filters. */
export type AuditLogAccessFilter = {
  organizationId: string;
  workspaceId?: string | null;
  from?: string | null;
  to?: string | null;
  actionPrefix?: string | null;
};

export function assertAuditLogAccessFilter(filter: AuditLogAccessFilter): void {
  if (!filter.organizationId.trim()) {
    throw new ValidationError("Organization is required for audit log access");
  }
  if (filter.from && filter.to && filter.from > filter.to) {
    throw new ValidationError("Audit log date range is invalid");
  }
}
