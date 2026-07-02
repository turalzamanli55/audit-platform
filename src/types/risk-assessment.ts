import type { Enums } from "@/types/supabase";

export type RiskAssessmentStatus = Enums<"risk_assessment_status">;
export type RiskType = Enums<"risk_type">;
export type RiskRatingLevel = Enums<"risk_rating_level">;
export type RiskLikelihood = Enums<"risk_likelihood">;
export type RiskImpact = Enums<"risk_impact">;
export type RiskResponseType = Enums<"risk_response_type">;
export type AssertionType = Enums<"assertion_type">;
export type RiskNoteType = Enums<"risk_note_type">;

export type RiskCategoryView = {
  id: string;
  name: string;
  description: string | null;
  sortOrder: number;
};

export type RiskRegisterItemView = {
  id: string;
  riskType: RiskType;
  categoryId: string | null;
  categoryName: string | null;
  title: string;
  description: string | null;
  auditArea: string | null;
  accountName: string | null;
  linkedAssertion: AssertionType | null;
  likelihood: RiskLikelihood | null;
  impact: RiskImpact | null;
  inherentRating: RiskRatingLevel | null;
  controlRating: RiskRatingLevel | null;
  detectionRating: RiskRatingLevel | null;
  residualRating: RiskRatingLevel | null;
  isSignificant: boolean;
  ownerId: string | null;
  rationale: string | null;
  version: number;
};

export type RiskAssertionRatingView = {
  id: string;
  accountName: string;
  assertion: AssertionType;
  inherentRating: RiskRatingLevel | null;
  controlRating: RiskRatingLevel | null;
  compositeRating: RiskRatingLevel | null;
  isSignificant: boolean;
  rationale: string | null;
  version: number;
};

export type RiskResponseView = {
  id: string;
  riskItemId: string;
  riskItemTitle: string;
  responseType: RiskResponseType;
  description: string;
};

export type RiskProcedureLinkView = {
  id: string;
  riskItemId: string;
  riskItemTitle: string;
  auditProcedureId: string | null;
  procedureReference: string | null;
};

export type RiskNoteView = {
  id: string;
  noteType: RiskNoteType;
  body: string;
  riskItemId: string | null;
  createdAt: string;
};

export type RiskHeatmapCell = {
  accountName: string;
  assertion: AssertionType;
  rating: RiskRatingLevel | null;
  isSignificant: boolean;
};
