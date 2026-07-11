import "server-only";

import { cache } from "react";
import { OPINION_PERMISSIONS } from "@/constants/opinion";
import type { OpinionActivityView } from "@/lib/opinion/opinion-workspace-view";
import { loadOpinionWorkspaceCached } from "@/lib/opinion/load-opinion-workspace";
import { getCurrentUser, getWorkspaceContext } from "@/lib/auth/server";
import { requirePermissionCodes } from "@/lib/auth/authorize";
import { AuthenticationError, AuthorizationError, DatabaseError } from "@/lib/errors";
import { createServerClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/supabase";

export type OpinionActivityLoadResult =
  | { ok: true; activity: OpinionActivityView }
  | { ok: false; reason: "unauthenticated" | "forbidden" | "no_workspace" | "not_found" | "error" };

function toActivityEntry(row: Tables<"opinion_activity">): OpinionActivityView["entries"][number] {
  const metadata = (row.metadata ?? {}) as Record<string, unknown>;
  const packageVersion =
    typeof metadata.packageVersion === "number"
      ? metadata.packageVersion
      : typeof metadata.package_version === "number"
        ? metadata.package_version
        : null;
  const sectionType =
    typeof metadata.sectionType === "string"
      ? metadata.sectionType
      : typeof metadata.section_type === "string"
        ? metadata.section_type
        : null;

  return {
    id: row.id,
    action: row.action,
    summary: row.summary,
    createdAt: row.created_at,
    actorName: row.created_by,
    actorId: row.created_by,
    sectionType,
    packageVersion,
  };
}

async function loadOpinionActivity(engagementSlug: string): Promise<OpinionActivityLoadResult> {
  try {
    const workspaceResult = await loadOpinionWorkspaceCached(engagementSlug);
    if (!workspaceResult.ok) {
      return { ok: false, reason: workspaceResult.reason };
    }

    if (!workspaceResult.opinion) {
      return { ok: true, activity: { entries: [] } };
    }

    const user = await getCurrentUser();
    if (!user) return { ok: false, reason: "unauthenticated" };

    requirePermissionCodes(user, OPINION_PERMISSIONS.READ);

    const workspace = await getWorkspaceContext();
    if (!workspace.isResolved || !workspace.workspaceId) {
      return { ok: false, reason: "no_workspace" };
    }

    const supabase = await createServerClient();
    const result = await supabase
      .from("opinion_activity")
      .select("*")
      .eq("opinion_package_id", workspaceResult.opinion.id)
      .order("created_at", { ascending: false })
      .limit(100);

    if (result.error) throw new DatabaseError("Failed to load review activity");

    return {
      ok: true,
      activity: {
        entries: ((result.data ?? []) as Tables<"opinion_activity">[]).map(toActivityEntry),
      },
    };
  } catch (error) {
    if (error instanceof AuthenticationError) return { ok: false, reason: "unauthenticated" };
    if (error instanceof AuthorizationError) return { ok: false, reason: "forbidden" };
    if (error instanceof DatabaseError) return { ok: false, reason: "error" };
    return { ok: false, reason: "error" };
  }
}

export const loadOpinionActivityCached = cache(loadOpinionActivity);
