"use server";

import { headers } from "next/headers";
import { ENGAGEMENT_PERMISSIONS, AUDIT_RESOURCE_TYPE } from "@/constants/engagement";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import { createEngagementAction as defineEngagementAction } from "@/lib/actions/engagement/engagement-action";
import {
  assertEngagementLifecycleReason,
  assertEngagementLifecycleTransition,
  nextEngagementLifecycleStatuses,
} from "@/lib/engagement/engagement-lifecycle-management";
import { createServerClient } from "@/lib/supabase/server";
import { EngagementRepository } from "@/repositories/engagement/engagement-repository";
import {
  EngagementLifecycleManagementRepository,
  type EngagementLifecycleEvent,
} from "@/repositories/engagement/engagement-lifecycle-management-repository";
import { PlanningRepository } from "@/repositories/planning/planning-repository";
import type { RepositoryContext } from "@/types/context";
import type { EngagementLifecycleStatus } from "@/types/engagement";
import { ValidationError } from "@/lib/errors";

export type TransitionEngagementLifecycleInput = {
  engagementId: string;
  version: number;
  toStatus: EngagementLifecycleStatus;
  reason?: string | null;
};

export type TransitionEngagementLifecycleResult = {
  engagementId: string;
  fromStatus: EngagementLifecycleStatus;
  toStatus: EngagementLifecycleStatus;
  version: number;
  nextStatuses: EngagementLifecycleStatus[];
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

export const transitionEngagementLifecycleAction = defineEngagementAction<
  TransitionEngagementLifecycleInput,
  TransitionEngagementLifecycleResult
>(
  { module: "engagement.lifecycle.transition" },
  ENGAGEMENT_PERMISSIONS.UPDATE,
  async (input, context) => {
    if (!input.engagementId) {
      throw new ValidationError("Engagement is required");
    }
    if (!Number.isInteger(input.version) || input.version < 1) {
      throw new ValidationError("Engagement version is required");
    }
    if (!input.toStatus) {
      throw new ValidationError("Target lifecycle status is required");
    }

    const supabase = await createServerClient();
    const repositoryContext = createRepositoryContext(
      context.userId,
      context.organizationId,
      context.workspaceId,
    );
    const repository = new EngagementRepository(supabase, repositoryContext);
    const lifecycleRepository = new EngagementLifecycleManagementRepository(
      supabase,
      repositoryContext,
    );
    const planningRepository = new PlanningRepository(supabase, repositoryContext);

    const engagement = await repository.validateWorkspaceOwnership(
      input.engagementId,
      context.workspaceId,
    );

    const fromStatus = engagement.lifecycle_status;
    assertEngagementLifecycleTransition(fromStatus, input.toStatus);
    assertEngagementLifecycleReason(fromStatus, input.toStatus, input.reason);

    if (input.toStatus === "fieldwork") {
      const plan = await planningRepository.findByEngagementId(input.engagementId);
      if (!plan || plan.planning_status !== "approved") {
        throw new ValidationError(
          "Engagement cannot advance to fieldwork until audit planning is approved.",
        );
      }
    }

    const updated = await repository.update(input.engagementId, input.version, {
      lifecycle_status: input.toStatus,
    });

    await lifecycleRepository.recordEvent({
      engagementId: updated.id,
      organizationId: context.organizationId,
      workspaceId: context.workspaceId,
      fromStatus,
      toStatus: input.toStatus,
      reason: input.reason ?? null,
      metadata: { version: updated.version },
    });

    const requestHeaders = await headers();
    await emitAuditEvent({
      action: AUDIT_ACTIONS.ENGAGEMENT_STATUS_CHANGED,
      resourceType: AUDIT_RESOURCE_TYPE,
      resourceId: updated.id,
      organizationId: context.organizationId,
      workspaceId: context.workspaceId,
      userId: context.userId,
      userAgent: requestHeaders.get("user-agent"),
      metadata: {
        fromStatus,
        toStatus: input.toStatus,
        reason: input.reason ?? null,
        version: updated.version,
      },
    });

    return {
      engagementId: updated.id,
      fromStatus,
      toStatus: input.toStatus,
      version: updated.version,
      nextStatuses: nextEngagementLifecycleStatuses(input.toStatus),
    };
  },
);

export type EngagementLifecycleHistoryInput = {
  engagementId: string;
};

export type EngagementLifecycleHistoryResult = {
  engagementId: string;
  events: Array<{
    id: string;
    fromStatus: EngagementLifecycleStatus | null;
    toStatus: EngagementLifecycleStatus;
    reason: string | null;
    actorId: string | null;
    createdAt: string;
  }>;
};

function toHistoryEntry(event: EngagementLifecycleEvent) {
  return {
    id: event.id,
    fromStatus: event.from_status,
    toStatus: event.to_status,
    reason: event.reason,
    actorId: event.actor_id,
    createdAt: event.created_at,
  };
}

export const listEngagementLifecycleHistoryAction = defineEngagementAction<
  EngagementLifecycleHistoryInput,
  EngagementLifecycleHistoryResult
>(
  { module: "engagement.lifecycle.history" },
  ENGAGEMENT_PERMISSIONS.READ,
  async (input, context) => {
    if (!input.engagementId) {
      throw new ValidationError("Engagement is required");
    }

    const supabase = await createServerClient();
    const repositoryContext = createRepositoryContext(
      context.userId,
      context.organizationId,
      context.workspaceId,
    );
    const repository = new EngagementRepository(supabase, repositoryContext);
    const lifecycleRepository = new EngagementLifecycleManagementRepository(
      supabase,
      repositoryContext,
    );

    await repository.validateWorkspaceOwnership(input.engagementId, context.workspaceId);
    const events = await lifecycleRepository.listByEngagement(input.engagementId);

    return {
      engagementId: input.engagementId,
      events: events.map(toHistoryEntry),
    };
  },
);
