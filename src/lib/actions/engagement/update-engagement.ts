"use server";

import { headers } from "next/headers";
import { ENGAGEMENT_PERMISSIONS, AUDIT_RESOURCE_TYPE } from "@/constants/engagement";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import { createEngagementAction as defineEngagementAction } from "@/lib/actions/engagement/engagement-action";
import { createServerClient } from "@/lib/supabase/server";
import { EngagementRepository } from "@/repositories/engagement/engagement-repository";
import type { RepositoryContext } from "@/types/context";
import type { EngagementLifecycleStatus } from "@/types/engagement";
import { validateUpdateEngagementInput } from "@/lib/engagement/validation";
import { ValidationError } from "@/lib/errors";
import { toSlug } from "@/utils/auth-validation";

export type UpdateEngagementActionInput = {
  engagementId: string;
  version: number;
  name?: string;
  engagementCode?: string | null;
  engagementType?: import("@/types/engagement").EngagementType;
  lifecycleStatus?: EngagementLifecycleStatus;
  reportingFramework?: import("@/types/engagement").EngagementReportingFramework;
  periodStart?: string | null;
  periodEnd?: string | null;
  plannedStart?: string | null;
  plannedEnd?: string | null;
  description?: string | null;
  notes?: string | null;
};

export type UpdateEngagementActionResult = {
  engagementId: string;
  slug: string;
  version: number;
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

export const updateEngagementAction = defineEngagementAction<
  UpdateEngagementActionInput,
  UpdateEngagementActionResult
>({ module: "engagement.update" }, ENGAGEMENT_PERMISSIONS.UPDATE, async (input, context) => {
  if (!input.engagementId) {
    throw new ValidationError("Engagement is required");
  }
  if (!Number.isInteger(input.version) || input.version < 1) {
    throw new ValidationError("Engagement version is required");
  }

  const patch = validateUpdateEngagementInput({
    name: input.name,
    engagementCode: input.engagementCode,
    engagementType: input.engagementType,
    lifecycleStatus: input.lifecycleStatus,
    reportingFramework: input.reportingFramework,
    periodStart: input.periodStart,
    periodEnd: input.periodEnd,
    plannedStart: input.plannedStart,
    plannedEnd: input.plannedEnd,
    description: input.description,
    notes: input.notes,
  });

  const supabase = await createServerClient();
  const repositoryContext = createRepositoryContext(
    context.userId,
    context.organizationId,
    context.workspaceId,
  );
  const repository = new EngagementRepository(supabase, repositoryContext);

  await repository.validateWorkspaceOwnership(input.engagementId, context.workspaceId);

  const updatePayload: Parameters<EngagementRepository["update"]>[2] = {
    engagement_code: patch.engagementCode,
    engagement_type: patch.engagementType,
    lifecycle_status: patch.lifecycleStatus,
    reporting_framework: patch.reportingFramework,
    period_start: patch.periodStart,
    period_end: patch.periodEnd,
    planned_start: patch.plannedStart,
    planned_end: patch.plannedEnd,
    description: patch.description,
    notes: patch.notes,
  };

  if (patch.name) {
    updatePayload.name = patch.name;
    updatePayload.slug = await repository.resolveUniqueSlug(
      context.workspaceId,
      toSlug(patch.name),
      input.engagementId,
    );
  }

  const engagement = await repository.update(input.engagementId, input.version, updatePayload);

  const requestHeaders = await headers();
  const auditAction =
    patch.lifecycleStatus ? AUDIT_ACTIONS.ENGAGEMENT_STATUS_CHANGED : AUDIT_ACTIONS.ENGAGEMENT_UPDATED;

  await emitAuditEvent({
    action: auditAction,
    resourceType: AUDIT_RESOURCE_TYPE,
    resourceId: engagement.id,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    userId: context.userId,
    userAgent: requestHeaders.get("user-agent"),
    metadata: { version: engagement.version, slug: engagement.slug },
  });

  return {
    engagementId: engagement.id,
    slug: engagement.slug,
    version: engagement.version,
  };
});
