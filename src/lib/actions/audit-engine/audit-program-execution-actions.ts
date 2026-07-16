"use server";

import { headers } from "next/headers";
import { AUDIT_ENGINE_PERMISSIONS, AUDIT_ENGINE_RESOURCE_TYPE } from "@/constants/audit-engine";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import { createAuditEngineAction } from "@/lib/actions/audit-engine/audit-engine-action";
import {
  assertAuditProgramProcedureTransition,
  type AuditProgramProcedureStatus,
} from "@/lib/audit-engine/audit-program-execution";
import { ValidationError } from "@/lib/errors";

export type TransitionAuditProgramProcedureInput = {
  procedureId: string;
  fromStatus: AuditProgramProcedureStatus;
  toStatus: AuditProgramProcedureStatus;
};

export type TransitionAuditProgramProcedureResult = {
  procedureId: string;
  fromStatus: AuditProgramProcedureStatus;
  toStatus: AuditProgramProcedureStatus;
};

export const transitionAuditProgramProcedureAction = createAuditEngineAction<
  TransitionAuditProgramProcedureInput,
  TransitionAuditProgramProcedureResult
>(
  { module: "audit-engine.audit-program-execution.transition" },
  AUDIT_ENGINE_PERMISSIONS.PROGRAM_EXECUTE,
  async (input, context) => {
    if (!input.procedureId) throw new ValidationError("Procedure is required");
    assertAuditProgramProcedureTransition(input.fromStatus, input.toStatus);

    const requestHeaders = await headers();
    await emitAuditEvent({
      action: AUDIT_ACTIONS.FIELDWORK_PROCEDURE_UPDATED,
      resourceType: AUDIT_ENGINE_RESOURCE_TYPE,
      resourceId: input.procedureId,
      organizationId: context.organizationId,
      workspaceId: context.workspaceId,
      userId: context.userId,
      userAgent: requestHeaders.get("user-agent"),
      metadata: {
        capability: "audit-program-execution",
        fromStatus: input.fromStatus,
        toStatus: input.toStatus,
      },
    });

    return {
      procedureId: input.procedureId,
      fromStatus: input.fromStatus,
      toStatus: input.toStatus,
    };
  },
);
