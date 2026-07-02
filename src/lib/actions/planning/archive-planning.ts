"use server";

import { headers } from "next/headers";
import { AUDIT_RESOURCE_TYPE, PLANNING_PERMISSIONS } from "@/constants/planning";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import { createPlanningAction as definePlanningAction } from "@/lib/actions/planning/planning-action";
import { createServerClient } from "@/lib/supabase/server";
import { PlanningRepository } from "@/repositories/planning/planning-repository";
import type { RepositoryContext } from "@/types/context";
import { ValidationError } from "@/lib/errors";

export type ArchivePlanningActionInput = {
  planId: string;
  version: number;
  archiveReason?: string | null;
};

export type ArchivePlanningActionResult = {
  planId: string;
  version: number;
  status: string;
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

export const archivePlanningAction = definePlanningAction<
  ArchivePlanningActionInput,
  ArchivePlanningActionResult
>({ module: "planning.archive" }, PLANNING_PERMISSIONS.ARCHIVE, async (input, context) => {
  if (!input.planId) {
    throw new ValidationError("Planning record is required");
  }
  if (!Number.isInteger(input.version) || input.version < 1) {
    throw new ValidationError("Planning version is required");
  }

  const supabase = await createServerClient();
  const repository = new PlanningRepository(
    supabase,
    createRepositoryContext(context.userId, context.organizationId, context.workspaceId),
  );

  await repository.validateWorkspaceOwnership(input.planId, context.workspaceId);
  const plan = await repository.archive(input.planId, input.version);

  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.PLANNING_ARCHIVED,
    resourceType: AUDIT_RESOURCE_TYPE,
    resourceId: plan.id,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    userId: context.userId,
    userAgent: requestHeaders.get("user-agent"),
    metadata: {
      version: plan.version,
      archiveReason: input.archiveReason ?? null,
    },
  });

  return {
    planId: plan.id,
    version: plan.version,
    status: plan.status,
  };
});
