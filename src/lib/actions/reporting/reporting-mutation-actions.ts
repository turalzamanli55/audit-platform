"use server";

import { headers } from "next/headers";
import { AUDIT_RESOURCE_TYPE, REPORTING_PERMISSIONS } from "@/constants/reporting";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import { createReportingAction as defineCompletionAction } from "@/lib/actions/reporting/reporting-action";
import {
  validateAddReportCommentInput,
  validateReportSectionMutationInput,
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

export const commentReportingAction = defineCompletionAction<
  import("@/lib/reporting/validation").AddReportCommentInput,
  { commentId: string; version: number }
>({ module: "review.comment.add" }, REPORTING_PERMISSIONS.COMMENT, async (input, context) => {
  const validated = validateAddReportCommentInput(input);

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
    validated.version,
    reviewRepository,
  );

  const comment = await reviewRepository.addComment({
    reportingPackageId: validated.packageId,
    commentType: validated.commentType,
    body: validated.body,
    parentCommentId: validated.parentCommentId,
    reportSectionId: validated.reportSectionId,
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

  return { commentId: comment.id, version: pkg?.version ?? validated.version };
});

export const resolveReportSectionAction = defineCompletionAction<
  import("@/lib/reporting/validation").ReportSectionMutationInput,
  { itemId: string; packageVersion: number; itemVersion: number }
>({ module: "review.item.resolve" }, REPORTING_PERMISSIONS.REVIEW, async (input, context) => {
  const validated = validateReportSectionMutationInput(input);

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

  const item = await reviewRepository.resolveItem(
    validated.packageId,
    validated.itemId,
    validated.itemVersion,
  );

  const pkg = await reviewRepository.findById(validated.packageId);

  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.REPORTING_ITEM_RESOLVED,
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

export const returnReportSectionAction = defineCompletionAction<
  import("@/lib/reporting/validation").ReportSectionMutationInput,
  { itemId: string; packageVersion: number; itemVersion: number }
>({ module: "review.item.return" }, REPORTING_PERMISSIONS.REVIEW, async (input, context) => {
  const validated = validateReportSectionMutationInput(input);

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

  const item = await reviewRepository.returnItem(
    validated.packageId,
    validated.itemId,
    validated.itemVersion,
    validated.returnNotes,
  );

  const pkg = await reviewRepository.findById(validated.packageId);

  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.REPORTING_ITEM_RETURNED,
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
