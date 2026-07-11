import "server-only";

import { cache } from "react";
import { FINANCIAL_STATEMENTS_PERMISSIONS } from "@/constants/financial-statements";
import {
  toFinancialStatementsWorkspaceView,
  type FinancialStatementCommentRecord,
  type FinancialStatementSectionRecord,
  type FinancialStatementPackageRecord,
  type FinancialStatementVersionRecord,
} from "@/lib/financial-statements/financial-statements-workspace-mapper";
import type { FinancialStatementsWorkspaceLoadResult } from "@/lib/financial-statements/financial-statements-workspace-view";
import { assertOpinionApprovedForFinancialStatements } from "@/lib/opinion/opinion-rules";
import { assertTrialBalanceApprovedForFinancialStatements } from "@/lib/trial-balance/trial-balance-rules";
import { getCurrentUser, getWorkspaceContext } from "@/lib/auth/server";
import { requirePermissionCodes } from "@/lib/auth/authorize";
import { AuthenticationError, AuthorizationError, DatabaseError } from "@/lib/errors";
import { createServerClient } from "@/lib/supabase/server";
import { CompanyRepository } from "@/repositories/company/company-repository";
import { EngagementRepository } from "@/repositories/engagement/engagement-repository";
import { OpinionRepository } from "@/repositories/opinion/opinion-repository";
import { TrialBalanceRepository } from "@/repositories/trial-balance/trial-balance-repository";
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
  let query = db.from(table).select("*").eq("financial_statement_package_id", packageId);
  if (includeSoftDeleteFilter) {
    query = query.is("deleted_at", null);
  }

  const result = orderBy
    ? await query.order(orderBy, { ascending: true })
    : await query.order("created_at", { ascending: true });

  if (result.error) throw new DatabaseError("Failed to load financialStatements workspace rows");
  return (result.data ?? []) as T[];
}

export async function loadFinancialStatementsWorkspace(
  engagementSlug: string,
): Promise<FinancialStatementsWorkspaceLoadResult> {
  try {
    const user = await getCurrentUser();
    if (!user) return { ok: false, reason: "unauthenticated" };

    requirePermissionCodes(user, FINANCIAL_STATEMENTS_PERMISSIONS.READ);

    const workspace = await getWorkspaceContext();
    if (!workspace.isResolved || !workspace.workspaceId || !user.organizationId) {
      return { ok: false, reason: "no_workspace" };
    }

    const supabase = await createServerClient();
    const db = supabase as unknown as SupabaseTableClient;
    const context = createRepositoryContext(user.id, user.organizationId, workspace.workspaceId);
    const engagementRepository = new EngagementRepository(supabase, context);
    const completionRepository = new OpinionRepository(supabase, context);
    const trialBalanceRepository = new TrialBalanceRepository(supabase, context);
    const companyRepository = new CompanyRepository(supabase, context);

    const engagement = await engagementRepository.findBySlugInWorkspace(
      workspace.workspaceId,
      engagementSlug,
    );

    if (!engagement) return { ok: false, reason: "not_found" };

    const [completion, trialBalance] = await Promise.all([
      completionRepository.findByEngagementId(engagement.id),
      trialBalanceRepository.findByEngagementId(engagement.id),
    ]);

    let prerequisitesMet = false;
    try {
      assertOpinionApprovedForFinancialStatements(completion);
      assertTrialBalanceApprovedForFinancialStatements(trialBalance);
      prerequisitesMet = true;
    } catch {
      prerequisitesMet = false;
    }

    const packageResult = await db
      .from("financial_statement_packages")
      .select("*")
      .eq("engagement_id", engagement.id)
      .is("deleted_at", null)
      .maybeSingle();

    if (packageResult.error) {
      throw new DatabaseError("Failed to load financialStatements package.");
    }

    const pkg = (packageResult.data ?? null) as FinancialStatementPackageRecord | null;
    if (!pkg) {
      return {
        ok: true,
        financialStatements: null,
        engagementSlug: engagement.slug,
        prerequisitesMet,
        opinionApproved: completion?.package_status === "approved",
      };
    }

    const [items, comments, versions, company] = await Promise.all([
      listRows<FinancialStatementSectionRecord>(db, "financial_statement_sections", pkg.id, "sort_order"),
      listRows<FinancialStatementCommentRecord>(db, "financial_statement_comments", pkg.id, undefined, false),
      listRows<FinancialStatementVersionRecord>(db, "financial_statement_versions", pkg.id, "version_number", false),
      companyRepository.findByIdAnyState(engagement.company_id),
    ]);

    const view = toFinancialStatementsWorkspaceView(
      pkg,
      engagement,
      company?.name ?? "—",
      items,
      comments,
      (versions as FinancialStatementVersionRecord[])
        .slice()
        .sort((a, b) => b.version_number - a.version_number),
    );

    return {
      ok: true,
      financialStatements: view,
      engagementSlug: engagement.slug,
      prerequisitesMet,
      opinionApproved: completion?.package_status === "approved",
    };
  } catch (error) {
    if (error instanceof AuthenticationError) return { ok: false, reason: "unauthenticated" };
    if (error instanceof AuthorizationError) return { ok: false, reason: "forbidden" };
    if (error instanceof DatabaseError) return { ok: false, reason: "error" };
    return { ok: false, reason: "error" };
  }
}

export const loadFinancialStatementsWorkspaceCached = cache(loadFinancialStatementsWorkspace);
