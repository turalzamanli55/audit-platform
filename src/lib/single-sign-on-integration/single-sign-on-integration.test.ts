import { describe, expect, it } from "vitest";
import { assertSingleSignOnProvider } from "./single-sign-on-integration";

export const SINGLESIGNONINTEGRATION_TEST_SUITE = "single-sign-on-integration";

describe("single-sign-on-integration", () => {
  it("requires organization context", () => {
    expect(() => assertSingleSignOnProvider({ organizationId: "" })).toThrowError(/Organization/i);
    expect(() => assertSingleSignOnProvider({ organizationId: "org-1" })).not.toThrow();
  });
});
