import { describe, expect, it } from "vitest";
import { currentFinancialReportingStage } from "@/lib/financial-reporting/financial-reporting-pipeline";

describe("management-reporting", () => {
  it("places management reporting after IFRS notes and opinion readiness", () => {
    expect(
      currentFinancialReportingStage({
        engagementId: "eng-1",
        trialBalanceApproved: true,
        fsMappingPublished: true,
        fsRenderingPublished: true,
        ifrsNotesApproved: true,
        opinionApproved: true,
        reportingApproved: false,
      }),
    ).toBe("reporting");
  });
});
