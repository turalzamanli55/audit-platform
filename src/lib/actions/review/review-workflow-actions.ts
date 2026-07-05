"use server";

import { headers } from "next/headers";
import { AUDIT_RESOURCE_TYPE, REVIEW_PERMISSIONS } from "@/constants/review";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import { createReviewAction as defineReviewAction } from "@/lib/actions/review/review-action";
import {
  assertCanApprove,
  assertCanReturn,
  assertCanSubmit,
  assertSubmitPrerequisites,
} from "@/lib/review/review-rules";
import { validateReviewWorkflowInput } from "@/lib/review/validation";
import { createServerClient } from "@/lib/supabase/server";
import { ReviewRepository } from "@/repositories/review/review-repository";
import type { RepositoryContext } from "@/types/context";
import { ValidationError } from "@/lib/errors";

export type ReviewWorkflowInput = {
  packageId: string;
  version: number;
  notes?: string | null;
};

export type ReviewWorkflowResult = {
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

export const submitReviewAction = defineReviewAction<
  ReviewWorkflowInput,
  ReviewWorkflowResult
>({ module: "review.submit" }, REVIEW_PERMISSIONS.UPDATE, async (input, context) => {
  const validated = validateReviewWorkflowInput(input);

  const supabase = await createServerClient();
  const repositoryContext = createRepositoryContext(
    context.userId,
    context.organizationId,
    context.workspaceId,
  );
  const reviewRepository = new ReviewRepository(supabase, repositoryContext);

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
    action: AUDIT_ACTIONS.REVIEW_SUBMITTED,
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

export const returnReviewAction = defineReviewAction<
  ReviewWorkflowInput,
  ReviewWorkflowResult
>({ module: "review.return" }, REVIEW_PERMISSIONS.REVIEW, async (input, context) => {
  const validated = validateReviewWorkflowInput(input);

  const supabase = await createServerClient();
  const repositoryContext = createRepositoryContext(
    context.userId,
    context.organizationId,
    context.workspaceId,
  );
  const reviewRepository = new ReviewRepository(supabase, repositoryContext);

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
      commentType: "review",
      body: validated.notes,
    });
  }

  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.REVIEW_RETURNED,
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

export const approveReviewAction = defineReviewAction<
  ReviewWorkflowInput,
  ReviewWorkflowResult
>({ module: "review.approve" }, REVIEW_PERMISSIONS.APPROVE, async (input, context) => {
  const validated = validateReviewWorkflowInput(input);

  const supabase = await createServerClient();
  const repositoryContext = createRepositoryContext(
    context.userId,
    context.organizationId,
    context.workspaceId,
  );
  const reviewRepository = new ReviewRepository(supabase, repositoryContext);

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
    action: AUDIT_ACTIONS.REVIEW_APPROVED,
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
