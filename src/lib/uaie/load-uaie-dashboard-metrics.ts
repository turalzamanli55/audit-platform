import "server-only";

import { UAIE_PERMISSIONS } from "@/constants/uaie";
import { getCurrentUser, getWorkspaceContext } from "@/lib/auth/server";
import { requirePermissionCodes } from "@/lib/auth/authorize";
import { createServerClient } from "@/lib/supabase/server";

export type UaieDashboardMetrics = {
  recentImports: number;
  failedImports: number;
  mappingRequired: number;
  stagedImports: number;
  averageConfidence: number;
  averageProcessingMs: number;
  successRate: number;
  unknownHeaders: number;
  pendingApprovals: number;
  dictionarySize: number;
  learningEvents: number;
  erpBreakdown: Array<{ erp: string; count: number }>;
};

export async function loadUaieDashboardMetrics(): Promise<UaieDashboardMetrics | null> {
  try {
    const user = await getCurrentUser();
    if (!user) return null;
    requirePermissionCodes(user, UAIE_PERMISSIONS.READ);
    const workspace = await getWorkspaceContext();
    if (!workspace.isResolved || !workspace.workspaceId) return null;

    const supabase = await createServerClient();
    const [sessionsResult, unknownsResult, dictionaryResult, eventsResult] = await Promise.all([
      supabase
        .from("uaie_import_sessions")
        .select("import_status, overall_confidence, processing_ms, created_at, detected_erp")
        .eq("workspace_id", workspace.workspaceId)
        .is("deleted_at", null)
        .order("created_at", { ascending: false })
        .limit(100),
      supabase
        .from("uaie_unknown_headers")
        .select("id, unknown_status")
        .eq("workspace_id", workspace.workspaceId)
        .is("deleted_at", null)
        .in("unknown_status", ["open", "suggested"])
        .limit(500),
      supabase
        .from("uaie_dictionary_entries")
        .select("id")
        .eq("workspace_id", workspace.workspaceId)
        .eq("entry_status", "approved")
        .is("deleted_at", null)
        .limit(500),
      supabase
        .from("uaie_learning_events")
        .select("id")
        .eq("workspace_id", workspace.workspaceId)
        .limit(200),
    ]);

    const rows = sessionsResult.data ?? [];
    const unknowns = unknownsResult.data ?? [];
    const dictionary = dictionaryResult.data ?? [];
    const events = eventsResult.data ?? [];
    if (rows.length === 0) {
      return {
        recentImports: 0,
        failedImports: 0,
        mappingRequired: 0,
        stagedImports: 0,
        averageConfidence: 0,
        averageProcessingMs: 0,
        successRate: 0,
        unknownHeaders: unknowns.length,
        pendingApprovals: unknowns.filter((row) => row.unknown_status === "suggested").length,
        dictionarySize: dictionary.length,
        learningEvents: events.length,
        erpBreakdown: [],
      };
    }

    const failedImports = rows.filter((row) => row.import_status === "failed").length;
    const mappingRequired = rows.filter((row) => row.import_status === "mapping_required").length;
    const stagedImports = rows.filter((row) => row.import_status === "staged").length;
    const successLike = rows.filter((row) =>
      ["validated", "staged", "mapped"].includes(row.import_status),
    ).length;
    const averageConfidence = Math.round(
      rows.reduce((sum, row) => sum + (row.overall_confidence ?? 0), 0) / rows.length,
    );
    const withTiming = rows.filter((row) => row.processing_ms != null);
    const averageProcessingMs =
      withTiming.length === 0
        ? 0
        : Math.round(
            withTiming.reduce((sum, row) => sum + (row.processing_ms ?? 0), 0) / withTiming.length,
          );

    const erpCounts = new Map<string, number>();
    for (const row of rows) {
      const erp = row.detected_erp ?? "unknown";
      erpCounts.set(erp, (erpCounts.get(erp) ?? 0) + 1);
    }
    const erpBreakdown = [...erpCounts.entries()]
      .map(([erp, count]) => ({ erp, count }))
      .sort((a, b) => b.count - a.count);

    return {
      recentImports: rows.length,
      failedImports,
      mappingRequired,
      stagedImports,
      averageConfidence,
      averageProcessingMs,
      successRate: Math.round((successLike / rows.length) * 100),
      unknownHeaders: unknowns.length,
      pendingApprovals: unknowns.filter((row) => row.unknown_status === "suggested").length,
      dictionarySize: dictionary.length,
      learningEvents: events.length,
      erpBreakdown,
    };
  } catch {
    return null;
  }
}
