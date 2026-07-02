import "server-only";

import { cache } from "react";
import { FIELDWORK_PERMISSIONS } from "@/constants/fieldwork";
import { toFieldworkWorkspaceView } from "@/lib/fieldwork/fieldwork-workspace-mapper";
import type { FieldworkWorkspaceLoadResult } from "@/lib/fieldwork/fieldwork-workspace-view";
import { isPlanningApproved } from "@/lib/fieldwork/fieldwork-rules";
import { getCurrentUser, getWorkspaceContext } from "@/lib/auth/server";
import { requirePermissionCodes } from "@/lib/auth/authorize";
import { AuthenticationError, AuthorizationError, DatabaseError } from "@/lib/errors";
import { createServerClient } from "@/lib/supabase/server";
import { CompanyRepository } from "@/repositories/company/company-repository";
import { EngagementRepository } from "@/repositories/engagement/engagement-repository";
import { FieldworkRepository } from "@/repositories/fieldwork/fieldwork-repository";
import { PlanningRepository } from "@/repositories/planning/planning-repository";
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

export async function loadFieldworkWorkspace(
  engagementSlug: string,
): Promise<FieldworkWorkspaceLoadResult> {
  try {
    const user = await getCurrentUser();
    if (!user) return { ok: false, reason: "unauthenticated" };

    requirePermissionCodes(user, FIELDWORK_PERMISSIONS.READ);

    const workspace = await getWorkspaceContext();
    if (!workspace.isResolved || !workspace.workspaceId || !user.organizationId) {
      return { ok: false, reason: "no_workspace" };
    }

    const supabase = await createServerClient();
    const context = createRepositoryContext(user.id, user.organizationId, workspace.workspaceId);
    const engagementRepository = new EngagementRepository(supabase, context);
    const fieldworkRepository = new FieldworkRepository(supabase, context);
    const planningRepository = new PlanningRepository(supabase, context);
    const companyRepository = new CompanyRepository(supabase, context);

    const engagement = await engagementRepository.findBySlugInWorkspace(
      workspace.workspaceId,
      engagementSlug,
    );

    if (!engagement) return { ok: false, reason: "not_found" };

    const plan = await planningRepository.findByEngagementIdAnyState(engagement.id);
    const planningApproved = plan ? isPlanningApproved(plan) : false;

    const pkg = await fieldworkRepository.findPackageByEngagementIdAnyState(engagement.id);
    const company = await companyRepository.findByIdAnyState(engagement.company_id);

    if (!pkg) {
      return {
        ok: true,
        fieldwork: null,
        engagementSlug: engagement.slug,
        planningApproved,
      };
    }

    const [programs, groups, procedures, workingPapers, evidence, findings, notes, tickmarkLibrary] =
      await Promise.all([
        fieldworkRepository.listPrograms(pkg.id),
        fieldworkRepository.listProcedureGroups(pkg.id),
        fieldworkRepository.listProcedures(pkg.id),
        fieldworkRepository.listWorkingPapers(pkg.id),
        fieldworkRepository.listEvidence(pkg.id),
        fieldworkRepository.listFindings(pkg.id),
        fieldworkRepository.listNotes(pkg.id),
        fieldworkRepository.listTickmarkLibrary(workspace.workspaceId),
      ]);

    return {
      ok: true,
      fieldwork: toFieldworkWorkspaceView(
        pkg,
        engagement,
        company?.name ?? "—",
        programs,
        groups,
        procedures,
        workingPapers,
        evidence,
        findings,
        notes,
        tickmarkLibrary,
      ),
      engagementSlug: engagement.slug,
      planningApproved,
    };
  } catch (error) {
    if (error instanceof AuthenticationError) return { ok: false, reason: "unauthenticated" };
    if (error instanceof AuthorizationError) return { ok: false, reason: "forbidden" };
    if (error instanceof DatabaseError) return { ok: false, reason: "error" };
    return { ok: false, reason: "error" };
  }
}

export const loadFieldworkWorkspaceCached = cache(loadFieldworkWorkspace);
