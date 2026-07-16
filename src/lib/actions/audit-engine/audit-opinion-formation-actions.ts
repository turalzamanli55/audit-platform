"use server";

import { headers } from "next/headers";
import { AUDIT_ENGINE_PERMISSIONS, AUDIT_ENGINE_RESOURCE_TYPE } from "@/constants/audit-engine";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import { createAuditEngineAction } from "@/lib/actions/audit-engine/audit-engine-action";
import {
  assertOpinionTypeConsistency,
  deriveAuditOpinionType,
  type OpinionFormationInput,
} from "@/lib/audit-engine/audit-opinion-formation";
import { requireAuditOpinionFormationPermission } from "@/lib/audit-engine/audit-opinion-formation-permissions";
import { ValidationError } from "@/lib/errors";

export type FormAuditOpinionInput = OpinionFormationInput & {
  engagementId: string;
};

export type FormAuditOpinionResult = {
  engagementId: string;
  opinionType: OpinionFormationInput["opinionType"];
  derivedOpinionType: OpinionFormationInput["opinionType"];
};

export const formAuditOpinionAction = createAuditEngineAction<
  FormAuditOpinionInput,
  FormAuditOpinionResult
>(
  { module: "audit-engine.audit-opinion-formation.form" },
  AUDIT_ENGINE_PERMISSIONS.OPINION_FORMATION,
  async (input, context) => {
    if (!input.engagementId) throw new ValidationError("Engagement is required");
    requireAuditOpinionFormationPermission(context.permissionCodes);
    assertOpinionTypeConsistency(input);

    const derivedOpinionType = deriveAuditOpinionType(input);
    const requestHeaders = await headers();
    await emitAuditEvent({
      action: AUDIT_ACTIONS.OPINION_UPDATED,
      resourceType: AUDIT_ENGINE_RESOURCE_TYPE,
      resourceId: input.engagementId,
      organizationId: context.organizationId,
      workspaceId: context.workspaceId,
      userId: context.userId,
      userAgent: requestHeaders.get("user-agent"),
      metadata: {
        capability: "audit-opinion-formation",
        opinionType: input.opinionType,
        derivedOpinionType,
      },
    });

    return {
      engagementId: input.engagementId,
      opinionType: input.opinionType,
      derivedOpinionType,
    };
  },
);
