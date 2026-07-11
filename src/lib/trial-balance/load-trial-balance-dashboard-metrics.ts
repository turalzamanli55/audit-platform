import "server-only";

import { TRIAL_BALANCE_PERMISSIONS } from "@/constants/trial-balance";
import { getCurrentUser, getWorkspaceContext } from "@/lib/auth/server";
import { requirePermissionCodes } from "@/lib/auth/authorize";
import { createServerClient } from "@/lib/supabase/server";

export type TrialBalanceDashboardMetrics = {
  packages: number;
  draftPackages: number;
  pendingReview: number;
  outOfBalance: number;
  approvedPackages: number;
  averageAccounts: number;
};

export async function loadTrialBalanceDashboardMetrics(): Promise<TrialBalanceDashboardMetrics | null> {
  try {
    const user = await getCurrentUser();
    if (!user) return null;
    requirePermissionCodes(user, TRIAL_BALANCE_PERMISSIONS.READ);
    const workspace = await getWorkspaceContext();
    if (!workspace.isResolved || !workspace.workspaceId) return null;

    const supabase = await createServerClient();
    const result = await supabase
      .from("trial_balance_packages")
      .select("package_status, is_balanced, account_count")
      .eq("workspace_id", workspace.workspaceId)
      .is("deleted_at", null)
      .limit(200);

    const rows = result.data ?? [];
    if (rows.length === 0) {
      return {
        packages: 0,
        draftPackages: 0,
        pendingReview: 0,
        outOfBalance: 0,
        approvedPackages: 0,
        averageAccounts: 0,
      };
    }

    return {
      packages: rows.length,
      draftPackages: rows.filter((row) => row.package_status === "draft").length,
      pendingReview: rows.filter((row) =>
        ["submitted", "under_review"].includes(row.package_status),
      ).length,
      outOfBalance: rows.filter((row) => !row.is_balanced).length,
      approvedPackages: rows.filter((row) =>
        ["approved", "locked"].includes(row.package_status),
      ).length,
      averageAccounts: Math.round(
        rows.reduce((sum, row) => sum + (row.account_count ?? 0), 0) / rows.length,
      ),
    };
  } catch {
    return null;
  }
}
