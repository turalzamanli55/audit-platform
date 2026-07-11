import "server-only";

import { cache } from "react";
import { TRIAL_BALANCE_PERMISSIONS } from "@/constants/trial-balance";
import { getCurrentUser, getWorkspaceContext } from "@/lib/auth/server";
import { requirePermissionCodes } from "@/lib/auth/authorize";
import { authorizePermissionCodes } from "@/lib/auth/permissions";
import { AuthenticationError, AuthorizationError } from "@/lib/errors";
import { createServerClient } from "@/lib/supabase/server";
import { EngagementRepository } from "@/repositories/engagement/engagement-repository";
import { TrialBalanceRepository } from "@/repositories/trial-balance/trial-balance-repository";
import { UaieRepository } from "@/repositories/uaie/uaie-repository";
import type { RepositoryContext } from "@/types/context";

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

export type TrialBalanceWorkspaceLoadResult =
  | {
      ok: true;
      engagementId: string;
      engagementSlug: string;
      engagementName: string;
      companyId: string;
      package: Awaited<ReturnType<TrialBalanceRepository["findByEngagementId"]>>;
      lines: Awaited<ReturnType<TrialBalanceRepository["listLines"]>>;
      adjustments: Awaited<ReturnType<TrialBalanceRepository["listAdjustments"]>>;
      mappings: Awaited<ReturnType<TrialBalanceRepository["listMappings"]>>;
      periods: Awaited<ReturnType<TrialBalanceRepository["listPeriods"]>>;
      versions: Awaited<ReturnType<TrialBalanceRepository["listVersions"]>>;
      activity: Awaited<ReturnType<TrialBalanceRepository["listActivity"]>>;
      stagedImports: Array<{
        id: string;
        filename: string;
        confidence: number;
        erp: string;
        createdAt: string;
        rowCount: number;
      }>;
      capabilities: {
        canCreate: boolean;
        canUpdate: boolean;
        canReview: boolean;
        canApprove: boolean;
        canArchive: boolean;
      };
    }
  | { ok: false; reason: "unauthenticated" | "forbidden" | "no_workspace" | "not_found" | "error" };

export async function loadTrialBalanceWorkspace(
  engagementSlug: string,
): Promise<TrialBalanceWorkspaceLoadResult> {
  try {
    const user = await getCurrentUser();
    if (!user) return { ok: false, reason: "unauthenticated" };
    requirePermissionCodes(user, TRIAL_BALANCE_PERMISSIONS.READ);

    const workspace = await getWorkspaceContext();
    if (!workspace.isResolved || !workspace.workspaceId || !user.organizationId) {
      return { ok: false, reason: "no_workspace" };
    }

    const supabase = await createServerClient();
    const context = createRepositoryContext(user.id, user.organizationId, workspace.workspaceId);
    const engagementRepository = new EngagementRepository(supabase, context);
    const tbRepository = new TrialBalanceRepository(supabase, context);
    const uaieRepository = new UaieRepository(supabase, context);

    const engagement = await engagementRepository.findBySlugInWorkspace(
      workspace.workspaceId,
      engagementSlug,
    );
    if (!engagement) return { ok: false, reason: "not_found" };

    const pkg = await tbRepository.findByEngagementId(engagement.id);
    const [lines, adjustments, mappings, periods, versions, activity, companySessions] =
      await Promise.all([
        pkg ? tbRepository.listLines(pkg.id) : Promise.resolve([]),
        pkg ? tbRepository.listAdjustments(pkg.id) : Promise.resolve([]),
        pkg ? tbRepository.listMappings(pkg.id) : Promise.resolve([]),
        pkg ? tbRepository.listPeriods(pkg.id) : Promise.resolve([]),
        pkg ? tbRepository.listVersions(pkg.id) : Promise.resolve([]),
        pkg ? tbRepository.listActivity(pkg.id) : Promise.resolve([]),
        uaieRepository.listSessionsByCompany(engagement.company_id),
      ]);

    const stagedImports = companySessions
      .filter((session) => ["staged", "validated"].includes(session.import_status))
      .slice(0, 20)
      .map((session) => ({
        id: session.id,
        filename: session.source_filename,
        confidence: session.overall_confidence,
        erp: session.detected_erp,
        createdAt: session.created_at,
        rowCount: ((session.summary_json as { rowCount?: number } | null)?.rowCount ?? 0) as number,
      }));

    return {
      ok: true,
      engagementId: engagement.id,
      engagementSlug: engagement.slug,
      engagementName: engagement.name,
      companyId: engagement.company_id,
      package: pkg,
      lines,
      adjustments,
      mappings,
      periods,
      versions,
      activity,
      stagedImports,
      capabilities: {
        canCreate: authorizePermissionCodes(user.permissionCodes, TRIAL_BALANCE_PERMISSIONS.CREATE),
        canUpdate: authorizePermissionCodes(user.permissionCodes, TRIAL_BALANCE_PERMISSIONS.UPDATE),
        canReview: authorizePermissionCodes(user.permissionCodes, TRIAL_BALANCE_PERMISSIONS.REVIEW),
        canApprove: authorizePermissionCodes(user.permissionCodes, TRIAL_BALANCE_PERMISSIONS.APPROVE),
        canArchive: authorizePermissionCodes(user.permissionCodes, TRIAL_BALANCE_PERMISSIONS.ARCHIVE),
      },
    };
  } catch (error) {
    if (error instanceof AuthenticationError) return { ok: false, reason: "unauthenticated" };
    if (error instanceof AuthorizationError) return { ok: false, reason: "forbidden" };
    return { ok: false, reason: "error" };
  }
}

export const loadTrialBalanceWorkspaceCached = cache(loadTrialBalanceWorkspace);
