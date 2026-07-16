import { describe, expect, it } from "vitest";
import { assertFindingRecord } from "./finding-and-recommendation-tracking";

describe("finding-and-recommendation-tracking", () => {
  it("requires recommendation and owner for severe findings", () => {
    expect(() =>
      assertFindingRecord({
        title: "Control gap",
        severity: "medium",
        recommendation: "Remediate access reviews",
      }),
    ).not.toThrow();
    expect(() =>
      assertFindingRecord({
        title: "Critical gap",
        severity: "critical",
        recommendation: "Immediate remediation",
      }),
    ).toThrowError(/owner/i);
    expect(() =>
      assertFindingRecord({
        title: "Critical gap",
        severity: "critical",
        recommendation: "Immediate remediation",
        ownerId: "user-1",
      }),
    ).not.toThrow();
  });
});
