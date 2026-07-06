import "server-only";

import { COMPLETION_PERMISSIONS } from "@/constants/completion";
import { getCurrentUser, getWorkspaceContext } from "@/lib/auth/server";
import { requirePermissionCodes } from "@/lib/auth/authorize";
import { createServerClient } from "@/lib/supabase/server";
import { EngagementRepository } from "@/repositories/engagement/engagement-repository";
import type { RepositoryContext } from "@/types/context";

type CompletionPackageRow = {
  id: string;
  package_status: string;
  pending_count: number;
  returned_count: number;
  resolved_count: number;
  outstanding_items_count: number;
};

type SupabaseSelectResult = Promise<{ data: unknown; error: unknown }>;

type SupabaseFilterBuilder = {
  eq: (column: string, value: string) => SupabaseFilterBuilder;
  is: (column: string, value: null) => SupabaseFilterBuilder;
  maybeSingle: () => SupabaseSelectResult;
};

type SupabaseMetricClient = {
  from: (table: string) => {
    select: (columns: string) => SupabaseFilterBuilder;
  };
};

export type ReviewDashboardMetrics = {
  pendingReview: number;
  returnedReviews: number;
  draftPackages: number;
  approvedPackages: number;
  openFindings: number;
  myReviews: number;
  recentActivityCount: number;
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

export async function loadCompletionDashboardMetrics(): Promise<ReviewDashboardMetrics | null> {
  try {
    const user = await getCurrentUser();
    if (!user) return null;

    requirePermissionCodes(user, COMPLETION_PERMISSIONS.READ);

    const workspace = await getWorkspaceContext();
    if (!workspace.isResolved || !workspace.workspaceId || !user.organizationId) return null;

    const supabase = await createServerClient();
    const db = supabase as unknown as SupabaseMetricClient;
    const context = createRepositoryContext(user.id, user.organizationId, workspace.workspaceId);
    const engagementRepository = new EngagementRepository(supabase, context);

    const engagements = await engagementRepository.listByWorkspace(workspace.workspaceId);

    let pendingReview = 0;
    let returnedReviews = 0;
    let draftPackages = 0;
    let approvedPackages = 0;
    let openFindings = 0;
    let myReviews = 0;
    let recentActivityCount = 0;

    for (const engagement of engagements) {
      const packageResult = await db
        .from("completion_packages")
        .select(
          "id, package_status, pending_count, returned_count, resolved_count, outstanding_items_count",
        )
        .eq("engagement_id", engagement.id)
        .is("deleted_at", null)
        .maybeSingle();

      const pkg = (packageResult as { data: CompletionPackageRow | null }).data;
      if (!pkg) continue;

      if (["submitted", "under_review"].includes(pkg.package_status)) {
        pendingReview += 1;
      } else if (pkg.package_status === "returned") {
        returnedReviews += 1;
      } else if (pkg.package_status === "draft") {
        draftPackages += 1;
      } else if (pkg.package_status === "approved") {
        approvedPackages += 1;
      }

      openFindings += pkg.outstanding_items_count ?? 0;

      const itemsResult = await (supabase as unknown as {
        from: (table: string) => {
          select: (columns: string) => {
            eq: (col: string, val: string) => {
              is: (col: string, val: null) => {
                eq: (col2: string, val2: string) => Promise<{ data: unknown; error: unknown }>;
              };
            };
          };
        };
      })
        .from("completion_items")
        .select("id")
        .eq("completion_package_id", pkg.id)
        .is("deleted_at", null)
        .eq("assigned_reviewer_id", user.id);

      const assignedItems = (itemsResult as { data: { id: string }[] | null }).data ?? [];
      myReviews += assignedItems.length;

      const activityResult = await (supabase as unknown as {
        from: (table: string) => {
          select: (columns: string, opts?: { count: string; head: boolean }) => {
            eq: (col: string, val: string) => Promise<{ count: number | null; error: unknown }>;
          };
        };
      })
        .from("completion_activity")
        .select("id", { count: "exact", head: true })
        .eq("completion_package_id", pkg.id);

      recentActivityCount += (activityResult as { count: number | null }).count ?? 0;
    }

    return {
      pendingReview,
      returnedReviews,
      draftPackages,
      approvedPackages,
      openFindings,
      myReviews,
      recentActivityCount,
    };
  } catch {
    return null;
  }
}
