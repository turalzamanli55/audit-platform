import "server-only";

import { cache } from "react";
import { REVIEW_PERMISSIONS } from "@/constants/review";
import {
  toReviewWorkspaceView,
  type ReviewCommentRecord,
  type ReviewItemRecord,
  type ReviewPackageRecord,
  type ReviewVersionRecord,
} from "@/lib/review/review-workspace-mapper";
import type { ReviewWorkspaceLoadResult } from "@/lib/review/review-workspace-view";
import {
  isFieldworkSubstantiallyComplete,
  isReviewApproved,
} from "@/lib/review/review-rules";
import { getCurrentUser, getWorkspaceContext } from "@/lib/auth/server";
import { requirePermissionCodes } from "@/lib/auth/authorize";
import { AuthenticationError, AuthorizationError, DatabaseError } from "@/lib/errors";
import { createServerClient } from "@/lib/supabase/server";
import { CompanyRepository } from "@/repositories/company/company-repository";
import { EngagementRepository } from "@/repositories/engagement/engagement-repository";
import { FieldworkRepository } from "@/repositories/fieldwork/fieldwork-repository";
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
  let query = db.from(table).select("*").eq("review_package_id", packageId);
  if (includeSoftDeleteFilter) {
    query = query.is("deleted_at", null);
  }

  const result = orderBy
    ? await query.order(orderBy, { ascending: true })
    : await query.order("created_at", { ascending: true });

  if (result.error) throw new DatabaseError("Failed to load review workspace rows");
  return (result.data ?? []) as T[];
}

export async function loadReviewWorkspace(
  engagementSlug: string,
): Promise<ReviewWorkspaceLoadResult> {
  try {
    const user = await getCurrentUser();
    if (!user) return { ok: false, reason: "unauthenticated" };

    requirePermissionCodes(user, REVIEW_PERMISSIONS.READ);

    const workspace = await getWorkspaceContext();
    if (!workspace.isResolved || !workspace.workspaceId || !user.organizationId) {
      return { ok: false, reason: "no_workspace" };
    }

    const supabase = await createServerClient();
    const db = supabase as unknown as SupabaseTableClient;
    const context = createRepositoryContext(user.id, user.organizationId, workspace.workspaceId);
    const engagementRepository = new EngagementRepository(supabase, context);
    const fieldworkRepository = new FieldworkRepository(supabase, context);
    const companyRepository = new CompanyRepository(supabase, context);

    const engagement = await engagementRepository.findBySlugInWorkspace(
      workspace.workspaceId,
      engagementSlug,
    );

    if (!engagement) return { ok: false, reason: "not_found" };

    const fieldworkPackage = await fieldworkRepository.findPackageByEngagementIdAnyState(
      engagement.id,
    );
    const fieldworkStarted = Boolean(fieldworkPackage);
    const fieldworkSubstantiallyComplete = isFieldworkSubstantiallyComplete(fieldworkPackage);

    const packageResult = await db
      .from("review_packages")
      .select("*")
      .eq("engagement_id", engagement.id)
      .is("deleted_at", null)
      .maybeSingle();

    if (packageResult.error) {
      throw new DatabaseError("Failed to load review package.");
    }

    const pkg = (packageResult.data ?? null) as ReviewPackageRecord | null;
    if (!pkg) {
      return {
        ok: true,
        review: null,
        engagementSlug: engagement.slug,
        fieldworkStarted,
        fieldworkSubstantiallyComplete,
        reviewApproved: false,
      };
    }

    const [items, comments, versions, company] = await Promise.all([
      listRows<ReviewItemRecord>(db, "review_items", pkg.id, "sort_order"),
      listRows<ReviewCommentRecord>(db, "review_comments", pkg.id, undefined, false),
      listRows<ReviewVersionRecord>(
        db,
        "review_versions",
        pkg.id,
        "version_number",
        false,
      ),
      companyRepository.findByIdAnyState(engagement.company_id),
    ]);

    const view = toReviewWorkspaceView(
      pkg,
      engagement,
      company?.name ?? "—",
      items,
      comments,
      (versions as ReviewVersionRecord[]).slice().sort(
        (a, b) => b.version_number - a.version_number,
      ),
    );

    return {
      ok: true,
      review: view,
      engagementSlug: engagement.slug,
      fieldworkStarted,
      fieldworkSubstantiallyComplete,
      reviewApproved: isReviewApproved(pkg),
    };
  } catch (error) {
    if (error instanceof AuthenticationError) return { ok: false, reason: "unauthenticated" };
    if (error instanceof AuthorizationError) return { ok: false, reason: "forbidden" };
    if (error instanceof DatabaseError) return { ok: false, reason: "error" };
    return { ok: false, reason: "error" };
  }
}

export const loadReviewWorkspaceCached = cache(loadReviewWorkspace);
