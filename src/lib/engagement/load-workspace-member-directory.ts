import "server-only";

import { cache } from "react";
import { getCurrentUser, getWorkspaceContext } from "@/lib/auth/server";
import { requirePermissionCodes } from "@/lib/auth/authorize";
import { AuthenticationError, AuthorizationError, DatabaseError } from "@/lib/errors";
import { createServerClient } from "@/lib/supabase/server";
import { MembershipRepository } from "@/repositories/membership/membership-repository";
import { resolveUserProfiles } from "@/lib/user/resolve-user-profiles";
import type { RepositoryContext } from "@/types/context";
import { ENGAGEMENT_PERMISSIONS } from "@/constants/engagement";

export type WorkspaceMemberDirectoryItem = {
  userId: string;
  displayName: string;
  email: string;
};

export type WorkspaceMemberDirectoryLoadResult =
  | { ok: true; items: WorkspaceMemberDirectoryItem[] }
  | { ok: false; reason: "unauthenticated" | "forbidden" | "no_workspace" | "error" };

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

export const loadWorkspaceMemberDirectory = cache(
  async function loadWorkspaceMemberDirectory(): Promise<WorkspaceMemberDirectoryLoadResult> {
    try {
      const user = await getCurrentUser();
      if (!user) return { ok: false, reason: "unauthenticated" };

      requirePermissionCodes(user, ENGAGEMENT_PERMISSIONS.READ);

      const workspace = await getWorkspaceContext();
      if (!workspace.isResolved || !workspace.workspaceId || !user.organizationId) {
        return { ok: false, reason: "no_workspace" };
      }

      const supabase = await createServerClient();
      const membershipRepository = new MembershipRepository(
        supabase,
        createRepositoryContext(user.id, user.organizationId, workspace.workspaceId),
      );

      const memberships = await membershipRepository.listByWorkspace(workspace.workspaceId);
      const userIds = [...new Set(memberships.map((membership) => membership.user_id))];
      const profiles = await resolveUserProfiles(userIds);

      const items: WorkspaceMemberDirectoryItem[] = userIds.map((userId) => {
        const profile = profiles.get(userId);
        return {
          userId,
          displayName: profile?.displayName ?? userId,
          email: profile?.email ?? "",
        };
      });

      items.sort((left, right) => left.displayName.localeCompare(right.displayName));

      return { ok: true, items };
    } catch (error) {
      if (error instanceof AuthenticationError) return { ok: false, reason: "unauthenticated" };
      if (error instanceof AuthorizationError) return { ok: false, reason: "forbidden" };
      if (error instanceof DatabaseError) return { ok: false, reason: "error" };
      return { ok: false, reason: "error" };
    }
  },
);
