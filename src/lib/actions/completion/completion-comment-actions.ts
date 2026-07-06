"use server";

import { headers } from "next/headers";
import { AUDIT_RESOURCE_TYPE, COMPLETION_PERMISSIONS } from "@/constants/completion";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import { createCompletionAction as defineCompletionAction } from "@/lib/actions/completion/completion-action";
import {
  validateCompletionCommentMutationInput,
  validateUpdateCompletionCommentInput,
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

export const updateCompletionCommentAction = defineCompletionAction<
  import("@/lib/completion/validation").UpdateCompletionCommentInput,
  { commentId: string; packageVersion: number; commentVersion: number }
>({ module: "review.comment.update" }, COMPLETION_PERMISSIONS.COMMENT, async (input, context) => {
  const validated = validateUpdateCompletionCommentInput(input);

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
    action: AUDIT_ACTIONS.COMPLETION_COMMENT_ADDED,
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

export const archiveCompletionCommentAction = defineCompletionAction<
  import("@/lib/completion/validation").CompletionCommentMutationInput,
  { commentId: string; packageVersion: number }
>({ module: "review.comment.archive" }, COMPLETION_PERMISSIONS.COMMENT, async (input, context) => {
  const validated = validateCompletionCommentMutationInput(input);

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

export const restoreCompletionCommentAction = defineCompletionAction<
  import("@/lib/completion/validation").CompletionCommentMutationInput,
  { commentId: string; packageVersion: number }
>({ module: "review.comment.restore" }, COMPLETION_PERMISSIONS.COMMENT, async (input, context) => {
  const validated = validateCompletionCommentMutationInput(input);

  const supabase = await createServerClient();
  const repositoryContext = createRepositoryContext(
    context.userId,
    context.organizationId,
    context.workspaceId,
  );
  const reviewRepository = new CompletionRepository(supabase, repositoryContext);

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

export const resolveCompletionCommentAction = defineCompletionAction<
  import("@/lib/completion/validation").CompletionCommentMutationInput,
  { commentId: string; packageVersion: number }
>({ module: "review.comment.resolve" }, COMPLETION_PERMISSIONS.COMMENT, async (input, context) => {
  const validated = validateCompletionCommentMutationInput(input);

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

export const unresolveCompletionCommentAction = defineCompletionAction<
  import("@/lib/completion/validation").CompletionCommentMutationInput,
  { commentId: string; packageVersion: number }
>({ module: "review.comment.unresolve" }, COMPLETION_PERMISSIONS.COMMENT, async (input, context) => {
  const validated = validateCompletionCommentMutationInput(input);

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
