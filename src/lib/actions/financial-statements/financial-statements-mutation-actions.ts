"use server";

import { headers } from "next/headers";
import { AUDIT_RESOURCE_TYPE, FINANCIAL_STATEMENTS_PERMISSIONS } from "@/constants/financial-statements";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import { createFinancialStatementsAction as defineCompletionAction } from "@/lib/actions/financial-statements/financial-statements-action";
import {
  validateAddFinancialStatementCommentInput,
  validateFinancialStatementSectionMutationInput,
} from "@/lib/financial-statements/validation";
import { createServerClient } from "@/lib/supabase/server";
import { FinancialStatementRepository } from "@/repositories/financial-statements/financial-statement-repository";
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
  reviewRepository: FinancialStatementRepository,
) {
  const pkg = await reviewRepository.validateWorkspaceOwnership(packageId, workspaceId);
  if (pkg.version !== expectedVersion) {
    throw new ValidationError("Review package was modified by another user");
  }
  return pkg;
}

export const commentFinancialStatementsAction = defineCompletionAction<
  import("@/lib/financial-statements/validation").AddFinancialStatementCommentInput,
  { commentId: string; version: number }
>({ module: "financialStatements.comment.add" }, FINANCIAL_STATEMENTS_PERMISSIONS.COMMENT, async (input, context) => {
  const validated = validateAddFinancialStatementCommentInput(input);

  const supabase = await createServerClient();
  const repositoryContext = createRepositoryContext(
    context.userId,
    context.organizationId,
    context.workspaceId,
  );
  const reviewRepository = new FinancialStatementRepository(supabase, repositoryContext);

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
    financialStatementSectionId: validated.financialStatementSectionId,
    mentions: validated.mentions,
    attachmentMetadata: validated.attachmentMetadata,
  });

  const pkg = await reviewRepository.findById(validated.packageId);

  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.FINANCIAL_STATEMENTS_COMMENT_ADDED,
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

export const resolveFinancialStatementSectionAction = defineCompletionAction<
  import("@/lib/financial-statements/validation").FinancialStatementSectionMutationInput,
  { itemId: string; packageVersion: number; itemVersion: number }
>({ module: "financialStatements.item.resolve" }, FINANCIAL_STATEMENTS_PERMISSIONS.REVIEW, async (input, context) => {
  const validated = validateFinancialStatementSectionMutationInput(input);

  const supabase = await createServerClient();
  const repositoryContext = createRepositoryContext(
    context.userId,
    context.organizationId,
    context.workspaceId,
  );
  const reviewRepository = new FinancialStatementRepository(supabase, repositoryContext);

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
    action: AUDIT_ACTIONS.FINANCIAL_STATEMENTS_ITEM_RESOLVED,
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

export const returnFinancialStatementSectionAction = defineCompletionAction<
  import("@/lib/financial-statements/validation").FinancialStatementSectionMutationInput,
  { itemId: string; packageVersion: number; itemVersion: number }
>({ module: "financialStatements.item.return" }, FINANCIAL_STATEMENTS_PERMISSIONS.REVIEW, async (input, context) => {
  const validated = validateFinancialStatementSectionMutationInput(input);

  const supabase = await createServerClient();
  const repositoryContext = createRepositoryContext(
    context.userId,
    context.organizationId,
    context.workspaceId,
  );
  const reviewRepository = new FinancialStatementRepository(supabase, repositoryContext);

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
    action: AUDIT_ACTIONS.FINANCIAL_STATEMENTS_ITEM_RETURNED,
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
