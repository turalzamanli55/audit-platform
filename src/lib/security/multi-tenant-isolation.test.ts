import { describe, expect, it } from "vitest";
import {
  buildMultiTenantIsolationVerdict,
  type MultiTenantIsolationFacts,
} from "./multi-tenant-isolation";

const isolatedFacts: MultiTenantIsolationFacts = {
  userId: "user-1",
  userOrganizationId: "org-1",
  userWorkspaceId: "ws-1",
  contextWorkspaceId: "ws-1",
  workspaceOrganizationId: "org-1",
  workspaceExists: true,
};

describe("multi-tenant isolation verdict", () => {
  it("passes when all tenant boundaries align", () => {
    const verdict = buildMultiTenantIsolationVerdict(isolatedFacts);
    expect(verdict.isolated).toBe(true);
    expect(verdict.violations).toEqual([]);
    expect(verdict.checks.workspaceBelongsToOrganization).toBe(true);
  });

  it("flags a workspace owned by another organization", () => {
    const verdict = buildMultiTenantIsolationVerdict({
      ...isolatedFacts,
      workspaceOrganizationId: "org-2",
    });
    expect(verdict.isolated).toBe(false);
    expect(verdict.violations.map((v) => v.code)).toContain("workspace_outside_organization");
  });

  it("flags a session/workspace context mismatch", () => {
    const verdict = buildMultiTenantIsolationVerdict({
      ...isolatedFacts,
      userWorkspaceId: "ws-2",
    });
    expect(verdict.isolated).toBe(false);
    expect(verdict.violations.map((v) => v.code)).toContain("workspace_context_mismatch");
  });

  it("flags missing organization binding", () => {
    const verdict = buildMultiTenantIsolationVerdict({
      ...isolatedFacts,
      userOrganizationId: null,
    });
    expect(verdict.isolated).toBe(false);
    expect(verdict.checks.organizationBound).toBe(false);
  });

  it("flags an unresolvable workspace (RLS denial)", () => {
    const verdict = buildMultiTenantIsolationVerdict({
      ...isolatedFacts,
      workspaceExists: false,
      workspaceOrganizationId: null,
    });
    expect(verdict.isolated).toBe(false);
    expect(verdict.violations.map((v) => v.code)).toContain("workspace_not_found");
  });
});
