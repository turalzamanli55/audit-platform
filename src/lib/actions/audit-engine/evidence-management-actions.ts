"use server";

import { headers } from "next/headers";
import { AUDIT_ENGINE_PERMISSIONS, AUDIT_ENGINE_RESOURCE_TYPE } from "@/constants/audit-engine";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import { createAuditEngineAction } from "@/lib/actions/audit-engine/audit-engine-action";
import { assertEvidenceLinkage } from "@/lib/audit-engine/evidence-management";
import { ValidationError } from "@/lib/errors";

export type RegisterEvidenceManagementInput = {
  evidenceId: string;
  name: string;
  procedureId?: string | null;
  workingPaperId?: string | null;
};

export type RegisterEvidenceManagementResult = {
  evidenceId: string;
  linked: true;
};

export const registerEvidenceManagementAction = createAuditEngineAction<
  RegisterEvidenceManagementInput,
  RegisterEvidenceManagementResult
>(
  { module: "audit-engine.evidence-management.register" },
  AUDIT_ENGINE_PERMISSIONS.EVIDENCE_MANAGE,
  async (input, context) => {
    if (!input.evidenceId) throw new ValidationError("Evidence is required");
    assertEvidenceLinkage({
      name: input.name,
      procedureId: input.procedureId,
      workingPaperId: input.workingPaperId,
    });

    const requestHeaders = await headers();
    await emitAuditEvent({
      action: AUDIT_ACTIONS.FIELDWORK_EVIDENCE_ADDED,
      resourceType: AUDIT_ENGINE_RESOURCE_TYPE,
      resourceId: input.evidenceId,
      organizationId: context.organizationId,
      workspaceId: context.workspaceId,
      userId: context.userId,
      userAgent: requestHeaders.get("user-agent"),
      metadata: {
        capability: "evidence-management",
        procedureId: input.procedureId ?? null,
        workingPaperId: input.workingPaperId ?? null,
      },
    });

    return { evidenceId: input.evidenceId, linked: true };
  },
);
