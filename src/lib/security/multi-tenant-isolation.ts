/**
 * Multi-tenant isolation verification (PROJECT_BIBLE §13.7 Security).
 * Pure verdict logic — the server action supplies resolved tenant facts.
 */

export type MultiTenantIsolationFacts = {
  userId: string;
  userOrganizationId: string | null;
  userWorkspaceId: string | null;
  contextWorkspaceId: string | null;
  workspaceOrganizationId: string | null;
  workspaceExists: boolean;
};

export type MultiTenantIsolationViolation = {
  code:
    | "missing_organization_context"
    | "missing_workspace_context"
    | "workspace_not_found"
    | "workspace_outside_organization"
    | "workspace_context_mismatch";
  message: string;
};

export type MultiTenantIsolationVerdict = {
  isolated: boolean;
  userId: string;
  organizationId: string | null;
  workspaceId: string | null;
  violations: MultiTenantIsolationViolation[];
  checks: {
    organizationBound: boolean;
    workspaceResolved: boolean;
    workspaceBelongsToOrganization: boolean;
    sessionWorkspaceConsistent: boolean;
  };
};

export function buildMultiTenantIsolationVerdict(
  facts: MultiTenantIsolationFacts,
): MultiTenantIsolationVerdict {
  const violations: MultiTenantIsolationViolation[] = [];

  const organizationBound = Boolean(facts.userOrganizationId);
  if (!organizationBound) {
    violations.push({
      code: "missing_organization_context",
      message: "User session has no organization binding",
    });
  }

  const workspaceResolved = Boolean(facts.contextWorkspaceId);
  if (!workspaceResolved) {
    violations.push({
      code: "missing_workspace_context",
      message: "No workspace context is resolved for this session",
    });
  }

  if (workspaceResolved && !facts.workspaceExists) {
    violations.push({
      code: "workspace_not_found",
      message: "Resolved workspace does not exist or is not accessible under RLS",
    });
  }

  const workspaceBelongsToOrganization =
    facts.workspaceExists &&
    Boolean(facts.userOrganizationId) &&
    facts.workspaceOrganizationId === facts.userOrganizationId;
  if (workspaceResolved && facts.workspaceExists && !workspaceBelongsToOrganization) {
    violations.push({
      code: "workspace_outside_organization",
      message: "Workspace belongs to a different organization than the user session",
    });
  }

  const sessionWorkspaceConsistent =
    !facts.userWorkspaceId ||
    !facts.contextWorkspaceId ||
    facts.userWorkspaceId === facts.contextWorkspaceId;
  if (!sessionWorkspaceConsistent) {
    violations.push({
      code: "workspace_context_mismatch",
      message: "Session workspace binding does not match the resolved workspace context",
    });
  }

  return {
    isolated: violations.length === 0,
    userId: facts.userId,
    organizationId: facts.userOrganizationId,
    workspaceId: facts.contextWorkspaceId,
    violations,
    checks: {
      organizationBound,
      workspaceResolved,
      workspaceBelongsToOrganization,
      sessionWorkspaceConsistent,
    },
  };
}
