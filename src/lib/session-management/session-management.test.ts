import { describe, expect, it } from "vitest";
import { assertSessionManagementPolicy } from "./session-management";

export const SESSIONMANAGEMENT_TEST_SUITE = "session-management";

describe("session-management", () => {
  it("requires organization context", () => {
    expect(() => assertSessionManagementPolicy({ organizationId: "" })).toThrowError(/Organization/i);
    expect(() => assertSessionManagementPolicy({ organizationId: "org-1" })).not.toThrow();
  });
});
