import "server-only";

import { cache } from "react";
import { RISK_ASSESSMENT_PERMISSIONS } from "@/constants/risk-assessment";
import { getCurrentUser, getWorkspaceContext } from "@/lib/auth/server";
import { requirePermissionCodes } from "@/lib/auth/authorize";
import { AuthenticationError, AuthorizationError, DatabaseError } from "@/lib/errors";
import { createServerClient } from "@/lib/supabase/server";
import { EngagementRepository } from "@/repositories/engagement/engagement-repository";
import type { RepositoryContext } from "@/types/context";

type RiskActivityRow = {
  id: string;
  action: string;
  summary: string | null;
  created_by: string | null;
  created_at: string;
  metadata: unknown;
};

type RiskAssessmentRow = {
  id: string;
};

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

export type RiskAssessmentActivityEntry = {
  id: string;
  action: string;
  summary: string | null;
  actorId: string | null;
  createdAt: string;
  metadata: Record<string, unknown>;
};

export type RiskAssessmentActivityView = {
  entries: RiskAssessmentActivityEntry[];
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

function toActivityEntry(row: RiskActivityRow): RiskAssessmentActivityEntry {
  return {
    id: row.id,
    action: row.action,
    summary: row.summary,
    actorId: row.created_by,
    createdAt: row.created_at,
    metadata: (row.metadata ?? {}) as Record<string, unknown>,
  };
}

export type RiskAssessmentActivityLoadResult =
  | { ok: true; activity: RiskAssessmentActivityView }
  | { ok: false; reason: "unauthenticated" | "forbidden" | "no_workspace" | "not_found" | "error" };

export async function loadRiskAssessmentActivity(
  engagementSlug: string,
): Promise<RiskAssessmentActivityLoadResult> {
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

    const engagement = await engagementRepository.findBySlugInWorkspace(
      workspace.workspaceId,
      engagementSlug,
    );

    if (!engagement) return { ok: false, reason: "not_found" };

    const assessmentResult = await db
      .from("risk_assessments")
      .select("id")
      .eq("engagement_id", engagement.id)
      .is("deleted_at", null)
      .maybeSingle();

    if (assessmentResult.error) throw new DatabaseError("Failed to load risk assessment.");

    const assessment = (assessmentResult.data ?? null) as RiskAssessmentRow | null;
    if (!assessment) return { ok: true, activity: { entries: [] } };

    const rowsResult = await db
      .from("risk_activity")
      .select("*")
      .eq("risk_assessment_id", assessment.id)
      .order("created_at", { ascending: false });

    if (rowsResult.error) throw new DatabaseError("Failed to load risk activity.");

    const rows = (rowsResult.data ?? []) as RiskActivityRow[];
    return { ok: true, activity: { entries: rows.map(toActivityEntry) } };
  } catch (error) {
    if (error instanceof AuthenticationError) return { ok: false, reason: "unauthenticated" };
    if (error instanceof AuthorizationError) return { ok: false, reason: "forbidden" };
    if (error instanceof DatabaseError) return { ok: false, reason: "error" };
    return { ok: false, reason: "error" };
  }
}

export const loadRiskAssessmentActivityCached = cache(loadRiskAssessmentActivity);
