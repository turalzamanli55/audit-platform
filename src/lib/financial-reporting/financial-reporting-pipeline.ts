import { ValidationError } from "@/lib/errors";

/**
 * Financial Reporting pipeline orchestration (PROJECT_BIBLE).
 * Trial Balance → FS Mapping → FS Rendering → IFRS Notes → Opinion → Reporting
 * Does not generate PDFs, publications, or AI explanations.
 */

export const FINANCIAL_REPORTING_PIPELINE_STAGES = [
  "trial_balance",
  "fs_mapping",
  "fs_rendering",
  "ifrs_notes",
  "audit_opinion",
  "reporting",
] as const;

export type FinancialReportingPipelineStage =
  (typeof FINANCIAL_REPORTING_PIPELINE_STAGES)[number];

export type FinancialReportingPipelineState = {
  engagementId: string;
  trialBalanceApproved: boolean;
  fsMappingPublished: boolean;
  fsRenderingPublished: boolean;
  ifrsNotesApproved: boolean;
  opinionApproved: boolean;
  reportingApproved: boolean;
};

export function currentFinancialReportingStage(
  state: FinancialReportingPipelineState,
): FinancialReportingPipelineStage | "complete" {
  if (!state.trialBalanceApproved) return "trial_balance";
  if (!state.fsMappingPublished) return "fs_mapping";
  if (!state.fsRenderingPublished) return "fs_rendering";
  if (!state.ifrsNotesApproved) return "ifrs_notes";
  if (!state.opinionApproved) return "audit_opinion";
  if (!state.reportingApproved) return "reporting";
  return "complete";
}

export function assertFinancialReportingStageReady(
  state: FinancialReportingPipelineState,
  stage: FinancialReportingPipelineStage,
): void {
  if (!state.engagementId.trim()) {
    throw new ValidationError("Engagement is required for the financial reporting pipeline");
  }

  const prerequisites: Record<FinancialReportingPipelineStage, () => boolean> = {
    trial_balance: () => true,
    fs_mapping: () => state.trialBalanceApproved,
    fs_rendering: () => state.trialBalanceApproved && state.fsMappingPublished,
    ifrs_notes: () =>
      state.trialBalanceApproved && state.fsMappingPublished && state.fsRenderingPublished,
    audit_opinion: () =>
      state.trialBalanceApproved &&
      state.fsMappingPublished &&
      state.fsRenderingPublished &&
      state.ifrsNotesApproved,
    reporting: () =>
      state.trialBalanceApproved &&
      state.fsMappingPublished &&
      state.fsRenderingPublished &&
      state.ifrsNotesApproved &&
      state.opinionApproved,
  };

  if (!prerequisites[stage]()) {
    throw new ValidationError(
      `Financial reporting stage "${stage}" is blocked — complete prior pipeline stages first`,
    );
  }
}

export function isFinancialReportingPipelineComplete(
  state: FinancialReportingPipelineState,
): boolean {
  return currentFinancialReportingStage(state) === "complete";
}
