"use server";

import { headers } from "next/headers";
import { AUDIT_RESOURCE_TYPE, REPORTING_PERMISSIONS } from "@/constants/reporting";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import { createReportingAction as defineCompletionAction } from "@/lib/actions/reporting/reporting-action";
import {
  validateReportCommentMutationInput,
  validateUpdateReportCommentInput,
} from "@/lib/reporting/validation";
import { createServerClient } from "@/lib/supabase/server";
import { ReportingRepository } from "@/repositories/reporting/reporting-repository";
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
  reviewRepository: ReportingRepository,
) {
  const pkg = await reviewRepository.validateWorkspaceOwnership(packageId, workspaceId);
  if (pkg.version !== expectedVersion) {
    throw new ValidationError("Review package was modified by another user");
  }
  return pkg;
}

export const updateReportCommentAction = defineCompletionAction<
  import("@/lib/reporting/validation").UpdateReportCommentInput,
  { commentId: string; packageVersion: number; commentVersion: number }
>({ module: "review.comment.update" }, REPORTING_PERMISSIONS.COMMENT, async (input, context) => {
  const validated = validateUpdateReportCommentInput(input);

  const supabase = await createServerClient();
  const repositoryContext = createRepositoryContext(
    context.userId,
    context.organizationId,
    context.workspaceId,
  );
  const reviewRepository = new ReportingRepository(supabase, repositoryContext);

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
    action: AUDIT_ACTIONS.REPORTING_COMMENT_ADDED,
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

export const archiveReportCommentAction = defineCompletionAction<
  import("@/lib/reporting/validation").ReportCommentMutationInput,
  { commentId: string; packageVersion: number }
>({ module: "review.comment.archive" }, REPORTING_PERMISSIONS.COMMENT, async (input, context) => {
  const validated = validateReportCommentMutationInput(input);

  const supabase = await createServerClient();
  const repositoryContext = createRepositoryContext(
    context.userId,
    context.organizationId,
    context.workspaceId,
  );
  const reviewRepository = new ReportingRepository(supabase, repositoryContext);

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

export const restoreReportCommentAction = defineCompletionAction<
  import("@/lib/reporting/validation").ReportCommentMutationInput,
  { commentId: string; packageVersion: number }
>({ module: "review.comment.restore" }, REPORTING_PERMISSIONS.COMMENT, async (input, context) => {
  const validated = validateReportCommentMutationInput(input);

  const supabase = await createServerClient();
  const repositoryContext = createRepositoryContext(
    context.userId,
    context.organizationId,
    context.workspaceId,
  );
  const reviewRepository = new ReportingRepository(supabase, repositoryContext);

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

export const resolveReportCommentAction = defineCompletionAction<
  import("@/lib/reporting/validation").ReportCommentMutationInput,
  { commentId: string; packageVersion: number }
>({ module: "review.comment.resolve" }, REPORTING_PERMISSIONS.COMMENT, async (input, context) => {
  const validated = validateReportCommentMutationInput(input);

  const supabase = await createServerClient();
  const repositoryContext = createRepositoryContext(
    context.userId,
    context.organizationId,
    context.workspaceId,
  );
  const reviewRepository = new ReportingRepository(supabase, repositoryContext);

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

export const unresolveReportCommentAction = defineCompletionAction<
  import("@/lib/reporting/validation").ReportCommentMutationInput,
  { commentId: string; packageVersion: number }
>({ module: "review.comment.unresolve" }, REPORTING_PERMISSIONS.COMMENT, async (input, context) => {
  const validated = validateReportCommentMutationInput(input);

  const supabase = await createServerClient();
  const repositoryContext = createRepositoryContext(
    context.userId,
    context.organizationId,
    context.workspaceId,
  );
  const reviewRepository = new ReportingRepository(supabase, repositoryContext);

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
