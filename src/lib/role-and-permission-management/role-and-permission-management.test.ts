import { describe, expect, it } from "vitest";
import { assertRoleAndPermissionBundle } from "./role-and-permission-management";

export const ROLEANDPERMISSIONMANAGEMENT_TEST_SUITE = "role-and-permission-management";

describe("role-and-permission-management", () => {
  it("requires organization context", () => {
    expect(() => assertRoleAndPermissionBundle({ organizationId: "" })).toThrowError(/Organization/i);
    expect(() => assertRoleAndPermissionBundle({ organizationId: "org-1" })).not.toThrow();
  });
});
