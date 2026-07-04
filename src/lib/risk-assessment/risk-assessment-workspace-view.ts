import type {
  RiskAssertionRatingView,
  RiskCategoryView,
  RiskHeatmapCell,
  RiskNoteView,
  RiskProcedureLinkView,
  RiskRegisterItemView,
  RiskResponseView,
  RiskAssessmentStatus,
} from "@/types/risk-assessment";

export type RiskAssessmentWorkspaceView = {
  id: string;
  engagementId: string;
  engagementSlug: string;
  engagementName: string;
  companyName: string;
  auditPlanId: string;
  assessmentStatus: RiskAssessmentStatus;
  assessmentVersion: number;
  progressPct: number;
  categories: RiskCategoryView[];
  registerItems: RiskRegisterItemView[];
  assertionRatings: RiskAssertionRatingView[];
  responses: RiskResponseView[];
  procedureLinks: RiskProcedureLinkView[];
  notes: RiskNoteView[];
  reviewNotes: RiskNoteView[];
  internalNotes: RiskNoteView[];
  heatmap: RiskHeatmapCell[];
  significantRiskCount: number;
  pendingReviewCount: number;
  openItemsCount: number;
  status: string;
  version: number;
  isArchived: boolean;
  deletedAt: string | null;
  significantRisksAcknowledgedAt: string | null;
  submittedAt: string | null;
  approvedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type RiskAssessmentWorkspaceLoadResult =
  | {
      ok: true;
      riskAssessment: RiskAssessmentWorkspaceView | null;
      engagementSlug: string;
      planningApproved: boolean;
      materialityApproved: boolean;
      riskAssessmentApproved: boolean;
    }
  | { ok: false; reason: "unauthenticated" | "forbidden" | "no_workspace" | "not_found" | "error" };

export type RiskAssessmentWorkspaceSection =
  | "overview"
  | "inherent-risks"
  | "control-risks"
  | "detection-risks"
  | "fraud-risks"
  | "it-risks"
  | "compliance-risks"
  | "financial-statement-risks"
  | "assertion-risks"
  | "significant-risks"
  | "categories"
  | "scoring"
  | "heatmap"
  | "matrix"
  | "responses"
  | "procedures"
  | "owners"
  | "review-notes"
  | "comments"
  | "history"
  | "settings";
