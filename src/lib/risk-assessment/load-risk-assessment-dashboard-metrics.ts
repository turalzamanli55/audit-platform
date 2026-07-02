import "server-only";

import { RISK_ASSESSMENT_PERMISSIONS } from "@/constants/risk-assessment";
import { getCurrentUser, getWorkspaceContext } from "@/lib/auth/server";
import { requirePermissionCodes } from "@/lib/auth/authorize";
import { createServerClient } from "@/lib/supabase/server";
import { EngagementRepository } from "@/repositories/engagement/engagement-repository";
import type { RepositoryContext } from "@/types/context";

type RiskAssessmentMetricsRow = {
  id: string;
  assessment_status: string;
};

type RiskRegisterMetricsRow = {
  id: string;
  is_significant: boolean;
  residual_rating: string | null;
};

type SupabaseSelectResult = Promise<{ data: unknown; error: unknown }>;

type SupabaseFilterBuilder = {
  eq: (column: string, value: string) => SupabaseFilterBuilder;
  is: (column: string, value: null) => SupabaseFilterBuilder;
  order: (column: string, options?: { ascending: boolean }) => SupabaseSelectResult;
  maybeSingle: () => SupabaseSelectResult;
};

type SupabaseMetricClient = {
  from: (table: string) => {
    select: (columns: string) => SupabaseFilterBuilder;
  };
};

export type RiskAssessmentDashboardMetrics = {
  significantRiskCount: number;
  pendingReview: number;
  openItems: number;
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

export async function loadRiskAssessmentDashboardMetrics(): Promise<RiskAssessmentDashboardMetrics | null> {
  try {
    const user = await getCurrentUser();
    if (!user) return null;

    requirePermissionCodes(user, RISK_ASSESSMENT_PERMISSIONS.READ);

    const workspace = await getWorkspaceContext();
    if (!workspace.isResolved || !workspace.workspaceId || !user.organizationId) return null;

    const supabase = await createServerClient();
    const db = supabase as unknown as SupabaseMetricClient;
    const context = createRepositoryContext(user.id, user.organizationId, workspace.workspaceId);
    const engagementRepository = new EngagementRepository(supabase, context);

    const engagements = await engagementRepository.listByWorkspace(workspace.workspaceId);

    let significantRiskCount = 0;
    let pendingReview = 0;
    let openItems = 0;

    for (const engagement of engagements) {
      const assessmentResult = await db
        .from("risk_assessments")
        .select("id, assessment_status")
        .eq("engagement_id", engagement.id)
        .is("deleted_at", null)
        .maybeSingle();

      if (assessmentResult.error) continue;

      const assessment = (assessmentResult.data ?? null) as RiskAssessmentMetricsRow | null;
      if (!assessment) continue;

      if (["submitted", "under_review"].includes(assessment.assessment_status)) {
        pendingReview += 1;
      }

      const riskItemsResult = await db
        .from("risk_register_items")
        .select("id, is_significant, residual_rating")
        .eq("risk_assessment_id", assessment.id)
        .is("deleted_at", null)
        .order("created_at", { ascending: true });

      if (riskItemsResult.error) continue;

      const items = (riskItemsResult.data ?? []) as RiskRegisterMetricsRow[];
      significantRiskCount += items.filter((item) => item.is_significant).length;
      openItems += items.filter((item) => item.residual_rating === "high" || item.residual_rating === "significant").length;
    }

    return { significantRiskCount, pendingReview, openItems };
  } catch {
    return null;
  }
}
