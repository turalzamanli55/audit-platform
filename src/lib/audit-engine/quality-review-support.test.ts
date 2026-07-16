import { describe, expect, it } from "vitest";
import {
  assertQualityReviewCleared,
  isQualityReviewCleared,
  requiresEqcr,
} from "./quality-review-support";

describe("quality-review-support", () => {
  it("gates EQCR for elevated/listed engagements", () => {
    expect(requiresEqcr("listed")).toBe(true);
    expect(requiresEqcr("normal")).toBe(false);
    expect(
      isQualityReviewCleared({
        engagementRisk: "elevated",
        eqcrRequired: true,
        eqcrCompleted: true,
        outstandingNotes: 0,
      }),
    ).toBe(true);
    expect(() =>
      assertQualityReviewCleared({
        engagementRisk: "elevated",
        eqcrRequired: true,
        eqcrCompleted: false,
        outstandingNotes: 0,
      }),
    ).toThrowError(/EQCR/i);
  });
});
