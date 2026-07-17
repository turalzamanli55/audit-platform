"use server";

import { FINANCIAL_REPORTING_PERMISSIONS } from "@/constants/financial-reporting";
import { createFinancialReportingAction } from "@/lib/actions/financial-reporting/financial-reporting-action";
import {
  assertControlDeficiencyEvaluation,
  type ControlDeficiencyEvaluation,
} from "@/lib/control-deficiency-evaluation/control-deficiency-evaluation";
import { ValidationError } from "@/lib/errors";

export type EvaluateControlDeficiencyInput = ControlDeficiencyEvaluation & {
  engagementId: string;
};

export const evaluateControlDeficiencyAction = createFinancialReportingAction<
  EvaluateControlDeficiencyInput,
  { engagementId: string; severity: ControlDeficiencyEvaluation["severity"] }
>(
  { module: "financial-reporting.control-deficiency-evaluation.evaluate" },
  FINANCIAL_REPORTING_PERMISSIONS.CONTROL_DEFICIENCY,
  async (input) => {
    if (!input.engagementId) throw new ValidationError("Engagement is required");
    assertControlDeficiencyEvaluation(input);
    return { engagementId: input.engagementId, severity: input.severity };
  },
);
