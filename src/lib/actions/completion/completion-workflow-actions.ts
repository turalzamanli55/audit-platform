"use server";

import { headers } from "next/headers";
import { AUDIT_RESOURCE_TYPE, COMPLETION_PERMISSIONS } from "@/constants/completion";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import { createCompletionAction as defineCompletionAction } from "@/lib/actions/completion/completion-action";
import {
  assertCanApprove,
  assertCanReturn,
  assertCanSubmit,
  assertSubmitPrerequisites,
} from "@/lib/completion/completion-module-rules";
import { validateCompletionWorkflowInput } from "@/lib/completion/validation";
import { createServerClient } from "@/lib/supabase/server";
import { CompletionRepository } from "@/repositories/completion/completion-repository";
import type { RepositoryContext } from "@/types/context";
import { ValidationError } from "@/lib/errors";

export type CompletionWorkflowInput = {
  packageId: string;
  version: number;
  notes?: string | null;
};

export type CompletionWorkflowResult = {
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

export const submitCompletionAction = defineCompletionAction<
  CompletionWorkflowInput,
  CompletionWorkflowResult
>({ module: "review.submit" }, COMPLETION_PERMISSIONS.UPDATE, async (input, context) => {
  const validated = validateCompletionWorkflowInput(input);

  const supabase = await createServerClient();
  const repositoryContext = createRepositoryContext(
    context.userId,
    context.organizationId,
    context.workspaceId,
  );
  const reviewRepository = new CompletionRepository(supabase, repositoryContext);

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
    action: AUDIT_ACTIONS.COMPLETION_SUBMITTED,
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

export const returnCompletionAction = defineCompletionAction<
  CompletionWorkflowInput,
  CompletionWorkflowResult
>({ module: "review.return" }, COMPLETION_PERMISSIONS.REVIEW, async (input, context) => {
  const validated = validateCompletionWorkflowInput(input);

  const supabase = await createServerClient();
  const repositoryContext = createRepositoryContext(
    context.userId,
    context.organizationId,
    context.workspaceId,
  );
  const reviewRepository = new CompletionRepository(supabase, repositoryContext);

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
      reviewPackageId: updated.id,
      commentType: "completion",
      body: validated.notes,
    });
  }

  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.COMPLETION_RETURNED,
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

export const approveCompletionAction = defineCompletionAction<
  CompletionWorkflowInput,
  CompletionWorkflowResult
>({ module: "review.approve" }, COMPLETION_PERMISSIONS.APPROVE, async (input, context) => {
  const validated = validateCompletionWorkflowInput(input);

  const supabase = await createServerClient();
  const repositoryContext = createRepositoryContext(
    context.userId,
    context.organizationId,
    context.workspaceId,
  );
  const reviewRepository = new CompletionRepository(supabase, repositoryContext);

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
    action: AUDIT_ACTIONS.COMPLETION_APPROVED,
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
