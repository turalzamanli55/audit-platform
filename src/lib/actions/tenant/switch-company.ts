"use server";

import { createAuthenticatedAction } from "@/lib/actions/authenticated-action";
import { getCurrentUser, getWorkspaceContext } from "@/lib/auth/server";
import { requirePermissionCodes } from "@/lib/auth/authorize";
import { COMPANY_PERMISSIONS } from "@/constants/company";
import { setCompanySlugCookie } from "@/lib/auth/tenant-cookies";
import { AuthorizationError, ValidationError } from "@/lib/errors";
import { createServerClient } from "@/lib/supabase/server";
import { CompanyRepository } from "@/repositories/company/company-repository";
import type { RepositoryContext } from "@/types/context";

export type SwitchCompanyInput = {
  slug: string;
};

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

export const switchCompanyAction = createAuthenticatedAction<
  SwitchCompanyInput,
  { slug: string }
>({ module: "tenant.switch-company" }, async (input) => {
  const slug = input.slug.trim();
  if (!slug) {
    throw new ValidationError("Company is required");
  }

  const [workspace, user] = await Promise.all([getWorkspaceContext(), getCurrentUser()]);
  if (!workspace.isResolved || !workspace.workspaceId || !user?.organizationId) {
    throw new AuthorizationError("Workspace context is required");
  }

  if (user.workspaceId && user.workspaceId !== workspace.workspaceId) {
    throw new AuthorizationError("Workspace context mismatch");
  }

  requirePermissionCodes(user, COMPANY_PERMISSIONS.READ);

  const supabase = await createServerClient();
  const repository = new CompanyRepository(
    supabase,
    createRepositoryContext(user.id, user.organizationId, workspace.workspaceId),
  );

  const company = await repository.findBySlugInWorkspace(workspace.workspaceId, slug);
  if (!company) {
    throw new ValidationError("Company not found");
  }

  await setCompanySlugCookie(slug);
  return { slug };
});
