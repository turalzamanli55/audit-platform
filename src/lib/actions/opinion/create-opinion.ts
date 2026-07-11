"use server";

import { headers } from "next/headers";
import { AUDIT_RESOURCE_TYPE, OPINION_PERMISSIONS } from "@/constants/opinion";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import { createOpinionAction as defineReportingAction } from "@/lib/actions/opinion/opinion-action";
import { assertReportingApprovedForOpinion } from "@/lib/reporting/reporting-rules";
import { validateCreateOpinionPackageInput } from "@/lib/opinion/validation";
import { createServerClient } from "@/lib/supabase/server";
import { EngagementRepository } from "@/repositories/engagement/engagement-repository";
import { PlanningRepository } from "@/repositories/planning/planning-repository";
import { ReportingRepository } from "@/repositories/reporting/reporting-repository";
import { OpinionRepository } from "@/repositories/opinion/opinion-repository";
import type { RepositoryContext } from "@/types/context";
import { NotFoundError } from "@/lib/errors";

export type CreateOpinionPackageActionInput = {
  engagementId: string;
};

export type CreateOpinionPackageActionResult = {
  packageId: string;
  version: number;
  packageVersion: number;
  engagementId: string;
  auditPlanId: string;
  reportingPackageId: string | null;
};

function createRepositoryContext(
  userId: string,
  organizationId: string,
  workspaceId: string,
): RepositoryContext {
  return {
    userId,
    tenant: {
      organization: { organizationId, isResolved: true },
      workspace: { workspaceId, isResolved: true },
      company: { companyId: null, isResolved: false },
      permissions: { permissions: [], isResolved: false },
      roles: { roles: [], isResolved: false },
    },
  };
}

export const createOpinionPackageAction = defineReportingAction<
  CreateOpinionPackageActionInput,
  CreateOpinionPackageActionResult
>({ module: "opinion.create" }, OPINION_PERMISSIONS.CREATE, async (input, context) => {
  const validated = validateCreateOpinionPackageInput(input);

  const supabase = await createServerClient();
  const repositoryContext = createRepositoryContext(
    context.userId,
    context.organizationId,
    context.workspaceId,
  );
  const engagementRepository = new EngagementRepository(supabase, repositoryContext);
  const planningRepository = new PlanningRepository(supabase, repositoryContext);
  const completionRepository = new ReportingRepository(supabase, repositoryContext);
  const reportingRepository = new OpinionRepository(supabase, repositoryContext);

  const engagement = await engagementRepository.findById(validated.engagementId);
  if (!engagement || engagement.workspace_id !== context.workspaceId) {
    throw new NotFoundError("Engagement not found");
  }

  const [plan, completion] = await Promise.all([
    planningRepository.findByEngagementId(engagement.id),
    completionRepository.findByEngagementId(engagement.id),
  ]);

  if (!plan) {
    throw new NotFoundError("Audit plan not found for engagement");
  }

  assertReportingApprovedForOpinion(completion);

  const pkg = await reportingRepository.createPackage({
    organization_id: context.organizationId,
    workspace_id: context.workspaceId,
    engagement_id: engagement.id,
    audit_plan_id: plan.id,
    reporting_package_id: completion?.id ?? null,
  });

  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.OPINION_CREATED,
    resourceType: AUDIT_RESOURCE_TYPE,
    resourceId: pkg.id,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    userId: context.userId,
    userAgent: requestHeaders.get("user-agent"),
    metadata: {
      engagementId: engagement.id,
      auditPlanId: plan.id,
      reportingPackageId: completion?.id ?? null,
      packageVersion: pkg.package_version,
    },
  });

  return {
    packageId: pkg.id,
    version: pkg.version,
    packageVersion: pkg.package_version,
    engagementId: engagement.id,
    auditPlanId: plan.id,
    reportingPackageId: completion?.id ?? null,
  };
});
