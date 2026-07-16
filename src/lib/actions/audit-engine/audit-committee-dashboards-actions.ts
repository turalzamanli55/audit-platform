"use server";

import { headers } from "next/headers";
import { AUDIT_ENGINE_PERMISSIONS, AUDIT_ENGINE_RESOURCE_TYPE } from "@/constants/audit-engine";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import { createAuditEngineAction } from "@/lib/actions/audit-engine/audit-engine-action";
import {
  assertAuditCommitteeDashboardKpis,
  auditCommitteeRiskScore,
  type AuditCommitteeDashboardKpis,
} from "@/lib/audit-engine/audit-committee-dashboards";
import { ValidationError } from "@/lib/errors";

export type LoadAuditCommitteeDashboardsInput = AuditCommitteeDashboardKpis & {
  engagementId: string;
};

export type LoadAuditCommitteeDashboardsResult = {
  engagementId: string;
  riskScore: number;
  kpis: AuditCommitteeDashboardKpis;
};

export const loadAuditCommitteeDashboardsAction = createAuditEngineAction<
  LoadAuditCommitteeDashboardsInput,
  LoadAuditCommitteeDashboardsResult
>(
  { module: "audit-engine.audit-committee-dashboards.load" },
  AUDIT_ENGINE_PERMISSIONS.COMMITTEE_DASHBOARD,
  async (input, context) => {
    if (!input.engagementId) throw new ValidationError("Engagement is required");
    const kpis = {
      openFindings: input.openFindings,
      overdueRecommendations: input.overdueRecommendations,
      unclearedReviews: input.unclearedReviews,
      opinionStatus: input.opinionStatus,
    };
    assertAuditCommitteeDashboardKpis(kpis);
    const riskScore = auditCommitteeRiskScore(kpis);

    const requestHeaders = await headers();
    await emitAuditEvent({
      action: AUDIT_ACTIONS.REPORTING_UPDATED,
      resourceType: AUDIT_ENGINE_RESOURCE_TYPE,
      resourceId: input.engagementId,
      organizationId: context.organizationId,
      workspaceId: context.workspaceId,
      userId: context.userId,
      userAgent: requestHeaders.get("user-agent"),
      metadata: { capability: "audit-committee-dashboards", riskScore },
    });

    return { engagementId: input.engagementId, riskScore, kpis };
  },
);
