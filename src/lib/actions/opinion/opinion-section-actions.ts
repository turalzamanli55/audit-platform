"use server";

import { headers } from "next/headers";
import { AUDIT_RESOURCE_TYPE, OPINION_PERMISSIONS } from "@/constants/opinion";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import { createOpinionAction as defineCompletionAction } from "@/lib/actions/opinion/opinion-action";
import {
  validateOpinionSectionMutationInput,
  validateUpdateOpinionSectionInput,
} from "@/lib/opinion/validation";
import { createServerClient } from "@/lib/supabase/server";
import { OpinionRepository } from "@/repositories/opinion/opinion-repository";
import type { RepositoryContext } from "@/types/context";
import { ValidationError } from "@/lib/errors";

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

async function loadEditablePackage(
  packageId: string,
  workspaceId: string,
  expectedVersion: number,
  reviewRepository: OpinionRepository,
) {
  const pkg = await reviewRepository.validateWorkspaceOwnership(packageId, workspaceId);
  if (pkg.version !== expectedVersion) {
    throw new ValidationError("Review package was modified by another user");
  }
  return pkg;
}

export const updateOpinionSectionAction = defineCompletionAction<
  import("@/lib/opinion/validation").UpdateOpinionSectionInput,
  { itemId: string; packageVersion: number; itemVersion: number }
>({ module: "opinion.item.update" }, OPINION_PERMISSIONS.REVIEW, async (input, context) => {
  const validated = validateUpdateOpinionSectionInput(input);

  const supabase = await createServerClient();
  const repositoryContext = createRepositoryContext(
    context.userId,
    context.organizationId,
    context.workspaceId,
  );
  const reviewRepository = new OpinionRepository(supabase, repositoryContext);

  await loadEditablePackage(
    validated.packageId,
    context.workspaceId,
    validated.packageVersion,
    reviewRepository,
  );

  const item = await reviewRepository.updateItem({
    reportingPackageId: validated.packageId,
    itemId: validated.itemId,
    expectedItemVersion: validated.itemVersion,
    assignedReviewerId: validated.assignedReviewerId,
    priority: validated.priority,
    severity: validated.severity,
    dueDate: validated.dueDate,
    sectionStatus: validated.sectionStatus as never,
  });

  const pkg = await reviewRepository.findById(validated.packageId);

  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.OPINION_ITEM_RESOLVED,
    resourceType: AUDIT_RESOURCE_TYPE,
    resourceId: validated.packageId,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    userId: context.userId,
    userAgent: requestHeaders.get("user-agent"),
    metadata: { itemId: item.id },
  });

  return {
    itemId: item.id,
    packageVersion: pkg?.version ?? validated.packageVersion,
    itemVersion: item.version,
  };
});

export const reopenOpinionSectionAction = defineCompletionAction<
  import("@/lib/opinion/validation").OpinionSectionMutationInput,
  { itemId: string; packageVersion: number; itemVersion: number }
>({ module: "opinion.item.reopen" }, OPINION_PERMISSIONS.REVIEW, async (input, context) => {
  const validated = validateOpinionSectionMutationInput(input);

  const supabase = await createServerClient();
  const repositoryContext = createRepositoryContext(
    context.userId,
    context.organizationId,
    context.workspaceId,
  );
  const reviewRepository = new OpinionRepository(supabase, repositoryContext);

  await loadEditablePackage(
    validated.packageId,
    context.workspaceId,
    validated.packageVersion,
    reviewRepository,
  );

  const item = await reviewRepository.reopenItem(
    validated.packageId,
    validated.itemId,
    validated.itemVersion,
  );

  const pkg = await reviewRepository.findById(validated.packageId);

  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.OPINION_ITEM_RETURNED,
    resourceType: AUDIT_RESOURCE_TYPE,
    resourceId: validated.packageId,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    userId: context.userId,
    userAgent: requestHeaders.get("user-agent"),
    metadata: { itemId: item.id },
  });

  return {
    itemId: item.id,
    packageVersion: pkg?.version ?? validated.packageVersion,
    itemVersion: item.version,
  };
});

export const approveOpinionSectionAction = defineCompletionAction<
  import("@/lib/opinion/validation").OpinionSectionMutationInput,
  { itemId: string; packageVersion: number; itemVersion: number }
>({ module: "opinion.item.approve" }, OPINION_PERMISSIONS.REVIEW, async (input, context) => {
  const validated = validateOpinionSectionMutationInput(input);

  const supabase = await createServerClient();
  const repositoryContext = createRepositoryContext(
    context.userId,
    context.organizationId,
    context.workspaceId,
  );
  const reviewRepository = new OpinionRepository(supabase, repositoryContext);

  await loadEditablePackage(
    validated.packageId,
    context.workspaceId,
    validated.packageVersion,
    reviewRepository,
  );

  const item = await reviewRepository.resolveItem(
    validated.packageId,
    validated.itemId,
    validated.itemVersion,
  );

  const pkg = await reviewRepository.findById(validated.packageId);

  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.OPINION_ITEM_RESOLVED,
    resourceType: AUDIT_RESOURCE_TYPE,
    resourceId: validated.packageId,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    userId: context.userId,
    userAgent: requestHeaders.get("user-agent"),
    metadata: { itemId: item.id },
  });

  return {
    itemId: item.id,
    packageVersion: pkg?.version ?? validated.packageVersion,
    itemVersion: item.version,
  };
});
