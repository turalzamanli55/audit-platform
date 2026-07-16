"use server";

import { headers } from "next/headers";
import { getCurrentUser, getWorkspaceContext } from "@/lib/auth/server";
import { createAuthenticatedAction } from "@/lib/actions/authenticated-action";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import {
  buildMultiTenantIsolationVerdict,
  type MultiTenantIsolationVerdict,
} from "@/lib/security/multi-tenant-isolation";
import { createServerClient } from "@/lib/supabase/server";
import { WorkspaceRepository } from "@/repositories/workspace/workspace-repository";
import type { RepositoryContext } from "@/types/context";
import { AuthenticationError, AuthorizationError } from "@/lib/errors";

function createRepositoryContext(userId: string, organizationId: string | null): RepositoryContext {
  return {
    userId,
    tenant: {
      organization: { organizationId, isResolved: Boolean(organizationId) },
      workspace: { workspaceId: null, isResolved: false },
      company: { companyId: null, isResolved: false },
      permissions: { permissions: [], isResolved: false },
      roles: { roles: [], isResolved: false },
    },
  };
}

async function resolveIsolationVerdict(userId: string): Promise<MultiTenantIsolationVerdict> {
  const user = await getCurrentUser();
  if (!user) {
    throw new AuthenticationError();
  }

  const workspaceContext = await getWorkspaceContext();
  const contextWorkspaceId = workspaceContext.isResolved ? workspaceContext.workspaceId : null;

  let workspaceOrganizationId: string | null = null;
  let workspaceExists = false;

  if (contextWorkspaceId) {
    const supabase = await createServerClient();
    const repository = new WorkspaceRepository(
      supabase,
      createRepositoryContext(userId, user.organizationId ?? null),
    );
    // RLS-scoped read: a workspace outside the caller's tenant resolves to null.
    const workspace = await repository.findById(contextWorkspaceId);
    workspaceExists = Boolean(workspace);
    workspaceOrganizationId = workspace?.organization_id ?? null;
  }

  return buildMultiTenantIsolationVerdict({
    userId,
    userOrganizationId: user.organizationId ?? null,
    userWorkspaceId: user.workspaceId ?? null,
    contextWorkspaceId,
    workspaceOrganizationId,
    workspaceExists,
  });
}

/**
 * Verifies the caller's tenant isolation boundary: organization binding,
 * workspace resolution, workspace ownership, and session consistency
 * (PROJECT_BIBLE §13.7 Security — multi-tenant isolation).
 */
export const verifyMultiTenantIsolationAction = createAuthenticatedAction<
  Record<string, never> | undefined,
  MultiTenantIsolationVerdict
>({ module: "tenant.multi-tenant-isolation.verify" }, async (_input, context) => {
  const verdict = await resolveIsolationVerdict(context.userId);

  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.TENANT_ISOLATION_VERIFIED,
    resourceType: "workspace",
    resourceId: verdict.workspaceId,
    organizationId: verdict.organizationId,
    workspaceId: verdict.workspaceId,
    userId: context.userId,
    userAgent: requestHeaders.get("user-agent"),
    metadata: {
      isolated: verdict.isolated,
      violations: verdict.violations.map((violation) => violation.code),
    },
  });

  return verdict;
});

/**
 * Hard tenant-isolation gate for sensitive flows: throws when any
 * isolation violation is present instead of returning a report.
 */
export const enforceMultiTenantIsolationAction = createAuthenticatedAction<
  Record<string, never> | undefined,
  { workspaceId: string; organizationId: string }
>({ module: "tenant.multi-tenant-isolation.enforce" }, async (_input, context) => {
  const verdict = await resolveIsolationVerdict(context.userId);

  if (!verdict.isolated || !verdict.workspaceId || !verdict.organizationId) {
    const detail = verdict.violations.map((violation) => violation.message).join("; ");
    throw new AuthorizationError(
      detail.length > 0 ? `Tenant isolation violation: ${detail}` : "Tenant isolation violation",
    );
  }

  return {
    workspaceId: verdict.workspaceId,
    organizationId: verdict.organizationId,
  };
});
