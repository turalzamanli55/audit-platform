import "server-only";

import { cache } from "react";
import { COMPLETION_PERMISSIONS } from "@/constants/completion";
import type { CompletionActivityView } from "@/lib/completion/completion-workspace-view";
import { loadCompletionWorkspaceCached } from "@/lib/completion/load-completion-workspace";
import { getCurrentUser, getWorkspaceContext } from "@/lib/auth/server";
import { requirePermissionCodes } from "@/lib/auth/authorize";
import { AuthenticationError, AuthorizationError, DatabaseError } from "@/lib/errors";
import { createServerClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/supabase";

export type CompletionActivityLoadResult =
  | { ok: true; activity: CompletionActivityView }
  | { ok: false; reason: "unauthenticated" | "forbidden" | "no_workspace" | "not_found" | "error" };

function toActivityEntry(row: Tables<"completion_activity">): CompletionActivityView["entries"][number] {
  const metadata = (row.metadata ?? {}) as Record<string, unknown>;
  const packageVersion =
    typeof metadata.packageVersion === "number"
      ? metadata.packageVersion
      : typeof metadata.package_version === "number"
        ? metadata.package_version
        : null;
  const itemType =
    typeof metadata.itemType === "string"
      ? metadata.itemType
      : typeof metadata.item_type === "string"
        ? metadata.item_type
        : null;

  return {
    id: row.id,
    action: row.action,
    summary: row.summary,
    createdAt: row.created_at,
    actorName: row.created_by,
    actorId: row.created_by,
    itemType,
    packageVersion,
  };
}

async function loadCompletionActivity(engagementSlug: string): Promise<CompletionActivityLoadResult> {
  try {
    const workspaceResult = await loadCompletionWorkspaceCached(engagementSlug);
    if (!workspaceResult.ok) {
      return { ok: false, reason: workspaceResult.reason };
    }

    if (!workspaceResult.completion) {
      return { ok: true, activity: { entries: [] } };
    }

    const user = await getCurrentUser();
    if (!user) return { ok: false, reason: "unauthenticated" };

    requirePermissionCodes(user, COMPLETION_PERMISSIONS.READ);

    const workspace = await getWorkspaceContext();
    if (!workspace.isResolved || !workspace.workspaceId) {
      return { ok: false, reason: "no_workspace" };
    }

    const supabase = await createServerClient();
    const result = await supabase
      .from("completion_activity")
      .select("*")
      .eq("completion_package_id", workspaceResult.completion.id)
      .order("created_at", { ascending: false })
      .limit(100);

    if (result.error) throw new DatabaseError("Failed to load review activity");

    return {
      ok: true,
      activity: {
        entries: ((result.data ?? []) as Tables<"completion_activity">[]).map(toActivityEntry),
      },
    };
  } catch (error) {
    if (error instanceof AuthenticationError) return { ok: false, reason: "unauthenticated" };
    if (error instanceof AuthorizationError) return { ok: false, reason: "forbidden" };
    if (error instanceof DatabaseError) return { ok: false, reason: "error" };
    return { ok: false, reason: "error" };
  }
}

export const loadCompletionActivityCached = cache(loadCompletionActivity);
