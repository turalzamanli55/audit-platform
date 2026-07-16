"use server";

import { headers } from "next/headers";
import { AUDIT_ENGINE_PERMISSIONS, AUDIT_ENGINE_RESOURCE_TYPE } from "@/constants/audit-engine";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import { createAuditEngineAction } from "@/lib/actions/audit-engine/audit-engine-action";
import {
  assertSamplingPlan,
  recommendedSampleSize,
  type SamplingPlan,
} from "@/lib/audit-engine/sampling-support";
import { ValidationError } from "@/lib/errors";

export type PlanSamplingSupportInput = SamplingPlan & {
  engagementId: string;
};

export type PlanSamplingSupportResult = {
  engagementId: string;
  sampleSize: number;
  recommendedSampleSize: number;
};

export const planSamplingSupportAction = createAuditEngineAction<
  PlanSamplingSupportInput,
  PlanSamplingSupportResult
>(
  { module: "audit-engine.sampling-support.plan" },
  AUDIT_ENGINE_PERMISSIONS.SAMPLING,
  async (input, context) => {
    if (!input.engagementId) throw new ValidationError("Engagement is required");
    assertSamplingPlan(input);
    const recommended = recommendedSampleSize(input.populationSize, input.riskFactor);

    const requestHeaders = await headers();
    await emitAuditEvent({
      action: AUDIT_ACTIONS.FIELDWORK_PROCEDURE_UPDATED,
      resourceType: AUDIT_ENGINE_RESOURCE_TYPE,
      resourceId: input.engagementId,
      organizationId: context.organizationId,
      workspaceId: context.workspaceId,
      userId: context.userId,
      userAgent: requestHeaders.get("user-agent"),
      metadata: {
        capability: "sampling-support",
        sampleSize: input.sampleSize,
        recommendedSampleSize: recommended,
      },
    });

    return {
      engagementId: input.engagementId,
      sampleSize: input.sampleSize,
      recommendedSampleSize: recommended,
    };
  },
);
