import { ValidationError } from "@/lib/errors";

export type CreateRiskAssessmentInput = {
  engagementId: string;
};

export function validateCreateRiskAssessmentInput(input: CreateRiskAssessmentInput) {
  if (!input.engagementId?.trim()) {
    throw new ValidationError("Engagement is required");
  }

  return { engagementId: input.engagementId.trim() };
}
