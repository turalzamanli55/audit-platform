import { describe, expect, it } from "vitest";
import { assertRoleBasedAccessAssignment } from "./role-based-access-control";

export const ROLEBASEDACCESSCONTROL_TEST_SUITE = "role-based-access-control";

describe("role-based-access-control", () => {
  it("requires organization context", () => {
    expect(() => assertRoleBasedAccessAssignment({ organizationId: "" })).toThrowError(/Organization/i);
    expect(() => assertRoleBasedAccessAssignment({ organizationId: "org-1" })).not.toThrow();
  });
});
