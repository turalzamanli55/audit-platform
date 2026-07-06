"use server";

import { headers } from "next/headers";
import { AUDIT_RESOURCE_TYPE, COMPLETION_PERMISSIONS } from "@/constants/completion";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import { createCompletionAction as defineCompletionAction } from "@/lib/actions/completion/completion-action";
import {
  validateCompletionItemMutationInput,
  validateUpdateCompletionItemInput,
} from "@/lib/completion/validation";
import { createServerClient } from "@/lib/supabase/server";
import { CompletionRepository } from "@/repositories/completion/completion-repository";
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
  reviewRepository: CompletionRepository,
) {
  const pkg = await reviewRepository.validateWorkspaceOwnership(packageId, workspaceId);
  if (pkg.version !== expectedVersion) {
    throw new ValidationError("Review package was modified by another user");
  }
  return pkg;
}

export const updateCompletionItemAction = defineCompletionAction<
  import("@/lib/completion/validation").UpdateCompletionItemInput,
  { itemId: string; packageVersion: number; itemVersion: number }
>({ module: "review.item.update" }, COMPLETION_PERMISSIONS.REVIEW, async (input, context) => {
  const validated = validateUpdateCompletionItemInput(input);

  const supabase = await createServerClient();
  const repositoryContext = createRepositoryContext(
    context.userId,
    context.organizationId,
    context.workspaceId,
  );
  const reviewRepository = new CompletionRepository(supabase, repositoryContext);

  await loadEditablePackage(
    validated.packageId,
    context.workspaceId,
    validated.packageVersion,
    reviewRepository,
  );

  const item = await reviewRepository.updateItem({
    reviewPackageId: validated.packageId,
    itemId: validated.itemId,
    expectedItemVersion: validated.itemVersion,
    assignedReviewerId: validated.assignedReviewerId,
    priority: validated.priority,
    severity: validated.severity,
    dueDate: validated.dueDate,
    itemStatus: validated.itemStatus as never,
  });

  const pkg = await reviewRepository.findById(validated.packageId);

  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.COMPLETION_ITEM_RESOLVED,
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

export const reopenCompletionItemAction = defineCompletionAction<
  import("@/lib/completion/validation").CompletionItemMutationInput,
  { itemId: string; packageVersion: number; itemVersion: number }
>({ module: "review.item.reopen" }, COMPLETION_PERMISSIONS.REVIEW, async (input, context) => {
  const validated = validateCompletionItemMutationInput(input);

  const supabase = await createServerClient();
  const repositoryContext = createRepositoryContext(
    context.userId,
    context.organizationId,
    context.workspaceId,
  );
  const reviewRepository = new CompletionRepository(supabase, repositoryContext);

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
    action: AUDIT_ACTIONS.COMPLETION_ITEM_RETURNED,
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

export const approveCompletionItemAction = defineCompletionAction<
  import("@/lib/completion/validation").CompletionItemMutationInput,
  { itemId: string; packageVersion: number; itemVersion: number }
>({ module: "review.item.approve" }, COMPLETION_PERMISSIONS.REVIEW, async (input, context) => {
  const validated = validateCompletionItemMutationInput(input);

  const supabase = await createServerClient();
  const repositoryContext = createRepositoryContext(
    context.userId,
    context.organizationId,
    context.workspaceId,
  );
  const reviewRepository = new CompletionRepository(supabase, repositoryContext);

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
    action: AUDIT_ACTIONS.COMPLETION_ITEM_RESOLVED,
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
