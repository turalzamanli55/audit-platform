import "server-only";

import { cache } from "react";
import { ENGAGEMENT_PERMISSIONS } from "@/constants/engagement";
import { enrichEngagementMembers } from "@/lib/engagement/engagement-member-view";
import type {
  EngagementWorkspaceLoadResult,
  EngagementWorkspaceView,
} from "@/lib/engagement/engagement-workspace-view";
import { getCurrentUser, getWorkspaceContext } from "@/lib/auth/server";
import { requirePermissionCodes } from "@/lib/auth/authorize";
import { AuthenticationError, AuthorizationError, DatabaseError } from "@/lib/errors";
import { createServerClient } from "@/lib/supabase/server";
import { CompanyRepository } from "@/repositories/company/company-repository";
import { EngagementRepository, type Engagement } from "@/repositories/engagement/engagement-repository";
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

async function toWorkspaceView(
  repository: EngagementRepository,
  companyRepository: CompanyRepository,
  engagement: Engagement,
): Promise<EngagementWorkspaceView> {
  const [company, members] = await Promise.all([
    companyRepository.findByIdAnyState(engagement.company_id),
    repository.listMembers(engagement.id),
  ]);

  const memberViews = await enrichEngagementMembers(members);

  return {
    id: engagement.id,
    slug: engagement.slug,
    name: engagement.name,
    engagementCode: engagement.engagement_code,
    companyId: engagement.company_id,
    companyName: company?.name ?? "—",
    companySlug: company?.slug ?? "",
    engagementType: engagement.engagement_type,
    lifecycleStatus: engagement.lifecycle_status,
    reportingFramework: engagement.reporting_framework,
    periodStart: engagement.period_start,
    periodEnd: engagement.period_end,
    plannedStart: engagement.planned_start,
    plannedEnd: engagement.planned_end,
    description: engagement.description,
    notes: engagement.notes,
    status: engagement.status,
    createdAt: engagement.created_at,
    updatedAt: engagement.updated_at,
    version: engagement.version,
    isArchived: Boolean(engagement.deleted_at) || engagement.status === "archived",
    deletedAt: engagement.deleted_at,
    members: memberViews,
    memberCount: memberViews.length,
  };
}

export async function loadEngagementWorkspace(slug: string): Promise<EngagementWorkspaceLoadResult> {
  try {
    const user = await getCurrentUser();
    if (!user) return { ok: false, reason: "unauthenticated" };

    requirePermissionCodes(user, ENGAGEMENT_PERMISSIONS.READ);

    const workspace = await getWorkspaceContext();
    if (!workspace.isResolved || !workspace.workspaceId || !user.organizationId) {
      return { ok: false, reason: "no_workspace" };
    }

    const supabase = await createServerClient();
    const context = createRepositoryContext(user.id, user.organizationId, workspace.workspaceId);
    const repository = new EngagementRepository(supabase, context);
    const companyRepository = new CompanyRepository(supabase, context);

    const engagement = await repository.findBySlugInWorkspace(workspace.workspaceId, slug);

    if (!engagement) return { ok: false, reason: "not_found" };

    return {
      ok: true,
      engagement: await toWorkspaceView(repository, companyRepository, engagement),
    };
  } catch (error) {
    if (error instanceof AuthenticationError) return { ok: false, reason: "unauthenticated" };
    if (error instanceof AuthorizationError) return { ok: false, reason: "forbidden" };
    if (error instanceof DatabaseError) return { ok: false, reason: "error" };
    return { ok: false, reason: "error" };
  }
}

export const loadEngagementWorkspaceCached = cache(loadEngagementWorkspace);
