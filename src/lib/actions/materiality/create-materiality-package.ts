"use server";

import { headers } from "next/headers";
import { AUDIT_RESOURCE_TYPE, MATERIALITY_PERMISSIONS } from "@/constants/materiality";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import { createMaterialityAction as defineMaterialityAction } from "@/lib/actions/materiality/materiality-action";
import { assertMaterialityCreateGate } from "@/lib/materiality/materiality-rules";
import { validateCreateMaterialityPackageInput } from "@/lib/materiality/validation";
import { createServerClient } from "@/lib/supabase/server";
import { EngagementRepository } from "@/repositories/engagement/engagement-repository";
import { MaterialityRepository } from "@/repositories/materiality/materiality-repository";
import { PlanningRepository } from "@/repositories/planning/planning-repository";
import type { RepositoryContext } from "@/types/context";
import { NotFoundError } from "@/lib/errors";

export type CreateMaterialityPackageActionInput = {
  engagementId: string;
};

export type CreateMaterialityPackageActionResult = {
  packageId: string;
  version: number;
  packageVersion: number;
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

export const createMaterialityPackageAction = defineMaterialityAction<
  CreateMaterialityPackageActionInput,
  CreateMaterialityPackageActionResult
>({ module: "materiality.create" }, MATERIALITY_PERMISSIONS.CREATE, async (input, context) => {
  const validated = validateCreateMaterialityPackageInput(input);

  const supabase = await createServerClient();
  const repositoryContext = createRepositoryContext(
    context.userId,
    context.organizationId,
    context.workspaceId,
  );
  const engagementRepository = new EngagementRepository(supabase, repositoryContext);
  const planningRepository = new PlanningRepository(supabase, repositoryContext);
  const materialityRepository = new MaterialityRepository(supabase, repositoryContext);

  const engagement = await engagementRepository.findById(validated.engagementId);
  if (!engagement || engagement.workspace_id !== context.workspaceId) {
    throw new NotFoundError("Engagement not found");
  }

  const plan = await planningRepository.findByEngagementId(engagement.id);
  assertMaterialityCreateGate(plan);

  const pkg = await materialityRepository.createPackage({
    organization_id: context.organizationId,
    workspace_id: context.workspaceId,
    engagement_id: engagement.id,
    audit_plan_id: plan!.id,
  });

  const planUpdate = await planningRepository.update(plan!.id, plan!.version, {
    materiality_status: "placeholder",
  });

  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.MATERIALITY_CREATED,
    resourceType: AUDIT_RESOURCE_TYPE,
    resourceId: pkg.id,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    userId: context.userId,
    userAgent: requestHeaders.get("user-agent"),
    metadata: {
      engagementId: engagement.id,
      auditPlanId: plan!.id,
      packageVersion: pkg.package_version,
      planVersion: planUpdate.version,
    },
  });

  return {
    packageId: pkg.id,
    version: pkg.version,
    packageVersion: pkg.package_version,
    engagementId: engagement.id,
    auditPlanId: plan!.id,
  };
});
