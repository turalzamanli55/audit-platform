import { describe, expect, it } from "vitest";
import { assertOrganizationManagementProfile } from "./organization-management";

export const ORGANIZATIONMANAGEMENT_TEST_SUITE = "organization-management";

describe("organization-management", () => {
  it("requires organization context", () => {
    expect(() => assertOrganizationManagementProfile({ organizationId: "" })).toThrowError(/Organization/i);
    expect(() => assertOrganizationManagementProfile({ organizationId: "org-1" })).not.toThrow();
  });
});
