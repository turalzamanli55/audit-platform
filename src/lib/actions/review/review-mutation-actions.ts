"use server";

import { headers } from "next/headers";
import { AUDIT_RESOURCE_TYPE, REVIEW_PERMISSIONS } from "@/constants/review";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import { createReviewAction as defineReviewAction } from "@/lib/actions/review/review-action";
import {
  validateAddReviewCommentInput,
  validateReviewItemMutationInput,
} from "@/lib/review/validation";
import { createServerClient } from "@/lib/supabase/server";
import { ReviewRepository } from "@/repositories/review/review-repository";
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
  reviewRepository: ReviewRepository,
) {
  const pkg = await reviewRepository.validateWorkspaceOwnership(packageId, workspaceId);
  if (pkg.version !== expectedVersion) {
    throw new ValidationError("Review package was modified by another user");
  }
  return pkg;
}

export const commentReviewAction = defineReviewAction<
  import("@/lib/review/validation").AddReviewCommentInput,
  { commentId: string; version: number }
>({ module: "review.comment.add" }, REVIEW_PERMISSIONS.COMMENT, async (input, context) => {
  const validated = validateAddReviewCommentInput(input);

  const supabase = await createServerClient();
  const repositoryContext = createRepositoryContext(
    context.userId,
    context.organizationId,
    context.workspaceId,
  );
  const reviewRepository = new ReviewRepository(supabase, repositoryContext);

  await loadEditablePackage(
    validated.packageId,
    context.workspaceId,
    validated.version,
    reviewRepository,
  );

  const comment = await reviewRepository.addComment({
    reviewPackageId: validated.packageId,
    commentType: validated.commentType,
    body: validated.body,
  });

  const pkg = await reviewRepository.findById(validated.packageId);

  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.REVIEW_COMMENT_ADDED,
    resourceType: AUDIT_RESOURCE_TYPE,
    resourceId: validated.packageId,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    userId: context.userId,
    userAgent: requestHeaders.get("user-agent"),
    metadata: { commentId: comment.id },
  });

  return { commentId: comment.id, version: pkg?.version ?? validated.version };
});

export const resolveReviewItemAction = defineReviewAction<
  import("@/lib/review/validation").ReviewItemMutationInput,
  { itemId: string; packageVersion: number; itemVersion: number }
>({ module: "review.item.resolve" }, REVIEW_PERMISSIONS.REVIEW, async (input, context) => {
  const validated = validateReviewItemMutationInput(input);

  const supabase = await createServerClient();
  const repositoryContext = createRepositoryContext(
    context.userId,
    context.organizationId,
    context.workspaceId,
  );
  const reviewRepository = new ReviewRepository(supabase, repositoryContext);

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
    action: AUDIT_ACTIONS.REVIEW_ITEM_RESOLVED,
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

export const returnReviewItemAction = defineReviewAction<
  import("@/lib/review/validation").ReviewItemMutationInput,
  { itemId: string; packageVersion: number; itemVersion: number }
>({ module: "review.item.return" }, REVIEW_PERMISSIONS.REVIEW, async (input, context) => {
  const validated = validateReviewItemMutationInput(input);

  const supabase = await createServerClient();
  const repositoryContext = createRepositoryContext(
    context.userId,
    context.organizationId,
    context.workspaceId,
  );
  const reviewRepository = new ReviewRepository(supabase, repositoryContext);

  await loadEditablePackage(
    validated.packageId,
    context.workspaceId,
    validated.packageVersion,
    reviewRepository,
  );

  const item = await reviewRepository.returnItem(
    validated.packageId,
    validated.itemId,
    validated.itemVersion,
    validated.returnNotes,
  );

  const pkg = await reviewRepository.findById(validated.packageId);

  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.REVIEW_ITEM_RETURNED,
    resourceType: AUDIT_RESOURCE_TYPE,
    resourceId: validated.packageId,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    userId: context.userId,
    userAgent: requestHeaders.get("user-agent"),
    metadata: { itemId: item.id, returnNotes: validated.returnNotes },
  });

  return {
    itemId: item.id,
    packageVersion: pkg?.version ?? validated.packageVersion,
    itemVersion: item.version,
  };
});
