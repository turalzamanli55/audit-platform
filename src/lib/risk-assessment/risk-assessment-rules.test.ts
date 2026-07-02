import { describe, expect, it } from "vitest";
import type { AuditPlan } from "@/repositories/planning/planning-repository";
import {
  assertAssessmentEditable,
  assertCanApprove,
  assertCanReturn,
  assertCanSubmit,
  assertFieldworkRiskGate,
  assertRiskAssessmentGate,
  assertSignificantRisksAcknowledged,
  assertSubmitPrerequisites,
  computeResidualRating,
  computeRiskAssessmentProgress,
  isPlanningApproved,
  isRiskAssessmentApproved,
  ratingToHeatmapColor,
} from "@/lib/risk-assessment/risk-assessment-rules";
import { ValidationError } from "@/lib/errors";

function approvedPlan(): AuditPlan {
  return { planning_status: "approved" } as AuditPlan;
}

describe("risk assessment rules", () => {
  it("marks planning approved when status is approved", () => {
    expect(isPlanningApproved(approvedPlan())).toBe(true);
  });

  it("marks planning not approved for in-progress status", () => {
    expect(isPlanningApproved({ planning_status: "in_progress" } as AuditPlan)).toBe(false);
  });

  it("accepts approved risk assessments", () => {
    expect(isRiskAssessmentApproved({ assessment_status: "approved" } as never)).toBe(true);
  });

  it("rejects non-approved risk assessments", () => {
    expect(isRiskAssessmentApproved({ assessment_status: "under_review" } as never)).toBe(false);
  });

  it("enforces planning gate for risk assessment", () => {
    expect(() => assertRiskAssessmentGate(approvedPlan())).not.toThrow();
    expect(() => assertRiskAssessmentGate(null)).toThrow(ValidationError);
  });

  it("enforces approved assessment gate for fieldwork", () => {
    expect(() => assertFieldworkRiskGate({ assessment_status: "approved" } as never)).not.toThrow();
    expect(() => assertFieldworkRiskGate(null)).toThrow(ValidationError);
  });

  it("blocks fieldwork gate when assessment is in review", () => {
    expect(() => assertFieldworkRiskGate({ assessment_status: "under_review" } as never)).toThrow(
      ValidationError,
    );
  });

  it("blocks editing for archived assessments", () => {
    expect(() =>
      assertAssessmentEditable({ assessment_status: "archived", deleted_at: null } as never),
    ).toThrow(ValidationError);
  });

  it("blocks editing for approved assessments", () => {
    expect(() =>
      assertAssessmentEditable({ assessment_status: "approved", deleted_at: null } as never),
    ).toThrow(ValidationError);
  });

  it("blocks editing for deleted assessments", () => {
    expect(() =>
      assertAssessmentEditable({
        assessment_status: "in_progress",
        deleted_at: "2026-07-01T00:00:00.000Z",
      } as never),
    ).toThrow(ValidationError);
  });

  it("allows editing while assessment is in progress", () => {
    expect(() =>
      assertAssessmentEditable({ assessment_status: "in_progress", deleted_at: null } as never),
    ).not.toThrow();
  });

  it("allows submit from not-started", () => {
    expect(() => assertCanSubmit({ assessment_status: "not_started" } as never)).not.toThrow();
  });

  it("allows submit from in-progress", () => {
    expect(() => assertCanSubmit({ assessment_status: "in_progress" } as never)).not.toThrow();
  });

  it("blocks submit from submitted", () => {
    expect(() => assertCanSubmit({ assessment_status: "submitted" } as never)).toThrow(ValidationError);
  });

  it("allows return from submitted", () => {
    expect(() => assertCanReturn({ assessment_status: "submitted" } as never)).not.toThrow();
  });

  it("allows return from under-review", () => {
    expect(() => assertCanReturn({ assessment_status: "under_review" } as never)).not.toThrow();
  });

  it("blocks return for in-progress", () => {
    expect(() => assertCanReturn({ assessment_status: "in_progress" } as never)).toThrow(ValidationError);
  });

  it("allows approve from submitted and under-review", () => {
    expect(() => assertCanApprove({ assessment_status: "submitted" } as never)).not.toThrow();
    expect(() => assertCanApprove({ assessment_status: "under_review" } as never)).not.toThrow();
  });

  it("blocks approve for not-started", () => {
    expect(() => assertCanApprove({ assessment_status: "not_started" } as never)).toThrow(ValidationError);
  });

  it("requires significant risk acknowledgment when significant items exist", () => {
    expect(() =>
      assertSignificantRisksAcknowledged(
        { significant_risks_acknowledged_at: null },
        [{ isSignificant: true }],
      ),
    ).toThrow(ValidationError);
  });

  it("allows approval when significant risks are acknowledged", () => {
    expect(() =>
      assertSignificantRisksAcknowledged(
        { significant_risks_acknowledged_at: "2026-07-01T00:00:00.000Z" },
        [{ isSignificant: true }],
      ),
    ).not.toThrow();
  });

  it("allows approval with no significant risks", () => {
    expect(() =>
      assertSignificantRisksAcknowledged(
        { significant_risks_acknowledged_at: null },
        [{ isSignificant: false }],
      ),
    ).not.toThrow();
  });

  it("requires fraud risk and procedure links before submit", () => {
    expect(() =>
      assertSubmitPrerequisites(
        [
          { id: "1", riskType: "fraud", isSignificant: true },
          { id: "2", riskType: "inherent", isSignificant: false },
        ],
        [{ riskItemId: "1" }],
      ),
    ).not.toThrow();

    expect(() =>
      assertSubmitPrerequisites([{ id: "1", riskType: "inherent", isSignificant: false }], []),
    ).toThrow(ValidationError);

    expect(() =>
      assertSubmitPrerequisites([{ id: "1", riskType: "fraud", isSignificant: true }], []),
    ).toThrow(ValidationError);
  });

  it("computes progress from weighted sections", () => {
    expect(
      computeRiskAssessmentProgress({
        totalRiskItems: 4,
        ratedRiskItems: 3,
        totalAssertionRatings: 2,
        completedAssertionRatings: 1,
        totalResponses: 4,
        completedResponses: 2,
        hasSignificantRisks: true,
        significantRisksAcknowledged: false,
      }),
    ).toBe(44);
  });

  it("computes progress with full completion", () => {
    expect(
      computeRiskAssessmentProgress({
        totalRiskItems: 2,
        ratedRiskItems: 2,
        totalAssertionRatings: 3,
        completedAssertionRatings: 3,
        totalResponses: 1,
        completedResponses: 1,
        hasSignificantRisks: true,
        significantRisksAcknowledged: true,
      }),
    ).toBe(100);
  });

  it("returns null residual rating when inherent rating is missing", () => {
    expect(computeResidualRating(null, "high", "moderate")).toBeNull();
  });

  it("computes residual rating from available ratings", () => {
    expect(computeResidualRating("high", "moderate", "low")).toBe("moderate");
  });

  it("returns risk heatmap classes by rating", () => {
    expect(ratingToHeatmapColor("low")).toContain("emerald");
    expect(ratingToHeatmapColor("moderate")).toContain("amber");
    expect(ratingToHeatmapColor("high")).toContain("orange");
    expect(ratingToHeatmapColor("significant")).toContain("red");
    expect(ratingToHeatmapColor(null)).toContain("muted");
  });
});
