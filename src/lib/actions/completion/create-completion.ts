"use server";

import { headers } from "next/headers";
import { AUDIT_RESOURCE_TYPE, COMPLETION_PERMISSIONS } from "@/constants/completion";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import { createCompletionAction as defineCompletionAction } from "@/lib/actions/completion/completion-action";
import { assertEngagementCompletionGate } from "@/lib/completion/completion-rules";
import { validateCreateCompletionPackageInput } from "@/lib/completion/validation";
import { createServerClient } from "@/lib/supabase/server";
import { EngagementRepository } from "@/repositories/engagement/engagement-repository";
import { FieldworkRepository } from "@/repositories/fieldwork/fieldwork-repository";
import { MaterialityRepository } from "@/repositories/materiality/materiality-repository";
import { PlanningRepository } from "@/repositories/planning/planning-repository";
import { ReviewRepository } from "@/repositories/review/review-repository";
import { RiskAssessmentRepository } from "@/repositories/risk-assessment/risk-assessment-repository";
import { CompletionRepository } from "@/repositories/completion/completion-repository";
import type { RepositoryContext } from "@/types/context";
import { NotFoundError } from "@/lib/errors";

export type CreateCompletionPackageActionInput = {
  engagementId: string;
};

export type CreateCompletionPackageActionResult = {
  packageId: string;
  version: number;
  packageVersion: number;
  engagementId: string;
  auditPlanId: string;
  reviewPackageId: string | null;
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

export const createCompletionPackageAction = defineCompletionAction<
  CreateCompletionPackageActionInput,
  CreateCompletionPackageActionResult
>({ module: "completion.create" }, COMPLETION_PERMISSIONS.CREATE, async (input, context) => {
  const validated = validateCreateCompletionPackageInput(input);

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
  const fieldworkRepository = new FieldworkRepository(supabase, repositoryContext);
  const reviewRepository = new ReviewRepository(supabase, repositoryContext);
  const completionRepository = new CompletionRepository(supabase, repositoryContext);

  const engagement = await engagementRepository.findById(validated.engagementId);
  if (!engagement || engagement.workspace_id !== context.workspaceId) {
    throw new NotFoundError("Engagement not found");
  }

  const [plan, materiality, riskAssessment, fieldwork, review] = await Promise.all([
    planningRepository.findByEngagementId(engagement.id),
    materialityRepository.findByEngagementId(engagement.id),
    riskRepository.findByEngagementId(engagement.id),
    fieldworkRepository.findPackageByEngagementId(engagement.id),
    reviewRepository.findByEngagementId(engagement.id),
  ]);

  if (!plan) {
    throw new NotFoundError("Audit plan not found for engagement");
  }

  assertEngagementCompletionGate({
    planning: plan,
    materiality,
    riskAssessment,
    fieldwork,
    review,
  });

  const pkg = await completionRepository.createPackage({
    organization_id: context.organizationId,
    workspace_id: context.workspaceId,
    engagement_id: engagement.id,
    audit_plan_id: plan.id,
    review_package_id: review?.id ?? null,
  });

  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.COMPLETION_CREATED,
    resourceType: AUDIT_RESOURCE_TYPE,
    resourceId: pkg.id,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    userId: context.userId,
    userAgent: requestHeaders.get("user-agent"),
    metadata: {
      engagementId: engagement.id,
      auditPlanId: plan.id,
      reviewPackageId: review?.id ?? null,
      packageVersion: pkg.package_version,
    },
  });

  return {
    packageId: pkg.id,
    version: pkg.version,
    packageVersion: pkg.package_version,
    engagementId: engagement.id,
    auditPlanId: plan.id,
    reviewPackageId: review?.id ?? null,
  };
});
