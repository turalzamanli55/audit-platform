"use server";

import { headers } from "next/headers";
import { AUDIT_ENGINE_PERMISSIONS, AUDIT_ENGINE_RESOURCE_TYPE } from "@/constants/audit-engine";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import { createAuditEngineAction } from "@/lib/actions/audit-engine/audit-engine-action";
import {
  assertQualityReviewCleared,
  isQualityReviewCleared,
  requiresEqcr,
  type QualityReviewGate,
} from "@/lib/audit-engine/quality-review-support";
import { ValidationError } from "@/lib/errors";

export type EvaluateQualityReviewSupportInput = QualityReviewGate & {
  engagementId: string;
};

export type EvaluateQualityReviewSupportResult = {
  engagementId: string;
  cleared: boolean;
  eqcrRequired: boolean;
};

export const evaluateQualityReviewSupportAction = createAuditEngineAction<
  EvaluateQualityReviewSupportInput,
  EvaluateQualityReviewSupportResult
>(
  { module: "audit-engine.quality-review-support.evaluate" },
  AUDIT_ENGINE_PERMISSIONS.QUALITY_REVIEW,
  async (input, context) => {
    if (!input.engagementId) throw new ValidationError("Engagement is required");
    const eqcrRequired = requiresEqcr(input.engagementRisk);
    const gate = { ...input, eqcrRequired };
    assertQualityReviewCleared(gate);

    const requestHeaders = await headers();
    await emitAuditEvent({
      action: AUDIT_ACTIONS.REVIEW_APPROVED,
      resourceType: AUDIT_ENGINE_RESOURCE_TYPE,
      resourceId: input.engagementId,
      organizationId: context.organizationId,
      workspaceId: context.workspaceId,
      userId: context.userId,
      userAgent: requestHeaders.get("user-agent"),
      metadata: { capability: "quality-review-support", eqcrRequired },
    });

    return {
      engagementId: input.engagementId,
      cleared: isQualityReviewCleared(gate),
      eqcrRequired,
    };
  },
);
