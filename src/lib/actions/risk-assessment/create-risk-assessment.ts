"use server";

import { headers } from "next/headers";
import { AUDIT_RESOURCE_TYPE, RISK_ASSESSMENT_PERMISSIONS } from "@/constants/risk-assessment";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import { createRiskAssessmentAction as defineRiskAssessmentAction } from "@/lib/actions/risk-assessment/risk-assessment-action";
import { assertMaterialityGate } from "@/lib/materiality/materiality-rules";
import { assertRiskAssessmentGate } from "@/lib/risk-assessment/risk-assessment-rules";
import { validateCreateRiskAssessmentInput } from "@/lib/risk-assessment/validation";
import { createServerClient } from "@/lib/supabase/server";
import { EngagementRepository } from "@/repositories/engagement/engagement-repository";
import { MaterialityRepository } from "@/repositories/materiality/materiality-repository";
import { PlanningRepository } from "@/repositories/planning/planning-repository";
import { RiskAssessmentRepository } from "@/repositories/risk-assessment/risk-assessment-repository";
import type { RepositoryContext } from "@/types/context";
import { NotFoundError } from "@/lib/errors";

export type CreateRiskAssessmentActionInput = {
  engagementId: string;
};

export type CreateRiskAssessmentActionResult = {
  assessmentId: string;
  version: number;
  assessmentVersion: number;
  engagementId: string;
  auditPlanId: string;
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

export const createRiskAssessmentAction = defineRiskAssessmentAction<
  CreateRiskAssessmentActionInput,
  CreateRiskAssessmentActionResult
>({ module: "risk_assessment.create" }, RISK_ASSESSMENT_PERMISSIONS.CREATE, async (input, context) => {
  const validated = validateCreateRiskAssessmentInput(input);

  const supabase = await createServerClient();
  const repositoryContext = createRepositoryContext(
    context.userId,
    context.organizationId,
    context.workspaceId,
  );
  const engagementRepository = new EngagementRepository(supabase, repositoryContext);
  const planningRepository = new PlanningRepository(supabase, repositoryContext);
  const materialityRepository = new MaterialityRepository(supabase, repositoryContext);
  const riskRepository = new RiskAssessmentRepository(supabase, repositoryContext);

  const engagement = await engagementRepository.findById(validated.engagementId);
  if (!engagement || engagement.workspace_id !== context.workspaceId) {
    throw new NotFoundError("Engagement not found");
  }

  const plan = await planningRepository.findByEngagementId(engagement.id);
  assertRiskAssessmentGate(plan);

  const materialityPackage = await materialityRepository.findByEngagementId(engagement.id);
  assertMaterialityGate(materialityPackage);

  const assessment = await riskRepository.createAssessment({
    organization_id: context.organizationId,
    workspace_id: context.workspaceId,
    engagement_id: engagement.id,
    audit_plan_id: plan!.id,
  });

  const planUpdate = await planningRepository.update(plan!.id, plan!.version, {
    risk_status: "placeholder",
  });

  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.RISK_ASSESSMENT_CREATED,
    resourceType: AUDIT_RESOURCE_TYPE,
    resourceId: assessment.id,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    userId: context.userId,
    userAgent: requestHeaders.get("user-agent"),
    metadata: {
      engagementId: engagement.id,
      auditPlanId: plan!.id,
      assessmentVersion: assessment.assessment_version,
      planVersion: planUpdate.version,
    },
  });

  return {
    assessmentId: assessment.id,
    version: assessment.version,
    assessmentVersion: assessment.assessment_version,
    engagementId: engagement.id,
    auditPlanId: plan!.id,
  };
});
