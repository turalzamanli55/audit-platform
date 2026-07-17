import { describe, expect, it } from "vitest";
import {
  assertFinancialReportingStageReady,
  currentFinancialReportingStage,
  isFinancialReportingPipelineComplete,
  type FinancialReportingPipelineState,
} from "./financial-reporting-pipeline";

const complete: FinancialReportingPipelineState = {
  engagementId: "eng-1",
  trialBalanceApproved: true,
  fsMappingPublished: true,
  fsRenderingPublished: true,
  ifrsNotesApproved: true,
  opinionApproved: true,
  reportingApproved: true,
};

describe("financial-reporting-pipeline", () => {
  it("advances Trial Balance → Mapping → Rendering → Notes → Opinion → Reporting", () => {
    expect(
      currentFinancialReportingStage({
        ...complete,
        trialBalanceApproved: false,
        fsMappingPublished: false,
        fsRenderingPublished: false,
        ifrsNotesApproved: false,
        opinionApproved: false,
        reportingApproved: false,
      }),
    ).toBe("trial_balance");
    expect(
      currentFinancialReportingStage({
        ...complete,
        fsMappingPublished: false,
        fsRenderingPublished: false,
        ifrsNotesApproved: false,
        opinionApproved: false,
        reportingApproved: false,
      }),
    ).toBe("fs_mapping");
    expect(
      currentFinancialReportingStage({
        ...complete,
        fsRenderingPublished: false,
        ifrsNotesApproved: false,
        opinionApproved: false,
        reportingApproved: false,
      }),
    ).toBe("fs_rendering");
    expect(isFinancialReportingPipelineComplete(complete)).toBe(true);
  });

  it("blocks later stages until priors are complete", () => {
    expect(() =>
      assertFinancialReportingStageReady(
        {
          ...complete,
          trialBalanceApproved: false,
          fsMappingPublished: false,
        },
        "fs_mapping",
      ),
    ).toThrowError(/blocked/i);
    expect(() => assertFinancialReportingStageReady(complete, "reporting")).not.toThrow();
  });
});
