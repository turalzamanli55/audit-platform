"use server";

import { createAuthenticatedAction } from "@/lib/actions/authenticated-action";
import { getCurrentUser, getWorkspaceContext } from "@/lib/auth/server";
import { requirePermissionCodes } from "@/lib/auth/authorize";
import { ENGAGEMENT_PERMISSIONS } from "@/constants/engagement";
import { setEngagementSlugCookie } from "@/lib/auth/tenant-cookies";
import { AuthorizationError, ValidationError } from "@/lib/errors";
import { createServerClient } from "@/lib/supabase/server";
import { EngagementRepository } from "@/repositories/engagement/engagement-repository";
import type { RepositoryContext } from "@/types/context";

export type SwitchEngagementInput = {
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

export const switchEngagementAction = createAuthenticatedAction<
  SwitchEngagementInput,
  { slug: string }
>({ module: "tenant.switch-engagement" }, async (input) => {
  const slug = input.slug.trim();
  if (!slug) {
    throw new ValidationError("Engagement is required");
  }

  const [workspace, user] = await Promise.all([getWorkspaceContext(), getCurrentUser()]);
  if (!workspace.isResolved || !workspace.workspaceId || !user?.organizationId) {
    throw new AuthorizationError("Workspace context is required");
  }

  if (user.workspaceId && user.workspaceId !== workspace.workspaceId) {
    throw new AuthorizationError("Workspace context mismatch");
  }

  requirePermissionCodes(user, ENGAGEMENT_PERMISSIONS.READ);

  const supabase = await createServerClient();
  const repository = new EngagementRepository(
    supabase,
    createRepositoryContext(user.id, user.organizationId, workspace.workspaceId),
  );

  const engagement = await repository.findBySlugInWorkspace(workspace.workspaceId, slug);
  if (!engagement) {
    throw new ValidationError("Engagement not found");
  }

  await setEngagementSlugCookie(slug);
  return { slug };
});
