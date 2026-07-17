import { describe, expect, it } from "vitest";
import { assertWorkspaceManagementSettings } from "./workspace-management";

export const WORKSPACEMANAGEMENT_TEST_SUITE = "workspace-management";

describe("workspace-management", () => {
  it("requires organization context", () => {
    expect(() => assertWorkspaceManagementSettings({ organizationId: "" })).toThrowError(/Organization/i);
    expect(() => assertWorkspaceManagementSettings({ organizationId: "org-1" })).not.toThrow();
  });
});
