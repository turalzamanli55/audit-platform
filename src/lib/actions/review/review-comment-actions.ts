"use server";

import { headers } from "next/headers";
import { AUDIT_RESOURCE_TYPE, REVIEW_PERMISSIONS } from "@/constants/review";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import { createReviewAction as defineReviewAction } from "@/lib/actions/review/review-action";
import {
  validateReviewCommentMutationInput,
  validateUpdateReviewCommentInput,
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

export const updateReviewCommentAction = defineReviewAction<
  import("@/lib/review/validation").UpdateReviewCommentInput,
  { commentId: string; packageVersion: number; commentVersion: number }
>({ module: "review.comment.update" }, REVIEW_PERMISSIONS.COMMENT, async (input, context) => {
  const validated = validateUpdateReviewCommentInput(input);

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

  const comment = await reviewRepository.updateComment({
    commentId: validated.commentId,
    reviewPackageId: validated.packageId,
    expectedVersion: validated.commentVersion,
    body: validated.body,
    mentions: validated.mentions,
    attachmentMetadata: validated.attachmentMetadata,
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

  return {
    commentId: comment.id,
    packageVersion: pkg?.version ?? validated.packageVersion,
    commentVersion: comment.version,
  };
});

export const archiveReviewCommentAction = defineReviewAction<
  import("@/lib/review/validation").ReviewCommentMutationInput,
  { commentId: string; packageVersion: number }
>({ module: "review.comment.archive" }, REVIEW_PERMISSIONS.COMMENT, async (input, context) => {
  const validated = validateReviewCommentMutationInput(input);

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

  await reviewRepository.archiveComment(
    validated.packageId,
    validated.commentId,
    validated.commentVersion,
  );

  const pkg = await reviewRepository.findById(validated.packageId);

  return {
    commentId: validated.commentId,
    packageVersion: pkg?.version ?? validated.packageVersion,
  };
});

export const restoreReviewCommentAction = defineReviewAction<
  import("@/lib/review/validation").ReviewCommentMutationInput,
  { commentId: string; packageVersion: number }
>({ module: "review.comment.restore" }, REVIEW_PERMISSIONS.COMMENT, async (input, context) => {
  const validated = validateReviewCommentMutationInput(input);

  const supabase = await createServerClient();
  const repositoryContext = createRepositoryContext(
    context.userId,
    context.organizationId,
    context.workspaceId,
  );
  const reviewRepository = new ReviewRepository(supabase, repositoryContext);

  await reviewRepository.validateWorkspaceOwnership(validated.packageId, context.workspaceId);

  await reviewRepository.restoreComment(
    validated.packageId,
    validated.commentId,
    validated.commentVersion,
  );

  const pkg = await reviewRepository.findById(validated.packageId);

  return {
    commentId: validated.commentId,
    packageVersion: pkg?.version ?? validated.packageVersion,
  };
});

export const resolveReviewCommentAction = defineReviewAction<
  import("@/lib/review/validation").ReviewCommentMutationInput,
  { commentId: string; packageVersion: number }
>({ module: "review.comment.resolve" }, REVIEW_PERMISSIONS.COMMENT, async (input, context) => {
  const validated = validateReviewCommentMutationInput(input);

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

  await reviewRepository.resolveComment(
    validated.packageId,
    validated.commentId,
    validated.commentVersion,
  );

  const pkg = await reviewRepository.findById(validated.packageId);

  return {
    commentId: validated.commentId,
    packageVersion: pkg?.version ?? validated.packageVersion,
  };
});

export const unresolveReviewCommentAction = defineReviewAction<
  import("@/lib/review/validation").ReviewCommentMutationInput,
  { commentId: string; packageVersion: number }
>({ module: "review.comment.unresolve" }, REVIEW_PERMISSIONS.COMMENT, async (input, context) => {
  const validated = validateReviewCommentMutationInput(input);

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

  await reviewRepository.unresolveComment(
    validated.packageId,
    validated.commentId,
    validated.commentVersion,
  );

  const pkg = await reviewRepository.findById(validated.packageId);

  return {
    commentId: validated.commentId,
    packageVersion: pkg?.version ?? validated.packageVersion,
  };
});
