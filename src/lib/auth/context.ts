import "server-only";

import type {
  OrganizationContext,
  WorkspaceContext,
  CompanyContext,
  PermissionContext,
  RoleContext,
  TenantContext,
} from "@/types/context";
import { createServerClient } from "@/lib/supabase/server";
import { CompanyRepository } from "@/repositories/company/company-repository";
import type { RepositoryContext } from "@/types/context";
import { readCompanySlugCookie } from "./tenant-cookies";
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

function createRepositoryContext(
  userId: string,
  organizationId: string,
  workspaceId: string,
): RepositoryContext {
  return {
    userId,
    tenant: {
      organization: { organizationId, isResolved: true },
      workspace: { workspaceId, isResolved: true },
      company: { companyId: null, isResolved: false },
      permissions: { permissions: [], isResolved: false },
      roles: { roles: [], isResolved: false },
    },
  };
}

export async function getCompanyContext(): Promise<CompanyContext> {
  const [workspace, slug, user] = await Promise.all([
    getWorkspaceContext(),
    readCompanySlugCookie(),
    resolveAuthenticatedUser(),
  ]);

  if (!workspace.isResolved || !workspace.workspaceId || !slug || !user?.organizationId) {
    return {
      companyId: null,
      isResolved: false,
    };
  }

  const supabase = await createServerClient();
  const repository = new CompanyRepository(
    supabase,
    createRepositoryContext(user.id, user.organizationId, workspace.workspaceId),
  );

  const company = await repository.findBySlug(workspace.workspaceId, slug);
  if (!company) {
    return {
      companyId: null,
      isResolved: false,
    };
  }

  return {
    companyId: company.id,
    isResolved: true,
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
