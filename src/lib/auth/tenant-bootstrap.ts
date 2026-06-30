import "server-only";

import { createServerClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import type { TenantBootstrap } from "@/types/tenant";
import { UserRepository } from "@/repositories/user/user-repository";
import type { RepositoryContext } from "@/types/context";
import { readTenantPreferences } from "./resolve-user";

export type { TenantBootstrap } from "@/types/tenant";

function createRepositoryContext(userId: string | null): RepositoryContext {
  return {
    userId,
    tenant: {
      organization: { organizationId: null, isResolved: false },
      workspace: { workspaceId: null, isResolved: false },
      company: { companyId: null, isResolved: false },
      permissions: { permissions: [], isResolved: false },
      roles: { roles: [], isResolved: false },
    },
  };
}

export async function getTenantBootstrap(): Promise<TenantBootstrap | null> {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const preferences = await readTenantPreferences();
  const repository = new UserRepository(supabase, createRepositoryContext(user.id));
  const memberships = await repository.listMemberships(user.id);
  const organizationIds = [...new Set(memberships.map((membership) => membership.organization_id))];

  const serviceClient = createServiceClient();
  const organizations: TenantBootstrap["organizations"] = [];

  for (const organizationId of organizationIds) {
    const result = await serviceClient
      .from("organizations")
      .select("id, name, slug")
      .eq("id", organizationId)
      .is("deleted_at", null)
      .maybeSingle();

    if (result.data) {
      organizations.push(result.data);
    }
  }

  const currentOrganizationId =
    preferences.organizationId && organizationIds.includes(preferences.organizationId)
      ? preferences.organizationId
      : organizations[0]?.id ?? null;

  const workspaces: TenantBootstrap["workspaces"] = [];
  if (currentOrganizationId) {
    const { data } = await serviceClient
      .from("workspaces")
      .select("id, name, slug, organization_id")
      .eq("organization_id", currentOrganizationId)
      .is("deleted_at", null)
      .order("name", { ascending: true });

    if (data) {
      workspaces.push(...data);
    }
  }

  const currentWorkspaceId =
    preferences.workspaceId && workspaces.some((workspace) => workspace.id === preferences.workspaceId)
      ? preferences.workspaceId
      : workspaces[0]?.id ?? null;

  const tenant = await repository.resolveTenantContext(user.id, {
    organizationId: currentOrganizationId,
    workspaceId: currentWorkspaceId,
  });

  return {
    organizations,
    workspaces,
    currentOrganizationId,
    currentWorkspaceId,
    hasOrganization: organizations.length > 0,
    permissionCodes: tenant.permissionCodes,
    roleSlugs: tenant.roleSlugs,
  };
}
