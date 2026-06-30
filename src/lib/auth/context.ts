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
import { getCurrentUser } from "./user";

async function readAppMetadataString(key: string): Promise<string | null> {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const value = user.app_metadata?.[key];
  return typeof value === "string" && value.length > 0 ? value : null;
}

export async function getOrganizationContext(): Promise<OrganizationContext> {
  const user = await getCurrentUser();

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
  const workspaceId = await readAppMetadataString("workspace_id");

  return {
    workspaceId,
    isResolved: workspaceId !== null,
  };
}

export async function getCompanyContext(): Promise<CompanyContext> {
  const companyId = await readAppMetadataString("company_id");

  return {
    companyId,
    isResolved: companyId !== null,
  };
}

export async function getPermissionContext(): Promise<PermissionContext> {
  const user = await getCurrentUser();

  return {
    permissions: user?.permissions ?? [],
    isResolved: Boolean(user),
  };
}

export async function getRoleContext(): Promise<RoleContext> {
  const user = await getCurrentUser();

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
