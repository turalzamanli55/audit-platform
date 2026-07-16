"use server";

import { headers } from "next/headers";
import { AUDIT_ENGINE_PERMISSIONS, AUDIT_ENGINE_RESOURCE_TYPE } from "@/constants/audit-engine";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import {
  createAuditEngineAction,
  createRepositoryContext,
} from "@/lib/actions/audit-engine/audit-engine-action";
import { createServerClient } from "@/lib/supabase/server";
import { AuditReportGenerationRepository } from "@/repositories/audit-engine/audit-report-generation-repository";
import type { AuditReportPackage } from "@/lib/audit-engine/audit-report-generation";
import { ValidationError } from "@/lib/errors";

export type GenerateAuditReportInput = AuditReportPackage & {
  engagementId: string;
};

export type GenerateAuditReportResult = {
  engagementId: string;
  ready: boolean;
  hasReportingPackage: boolean;
  hasOpinionPackage: boolean;
};

export const generateAuditReportAction = createAuditEngineAction<
  GenerateAuditReportInput,
  GenerateAuditReportResult
>(
  { module: "audit-engine.audit-report-generation.generate" },
  AUDIT_ENGINE_PERMISSIONS.REPORT_GENERATE,
  async (input, context) => {
    if (!input.engagementId) throw new ValidationError("Engagement is required");

    const supabase = await createServerClient();
    const repository = new AuditReportGenerationRepository(
      supabase,
      createRepositoryContext(context.userId, context.organizationId, context.workspaceId),
    );

    const readiness = repository.buildReadiness({
      opinionApproved: input.opinionApproved,
      findingsClosedOrAccepted: input.findingsClosedOrAccepted,
      financialStatementsApproved: input.financialStatementsApproved,
      representationLetterReceived: input.representationLetterReceived,
    });
    repository.assertReady(readiness);

    const [reporting, opinion] = await Promise.all([
      repository.findReportingPackageByEngagement(input.engagementId),
      repository.findOpinionPackageByEngagement(input.engagementId),
    ]);

    const requestHeaders = await headers();
    await emitAuditEvent({
      action: AUDIT_ACTIONS.REPORTING_APPROVED,
      resourceType: AUDIT_ENGINE_RESOURCE_TYPE,
      resourceId: input.engagementId,
      organizationId: context.organizationId,
      workspaceId: context.workspaceId,
      userId: context.userId,
      userAgent: requestHeaders.get("user-agent"),
      metadata: {
        capability: "audit-report-generation",
        hasReportingPackage: Boolean(reporting),
        hasOpinionPackage: Boolean(opinion),
      },
    });

    return {
      engagementId: input.engagementId,
      ready: readiness.ready,
      hasReportingPackage: Boolean(reporting),
      hasOpinionPackage: Boolean(opinion),
    };
  },
);
