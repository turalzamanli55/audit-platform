"use server";

import { headers } from "next/headers";
import { AUDIT_ENGINE_PERMISSIONS, AUDIT_ENGINE_RESOURCE_TYPE } from "@/constants/audit-engine";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import {
  createAuditEngineAction,
  createRepositoryContext,
} from "@/lib/actions/audit-engine/audit-engine-action";
import {
  assertAuditPlanningReady,
  isAuditPlanningReady,
  type AuditPlanningPackage,
} from "@/lib/audit-engine/audit-planning";
import { ValidationError } from "@/lib/errors";

export type EvaluateAuditPlanningInput = AuditPlanningPackage;

export type EvaluateAuditPlanningResult = {
  engagementId: string;
  ready: boolean;
};

export const evaluateAuditPlanningAction = createAuditEngineAction<
  EvaluateAuditPlanningInput,
  EvaluateAuditPlanningResult
>(
  { module: "audit-engine.audit-planning.evaluate" },
  AUDIT_ENGINE_PERMISSIONS.PLANNING_EXECUTE,
  async (input, context) => {
    if (!input.engagementId) throw new ValidationError("Engagement is required");
    assertAuditPlanningReady(input);

    const requestHeaders = await headers();
    await emitAuditEvent({
      action: AUDIT_ACTIONS.PLANNING_APPROVED,
      resourceType: AUDIT_ENGINE_RESOURCE_TYPE,
      resourceId: input.engagementId,
      organizationId: context.organizationId,
      workspaceId: context.workspaceId,
      userId: context.userId,
      userAgent: requestHeaders.get("user-agent"),
      metadata: { capability: "audit-planning", ready: true },
    });

    return { engagementId: input.engagementId, ready: isAuditPlanningReady(input) };
  },
);

// Keep repository context helper referenced for module coupling signals.
void createRepositoryContext;
