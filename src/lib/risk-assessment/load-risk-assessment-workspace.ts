import "server-only";

import { cache } from "react";
import { RISK_ASSESSMENT_PERMISSIONS } from "@/constants/risk-assessment";
import {
  toRiskAssessmentWorkspaceView,
  type RiskAssessmentRecord,
  type RiskAssertionRatingRecord,
  type RiskCategoryRecord,
  type RiskNoteRecord,
  type RiskProcedureLinkRecord,
  type RiskRegisterItemRecord,
  type RiskResponseRecord,
} from "@/lib/risk-assessment/risk-assessment-workspace-mapper";
import type { RiskAssessmentWorkspaceLoadResult } from "@/lib/risk-assessment/risk-assessment-workspace-view";
import {
  isPlanningApproved,
  isRiskAssessmentApproved,
} from "@/lib/risk-assessment/risk-assessment-rules";
import { getCurrentUser, getWorkspaceContext } from "@/lib/auth/server";
import { requirePermissionCodes } from "@/lib/auth/authorize";
import { AuthenticationError, AuthorizationError, DatabaseError } from "@/lib/errors";
import { createServerClient } from "@/lib/supabase/server";
import { CompanyRepository } from "@/repositories/company/company-repository";
import { EngagementRepository } from "@/repositories/engagement/engagement-repository";
import { PlanningRepository } from "@/repositories/planning/planning-repository";
import type { RepositoryContext } from "@/types/context";

type SupabaseSelectResult = Promise<{ data: unknown; error: unknown }>;

type SupabaseFilterBuilder = {
  eq: (column: string, value: string) => SupabaseFilterBuilder;
  is: (column: string, value: null) => SupabaseFilterBuilder;
  order: (column: string, options?: { ascending: boolean }) => SupabaseSelectResult;
  maybeSingle: () => SupabaseSelectResult;
};

type SupabaseTableClient = {
  from: (table: string) => {
    select: (columns: string) => SupabaseFilterBuilder;
  };
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

async function listRows<T>(
  db: SupabaseTableClient,
  table: string,
  riskAssessmentId: string,
  orderBy?: string,
): Promise<T[]> {
  const query = db
    .from(table)
    .select("*")
    .eq("risk_assessment_id", riskAssessmentId)
    .is("deleted_at", null);

  const result = orderBy
    ? await query.order(orderBy, { ascending: true })
    : await query.order("created_at", { ascending: true });

  if (result.error) throw new DatabaseError("Failed to load risk assessment workspace rows");
  return (result.data ?? []) as T[];
}

export async function loadRiskAssessmentWorkspace(
  engagementSlug: string,
): Promise<RiskAssessmentWorkspaceLoadResult> {
  try {
    const user = await getCurrentUser();
    if (!user) return { ok: false, reason: "unauthenticated" };

    requirePermissionCodes(user, RISK_ASSESSMENT_PERMISSIONS.READ);

    const workspace = await getWorkspaceContext();
    if (!workspace.isResolved || !workspace.workspaceId || !user.organizationId) {
      return { ok: false, reason: "no_workspace" };
    }

    const supabase = await createServerClient();
    const db = supabase as unknown as SupabaseTableClient;
    const context = createRepositoryContext(user.id, user.organizationId, workspace.workspaceId);
    const engagementRepository = new EngagementRepository(supabase, context);
    const planningRepository = new PlanningRepository(supabase, context);
    const companyRepository = new CompanyRepository(supabase, context);

    const engagement = await engagementRepository.findBySlugInWorkspace(
      workspace.workspaceId,
      engagementSlug,
    );

    if (!engagement) return { ok: false, reason: "not_found" };

    const plan = await planningRepository.findByEngagementIdAnyState(engagement.id);
    const planningApproved = plan ? isPlanningApproved(plan) : false;

    const assessmentResult = await db
      .from("risk_assessments")
      .select("*")
      .eq("engagement_id", engagement.id)
      .is("deleted_at", null)
      .maybeSingle();

    if (assessmentResult.error) {
      throw new DatabaseError("Failed to load risk assessment.");
    }

    const assessment = (assessmentResult.data ?? null) as RiskAssessmentRecord | null;
    if (!assessment) {
      return {
        ok: true,
        riskAssessment: null,
        engagementSlug: engagement.slug,
        planningApproved,
        riskAssessmentApproved: false,
      };
    }

    const [categories, registerItems, assertionRatings, responses, procedureLinks, notes, company] =
      await Promise.all([
        listRows<RiskCategoryRecord>(db, "risk_categories", assessment.id, "sort_order"),
        listRows<RiskRegisterItemRecord>(db, "risk_register_items", assessment.id, "sort_order"),
        listRows<RiskAssertionRatingRecord>(db, "risk_assertion_ratings", assessment.id),
        listRows<RiskResponseRecord>(db, "risk_responses", assessment.id),
        listRows<RiskProcedureLinkRecord>(db, "risk_procedure_links", assessment.id),
        listRows<RiskNoteRecord>(db, "risk_notes", assessment.id),
        companyRepository.findByIdAnyState(engagement.company_id),
      ]);

    return {
      ok: true,
      riskAssessment: toRiskAssessmentWorkspaceView(
        assessment,
        engagement,
        company?.name ?? "—",
        categories,
        registerItems,
        assertionRatings,
        responses,
        procedureLinks,
        notes,
      ),
      engagementSlug: engagement.slug,
      planningApproved,
      riskAssessmentApproved: isRiskAssessmentApproved(assessment),
    };
  } catch (error) {
    if (error instanceof AuthenticationError) return { ok: false, reason: "unauthenticated" };
    if (error instanceof AuthorizationError) return { ok: false, reason: "forbidden" };
    if (error instanceof DatabaseError) return { ok: false, reason: "error" };
    return { ok: false, reason: "error" };
  }
}

export const loadRiskAssessmentWorkspaceCached = cache(loadRiskAssessmentWorkspace);
