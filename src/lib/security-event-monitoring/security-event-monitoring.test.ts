import { describe, expect, it } from "vitest";
import { assertSecurityEvent } from "./security-event-monitoring";

export const SECURITYEVENTMONITORING_TEST_SUITE = "security-event-monitoring";

describe("security-event-monitoring", () => {
  it("requires organization context", () => {
    expect(() => assertSecurityEvent({ organizationId: "" })).toThrowError(/Organization/i);
    expect(() => assertSecurityEvent({ organizationId: "org-1" })).not.toThrow();
  });
});
