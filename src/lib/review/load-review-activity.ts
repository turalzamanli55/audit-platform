import "server-only";

import { cache } from "react";
import { REVIEW_PERMISSIONS } from "@/constants/review";
import type { ReviewActivityView } from "@/lib/review/review-workspace-view";
import { loadReviewWorkspaceCached } from "@/lib/review/load-review-workspace";
import { getCurrentUser, getWorkspaceContext } from "@/lib/auth/server";
import { requirePermissionCodes } from "@/lib/auth/authorize";
import { AuthenticationError, AuthorizationError, DatabaseError } from "@/lib/errors";
import { createServerClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/supabase";

export type ReviewActivityLoadResult =
  | { ok: true; activity: ReviewActivityView }
  | { ok: false; reason: "unauthenticated" | "forbidden" | "no_workspace" | "not_found" | "error" };

function toActivityEntry(row: Tables<"review_activity">): ReviewActivityView["entries"][number] {
  const metadata = (row.metadata ?? {}) as Record<string, unknown>;
  const packageVersion =
    typeof metadata.packageVersion === "number"
      ? metadata.packageVersion
      : typeof metadata.package_version === "number"
        ? metadata.package_version
        : null;
  const sourceModule =
    typeof metadata.sourceModule === "string"
      ? metadata.sourceModule
      : typeof metadata.source_module === "string"
        ? metadata.source_module
        : null;

  return {
    id: row.id,
    action: row.action,
    summary: row.summary,
    createdAt: row.created_at,
    actorName: row.created_by,
    actorId: row.created_by,
    sourceModule,
    packageVersion,
  };
}

async function loadReviewActivity(engagementSlug: string): Promise<ReviewActivityLoadResult> {
  try {
    const workspaceResult = await loadReviewWorkspaceCached(engagementSlug);
    if (!workspaceResult.ok) {
      return { ok: false, reason: workspaceResult.reason };
    }

    if (!workspaceResult.review) {
      return { ok: true, activity: { entries: [] } };
    }

    const user = await getCurrentUser();
    if (!user) return { ok: false, reason: "unauthenticated" };

    requirePermissionCodes(user, REVIEW_PERMISSIONS.READ);

    const workspace = await getWorkspaceContext();
    if (!workspace.isResolved || !workspace.workspaceId) {
      return { ok: false, reason: "no_workspace" };
    }

    const supabase = await createServerClient();
    const result = await supabase
      .from("review_activity")
      .select("*")
      .eq("review_package_id", workspaceResult.review.id)
      .order("created_at", { ascending: false })
      .limit(100);

    if (result.error) throw new DatabaseError("Failed to load review activity");

    return {
      ok: true,
      activity: {
        entries: ((result.data ?? []) as Tables<"review_activity">[]).map(toActivityEntry),
      },
    };
  } catch (error) {
    if (error instanceof AuthenticationError) return { ok: false, reason: "unauthenticated" };
    if (error instanceof AuthorizationError) return { ok: false, reason: "forbidden" };
    if (error instanceof DatabaseError) return { ok: false, reason: "error" };
    return { ok: false, reason: "error" };
  }
}

export const loadReviewActivityCached = cache(loadReviewActivity);
