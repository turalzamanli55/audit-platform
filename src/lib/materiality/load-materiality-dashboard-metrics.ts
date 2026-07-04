import "server-only";

import { MATERIALITY_PERMISSIONS } from "@/constants/materiality";
import { getCurrentUser, getWorkspaceContext } from "@/lib/auth/server";
import { requirePermissionCodes } from "@/lib/auth/authorize";
import { createServerClient } from "@/lib/supabase/server";
import { EngagementRepository } from "@/repositories/engagement/engagement-repository";
import type { RepositoryContext } from "@/types/context";

type MaterialityPackageRow = {
  id: string;
  package_status: string;
  overall_materiality: number | null;
  performance_materiality: number | null;
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

export type MaterialityDashboardMetrics = {
  pendingReview: number;
  draftPackages: number;
  approvedPackages: number;
  openComments: number;
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

export async function loadMaterialityDashboardMetrics(): Promise<MaterialityDashboardMetrics | null> {
  try {
    const user = await getCurrentUser();
    if (!user) return null;

    requirePermissionCodes(user, MATERIALITY_PERMISSIONS.READ);

    const workspace = await getWorkspaceContext();
    if (!workspace.isResolved || !workspace.workspaceId || !user.organizationId) return null;

    const supabase = await createServerClient();
    const db = supabase as unknown as SupabaseMetricClient;
    const context = createRepositoryContext(user.id, user.organizationId, workspace.workspaceId);
    const engagementRepository = new EngagementRepository(supabase, context);

    const engagements = await engagementRepository.listByWorkspace(workspace.workspaceId);

    let pendingReview = 0;
    let draftPackages = 0;
    let approvedPackages = 0;
    let openComments = 0;

    for (const engagement of engagements) {
      const packageResult = await db
        .from("materiality_packages")
        .select("id, package_status, overall_materiality, performance_materiality")
        .eq("engagement_id", engagement.id)
        .is("deleted_at", null)
        .maybeSingle();

      const pkg = (packageResult as { data: MaterialityPackageRow | null }).data;
      if (!pkg) continue;

      if (["submitted", "under_review"].includes(pkg.package_status)) {
        pendingReview += 1;
      } else if (pkg.package_status === "draft" || pkg.package_status === "returned") {
        draftPackages += 1;
      } else if (pkg.package_status === "approved") {
        approvedPackages += 1;
      }

      const commentsResult = await supabase
        .from("materiality_comments")
        .select("id", { count: "exact", head: true })
        .eq("materiality_package_id", pkg.id)
        .is("deleted_at", null);

      if (!commentsResult.error && commentsResult.count) {
        openComments += commentsResult.count;
      }
    }

    return { pendingReview, draftPackages, approvedPackages, openComments };
  } catch {
    return null;
  }
}
