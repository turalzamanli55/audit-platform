"use server";

import { headers } from "next/headers";
import { ENGAGEMENT_PERMISSIONS, AUDIT_RESOURCE_TYPE } from "@/constants/engagement";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import { createEngagementAction as defineEngagementAction } from "@/lib/actions/engagement/engagement-action";
import { createServerClient } from "@/lib/supabase/server";
import { EngagementRepository } from "@/repositories/engagement/engagement-repository";
import type { RepositoryContext } from "@/types/context";
import { ValidationError } from "@/lib/errors";

export type RestoreEngagementActionInput = {
  engagementId: string;
  version: number;
};

export type RestoreEngagementActionResult = {
  engagementId: string;
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

export const restoreEngagementAction = defineEngagementAction<
  RestoreEngagementActionInput,
  RestoreEngagementActionResult
>({ module: "engagement.restore" }, ENGAGEMENT_PERMISSIONS.ARCHIVE, async (input, context) => {
  if (!input.engagementId) {
    throw new ValidationError("Engagement is required");
  }
  if (!Number.isInteger(input.version) || input.version < 1) {
    throw new ValidationError("Engagement version is required");
  }

  const supabase = await createServerClient();
  const repository = new EngagementRepository(
    supabase,
    createRepositoryContext(context.userId, context.organizationId, context.workspaceId),
  );

  await repository.validateWorkspaceOwnership(input.engagementId, context.workspaceId);
  const engagement = await repository.restore(input.engagementId, input.version);

  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.ENGAGEMENT_RESTORED,
    resourceType: AUDIT_RESOURCE_TYPE,
    resourceId: engagement.id,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    userId: context.userId,
    userAgent: requestHeaders.get("user-agent"),
    metadata: { version: engagement.version },
  });

  return {
    engagementId: engagement.id,
    version: engagement.version,
    status: engagement.status,
  };
});
