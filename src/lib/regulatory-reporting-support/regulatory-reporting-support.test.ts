import { describe, expect, it } from "vitest";
import { isFinancialReportingPipelineComplete } from "@/lib/financial-reporting/financial-reporting-pipeline";

describe("regulatory-reporting-support", () => {
  it("marks regulatory reporting complete only when the full pipeline is done", () => {
    expect(
      isFinancialReportingPipelineComplete({
        engagementId: "eng-1",
        trialBalanceApproved: true,
        fsMappingPublished: true,
        fsRenderingPublished: true,
        ifrsNotesApproved: true,
        opinionApproved: true,
        reportingApproved: true,
      }),
    ).toBe(true);
  });
});
