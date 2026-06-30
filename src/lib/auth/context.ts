import "server-only";

import type {
  OrganizationContext,
  WorkspaceContext,
  CompanyContext,
  PermissionContext,
  RoleContext,
  TenantContext,
} from "@/types/context";
import { resolveAuthenticatedUser } from "./resolve-user";

export async function getOrganizationContext(): Promise<OrganizationContext> {
  const user = await resolveAuthenticatedUser();

  if (!user?.organizationId) {
    return {
      organizationId: null,
      isResolved: false,
    };
  }

  return {
    organizationId: user.organizationId,
    isResolved: true,
  };
}

export async function getWorkspaceContext(): Promise<WorkspaceContext> {
  const user = await resolveAuthenticatedUser();

  if (!user?.workspaceId) {
    return {
      workspaceId: null,
      isResolved: false,
    };
  }

  return {
    workspaceId: user.workspaceId,
    isResolved: true,
  };
}

export async function getCompanyContext(): Promise<CompanyContext> {
  return {
    companyId: null,
    isResolved: false,
  };
}

export async function getPermissionContext(): Promise<PermissionContext> {
  const user = await resolveAuthenticatedUser();

  return {
    permissions: user?.permissions ?? [],
    isResolved: Boolean(user),
  };
}

export async function getRoleContext(): Promise<RoleContext> {
  const user = await resolveAuthenticatedUser();

  return {
    roles: user?.roles ?? [],
    isResolved: Boolean(user),
  };
}

export async function getTenantContext(): Promise<TenantContext> {
  const [organization, workspace, company, permissions, roles] = await Promise.all([
    getOrganizationContext(),
    getWorkspaceContext(),
    getCompanyContext(),
    getPermissionContext(),
    getRoleContext(),
  ]);

  return {
    organization,
    workspace,
    company,
    permissions,
    roles,
  };
}
