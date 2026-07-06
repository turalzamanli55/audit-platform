import "server-only";

import { cache } from "react";
import { COMPLETION_PERMISSIONS } from "@/constants/completion";
import {
  toCompletionWorkspaceView,
  type CompletionCommentRecord,
  type CompletionItemRecord,
  type CompletionPackageRecord,
  type CompletionVersionRecord,
} from "@/lib/completion/completion-workspace-mapper";
import type { CompletionWorkspaceLoadResult } from "@/lib/completion/completion-workspace-view";
import { assertEngagementCompletionGate } from "@/lib/completion/completion-rules";
import { getCurrentUser, getWorkspaceContext } from "@/lib/auth/server";
import { requirePermissionCodes } from "@/lib/auth/authorize";
import { AuthenticationError, AuthorizationError, DatabaseError } from "@/lib/errors";
import { createServerClient } from "@/lib/supabase/server";
import { CompanyRepository } from "@/repositories/company/company-repository";
import { EngagementRepository } from "@/repositories/engagement/engagement-repository";
import { PlanningRepository } from "@/repositories/planning/planning-repository";
import { MaterialityRepository } from "@/repositories/materiality/materiality-repository";
import { RiskAssessmentRepository } from "@/repositories/risk-assessment/risk-assessment-repository";
import { FieldworkRepository } from "@/repositories/fieldwork/fieldwork-repository";
import { ReviewRepository } from "@/repositories/review/review-repository";
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
  packageId: string,
  orderBy?: string,
  includeSoftDeleteFilter = true,
): Promise<T[]> {
  let query = db.from(table).select("*").eq("completion_package_id", packageId);
  if (includeSoftDeleteFilter) {
    query = query.is("deleted_at", null);
  }

  const result = orderBy
    ? await query.order(orderBy, { ascending: true })
    : await query.order("created_at", { ascending: true });

  if (result.error) throw new DatabaseError("Failed to load completion workspace rows");
  return (result.data ?? []) as T[];
}

export async function loadCompletionWorkspace(
  engagementSlug: string,
): Promise<CompletionWorkspaceLoadResult> {
  try {
    const user = await getCurrentUser();
    if (!user) return { ok: false, reason: "unauthenticated" };

    requirePermissionCodes(user, COMPLETION_PERMISSIONS.READ);

    const workspace = await getWorkspaceContext();
    if (!workspace.isResolved || !workspace.workspaceId || !user.organizationId) {
      return { ok: false, reason: "no_workspace" };
    }

    const supabase = await createServerClient();
    const db = supabase as unknown as SupabaseTableClient;
    const context = createRepositoryContext(user.id, user.organizationId, workspace.workspaceId);
    const engagementRepository = new EngagementRepository(supabase, context);
    const auditPlanRepository = new PlanningRepository(supabase, context);
    const materialityRepository = new MaterialityRepository(supabase, context);
    const riskRepository = new RiskAssessmentRepository(supabase, context);
    const fieldworkRepository = new FieldworkRepository(supabase, context);
    const reviewRepository = new ReviewRepository(supabase, context);
    const companyRepository = new CompanyRepository(supabase, context);

    const engagement = await engagementRepository.findBySlugInWorkspace(
      workspace.workspaceId,
      engagementSlug,
    );

    if (!engagement) return { ok: false, reason: "not_found" };

    const [plan, materiality, riskAssessment, fieldwork, review] = await Promise.all([
      auditPlanRepository.findByEngagementId(engagement.id),
      materialityRepository.findByEngagementId(engagement.id),
      riskRepository.findByEngagementId(engagement.id),
      fieldworkRepository.findPackageByEngagementIdAnyState(engagement.id),
      reviewRepository.findByEngagementId(engagement.id),
    ]);

    let prerequisitesMet = false;
    try {
      assertEngagementCompletionGate({
        planning: plan,
        materiality,
        riskAssessment,
        fieldwork,
        review,
      });
      prerequisitesMet = true;
    } catch {
      prerequisitesMet = false;
    }

    const packageResult = await db
      .from("completion_packages")
      .select("*")
      .eq("engagement_id", engagement.id)
      .is("deleted_at", null)
      .maybeSingle();

    if (packageResult.error) {
      throw new DatabaseError("Failed to load completion package.");
    }

    const pkg = (packageResult.data ?? null) as CompletionPackageRecord | null;
    if (!pkg) {
      return {
        ok: true,
        completion: null,
        engagementSlug: engagement.slug,
        prerequisitesMet,
        reviewApproved: review?.package_status === "approved",
      };
    }

    const [items, comments, versions, company] = await Promise.all([
      listRows<CompletionItemRecord>(db, "completion_items", pkg.id, "sort_order"),
      listRows<CompletionCommentRecord>(db, "completion_comments", pkg.id, undefined, false),
      listRows<CompletionVersionRecord>(
        db,
        "completion_versions",
        pkg.id,
        "version_number",
        false,
      ),
      companyRepository.findByIdAnyState(engagement.company_id),
    ]);

    const view = toCompletionWorkspaceView(
      pkg,
      engagement,
      company?.name ?? "—",
      items,
      comments,
      (versions as CompletionVersionRecord[]).slice().sort(
        (a, b) => b.version_number - a.version_number,
      ),
    );

    return {
      ok: true,
      completion: view,
      engagementSlug: engagement.slug,
      prerequisitesMet,
      reviewApproved: review?.package_status === "approved",
    };
  } catch (error) {
    if (error instanceof AuthenticationError) return { ok: false, reason: "unauthenticated" };
    if (error instanceof AuthorizationError) return { ok: false, reason: "forbidden" };
    if (error instanceof DatabaseError) return { ok: false, reason: "error" };
    return { ok: false, reason: "error" };
  }
}

export const loadCompletionWorkspaceCached = cache(loadCompletionWorkspace);
