import "server-only";

import { FINANCIAL_STATEMENTS_PERMISSIONS } from "@/constants/financial-statements";
import { getCurrentUser, getWorkspaceContext } from "@/lib/auth/server";
import { requirePermissionCodes } from "@/lib/auth/authorize";
import { createServerClient } from "@/lib/supabase/server";
import { EngagementRepository } from "@/repositories/engagement/engagement-repository";
import type { RepositoryContext } from "@/types/context";

type FinancialStatementPackageRow = {
  id: string;
  package_status: string;
  pending_count: number;
  returned_count: number;
  resolved_count: number;
  pending_sections_count: number;
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

export type FinancialStatementsDashboardMetrics = {
  pendingFinancialStatements: number;
  returnedPackages: number;
  draftPackages: number;
  approvedPackages: number;
  pendingSections: number;
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

export async function loadFinancialStatementsDashboardMetrics(): Promise<FinancialStatementsDashboardMetrics | null> {
  try {
    const user = await getCurrentUser();
    if (!user) return null;

    requirePermissionCodes(user, FINANCIAL_STATEMENTS_PERMISSIONS.READ);

    const workspace = await getWorkspaceContext();
    if (!workspace.isResolved || !workspace.workspaceId || !user.organizationId) return null;

    const supabase = await createServerClient();
    const db = supabase as unknown as SupabaseMetricClient;
    const context = createRepositoryContext(user.id, user.organizationId, workspace.workspaceId);
    const engagementRepository = new EngagementRepository(supabase, context);
    const engagements = await engagementRepository.listByWorkspace(workspace.workspaceId);

    let pendingFinancialStatements = 0;
    let returnedPackages = 0;
    let draftPackages = 0;
    let approvedPackages = 0;
    let pendingSections = 0;
    let recentActivityCount = 0;

    for (const engagement of engagements) {
      const result = await db
        .from("financial_statement_packages")
        .select(
          "id, package_status, pending_count, returned_count, resolved_count, pending_sections_count",
        )
        .eq("engagement_id", engagement.id)
        .is("deleted_at", null)
        .maybeSingle();

      const pkg = (result.data ?? null) as FinancialStatementPackageRow | null;
      if (!pkg) continue;

      if (["submitted", "under_review"].includes(pkg.package_status)) pendingFinancialStatements += 1;
      if (pkg.package_status === "returned") returnedPackages += 1;
      if (pkg.package_status === "draft") draftPackages += 1;
      if (pkg.package_status === "approved") approvedPackages += 1;
      pendingSections += pkg.pending_sections_count ?? 0;

      const activityResult = await db
        .from("financial_statement_activity")
        .select("id")
        .eq("financial_statement_package_id", pkg.id)
        .is("deleted_at", null)
        .maybeSingle();
      if (activityResult.data) recentActivityCount += 1;
    }

    return {
      pendingFinancialStatements,
      returnedPackages,
      draftPackages,
      approvedPackages,
      pendingSections,
      recentActivityCount,
    };
  } catch {
    return null;
  }
}
