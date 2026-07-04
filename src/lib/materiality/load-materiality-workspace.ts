import "server-only";

import { cache } from "react";
import { MATERIALITY_PERMISSIONS } from "@/constants/materiality";
import {
  toMaterialityWorkspaceView,
  type MaterialityBenchmarkRecord,
  type MaterialityCalculationRecord,
  type MaterialityCommentRecord,
  type MaterialityPackageRecord,
  type MaterialityVersionRecord,
} from "@/lib/materiality/materiality-workspace-mapper";
import type { MaterialityWorkspaceLoadResult } from "@/lib/materiality/materiality-workspace-view";
import { isMaterialityApproved, isPlanningApproved } from "@/lib/materiality/materiality-rules";
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
  packageId: string,
  orderBy?: string,
  includeSoftDeleteFilter = true,
): Promise<T[]> {
  let query = db.from(table).select("*").eq("materiality_package_id", packageId);
  if (includeSoftDeleteFilter) {
    query = query.is("deleted_at", null);
  }

  const result = orderBy
    ? await query.order(orderBy, { ascending: true })
    : await query.order("created_at", { ascending: true });

  if (result.error) throw new DatabaseError("Failed to load materiality workspace rows");
  return (result.data ?? []) as T[];
}

export async function loadMaterialityWorkspace(
  engagementSlug: string,
): Promise<MaterialityWorkspaceLoadResult> {
  try {
    const user = await getCurrentUser();
    if (!user) return { ok: false, reason: "unauthenticated" };

    requirePermissionCodes(user, MATERIALITY_PERMISSIONS.READ);

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

    const packageResult = await db
      .from("materiality_packages")
      .select("*")
      .eq("engagement_id", engagement.id)
      .is("deleted_at", null)
      .maybeSingle();

    if (packageResult.error) {
      throw new DatabaseError("Failed to load materiality package.");
    }

    const pkg = (packageResult.data ?? null) as MaterialityPackageRecord | null;
    if (!pkg) {
      return {
        ok: true,
        materiality: null,
        materialityPackage: null,
        engagementSlug: engagement.slug,
        planningApproved,
        materialityApproved: false,
      };
    }

    const [benchmarks, calculations, comments, versions, company] = await Promise.all([
      listRows<MaterialityBenchmarkRecord>(db, "materiality_benchmarks", pkg.id, "sort_order"),
      listRows<MaterialityCalculationRecord>(
        db,
        "materiality_calculations",
        pkg.id,
        undefined,
        false,
      ),
      listRows<MaterialityCommentRecord>(db, "materiality_comments", pkg.id, undefined, false),
      listRows<MaterialityVersionRecord>(
        db,
        "materiality_versions",
        pkg.id,
        "version_number",
        false,
      ),
      companyRepository.findByIdAnyState(engagement.company_id),
    ]);

    const view = toMaterialityWorkspaceView(
      pkg,
      engagement,
      company?.name ?? "—",
      benchmarks,
      calculations,
      comments,
      (versions as MaterialityVersionRecord[]).slice().sort(
        (a, b) => b.version_number - a.version_number,
      ),
    );

    return {
      ok: true,
      materiality: view,
      materialityPackage: view,
      engagementSlug: engagement.slug,
      planningApproved,
      materialityApproved: isMaterialityApproved(pkg),
    };
  } catch (error) {
    if (error instanceof AuthenticationError) return { ok: false, reason: "unauthenticated" };
    if (error instanceof AuthorizationError) return { ok: false, reason: "forbidden" };
    if (error instanceof DatabaseError) return { ok: false, reason: "error" };
    return { ok: false, reason: "error" };
  }
}

export const loadMaterialityWorkspaceCached = cache(loadMaterialityWorkspace);
