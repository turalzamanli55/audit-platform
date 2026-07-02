import "server-only";

import { ENGAGEMENT_ACTIVITY_ACTIONS } from "@/constants/engagement";
import { ENGAGEMENT_PERMISSIONS } from "@/constants/engagement";
import { getCurrentUser, getWorkspaceContext } from "@/lib/auth/server";
import { requirePermissionCodes } from "@/lib/auth/authorize";
import { AuthenticationError, AuthorizationError, DatabaseError } from "@/lib/errors";
import { createServerClient } from "@/lib/supabase/server";
import { EngagementRepository } from "@/repositories/engagement/engagement-repository";

export type EngagementActivityEntry = {
  id: string;
  action: string;
  summary: string | null;
  createdAt: string;
  metadata: Record<string, unknown>;
};

export type EngagementActivitySummary = {
  total: number;
  created: number;
  updated: number;
  statusChanged: number;
  archived: number;
  restored: number;
};

export type EngagementActivityView = {
  entries: EngagementActivityEntry[];
  summary: EngagementActivitySummary;
};

export type EngagementActivityLoadResult =
  | { ok: true; activity: EngagementActivityView }
  | { ok: false; reason: "unauthenticated" | "forbidden" | "no_workspace" | "error" };

function parseMetadata(value: unknown): Record<string, unknown> {
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
}

function buildSummary(entries: EngagementActivityEntry[]): EngagementActivitySummary {
  const summary: EngagementActivitySummary = {
    total: entries.length,
    created: 0,
    updated: 0,
    statusChanged: 0,
    archived: 0,
    restored: 0,
  };

  for (const entry of entries) {
    switch (entry.action) {
      case ENGAGEMENT_ACTIVITY_ACTIONS.CREATED:
        summary.created += 1;
        break;
      case ENGAGEMENT_ACTIVITY_ACTIONS.UPDATED:
        summary.updated += 1;
        break;
      case ENGAGEMENT_ACTIVITY_ACTIONS.STATUS_CHANGED:
        summary.statusChanged += 1;
        break;
      case ENGAGEMENT_ACTIVITY_ACTIONS.ARCHIVED:
        summary.archived += 1;
        break;
      case ENGAGEMENT_ACTIVITY_ACTIONS.RESTORED:
        summary.restored += 1;
        break;
      default:
        break;
    }
  }

  return summary;
}

export async function loadEngagementActivity(
  engagementId: string,
): Promise<EngagementActivityLoadResult> {
  try {
    const user = await getCurrentUser();
    if (!user) return { ok: false, reason: "unauthenticated" };

    requirePermissionCodes(user, ENGAGEMENT_PERMISSIONS.READ);

    const workspace = await getWorkspaceContext();
    if (!workspace.isResolved || !workspace.workspaceId || !user.organizationId) {
      return { ok: false, reason: "no_workspace" };
    }

    const supabase = await createServerClient();
    const repository = new EngagementRepository(supabase, {
      userId: user.id,
      tenant: {
        organization: { organizationId: user.organizationId, isResolved: true },
        workspace: { workspaceId: workspace.workspaceId, isResolved: true },
        company: { companyId: null, isResolved: false },
        permissions: { permissions: [], isResolved: false },
        roles: { roles: [], isResolved: false },
      },
    });

    const rows = await repository.listActivity(engagementId);
    const entries: EngagementActivityEntry[] = rows.map((row) => ({
      id: row.id,
      action: row.action,
      summary: row.summary,
      createdAt: row.created_at,
      metadata: parseMetadata(row.metadata),
    }));

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
