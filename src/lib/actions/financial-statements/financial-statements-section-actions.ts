"use server";

import { headers } from "next/headers";
import { AUDIT_RESOURCE_TYPE, FINANCIAL_STATEMENTS_PERMISSIONS } from "@/constants/financial-statements";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import { createFinancialStatementsAction as defineCompletionAction } from "@/lib/actions/financial-statements/financial-statements-action";
import {
  validateFinancialStatementSectionMutationInput,
  validateUpdateFinancialStatementSectionInput,
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

export const updateFinancialStatementSectionAction = defineCompletionAction<
  import("@/lib/financial-statements/validation").UpdateFinancialStatementSectionInput,
  { itemId: string; packageVersion: number; itemVersion: number }
>({ module: "financialStatements.item.update" }, FINANCIAL_STATEMENTS_PERMISSIONS.REVIEW, async (input, context) => {
  const validated = validateUpdateFinancialStatementSectionInput(input);

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

export const reopenFinancialStatementSectionAction = defineCompletionAction<
  import("@/lib/financial-statements/validation").FinancialStatementSectionMutationInput,
  { itemId: string; packageVersion: number; itemVersion: number }
>({ module: "financialStatements.item.reopen" }, FINANCIAL_STATEMENTS_PERMISSIONS.REVIEW, async (input, context) => {
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

  const item = await reviewRepository.reopenItem(
    validated.packageId,
    validated.itemId,
    validated.itemVersion,
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
    metadata: { itemId: item.id },
  });

  return {
    itemId: item.id,
    packageVersion: pkg?.version ?? validated.packageVersion,
    itemVersion: item.version,
  };
});

export const approveFinancialStatementSectionAction = defineCompletionAction<
  import("@/lib/financial-statements/validation").FinancialStatementSectionMutationInput,
  { itemId: string; packageVersion: number; itemVersion: number }
>({ module: "financialStatements.item.approve" }, FINANCIAL_STATEMENTS_PERMISSIONS.REVIEW, async (input, context) => {
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
