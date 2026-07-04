"use server";

import { headers } from "next/headers";
import { AUDIT_RESOURCE_TYPE, MATERIALITY_PERMISSIONS } from "@/constants/materiality";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import { createMaterialityAction as defineMaterialityAction } from "@/lib/actions/materiality/materiality-action";
import {
  assertCanApprove,
  assertCanReturn,
  assertCanSubmit,
  assertSubmitPrerequisites,
} from "@/lib/materiality/materiality-rules";
import { validateMaterialityWorkflowInput } from "@/lib/materiality/validation";
import { createServerClient } from "@/lib/supabase/server";
import { MaterialityRepository } from "@/repositories/materiality/materiality-repository";
import { PlanningRepository } from "@/repositories/planning/planning-repository";
import type { RepositoryContext } from "@/types/context";
import { ValidationError } from "@/lib/errors";

export type MaterialityWorkflowInput = {
  packageId: string;
  version: number;
  notes?: string | null;
};

export type MaterialityWorkflowResult = {
  packageId: string;
  version: number;
  packageStatus: string;
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

export const submitMaterialityPackageAction = defineMaterialityAction<
  MaterialityWorkflowInput,
  MaterialityWorkflowResult
>({ module: "materiality.submit" }, MATERIALITY_PERMISSIONS.UPDATE, async (input, context) => {
  const validated = validateMaterialityWorkflowInput(input);

  const supabase = await createServerClient();
  const repositoryContext = createRepositoryContext(
    context.userId,
    context.organizationId,
    context.workspaceId,
  );
  const materialityRepository = new MaterialityRepository(supabase, repositoryContext);

  const pkg = await materialityRepository.validateWorkspaceOwnership(
    validated.packageId,
    context.workspaceId,
  );
  if (pkg.version !== validated.version) {
    throw new ValidationError("Materiality package was modified by another user");
  }

  assertCanSubmit(pkg);
  assertSubmitPrerequisites({
    selectedBenchmarkId: pkg.selected_benchmark_id,
    overallMateriality: pkg.overall_materiality != null ? Number(pkg.overall_materiality) : null,
    performanceMateriality:
      pkg.performance_materiality != null ? Number(pkg.performance_materiality) : null,
    trivialThreshold: pkg.trivial_threshold != null ? Number(pkg.trivial_threshold) : null,
  });

  const updated = await materialityRepository.submitForReview(validated.packageId, validated.version);

  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.MATERIALITY_SUBMITTED,
    resourceType: AUDIT_RESOURCE_TYPE,
    resourceId: updated.id,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    userId: context.userId,
    userAgent: requestHeaders.get("user-agent"),
    metadata: { version: updated.version },
  });

  return {
    packageId: updated.id,
    version: updated.version,
    packageStatus: updated.package_status,
  };
});

export const returnMaterialityPackageAction = defineMaterialityAction<
  MaterialityWorkflowInput,
  MaterialityWorkflowResult
>({ module: "materiality.return" }, MATERIALITY_PERMISSIONS.REVIEW, async (input, context) => {
  const validated = validateMaterialityWorkflowInput(input);

  const supabase = await createServerClient();
  const repositoryContext = createRepositoryContext(
    context.userId,
    context.organizationId,
    context.workspaceId,
  );
  const materialityRepository = new MaterialityRepository(supabase, repositoryContext);

  const pkg = await materialityRepository.validateWorkspaceOwnership(
    validated.packageId,
    context.workspaceId,
  );
  if (pkg.version !== validated.version) {
    throw new ValidationError("Materiality package was modified by another user");
  }

  assertCanReturn(pkg);

  const updated = await materialityRepository.returnForRevision(
    validated.packageId,
    validated.version,
    validated.notes,
  );

  if (validated.notes) {
    await materialityRepository.addComment({
      materialityPackageId: updated.id,
      commentType: "review",
      body: validated.notes,
    });
  }

  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.MATERIALITY_RETURNED,
    resourceType: AUDIT_RESOURCE_TYPE,
    resourceId: updated.id,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    userId: context.userId,
    userAgent: requestHeaders.get("user-agent"),
    metadata: { version: updated.version },
  });

  return {
    packageId: updated.id,
    version: updated.version,
    packageStatus: updated.package_status,
  };
});

export const approveMaterialityPackageAction = defineMaterialityAction<
  MaterialityWorkflowInput,
  MaterialityWorkflowResult
>({ module: "materiality.approve" }, MATERIALITY_PERMISSIONS.APPROVE, async (input, context) => {
  const validated = validateMaterialityWorkflowInput(input);

  const supabase = await createServerClient();
  const repositoryContext = createRepositoryContext(
    context.userId,
    context.organizationId,
    context.workspaceId,
  );
  const materialityRepository = new MaterialityRepository(supabase, repositoryContext);
  const planningRepository = new PlanningRepository(supabase, repositoryContext);

  const pkg = await materialityRepository.validateWorkspaceOwnership(
    validated.packageId,
    context.workspaceId,
  );
  if (pkg.version !== validated.version) {
    throw new ValidationError("Materiality package was modified by another user");
  }

  assertCanApprove(pkg);

  const updated = await materialityRepository.approve(validated.packageId, validated.version);

  const plan = await planningRepository.findByEngagementId(updated.engagement_id);
  if (plan) {
    await planningRepository.update(plan.id, plan.version, { materiality_status: "integrated" });
  }

  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.MATERIALITY_APPROVED,
    resourceType: AUDIT_RESOURCE_TYPE,
    resourceId: updated.id,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    userId: context.userId,
    userAgent: requestHeaders.get("user-agent"),
    metadata: { version: updated.version },
  });

  return {
    packageId: updated.id,
    version: updated.version,
    packageStatus: updated.package_status,
  };
});
