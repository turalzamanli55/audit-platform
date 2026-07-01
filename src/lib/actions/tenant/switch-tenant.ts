"use server";

import { createServerClient } from "@/lib/supabase/server";
import { createAuthenticatedAction } from "@/lib/actions/authenticated-action";
import { UserRepository } from "@/repositories/user/user-repository";
import type { RepositoryContext } from "@/types/context";
import {
  clearCompanySlugCookie,
  clearWorkspaceCookie,
  setOrganizationCookie,
  setWorkspaceCookie,
} from "@/lib/auth/tenant-cookies";
import { ValidationError } from "@/lib/errors";

export type SwitchOrganizationInput = {
  organizationId: string;
};

function createRepositoryContext(userId: string): RepositoryContext {
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

export const switchOrganizationAction = createAuthenticatedAction<
  SwitchOrganizationInput,
  { organizationId: string; workspaceId: string | null }
>({ module: "tenant.switch-organization" }, async (input, context) => {
  if (!input.organizationId) {
    throw new ValidationError("Organization is required");
  }

  await setOrganizationCookie(input.organizationId);
  await clearWorkspaceCookie();
  await clearCompanySlugCookie();

  const supabase = await createServerClient();
  const repository = new UserRepository(supabase, createRepositoryContext(context.userId));
  const tenant = await repository.resolveTenantContext(context.userId, {
    organizationId: input.organizationId,
    workspaceId: null,
  });

  if (tenant.workspace?.id) {
    await setWorkspaceCookie(tenant.workspace.id);
  }

  return {
    organizationId: input.organizationId,
    workspaceId: tenant.workspace?.id ?? null,
  };
});

export type SwitchWorkspaceInput = {
  workspaceId: string;
};

export const switchWorkspaceAction = createAuthenticatedAction<
  SwitchWorkspaceInput,
  { workspaceId: string }
>({ module: "tenant.switch-workspace" }, async (input) => {
  if (!input.workspaceId) {
    throw new ValidationError("Workspace is required");
  }

  await setWorkspaceCookie(input.workspaceId);
  await clearCompanySlugCookie();

  return { workspaceId: input.workspaceId };
});
