"use server";

import { headers } from "next/headers";
import { AUDIT_RESOURCE_TYPE, PLANNING_PERMISSIONS } from "@/constants/planning";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import { createPlanningAction as definePlanningAction } from "@/lib/actions/planning/planning-action";
import {
  assertCanApprove,
  assertCanReturn,
  assertCanRevise,
  assertCanSubmit,
  assertSubmissionPrerequisites,
} from "@/lib/planning/planning-rules";
import { createServerClient } from "@/lib/supabase/server";
import { EngagementRepository } from "@/repositories/engagement/engagement-repository";
import { PlanningRepository } from "@/repositories/planning/planning-repository";
import type { RepositoryContext } from "@/types/context";
import { ValidationError } from "@/lib/errors";

export type PlanningWorkflowInput = {
  planId: string;
  version: number;
  notes?: string | null;
};

export type PlanningWorkflowResult = {
  planId: string;
  version: number;
  planningStatus: string;
  planVersion: number;
  engagementLifecycleStatus?: string;
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

async function getPlanOrThrow(
  repository: PlanningRepository,
  planId: string,
  workspaceId: string,
  version: number,
) {
  if (!planId) throw new ValidationError("Planning record is required");
  if (!Number.isInteger(version) || version < 1) {
    throw new ValidationError("Planning version is required");
  }
  const plan = await repository.validateWorkspaceOwnership(planId, workspaceId);
  repository.validateOptimisticLock(plan, version);
  return plan;
}

export const submitPlanningForReviewAction = definePlanningAction<
  PlanningWorkflowInput,
  PlanningWorkflowResult
>(
  { module: "planning.submit" },
  PLANNING_PERMISSIONS.SUBMIT,
  async (input, context) => {
    const supabase = await createServerClient();
    const ctx = createRepositoryContext(
      context.userId,
      context.organizationId,
      context.workspaceId,
    );
    const repository = new PlanningRepository(supabase, ctx);
    const plan = await getPlanOrThrow(
      repository,
      input.planId,
      context.workspaceId,
      input.version,
    );

    assertCanSubmit(plan);
    assertSubmissionPrerequisites(plan);

    const updated = await repository.submitForReview(plan.id, input.version);

    const requestHeaders = await headers();
    await emitAuditEvent({
      action: AUDIT_ACTIONS.PLANNING_SUBMITTED,
      resourceType: AUDIT_RESOURCE_TYPE,
      resourceId: updated.id,
      organizationId: context.organizationId,
      workspaceId: context.workspaceId,
      userId: context.userId,
      userAgent: requestHeaders.get("user-agent"),
      metadata: { planVersion: updated.plan_version, version: updated.version },
    });

    return {
      planId: updated.id,
      version: updated.version,
      planningStatus: updated.planning_status,
      planVersion: updated.plan_version,
    };
  },
);

export const returnPlanningAction = definePlanningAction<
  PlanningWorkflowInput,
  PlanningWorkflowResult
>(
  { module: "planning.return" },
  PLANNING_PERMISSIONS.REVIEW,
  async (input, context) => {
    const supabase = await createServerClient();
    const ctx = createRepositoryContext(
      context.userId,
      context.organizationId,
      context.workspaceId,
    );
    const repository = new PlanningRepository(supabase, ctx);
    const plan = await getPlanOrThrow(
      repository,
      input.planId,
      context.workspaceId,
      input.version,
    );

    assertCanReturn(plan);

    const updated = await repository.returnForRevision(
      plan.id,
      input.version,
      input.notes?.trim() || null,
    );

    if (input.notes?.trim()) {
      await repository.addComment({
        auditPlanId: plan.id,
        engagementId: plan.engagement_id,
        organizationId: plan.organization_id,
        workspaceId: plan.workspace_id,
        body: input.notes.trim(),
        commentType: "return",
      });
    }

    const requestHeaders = await headers();
    await emitAuditEvent({
      action: AUDIT_ACTIONS.PLANNING_RETURNED,
      resourceType: AUDIT_RESOURCE_TYPE,
      resourceId: updated.id,
      organizationId: context.organizationId,
      workspaceId: context.workspaceId,
      userId: context.userId,
      userAgent: requestHeaders.get("user-agent"),
      metadata: { planVersion: updated.plan_version, version: updated.version },
    });

    return {
      planId: updated.id,
      version: updated.version,
      planningStatus: updated.planning_status,
      planVersion: updated.plan_version,
    };
  },
);

export const approvePlanningAction = definePlanningAction<
  PlanningWorkflowInput,
  PlanningWorkflowResult
>(
  { module: "planning.approve" },
  PLANNING_PERMISSIONS.APPROVE,
  async (input, context) => {
    const supabase = await createServerClient();
    const ctx = createRepositoryContext(
      context.userId,
      context.organizationId,
      context.workspaceId,
    );
    const repository = new PlanningRepository(supabase, ctx);
    const engagementRepository = new EngagementRepository(supabase, ctx);

    const plan = await getPlanOrThrow(
      repository,
      input.planId,
      context.workspaceId,
      input.version,
    );

    assertCanApprove(plan);

    const updated = await repository.approve(plan.id, input.version);

    const engagement = await engagementRepository.findById(plan.engagement_id);
    let engagementLifecycleStatus = engagement?.lifecycle_status;

    if (engagement && engagement.lifecycle_status === "planning") {
      const nextEngagement = await engagementRepository.updateLifecycleStatus(
        engagement.id,
        engagement.version,
        "fieldwork",
      );
      engagementLifecycleStatus = nextEngagement.lifecycle_status;
    }

    const requestHeaders = await headers();
    await emitAuditEvent({
      action: AUDIT_ACTIONS.PLANNING_APPROVED,
      resourceType: AUDIT_RESOURCE_TYPE,
      resourceId: updated.id,
      organizationId: context.organizationId,
      workspaceId: context.workspaceId,
      userId: context.userId,
      userAgent: requestHeaders.get("user-agent"),
      metadata: {
        planVersion: updated.plan_version,
        version: updated.version,
        engagementId: plan.engagement_id,
      },
    });

    return {
      planId: updated.id,
      version: updated.version,
      planningStatus: updated.planning_status,
      planVersion: updated.plan_version,
      engagementLifecycleStatus,
    };
  },
);

export const revisePlanningAction = definePlanningAction<
  PlanningWorkflowInput,
  PlanningWorkflowResult
>(
  { module: "planning.revise" },
  PLANNING_PERMISSIONS.APPROVE,
  async (input, context) => {
    const supabase = await createServerClient();
    const ctx = createRepositoryContext(
      context.userId,
      context.organizationId,
      context.workspaceId,
    );
    const repository = new PlanningRepository(supabase, ctx);
    const plan = await getPlanOrThrow(
      repository,
      input.planId,
      context.workspaceId,
      input.version,
    );

    assertCanRevise(plan);

    const updated = await repository.revise(plan.id, input.version, input.notes?.trim() || null);

    const requestHeaders = await headers();
    await emitAuditEvent({
      action: AUDIT_ACTIONS.PLANNING_REVISED,
      resourceType: AUDIT_RESOURCE_TYPE,
      resourceId: updated.id,
      organizationId: context.organizationId,
      workspaceId: context.workspaceId,
      userId: context.userId,
      userAgent: requestHeaders.get("user-agent"),
      metadata: {
        planVersion: updated.plan_version,
        version: updated.version,
      },
    });

    return {
      planId: updated.id,
      version: updated.version,
      planningStatus: updated.planning_status,
      planVersion: updated.plan_version,
    };
  },
);
