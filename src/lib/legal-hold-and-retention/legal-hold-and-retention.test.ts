import { describe, expect, it } from "vitest";
import { assertLegalHoldPolicy } from "./legal-hold-and-retention";

export const LEGALHOLDANDRETENTION_TEST_SUITE = "legal-hold-and-retention";

describe("legal-hold-and-retention", () => {
  it("requires organization context", () => {
    expect(() => assertLegalHoldPolicy({ organizationId: "" })).toThrowError(/Organization/i);
    expect(() => assertLegalHoldPolicy({ organizationId: "org-1" })).not.toThrow();
  });
});
