import { describe, expect, it } from "vitest";
import {
  validateCreateEngagementInput,
  validateUpdateEngagementInput,
} from "./validation";

describe("validateCreateEngagementInput", () => {
  it("accepts a valid engagement payload", () => {
    const result = validateCreateEngagementInput({
      name: "FY2026 Statutory Audit",
      companyId: "company-1",
      engagementType: "statutory_audit",
      reportingFramework: "IFRS",
      periodStart: "2026-01-01",
      periodEnd: "2026-12-31",
    });

    expect(result.name).toBe("FY2026 Statutory Audit");
    expect(result.slug).toBe("fy2026-statutory-audit");
    expect(result.companyId).toBe("company-1");
  });

  it("rejects invalid reporting period order", () => {
    expect(() =>
      validateCreateEngagementInput({
        name: "Invalid Period",
        companyId: "company-1",
        engagementType: "review",
        reportingFramework: "IFRS",
        periodStart: "2026-12-31",
        periodEnd: "2026-01-01",
      }),
    ).toThrow(/reporting period/i);
  });
});

describe("validateUpdateEngagementInput", () => {
  it("returns an empty patch for empty input", () => {
    expect(validateUpdateEngagementInput({})).toEqual({});
  });

  it("normalizes optional notes", () => {
    expect(
      validateUpdateEngagementInput({
        notes: "   Planning memo   ",
      }),
    ).toEqual({ notes: "Planning memo" });
  });
});
