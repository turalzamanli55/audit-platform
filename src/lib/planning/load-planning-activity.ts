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

export type PlanningActivityEntry = {
  id: string;
  action: string;
  summary: string | null;
  actorId: string | null;
  createdAt: string;
  metadata: Record<string, unknown>;
};

export type PlanningActivityView = {
  entries: PlanningActivityEntry[];
  summary: {
    total: number;
    created: number;
    updated: number;
    archived: number;
    restored: number;
  };
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

function toActivityEntry(row: Tables<"planning_activity">): PlanningActivityEntry {
  return {
    id: row.id,
    action: row.action,
    summary: row.summary,
    actorId: row.actor_id,
    createdAt: row.created_at,
    metadata: (row.metadata ?? {}) as Record<string, unknown>,
  };
}

function buildSummary(entries: PlanningActivityEntry[]): PlanningActivityView["summary"] {
  return {
    total: entries.length,
    created: entries.filter((e) => e.action.includes("created")).length,
    updated: entries.filter((e) => e.action.includes("updated")).length,
    archived: entries.filter((e) => e.action.includes("archived")).length,
    restored: entries.filter((e) => e.action.includes("restored")).length,
  };
}

export type PlanningActivityLoadResult =
  | { ok: true; activity: PlanningActivityView }
  | { ok: false; reason: "unauthenticated" | "forbidden" | "no_workspace" | "not_found" | "error" };

export async function loadPlanningActivity(
  engagementSlug: string,
): Promise<PlanningActivityLoadResult> {
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
      return {
        ok: true,
        activity: { entries: [], summary: buildSummary([]) },
      };
    }

    const rows = await planningRepository.listActivity(plan.id);
    const entries = rows.map(toActivityEntry);

    return {
      ok: true,
      activity: {
        entries,
        summary: buildSummary(entries),
      },
    };
  } catch (error) {
    if (error instanceof AuthenticationError) return { ok: false, reason: "unauthenticated" };
    if (error instanceof AuthorizationError) return { ok: false, reason: "forbidden" };
    if (error instanceof DatabaseError) return { ok: false, reason: "error" };
    return { ok: false, reason: "error" };
  }
}

export const loadPlanningActivityCached = cache(loadPlanningActivity);
