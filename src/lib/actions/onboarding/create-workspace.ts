"use server";

import { headers } from "next/headers";
import { createServiceClient } from "@/lib/supabase/service";
import { createAuthenticatedAction } from "@/lib/actions/authenticated-action";
import { WorkspaceRepository } from "@/repositories/workspace/workspace-repository";
import { MembershipRepository } from "@/repositories/membership/membership-repository";
import { RoleRepository } from "@/repositories/role/role-repository";
import { PLATFORM_ROLE_SLUGS } from "@/types/auth";
import type { RepositoryContext } from "@/types/context";
import { setTenantCookies } from "@/lib/auth/tenant-cookies";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import { ValidationError } from "@/lib/errors";
import { toSlug } from "@/utils/auth-validation";

export type CreateWorkspaceInput = {
  organizationId: string;
  name: string;
  description?: string;
};

export type CreateWorkspaceResult = {
  workspaceId: string;
  slug: string;
};

function createServiceContext(userId: string, organizationId: string): RepositoryContext {
  return {
    userId,
    tenant: {
      organization: { organizationId, isResolved: true },
      workspace: { workspaceId: null, isResolved: false },
      company: { companyId: null, isResolved: false },
      permissions: { permissions: [], isResolved: false },
      roles: { roles: [], isResolved: false },
    },
  };
}

export const createWorkspaceAction = createAuthenticatedAction<
  CreateWorkspaceInput,
  CreateWorkspaceResult
>({ module: "onboarding.create-workspace" }, async (input, context) => {
  const name = input.name.trim();
  if (!name) {
    throw new ValidationError("Workspace name is required");
  }
  if (!input.organizationId) {
    throw new ValidationError("Organization is required");
  }

  const slug = toSlug(name);
  if (!slug) {
    throw new ValidationError("Workspace name must contain valid characters");
  }

  const serviceClient = createServiceClient();
  const repositoryContext = createServiceContext(context.userId, input.organizationId);
  const workspaceRepository = new WorkspaceRepository(serviceClient, repositoryContext);
  const membershipRepository = new MembershipRepository(serviceClient, repositoryContext);
  const roleRepository = new RoleRepository(serviceClient, repositoryContext);

  const workspaceRole = await roleRepository.findBySlug(PLATFORM_ROLE_SLUGS.WORKSPACE_ADMIN);
  if (!workspaceRole) {
    throw new ValidationError("Workspace admin role is not configured");
  }

  const workspace = await workspaceRepository.create({
    organization_id: input.organizationId,
    name,
    slug,
    description: input.description?.trim() || null,
  });

  const membership = await membershipRepository.create({
    user_id: context.userId,
    organization_id: input.organizationId,
    workspace_id: workspace.id,
    company_id: null,
    role_id: workspaceRole.id,
    membership_scope: "workspace",
  });

  await setTenantCookies(input.organizationId, workspace.id);

  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.WORKSPACE_CREATED,
    resourceType: "workspace",
    resourceId: workspace.id,
    organizationId: input.organizationId,
    workspaceId: workspace.id,
    userId: context.userId,
    userAgent: requestHeaders.get("user-agent"),
    metadata: { slug: workspace.slug },
  });

  await emitAuditEvent({
    action: AUDIT_ACTIONS.MEMBERSHIP_CREATED,
    resourceType: "membership",
    resourceId: membership.id,
    organizationId: input.organizationId,
    workspaceId: workspace.id,
    userId: context.userId,
    userAgent: requestHeaders.get("user-agent"),
    metadata: { roleSlug: PLATFORM_ROLE_SLUGS.WORKSPACE_ADMIN },
  });

  return {
    workspaceId: workspace.id,
    slug: workspace.slug,
  };
});
