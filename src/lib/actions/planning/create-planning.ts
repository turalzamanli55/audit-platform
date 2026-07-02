"use server";

import { headers } from "next/headers";
import { AUDIT_RESOURCE_TYPE, PLANNING_PERMISSIONS } from "@/constants/planning";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import { createPlanningAction as definePlanningAction } from "@/lib/actions/planning/planning-action";
import { validateCreatePlanningInput } from "@/lib/planning/validation";
import { createServerClient } from "@/lib/supabase/server";
import { EngagementRepository } from "@/repositories/engagement/engagement-repository";
import { PlanningRepository } from "@/repositories/planning/planning-repository";
import type { RepositoryContext } from "@/types/context";
import { NotFoundError } from "@/lib/errors";

export type CreatePlanningActionInput = {
  engagementId: string;
  financialReportingFramework?: string | null;
};

export type CreatePlanningActionResult = {
  planId: string;
  version: number;
  engagementId: string;
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

export const createPlanningAction = definePlanningAction<
  CreatePlanningActionInput,
  CreatePlanningActionResult
>({ module: "planning.create" }, PLANNING_PERMISSIONS.CREATE, async (input, context) => {
  const validated = validateCreatePlanningInput(input);

  const supabase = await createServerClient();
  const repositoryContext = createRepositoryContext(
    context.userId,
    context.organizationId,
    context.workspaceId,
  );

  const engagementRepository = new EngagementRepository(supabase, repositoryContext);
  const planningRepository = new PlanningRepository(supabase, repositoryContext);

  const engagement = await engagementRepository.findById(validated.engagementId);
  if (!engagement || engagement.workspace_id !== context.workspaceId) {
    throw new NotFoundError("Engagement not found");
  }

  const plan = await planningRepository.create({
    organization_id: context.organizationId,
    workspace_id: context.workspaceId,
    engagement_id: engagement.id,
    financial_reporting_framework:
      validated.financialReportingFramework ?? engagement.reporting_framework,
  });

  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.PLANNING_CREATED,
    resourceType: AUDIT_RESOURCE_TYPE,
    resourceId: plan.id,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    userId: context.userId,
    userAgent: requestHeaders.get("user-agent"),
    metadata: {
      engagementId: engagement.id,
      planVersion: plan.plan_version,
    },
  });

  return {
    planId: plan.id,
    version: plan.version,
    engagementId: engagement.id,
  };
});
