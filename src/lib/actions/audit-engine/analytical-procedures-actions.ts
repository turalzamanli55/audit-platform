"use server";

import { headers } from "next/headers";
import { AUDIT_ENGINE_PERMISSIONS, AUDIT_ENGINE_RESOURCE_TYPE } from "@/constants/audit-engine";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import { createAuditEngineAction } from "@/lib/actions/audit-engine/audit-engine-action";
import {
  analyticalVariancePct,
  assertAnalyticalProcedureInput,
  isAnalyticalVarianceSignificant,
  type AnalyticalProcedureResult,
} from "@/lib/audit-engine/analytical-procedures";

export type EvaluateAnalyticalProceduresInput = AnalyticalProcedureResult & {
  engagementId: string;
};

export type EvaluateAnalyticalProceduresResult = {
  engagementId: string;
  accountCode: string;
  variancePct: number;
  significant: boolean;
};

export const evaluateAnalyticalProceduresAction = createAuditEngineAction<
  EvaluateAnalyticalProceduresInput,
  EvaluateAnalyticalProceduresResult
>(
  { module: "audit-engine.analytical-procedures.evaluate" },
  AUDIT_ENGINE_PERMISSIONS.ANALYTICAL_PROCEDURES,
  async (input, context) => {
    assertAnalyticalProcedureInput(input);
    const variancePct = analyticalVariancePct(input);
    const significant = isAnalyticalVarianceSignificant(input);

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
        capability: "analytical-procedures",
        accountCode: input.accountCode,
        variancePct,
        significant,
      },
    });

    return {
      engagementId: input.engagementId,
      accountCode: input.accountCode,
      variancePct,
      significant,
    };
  },
);
