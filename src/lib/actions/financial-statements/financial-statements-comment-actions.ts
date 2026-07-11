"use server";

import { headers } from "next/headers";
import { AUDIT_RESOURCE_TYPE, FINANCIAL_STATEMENTS_PERMISSIONS } from "@/constants/financial-statements";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import { createFinancialStatementsAction as defineCompletionAction } from "@/lib/actions/financial-statements/financial-statements-action";
import {
  validateFinancialStatementCommentMutationInput,
  validateUpdateFinancialStatementCommentInput,
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

export const updateFinancialStatementCommentAction = defineCompletionAction<
  import("@/lib/financial-statements/validation").UpdateFinancialStatementCommentInput,
  { commentId: string; packageVersion: number; commentVersion: number }
>({ module: "financialStatements.comment.update" }, FINANCIAL_STATEMENTS_PERMISSIONS.COMMENT, async (input, context) => {
  const validated = validateUpdateFinancialStatementCommentInput(input);

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
    action: AUDIT_ACTIONS.FINANCIAL_STATEMENTS_COMMENT_ADDED,
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

export const archiveFinancialStatementCommentAction = defineCompletionAction<
  import("@/lib/financial-statements/validation").FinancialStatementCommentMutationInput,
  { commentId: string; packageVersion: number }
>({ module: "financialStatements.comment.archive" }, FINANCIAL_STATEMENTS_PERMISSIONS.COMMENT, async (input, context) => {
  const validated = validateFinancialStatementCommentMutationInput(input);

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

export const restoreFinancialStatementCommentAction = defineCompletionAction<
  import("@/lib/financial-statements/validation").FinancialStatementCommentMutationInput,
  { commentId: string; packageVersion: number }
>({ module: "financialStatements.comment.restore" }, FINANCIAL_STATEMENTS_PERMISSIONS.COMMENT, async (input, context) => {
  const validated = validateFinancialStatementCommentMutationInput(input);

  const supabase = await createServerClient();
  const repositoryContext = createRepositoryContext(
    context.userId,
    context.organizationId,
    context.workspaceId,
  );
  const reviewRepository = new FinancialStatementRepository(supabase, repositoryContext);

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

export const resolveFinancialStatementCommentAction = defineCompletionAction<
  import("@/lib/financial-statements/validation").FinancialStatementCommentMutationInput,
  { commentId: string; packageVersion: number }
>({ module: "financialStatements.comment.resolve" }, FINANCIAL_STATEMENTS_PERMISSIONS.COMMENT, async (input, context) => {
  const validated = validateFinancialStatementCommentMutationInput(input);

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

export const unresolveFinancialStatementCommentAction = defineCompletionAction<
  import("@/lib/financial-statements/validation").FinancialStatementCommentMutationInput,
  { commentId: string; packageVersion: number }
>({ module: "financialStatements.comment.unresolve" }, FINANCIAL_STATEMENTS_PERMISSIONS.COMMENT, async (input, context) => {
  const validated = validateFinancialStatementCommentMutationInput(input);

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
