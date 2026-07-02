import "server-only";

import { cache } from "react";
import { PLANNING_PERMISSIONS } from "@/constants/planning";
import { getCurrentUser, getWorkspaceContext } from "@/lib/auth/server";
import { requirePermissionCodes } from "@/lib/auth/authorize";
import { AuthenticationError, AuthorizationError, DatabaseError } from "@/lib/errors";
import { createServerClient } from "@/lib/supabase/server";
import { EngagementRepository } from "@/repositories/engagement/engagement-repository";
import { PlanningRepository } from "@/repositories/planning/planning-repository";
import type { RepositoryContext } from "@/types/context";
import type { Tables } from "@/types/supabase";

export type PlanningCommentView = {
  id: string;
  body: string;
  commentType: string;
  authorId: string | null;
  createdAt: string;
  resolvedAt: string | null;
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

function toCommentView(row: Tables<"planning_comments">): PlanningCommentView {
  return {
    id: row.id,
    body: row.body,
    commentType: row.comment_type,
    authorId: row.author_id,
    createdAt: row.created_at,
    resolvedAt: row.resolved_at,
  };
}

export type PlanningCommentsLoadResult =
  | { ok: true; comments: PlanningCommentView[] }
  | { ok: false; reason: "unauthenticated" | "forbidden" | "no_workspace" | "not_found" | "error" };

export async function loadPlanningComments(
  engagementSlug: string,
): Promise<PlanningCommentsLoadResult> {
  try {
    const user = await getCurrentUser();
    if (!user) return { ok: false, reason: "unauthenticated" };

    requirePermissionCodes(user, PLANNING_PERMISSIONS.READ);

    const workspace = await getWorkspaceContext();
    if (!workspace.isResolved || !workspace.workspaceId || !user.organizationId) {
      return { ok: false, reason: "no_workspace" };
    }

    const supabase = await createServerClient();
    const context = createRepositoryContext(user.id, user.organizationId, workspace.workspaceId);
    const engagementRepository = new EngagementRepository(supabase, context);
    const planningRepository = new PlanningRepository(supabase, context);

    const engagement = await engagementRepository.findBySlugInWorkspace(
      workspace.workspaceId,
      engagementSlug,
    );

    if (!engagement) return { ok: false, reason: "not_found" };

    const plan = await planningRepository.findByEngagementIdAnyState(engagement.id);
    if (!plan) {
      return { ok: true, comments: [] };
    }

    const rows = await planningRepository.listComments(plan.id);
    return { ok: true, comments: rows.map(toCommentView) };
  } catch (error) {
    if (error instanceof AuthenticationError) return { ok: false, reason: "unauthenticated" };
    if (error instanceof AuthorizationError) return { ok: false, reason: "forbidden" };
    if (error instanceof DatabaseError) return { ok: false, reason: "error" };
    return { ok: false, reason: "error" };
  }
}

export const loadPlanningCommentsCached = cache(loadPlanningComments);
