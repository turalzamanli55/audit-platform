import "server-only";

import { cache } from "react";
import { ENGAGEMENT_PERMISSIONS } from "@/constants/engagement";
import type { EngagementListItem, EngagementListLoadResult } from "@/lib/engagement/engagement-list-item";
import { getCurrentUser, getWorkspaceContext } from "@/lib/auth/server";
import { requirePermissionCodes } from "@/lib/auth/authorize";
import { AuthenticationError, AuthorizationError, DatabaseError } from "@/lib/errors";
import { createServerClient } from "@/lib/supabase/server";
import { CompanyRepository } from "@/repositories/company/company-repository";
import { EngagementRepository } from "@/repositories/engagement/engagement-repository";
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

export const loadEngagementList = cache(async function loadEngagementList(): Promise<EngagementListLoadResult> {
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
    const engagementRepository = new EngagementRepository(supabase, context);
    const companyRepository = new CompanyRepository(supabase, context);

    const [engagements, companies] = await Promise.all([
      engagementRepository.listByWorkspace(workspace.workspaceId, { includeArchived: true }),
      companyRepository.listByWorkspace(workspace.workspaceId, { includeArchived: true }),
    ]);

    const companyNames = new Map(companies.map((company) => [company.id, company.name]));

    const items: EngagementListItem[] = engagements.map((engagement) => ({
      id: engagement.id,
      slug: engagement.slug,
      name: engagement.name,
      engagementCode: engagement.engagement_code,
      companyId: engagement.company_id,
      companyName: companyNames.get(engagement.company_id) ?? "—",
      engagementType: engagement.engagement_type,
      lifecycleStatus: engagement.lifecycle_status,
      reportingFramework: engagement.reporting_framework,
      periodStart: engagement.period_start,
      periodEnd: engagement.period_end,
      status: engagement.status,
      updatedAt: engagement.updated_at,
      version: engagement.version,
      isArchived: Boolean(engagement.deleted_at) || engagement.status === "archived",
    }));

    return { ok: true, items };
  } catch (error) {
    if (error instanceof AuthenticationError) return { ok: false, reason: "unauthenticated" };
    if (error instanceof AuthorizationError) return { ok: false, reason: "forbidden" };
    if (error instanceof DatabaseError) return { ok: false, reason: "error" };
    return { ok: false, reason: "error" };
  }
});
