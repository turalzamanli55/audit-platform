import "server-only";

import { cache } from "react";
import { FIELDWORK_PERMISSIONS } from "@/constants/fieldwork";
import { getCurrentUser, getWorkspaceContext } from "@/lib/auth/server";
import { requirePermissionCodes } from "@/lib/auth/authorize";
import { AuthenticationError, AuthorizationError, DatabaseError } from "@/lib/errors";
import { createServerClient } from "@/lib/supabase/server";
import { EngagementRepository } from "@/repositories/engagement/engagement-repository";
import { FieldworkRepository } from "@/repositories/fieldwork/fieldwork-repository";
import type { RepositoryContext } from "@/types/context";
import type { Tables } from "@/types/supabase";

export type FieldworkActivityEntry = {
  id: string;
  action: string;
  summary: string | null;
  actorId: string | null;
  createdAt: string;
  metadata: Record<string, unknown>;
};

export type FieldworkActivityView = {
  entries: FieldworkActivityEntry[];
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

function toActivityEntry(row: Tables<"fieldwork_activity">): FieldworkActivityEntry {
  return {
    id: row.id,
    action: row.action,
    summary: row.summary,
    actorId: row.actor_id,
    createdAt: row.created_at,
    metadata: (row.metadata ?? {}) as Record<string, unknown>,
  };
}

export type FieldworkActivityLoadResult =
  | { ok: true; activity: FieldworkActivityView }
  | { ok: false; reason: "unauthenticated" | "forbidden" | "no_workspace" | "not_found" | "error" };

export async function loadFieldworkActivity(
  engagementSlug: string,
): Promise<FieldworkActivityLoadResult> {
  try {
    const user = await getCurrentUser();
    if (!user) return { ok: false, reason: "unauthenticated" };

    requirePermissionCodes(user, FIELDWORK_PERMISSIONS.READ);

    const workspace = await getWorkspaceContext();
    if (!workspace.isResolved || !workspace.workspaceId || !user.organizationId) {
      return { ok: false, reason: "no_workspace" };
    }

    const supabase = await createServerClient();
    const context = createRepositoryContext(user.id, user.organizationId, workspace.workspaceId);
    const engagementRepository = new EngagementRepository(supabase, context);
    const fieldworkRepository = new FieldworkRepository(supabase, context);

    const engagement = await engagementRepository.findBySlugInWorkspace(
      workspace.workspaceId,
      engagementSlug,
    );

    if (!engagement) return { ok: false, reason: "not_found" };

    const pkg = await fieldworkRepository.findPackageByEngagementIdAnyState(engagement.id);
    if (!pkg) {
      return { ok: true, activity: { entries: [] } };
    }

    const rows = await fieldworkRepository.listActivity(pkg.id);
    return { ok: true, activity: { entries: rows.map(toActivityEntry) } };
  } catch (error) {
    if (error instanceof AuthenticationError) return { ok: false, reason: "unauthenticated" };
    if (error instanceof AuthorizationError) return { ok: false, reason: "forbidden" };
    if (error instanceof DatabaseError) return { ok: false, reason: "error" };
    return { ok: false, reason: "error" };
  }
}

export const loadFieldworkActivityCached = cache(loadFieldworkActivity);
