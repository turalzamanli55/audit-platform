"use server";

import { headers } from "next/headers";
import { AUDIT_RESOURCE_TYPE, FINANCIAL_STATEMENTS_PERMISSIONS } from "@/constants/financial-statements";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import { createFinancialStatementsAction as defineCompletionAction } from "@/lib/actions/financial-statements/financial-statements-action";
import {
  assertCanApprove,
  assertCanPrepare,
  assertCanPublish,
  assertCanReturn,
  assertCanSubmit,
  assertSubmitPrerequisites,
} from "@/lib/financial-statements/financial-statements-module-rules";
import { validateFinancialStatementsWorkflowInput } from "@/lib/financial-statements/validation";
import { createServerClient } from "@/lib/supabase/server";
import { FinancialStatementRepository } from "@/repositories/financial-statements/financial-statement-repository";
import type { RepositoryContext } from "@/types/context";
import { ValidationError } from "@/lib/errors";

export type FinancialStatementsWorkflowInput = {
  packageId: string;
  version: number;
  notes?: string | null;
};

export type FinancialStatementsWorkflowResult = {
  packageId: string;
  version: number;
  packageStatus: string;
};

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

export const submitFinancialStatementsAction = defineCompletionAction<
  FinancialStatementsWorkflowInput,
  FinancialStatementsWorkflowResult
>({ module: "financialStatements.submit" }, FINANCIAL_STATEMENTS_PERMISSIONS.UPDATE, async (input, context) => {
  const validated = validateFinancialStatementsWorkflowInput(input);

  const supabase = await createServerClient();
  const repositoryContext = createRepositoryContext(
    context.userId,
    context.organizationId,
    context.workspaceId,
  );
  const reviewRepository = new FinancialStatementRepository(supabase, repositoryContext);

  const pkg = await reviewRepository.validateWorkspaceOwnership(
    validated.packageId,
    context.workspaceId,
  );
  if (pkg.version !== validated.version) {
    throw new ValidationError("Review package was modified by another user");
  }

  await reviewRepository.syncItemsFromModules(validated.packageId);
  const refreshed = (await reviewRepository.findById(validated.packageId)) ?? pkg;

  assertCanSubmit(refreshed);
  assertSubmitPrerequisites({
    pendingCount: refreshed.pending_count,
    returnedCount: refreshed.returned_count,
    totalItems: refreshed.pending_count + refreshed.returned_count + refreshed.resolved_count,
  });

  const updated = await reviewRepository.submitForReview(validated.packageId, validated.version);

  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.FINANCIAL_STATEMENTS_SUBMITTED,
    resourceType: AUDIT_RESOURCE_TYPE,
    resourceId: updated.id,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    userId: context.userId,
    userAgent: requestHeaders.get("user-agent"),
    metadata: { version: updated.version },
  });

  return {
    packageId: updated.id,
    version: updated.version,
    packageStatus: updated.package_status,
  };
});

export const returnFinancialStatementsAction = defineCompletionAction<
  FinancialStatementsWorkflowInput,
  FinancialStatementsWorkflowResult
>({ module: "financialStatements.return" }, FINANCIAL_STATEMENTS_PERMISSIONS.REVIEW, async (input, context) => {
  const validated = validateFinancialStatementsWorkflowInput(input);

  const supabase = await createServerClient();
  const repositoryContext = createRepositoryContext(
    context.userId,
    context.organizationId,
    context.workspaceId,
  );
  const reviewRepository = new FinancialStatementRepository(supabase, repositoryContext);

  const pkg = await reviewRepository.validateWorkspaceOwnership(
    validated.packageId,
    context.workspaceId,
  );
  if (pkg.version !== validated.version) {
    throw new ValidationError("Review package was modified by another user");
  }

  assertCanReturn(pkg);

  const updated = await reviewRepository.returnForRevision(
    validated.packageId,
    validated.version,
    validated.notes,
  );

  if (validated.notes) {
    await reviewRepository.addComment({
      reportingPackageId: updated.id,
      commentType: "financial_statement",
      body: validated.notes,
    });
  }

  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.FINANCIAL_STATEMENTS_RETURNED,
    resourceType: AUDIT_RESOURCE_TYPE,
    resourceId: updated.id,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    userId: context.userId,
    userAgent: requestHeaders.get("user-agent"),
    metadata: { version: updated.version },
  });

  return {
    packageId: updated.id,
    version: updated.version,
    packageStatus: updated.package_status,
  };
});

export const approveFinancialStatementsAction = defineCompletionAction<
  FinancialStatementsWorkflowInput,
  FinancialStatementsWorkflowResult
>({ module: "financialStatements.approve" }, FINANCIAL_STATEMENTS_PERMISSIONS.APPROVE, async (input, context) => {
  const validated = validateFinancialStatementsWorkflowInput(input);

  const supabase = await createServerClient();
  const repositoryContext = createRepositoryContext(
    context.userId,
    context.organizationId,
    context.workspaceId,
  );
  const reviewRepository = new FinancialStatementRepository(supabase, repositoryContext);

  const pkg = await reviewRepository.validateWorkspaceOwnership(
    validated.packageId,
    context.workspaceId,
  );
  if (pkg.version !== validated.version) {
    throw new ValidationError("Review package was modified by another user");
  }

  assertCanApprove(pkg);

  const updated = await reviewRepository.approve(validated.packageId, validated.version);

  await reviewRepository.createVersion(
    updated.id,
    validated.notes ?? "Review package approved",
  );

  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.FINANCIAL_STATEMENTS_APPROVED,
    resourceType: AUDIT_RESOURCE_TYPE,
    resourceId: updated.id,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    userId: context.userId,
    userAgent: requestHeaders.get("user-agent"),
    metadata: { version: updated.version },
  });

  return {
    packageId: updated.id,
    version: updated.version,
    packageStatus: updated.package_status,
  };
});

export const prepareFinancialStatementsAction = defineCompletionAction<
  FinancialStatementsWorkflowInput,
  FinancialStatementsWorkflowResult
>({ module: "financialStatements.prepare" }, FINANCIAL_STATEMENTS_PERMISSIONS.UPDATE, async (input, context) => {
  const validated = validateFinancialStatementsWorkflowInput(input);
  const supabase = await createServerClient();
  const repositoryContext = createRepositoryContext(
    context.userId,
    context.organizationId,
    context.workspaceId,
  );
  const reviewRepository = new FinancialStatementRepository(supabase, repositoryContext);
  const pkg = await reviewRepository.validateWorkspaceOwnership(
    validated.packageId,
    context.workspaceId,
  );
  if (pkg.version !== validated.version) {
    throw new ValidationError("Financial statement package was modified by another user");
  }
  assertCanPrepare(pkg);
  const updated = await reviewRepository.markPrepared(validated.packageId, validated.version);
  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.FINANCIAL_STATEMENTS_PREPARED,
    resourceType: AUDIT_RESOURCE_TYPE,
    resourceId: updated.id,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    userId: context.userId,
    userAgent: requestHeaders.get("user-agent"),
    metadata: { packageVersion: updated.package_version, version: updated.version },
  });
  return {
    packageId: updated.id,
    version: updated.version,
    packageStatus: updated.package_status,
  };
});

export const publishFinancialStatementsAction = defineCompletionAction<
  FinancialStatementsWorkflowInput,
  FinancialStatementsWorkflowResult
>({ module: "financialStatements.publish" }, FINANCIAL_STATEMENTS_PERMISSIONS.APPROVE, async (input, context) => {
  const validated = validateFinancialStatementsWorkflowInput(input);
  const supabase = await createServerClient();
  const repositoryContext = createRepositoryContext(
    context.userId,
    context.organizationId,
    context.workspaceId,
  );
  const reviewRepository = new FinancialStatementRepository(supabase, repositoryContext);
  const pkg = await reviewRepository.validateWorkspaceOwnership(
    validated.packageId,
    context.workspaceId,
  );
  if (pkg.version !== validated.version) {
    throw new ValidationError("Financial statement package was modified by another user");
  }
  assertCanPublish(pkg);
  const updated = await reviewRepository.publish(validated.packageId, validated.version);
  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.FINANCIAL_STATEMENTS_PUBLISHED,
    resourceType: AUDIT_RESOURCE_TYPE,
    resourceId: updated.id,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    userId: context.userId,
    userAgent: requestHeaders.get("user-agent"),
    metadata: { packageVersion: updated.package_version, version: updated.version },
  });
  return {
    packageId: updated.id,
    version: updated.version,
    packageStatus: updated.package_status,
  };
});
