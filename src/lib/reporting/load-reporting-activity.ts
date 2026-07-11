import "server-only";

import { cache } from "react";
import { REPORTING_PERMISSIONS } from "@/constants/reporting";
import type { ReportActivityView } from "@/lib/reporting/reporting-workspace-view";
import { loadReportingWorkspaceCached } from "@/lib/reporting/load-reporting-workspace";
import { getCurrentUser, getWorkspaceContext } from "@/lib/auth/server";
import { requirePermissionCodes } from "@/lib/auth/authorize";
import { AuthenticationError, AuthorizationError, DatabaseError } from "@/lib/errors";
import { createServerClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/supabase";

export type ReportActivityLoadResult =
  | { ok: true; activity: ReportActivityView }
  | { ok: false; reason: "unauthenticated" | "forbidden" | "no_workspace" | "not_found" | "error" };

function toActivityEntry(row: Tables<"report_activity">): ReportActivityView["entries"][number] {
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

async function loadReportActivity(engagementSlug: string): Promise<ReportActivityLoadResult> {
  try {
    const workspaceResult = await loadReportingWorkspaceCached(engagementSlug);
    if (!workspaceResult.ok) {
      return { ok: false, reason: workspaceResult.reason };
    }

    if (!workspaceResult.reporting) {
      return { ok: true, activity: { entries: [] } };
    }

    const user = await getCurrentUser();
    if (!user) return { ok: false, reason: "unauthenticated" };

    requirePermissionCodes(user, REPORTING_PERMISSIONS.READ);

    const workspace = await getWorkspaceContext();
    if (!workspace.isResolved || !workspace.workspaceId) {
      return { ok: false, reason: "no_workspace" };
    }

    const supabase = await createServerClient();
    const result = await supabase
      .from("report_activity")
      .select("*")
      .eq("reporting_package_id", workspaceResult.reporting.id)
      .order("created_at", { ascending: false })
      .limit(100);

    if (result.error) throw new DatabaseError("Failed to load review activity");

    return {
      ok: true,
      activity: {
        entries: ((result.data ?? []) as Tables<"report_activity">[]).map(toActivityEntry),
      },
    };
  } catch (error) {
    if (error instanceof AuthenticationError) return { ok: false, reason: "unauthenticated" };
    if (error instanceof AuthorizationError) return { ok: false, reason: "forbidden" };
    if (error instanceof DatabaseError) return { ok: false, reason: "error" };
    return { ok: false, reason: "error" };
  }
}

export const loadReportActivityCached = cache(loadReportActivity);
export const loadReportingActivityCached = loadReportActivityCached;
