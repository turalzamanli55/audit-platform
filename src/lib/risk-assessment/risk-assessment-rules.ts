import type { AuditPlan } from "@/repositories/planning/planning-repository";
import {
  LOCKED_RISK_ASSESSMENT_STATUSES,
  RISK_RATING_LEVELS,
} from "@/constants/risk-assessment";
import { ValidationError } from "@/lib/errors";

type RiskRatingLevel = (typeof RISK_RATING_LEVELS)[number];

const SUBMITTABLE_ASSESSMENT_STATUSES = ["not_started", "in_progress"] as const;
const RETURNABLE_ASSESSMENT_STATUSES = ["submitted", "under_review"] as const;
const APPROVABLE_ASSESSMENT_STATUSES = ["submitted", "under_review"] as const;

const RATING_WEIGHTS: Record<RiskRatingLevel, number> = {
  low: 1,
  moderate: 2,
  high: 3,
  significant: 4,
};

const WEIGHT_TO_RATING: Record<number, RiskRatingLevel> = {
  1: "low",
  2: "moderate",
  3: "high",
  4: "significant",
};

export type RiskAssessmentGateTarget = Pick<AuditPlan, "planning_status">;

export type RiskAssessmentWorkflowTarget = {
  assessment_status: string;
  deleted_at?: string | null;
};

export type SignificantRiskItem = {
  isSignificant: boolean;
  id?: string;
};

export type RiskItemSubmitCheck = SignificantRiskItem & {
  id: string;
  riskType: string;
};

export type ProcedureLinkCheck = {
  riskItemId: string;
};

export type ComputeRiskAssessmentProgressInput = {
  totalRiskItems: number;
  ratedRiskItems: number;
  totalAssertionRatings: number;
  completedAssertionRatings: number;
  totalResponses: number;
  completedResponses: number;
  hasSignificantRisks: boolean;
  significantRisksAcknowledged: boolean;
};

export function isPlanningApproved(plan: RiskAssessmentGateTarget): boolean {
  return plan.planning_status === "approved";
}

export function isRiskAssessmentApproved(
  assessment: Pick<RiskAssessmentWorkflowTarget, "assessment_status">,
): boolean {
  return assessment.assessment_status === "approved";
}

export function assertRiskAssessmentGate(plan: RiskAssessmentGateTarget | null): void {
  if (!plan || !isPlanningApproved(plan)) {
    throw new ValidationError(
      "Risk assessment cannot begin until audit planning is approved (ENG-03).",
    );
  }
}

export function assertFieldworkRiskGate(
  riskAssessment: Pick<RiskAssessmentWorkflowTarget, "assessment_status"> | null,
): void {
  if (!riskAssessment || !isRiskAssessmentApproved(riskAssessment)) {
    throw new ValidationError(
      "Fieldwork cannot begin until the risk assessment is approved (ENG-04).",
    );
  }
}

export function assertAssessmentEditable(assessment: RiskAssessmentWorkflowTarget): void {
  if (
    LOCKED_RISK_ASSESSMENT_STATUSES.includes(
      assessment.assessment_status as (typeof LOCKED_RISK_ASSESSMENT_STATUSES)[number],
    ) ||
    assessment.deleted_at
  ) {
    throw new ValidationError("Approved or archived risk assessments are read-only.");
  }
}

export function assertCanSubmit(
  assessment: Pick<RiskAssessmentWorkflowTarget, "assessment_status">,
): void {
  if (
    !SUBMITTABLE_ASSESSMENT_STATUSES.includes(
      assessment.assessment_status as (typeof SUBMITTABLE_ASSESSMENT_STATUSES)[number],
    )
  ) {
    throw new ValidationError(
      "Only not-started or in-progress risk assessments can be submitted.",
    );
  }
}

export function assertCanReturn(
  assessment: Pick<RiskAssessmentWorkflowTarget, "assessment_status">,
): void {
  if (
    !RETURNABLE_ASSESSMENT_STATUSES.includes(
      assessment.assessment_status as (typeof RETURNABLE_ASSESSMENT_STATUSES)[number],
    )
  ) {
    throw new ValidationError("Only submitted risk assessments can be returned.");
  }
}

export function assertCanApprove(
  assessment: Pick<RiskAssessmentWorkflowTarget, "assessment_status">,
): void {
  if (
    !APPROVABLE_ASSESSMENT_STATUSES.includes(
      assessment.assessment_status as (typeof APPROVABLE_ASSESSMENT_STATUSES)[number],
    )
  ) {
    throw new ValidationError("Only submitted risk assessments can be approved.");
  }
}

export function assertSignificantRisksAcknowledged(
  assessment: { significant_risks_acknowledged_at?: string | null },
  riskItems: SignificantRiskItem[],
): void {
  const hasSignificantRisks = riskItems.some((item) => item.isSignificant);
  if (hasSignificantRisks && !assessment.significant_risks_acknowledged_at) {
    throw new ValidationError(
      "Significant risks must be acknowledged before approving the risk assessment.",
    );
  }
}

export function assertSubmitPrerequisites(
  riskItems: RiskItemSubmitCheck[],
  procedureLinks: ProcedureLinkCheck[],
): void {
  if (riskItems.length === 0) {
    throw new ValidationError("At least one risk item is required before submission.");
  }

  const hasFraudRisk = riskItems.some((item) => item.riskType === "fraud");
  if (!hasFraudRisk) {
    throw new ValidationError("At least one fraud risk item must be documented before submission.");
  }

  const linkedRiskIds = new Set(procedureLinks.map((link) => link.riskItemId));
  const unlinkedSignificant = riskItems.filter(
    (item) => item.isSignificant && !linkedRiskIds.has(item.id),
  );
  if (unlinkedSignificant.length > 0) {
    throw new ValidationError(
      "All significant risks must have linked procedures before submission.",
    );
  }
}

export function computeOpenRiskItems(
  riskItems: Array<{ id: string; isSignificant: boolean; inherentRating: string | null; residualRating: string | null }>,
  procedureLinks: ProcedureLinkCheck[],
  responseRiskIds: Set<string>,
): number {
  const linkedRiskIds = new Set(procedureLinks.map((link) => link.riskItemId));
  return riskItems.filter((item) => {
    if (item.isSignificant && !linkedRiskIds.has(item.id)) return true;
    if (!item.inherentRating && !item.residualRating) return true;
    if (!responseRiskIds.has(item.id)) return true;
    return false;
  }).length;
}

export function computeRiskAssessmentProgress(input: ComputeRiskAssessmentProgressInput): number {
  const sections: number[] = [];

  sections.push(input.totalRiskItems === 0 ? 0 : Math.round((input.ratedRiskItems / input.totalRiskItems) * 100));
  sections.push(
    input.totalAssertionRatings === 0
      ? 0
      : Math.round((input.completedAssertionRatings / input.totalAssertionRatings) * 100),
  );
  sections.push(
    input.totalResponses === 0 ? 0 : Math.round((input.completedResponses / input.totalResponses) * 100),
  );

  if (input.hasSignificantRisks) {
    sections.push(input.significantRisksAcknowledged ? 100 : 0);
  }

  if (sections.length === 0) return 0;
  return Math.round(sections.reduce((sum, value) => sum + value, 0) / sections.length);
}

export function computeResidualRating(
  inherentRating: RiskRatingLevel | null,
  controlRating: RiskRatingLevel | null,
  detectionRating: RiskRatingLevel | null,
): RiskRatingLevel | null {
  if (!inherentRating) return null;

  const inherentWeight = RATING_WEIGHTS[inherentRating];
  const controlWeight = controlRating ? RATING_WEIGHTS[controlRating] : inherentWeight;
  const detectionWeight = detectionRating ? RATING_WEIGHTS[detectionRating] : inherentWeight;

  const dampened = Math.round((inherentWeight * 2 + controlWeight + detectionWeight) / 4);
  const bounded = Math.min(4, Math.max(1, dampened));
  return WEIGHT_TO_RATING[bounded];
}

export function ratingToHeatmapColor(rating: RiskRatingLevel | null): string {
  switch (rating) {
    case "low":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "moderate":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "high":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "significant":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
}
