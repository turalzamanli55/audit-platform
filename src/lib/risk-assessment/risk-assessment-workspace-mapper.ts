import type { Engagement } from "@/repositories/engagement/engagement-repository";
import { RISK_RATING_LEVELS } from "@/constants/risk-assessment";
import {
  computeOpenRiskItems,
  computeResidualRating,
  computeRiskAssessmentProgress,
} from "@/lib/risk-assessment/risk-assessment-rules";
import type { RiskAssessmentWorkspaceView } from "@/lib/risk-assessment/risk-assessment-workspace-view";
import type {
  AssertionType,
  RiskAssertionRatingView,
  RiskCategoryView,
  RiskHeatmapCell,
  RiskNoteType,
  RiskNoteView,
  RiskProcedureLinkView,
  RiskRegisterItemView,
  RiskResponseType,
  RiskResponseView,
  RiskAssessmentStatus,
} from "@/types/risk-assessment";

type RiskRatingLevel = (typeof RISK_RATING_LEVELS)[number];

export type RiskAssessmentRecord = {
  id: string;
  engagement_id: string;
  audit_plan_id: string;
  assessment_status: string;
  assessment_version: number;
  significant_risks_acknowledged_at: string | null;
  submitted_at: string | null;
  approved_at: string | null;
  status: string;
  version: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
};

export type RiskCategoryRecord = {
  id: string;
  name: string;
  description: string | null;
  sort_order: number;
};

export type RiskRegisterItemRecord = {
  id: string;
  risk_type: RiskRegisterItemView["riskType"];
  risk_category_id: string | null;
  title: string;
  description: string | null;
  audit_area: string | null;
  account_name: string | null;
  linked_assertion: AssertionType | null;
  likelihood: RiskRegisterItemView["likelihood"];
  impact: RiskRegisterItemView["impact"];
  inherent_rating: RiskRatingLevel | null;
  control_rating: RiskRatingLevel | null;
  detection_rating: RiskRatingLevel | null;
  residual_rating: RiskRatingLevel | null;
  is_significant: boolean;
  owner_id: string | null;
  rationale: string | null;
  version: number;
};

export type RiskAssertionRatingRecord = {
  id: string;
  account_name: string;
  assertion: AssertionType;
  inherent_rating: RiskRatingLevel | null;
  control_rating: RiskRatingLevel | null;
  composite_rating: RiskRatingLevel | null;
  is_significant: boolean;
  rationale: string | null;
  version: number;
};

export type RiskResponseRecord = {
  id: string;
  risk_register_item_id: string;
  response_type: RiskResponseType;
  description: string;
};

export type RiskProcedureLinkRecord = {
  id: string;
  risk_register_item_id: string;
  audit_procedure_id: string | null;
  procedure_reference: string | null;
};

export type RiskNoteRecord = {
  id: string;
  note_type: RiskNoteType;
  body: string;
  risk_register_item_id: string | null;
  created_at: string;
};

export function toRiskAssessmentWorkspaceView(
  assessment: RiskAssessmentRecord,
  engagement: Engagement,
  companyName: string,
  categories: RiskCategoryRecord[],
  registerItems: RiskRegisterItemRecord[],
  assertionRatings: RiskAssertionRatingRecord[],
  responses: RiskResponseRecord[],
  procedureLinks: RiskProcedureLinkRecord[],
  notes: RiskNoteRecord[],
): RiskAssessmentWorkspaceView {
  const categoryMap = new Map(categories.map((category) => [category.id, category.name]));
  const riskTitleMap = new Map(registerItems.map((item) => [item.id, item.title]));
  const responseRiskIds = new Set(responses.map((response) => response.risk_register_item_id));

  const categoryViews: RiskCategoryView[] = categories.map((category) => ({
    id: category.id,
    name: category.name,
    description: category.description,
    sortOrder: category.sort_order,
  }));

  const registerItemViews: RiskRegisterItemView[] = registerItems.map((item) => {
    const inherentRating = (item.inherent_rating ?? null) as RiskRatingLevel | null;
    const controlRating = (item.control_rating ?? null) as RiskRatingLevel | null;
    const detectionRating = (item.detection_rating ?? null) as RiskRatingLevel | null;
    const storedResidualRating = (item.residual_rating ?? null) as RiskRatingLevel | null;

    const residualRating =
      storedResidualRating ?? computeResidualRating(inherentRating, controlRating, detectionRating);

    return {
      id: item.id,
      riskType: item.risk_type,
      categoryId: item.risk_category_id,
      categoryName: item.risk_category_id ? categoryMap.get(item.risk_category_id) ?? null : null,
      title: item.title,
      description: item.description,
      auditArea: item.audit_area,
      accountName: item.account_name,
      linkedAssertion: item.linked_assertion,
      likelihood: item.likelihood,
      impact: item.impact,
      inherentRating: inherentRating as RiskRegisterItemView["inherentRating"],
      controlRating: controlRating as RiskRegisterItemView["controlRating"],
      detectionRating: detectionRating as RiskRegisterItemView["detectionRating"],
      residualRating,
      isSignificant: item.is_significant,
      ownerId: item.owner_id,
      rationale: item.rationale,
      version: item.version,
    };
  });

  const assertionRatingViews: RiskAssertionRatingView[] = assertionRatings.map((rating) => {
    const inherentRating = (rating.inherent_rating ?? null) as RiskRatingLevel | null;
    const controlRating = (rating.control_rating ?? null) as RiskRatingLevel | null;
    const compositeRating = (rating.composite_rating ?? null) as RiskRatingLevel | null;

    return {
      id: rating.id,
      accountName: rating.account_name,
      assertion: rating.assertion,
      inherentRating: inherentRating as RiskAssertionRatingView["inherentRating"],
      controlRating: controlRating as RiskAssertionRatingView["controlRating"],
      compositeRating:
        compositeRating ?? computeResidualRating(inherentRating, controlRating, controlRating),
      isSignificant: rating.is_significant,
      rationale: rating.rationale,
      version: rating.version,
    };
  });

  const responseViews: RiskResponseView[] = responses.map((response) => ({
    id: response.id,
    riskItemId: response.risk_register_item_id,
    riskItemTitle: riskTitleMap.get(response.risk_register_item_id) ?? "—",
    responseType: response.response_type,
    description: response.description,
  }));

  const procedureLinkViews: RiskProcedureLinkView[] = procedureLinks.map((link) => ({
    id: link.id,
    riskItemId: link.risk_register_item_id,
    riskItemTitle: riskTitleMap.get(link.risk_register_item_id) ?? "—",
    auditProcedureId: link.audit_procedure_id,
    procedureReference: link.procedure_reference,
  }));

  const noteViews: RiskNoteView[] = notes.map((note) => ({
    id: note.id,
    noteType: note.note_type,
    body: note.body,
    riskItemId: note.risk_register_item_id,
    createdAt: note.created_at,
  }));

  const heatmap: RiskHeatmapCell[] = assertionRatingViews.map((rating) => ({
    accountName: rating.accountName,
    assertion: rating.assertion,
    rating: rating.compositeRating,
    isSignificant: rating.isSignificant,
  }));

  const significantRiskCount = registerItemViews.filter((item) => item.isSignificant).length;
  const openItemsCount = computeOpenRiskItems(
    registerItemViews,
    procedureLinkViews.map((link) => ({ riskItemId: link.riskItemId })),
    responseRiskIds,
  );
  const pendingReviewCount = ["submitted", "under_review"].includes(assessment.assessment_status) ? 1 : 0;

  const progressPct = computeRiskAssessmentProgress({
    totalRiskItems: registerItemViews.length,
    ratedRiskItems: registerItemViews.filter((item) => item.inherentRating || item.residualRating).length,
    totalAssertionRatings: assertionRatingViews.length,
    completedAssertionRatings: assertionRatingViews.filter((item) => item.compositeRating).length,
    totalResponses: registerItemViews.length,
    completedResponses: responseViews.length,
    hasSignificantRisks: significantRiskCount > 0,
    significantRisksAcknowledged: Boolean(assessment.significant_risks_acknowledged_at),
  });

  return {
    id: assessment.id,
    engagementId: assessment.engagement_id,
    engagementSlug: engagement.slug,
    engagementName: engagement.name,
    companyName,
    auditPlanId: assessment.audit_plan_id,
    assessmentStatus: assessment.assessment_status as RiskAssessmentStatus,
    assessmentVersion: assessment.assessment_version,
    progressPct,
    categories: categoryViews,
    registerItems: registerItemViews,
    assertionRatings: assertionRatingViews,
    responses: responseViews,
    procedureLinks: procedureLinkViews,
    notes: noteViews,
    reviewNotes: noteViews.filter((note) => note.noteType === "review"),
    internalNotes: noteViews.filter((note) => note.noteType === "internal"),
    heatmap,
    significantRiskCount,
    pendingReviewCount,
    openItemsCount,
    status: assessment.status,
    version: assessment.version,
    isArchived: Boolean(assessment.deleted_at) || assessment.status === "archived",
    deletedAt: assessment.deleted_at,
    significantRisksAcknowledgedAt: assessment.significant_risks_acknowledged_at,
    submittedAt: assessment.submitted_at,
    approvedAt: assessment.approved_at,
    createdAt: assessment.created_at,
    updatedAt: assessment.updated_at,
  };
}
