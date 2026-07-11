"use server";

import { headers } from "next/headers";
import { AUDIT_RESOURCE_TYPE, OPINION_PERMISSIONS } from "@/constants/opinion";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import { createOpinionAction as defineCompletionAction } from "@/lib/actions/opinion/opinion-action";
import {
  validateOpinionCommentMutationInput,
  validateUpdateOpinionCommentInput,
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

export const updateOpinionCommentAction = defineCompletionAction<
  import("@/lib/opinion/validation").UpdateOpinionCommentInput,
  { commentId: string; packageVersion: number; commentVersion: number }
>({ module: "opinion.comment.update" }, OPINION_PERMISSIONS.COMMENT, async (input, context) => {
  const validated = validateUpdateOpinionCommentInput(input);

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

  const comment = await reviewRepository.updateComment({
    commentId: validated.commentId,
    reportingPackageId: validated.packageId,
    expectedVersion: validated.commentVersion,
    body: validated.body,
    mentions: validated.mentions,
    attachmentMetadata: validated.attachmentMetadata,
  });

  const pkg = await reviewRepository.findById(validated.packageId);

  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.OPINION_COMMENT_ADDED,
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

export const archiveOpinionCommentAction = defineCompletionAction<
  import("@/lib/opinion/validation").OpinionCommentMutationInput,
  { commentId: string; packageVersion: number }
>({ module: "opinion.comment.archive" }, OPINION_PERMISSIONS.COMMENT, async (input, context) => {
  const validated = validateOpinionCommentMutationInput(input);

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

export const restoreOpinionCommentAction = defineCompletionAction<
  import("@/lib/opinion/validation").OpinionCommentMutationInput,
  { commentId: string; packageVersion: number }
>({ module: "opinion.comment.restore" }, OPINION_PERMISSIONS.COMMENT, async (input, context) => {
  const validated = validateOpinionCommentMutationInput(input);

  const supabase = await createServerClient();
  const repositoryContext = createRepositoryContext(
    context.userId,
    context.organizationId,
    context.workspaceId,
  );
  const reviewRepository = new OpinionRepository(supabase, repositoryContext);

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

export const resolveOpinionCommentAction = defineCompletionAction<
  import("@/lib/opinion/validation").OpinionCommentMutationInput,
  { commentId: string; packageVersion: number }
>({ module: "opinion.comment.resolve" }, OPINION_PERMISSIONS.COMMENT, async (input, context) => {
  const validated = validateOpinionCommentMutationInput(input);

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

export const unresolveOpinionCommentAction = defineCompletionAction<
  import("@/lib/opinion/validation").OpinionCommentMutationInput,
  { commentId: string; packageVersion: number }
>({ module: "opinion.comment.unresolve" }, OPINION_PERMISSIONS.COMMENT, async (input, context) => {
  const validated = validateOpinionCommentMutationInput(input);

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
