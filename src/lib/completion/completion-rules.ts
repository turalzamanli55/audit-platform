import { isMaterialityApproved } from "@/lib/materiality/materiality-rules";
import { isPlanningApproved } from "@/lib/materiality/materiality-rules";
import { isFieldworkSubstantiallyComplete } from "@/lib/review/review-rules";
import { assertReviewApprovedForCompletion } from "@/lib/review/review-rules";
import { isRiskAssessmentApproved } from "@/lib/risk-assessment/risk-assessment-rules";
import type { Tables } from "@/types/supabase";
import { ValidationError } from "@/lib/errors";

export type EngagementCompletionGateInput = {
  planning: Pick<Tables<"audit_plans">, "planning_status"> | null;
  materiality: Pick<Tables<"materiality_packages">, "package_status"> | null;
  riskAssessment: Pick<Tables<"risk_assessments">, "assessment_status"> | null;
  fieldwork: Pick<Tables<"fieldwork_packages">, "package_status"> | null;
  review: Pick<Tables<"review_packages">, "package_status"> | null;
};

export function assertEngagementCompletionGate(input: EngagementCompletionGateInput): void {
  if (!input.planning || !isPlanningApproved(input.planning)) {
    throw new ValidationError(
      "Engagement completion requires an approved planning package.",
    );
  }

  if (!input.materiality || !isMaterialityApproved(input.materiality)) {
    throw new ValidationError(
      "Engagement completion requires an approved materiality package.",
    );
  }

  if (!input.riskAssessment || !isRiskAssessmentApproved(input.riskAssessment)) {
    throw new ValidationError(
      "Engagement completion requires an approved risk assessment.",
    );
  }

  if (!input.fieldwork || !isFieldworkSubstantiallyComplete(input.fieldwork)) {
    throw new ValidationError(
      "Engagement completion requires substantially complete fieldwork.",
    );
  }

  assertReviewApprovedForCompletion(input.review);
}
