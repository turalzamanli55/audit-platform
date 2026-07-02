"use server";

import { headers } from "next/headers";
import { AUDIT_RESOURCE_TYPE, FIELDWORK_PERMISSIONS } from "@/constants/fieldwork";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import { createFieldworkAction as defineFieldworkAction } from "@/lib/actions/fieldwork/fieldwork-action";
import { assertFieldworkGate } from "@/lib/fieldwork/fieldwork-rules";
import { validateCreateFieldworkInput } from "@/lib/fieldwork/validation";
import { createServerClient } from "@/lib/supabase/server";
import { EngagementRepository } from "@/repositories/engagement/engagement-repository";
import { FieldworkRepository } from "@/repositories/fieldwork/fieldwork-repository";
import { PlanningRepository } from "@/repositories/planning/planning-repository";
import type { RepositoryContext } from "@/types/context";
import { NotFoundError } from "@/lib/errors";

export type CreateFieldworkActionInput = {
  engagementId: string;
};

export type CreateFieldworkActionResult = {
  packageId: string;
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

export const createFieldworkAction = defineFieldworkAction<
  CreateFieldworkActionInput,
  CreateFieldworkActionResult
>({ module: "fieldwork.create" }, FIELDWORK_PERMISSIONS.CREATE, async (input, context) => {
  const validated = validateCreateFieldworkInput(input);

  const supabase = await createServerClient();
  const ctx = createRepositoryContext(context.userId, context.organizationId, context.workspaceId);
  const engagementRepository = new EngagementRepository(supabase, ctx);
  const planningRepository = new PlanningRepository(supabase, ctx);
  const fieldworkRepository = new FieldworkRepository(supabase, ctx);

  const engagement = await engagementRepository.findById(validated.engagementId);
  if (!engagement || engagement.workspace_id !== context.workspaceId) {
    throw new NotFoundError("Engagement not found");
  }

  const plan = await planningRepository.findByEngagementId(engagement.id);
  assertFieldworkGate(plan, engagement.lifecycle_status);

  const pkg = await fieldworkRepository.createPackage({
    organization_id: context.organizationId,
    workspace_id: context.workspaceId,
    engagement_id: engagement.id,
    audit_plan_id: plan!.id,
  });

  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.FIELDWORK_CREATED,
    resourceType: AUDIT_RESOURCE_TYPE,
    resourceId: pkg.id,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    userId: context.userId,
    userAgent: requestHeaders.get("user-agent"),
    metadata: { engagementId: engagement.id, auditPlanId: plan!.id },
  });

  return {
    packageId: pkg.id,
    version: pkg.version,
    engagementId: engagement.id,
  };
});
