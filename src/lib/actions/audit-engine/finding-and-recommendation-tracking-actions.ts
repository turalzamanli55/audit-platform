"use server";

import { headers } from "next/headers";
import { AUDIT_ENGINE_PERMISSIONS, AUDIT_ENGINE_RESOURCE_TYPE } from "@/constants/audit-engine";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import { createAuditEngineAction } from "@/lib/actions/audit-engine/audit-engine-action";
import {
  assertFindingRecord,
  type FindingRecord,
} from "@/lib/audit-engine/finding-and-recommendation-tracking";
import { ValidationError } from "@/lib/errors";

export type TrackFindingAndRecommendationInput = FindingRecord & {
  engagementId: string;
  findingId: string;
};

export type TrackFindingAndRecommendationResult = {
  engagementId: string;
  findingId: string;
  severity: FindingRecord["severity"];
};

export const trackFindingAndRecommendationAction = createAuditEngineAction<
  TrackFindingAndRecommendationInput,
  TrackFindingAndRecommendationResult
>(
  { module: "audit-engine.finding-and-recommendation-tracking.track" },
  AUDIT_ENGINE_PERMISSIONS.FINDING_TRACK,
  async (input, context) => {
    if (!input.engagementId) throw new ValidationError("Engagement is required");
    if (!input.findingId) throw new ValidationError("Finding is required");
    assertFindingRecord(input);

    const requestHeaders = await headers();
    await emitAuditEvent({
      action: AUDIT_ACTIONS.FIELDWORK_FINDING_ADDED,
      resourceType: AUDIT_ENGINE_RESOURCE_TYPE,
      resourceId: input.findingId,
      organizationId: context.organizationId,
      workspaceId: context.workspaceId,
      userId: context.userId,
      userAgent: requestHeaders.get("user-agent"),
      metadata: {
        capability: "finding-and-recommendation-tracking",
        severity: input.severity,
        ownerId: input.ownerId ?? null,
      },
    });

    return {
      engagementId: input.engagementId,
      findingId: input.findingId,
      severity: input.severity,
    };
  },
);
