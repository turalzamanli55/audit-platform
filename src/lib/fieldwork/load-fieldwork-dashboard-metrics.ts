import "server-only";

import { FIELDWORK_PERMISSIONS } from "@/constants/fieldwork";
import { getCurrentUser, getWorkspaceContext } from "@/lib/auth/server";
import { requirePermissionCodes } from "@/lib/auth/authorize";
import { createServerClient } from "@/lib/supabase/server";
import { FieldworkRepository } from "@/repositories/fieldwork/fieldwork-repository";
import { EngagementRepository } from "@/repositories/engagement/engagement-repository";
import type { RepositoryContext } from "@/types/context";

export type FieldworkDashboardMetrics = {
  pendingReview: number;
  assignedToMe: number;
  openFindings: number;
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

export async function loadFieldworkDashboardMetrics(): Promise<FieldworkDashboardMetrics | null> {
  try {
    const user = await getCurrentUser();
    if (!user) return null;

    requirePermissionCodes(user, FIELDWORK_PERMISSIONS.READ);

    const workspace = await getWorkspaceContext();
    if (!workspace.isResolved || !workspace.workspaceId || !user.organizationId) return null;

    const supabase = await createServerClient();
    const context = createRepositoryContext(user.id, user.organizationId, workspace.workspaceId);
    const engagementRepository = new EngagementRepository(supabase, context);
    const fieldworkRepository = new FieldworkRepository(supabase, context);

    const engagements = await engagementRepository.listByWorkspace(workspace.workspaceId);

    let pendingReview = 0;
    let assignedToMe = 0;
    let openFindings = 0;

    for (const engagement of engagements) {
      const pkg = await fieldworkRepository.findPackageByEngagementId(engagement.id);
      if (!pkg) continue;

      const [procedures, findings] = await Promise.all([
        fieldworkRepository.listProcedures(pkg.id),
        fieldworkRepository.listFindings(pkg.id),
      ]);

      pendingReview += procedures.filter((p) =>
        ["submitted_for_review", "review_in_progress"].includes(p.procedure_status),
      ).length;
      assignedToMe += procedures.filter((p) => p.assigned_auditor_id === user.id).length;
      openFindings += findings.filter((f) => f.finding_status === "open").length;
    }

    return { pendingReview, assignedToMe, openFindings };
  } catch {
    return null;
  }
}
