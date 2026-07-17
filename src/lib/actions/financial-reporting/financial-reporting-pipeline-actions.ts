"use server";

import { FINANCIAL_REPORTING_PERMISSIONS } from "@/constants/financial-reporting";
import { createFinancialReportingAction } from "@/lib/actions/financial-reporting/financial-reporting-action";
import {
  assertFinancialReportingStageReady,
  currentFinancialReportingStage,
  type FinancialReportingPipelineState,
} from "@/lib/financial-reporting/financial-reporting-pipeline";
import { ValidationError } from "@/lib/errors";

export type AdvanceFinancialReportingPipelineInput = FinancialReportingPipelineState & {
  targetStage:
    | "trial_balance"
    | "fs_mapping"
    | "fs_rendering"
    | "ifrs_notes"
    | "audit_opinion"
    | "reporting";
};

export type AdvanceFinancialReportingPipelineResult = {
  engagementId: string;
  currentStage: ReturnType<typeof currentFinancialReportingStage>;
  targetStage: AdvanceFinancialReportingPipelineInput["targetStage"];
};

export const advanceFinancialReportingPipelineAction = createFinancialReportingAction<
  AdvanceFinancialReportingPipelineInput,
  AdvanceFinancialReportingPipelineResult
>(
  { module: "financial-reporting.pipeline.advance" },
  FINANCIAL_REPORTING_PERMISSIONS.PIPELINE_ADVANCE,
  async (input) => {
    if (!input.engagementId) throw new ValidationError("Engagement is required");
    assertFinancialReportingStageReady(input, input.targetStage);
    return {
      engagementId: input.engagementId,
      currentStage: currentFinancialReportingStage(input),
      targetStage: input.targetStage,
    };
  },
);
