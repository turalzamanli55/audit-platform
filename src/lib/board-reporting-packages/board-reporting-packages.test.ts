import { describe, expect, it } from "vitest";
import { assertFinancialReportingStageReady } from "@/lib/financial-reporting/financial-reporting-pipeline";

describe("board-reporting-packages", () => {
  it("requires opinion approval before board reporting packages", () => {
    expect(() =>
      assertFinancialReportingStageReady(
        {
          engagementId: "eng-1",
          trialBalanceApproved: true,
          fsMappingPublished: true,
          fsRenderingPublished: true,
          ifrsNotesApproved: true,
          opinionApproved: false,
          reportingApproved: false,
        },
        "reporting",
      ),
    ).toThrowError(/blocked/i);
  });
});
