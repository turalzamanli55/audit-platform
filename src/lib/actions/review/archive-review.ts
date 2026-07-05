"use server";

import { headers } from "next/headers";
import { AUDIT_RESOURCE_TYPE, REVIEW_PERMISSIONS } from "@/constants/review";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import { createReviewAction as defineReviewAction } from "@/lib/actions/review/review-action";
import { validateArchiveReviewInput } from "@/lib/review/validation";
import { createServerClient } from "@/lib/supabase/server";
import { ReviewRepository } from "@/repositories/review/review-repository";
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

export type ArchiveReviewActionInput = {
  packageId: string;
  version: number;
  archiveReason?: string | null;
};

export type ArchiveReviewActionResult = {
  packageId: string;
  version: number;
  packageStatus: string;
};

export const archiveReviewAction = defineReviewAction<
  ArchiveReviewActionInput,
  ArchiveReviewActionResult
>({ module: "review.archive" }, REVIEW_PERMISSIONS.ARCHIVE, async (input, context) => {
  const validated = validateArchiveReviewInput(input);

  const supabase = await createServerClient();
  const repositoryContext = createRepositoryContext(
    context.userId,
    context.organizationId,
    context.workspaceId,
  );
  const reviewRepository = new ReviewRepository(supabase, repositoryContext);

  const current = await reviewRepository.validateWorkspaceOwnership(
    validated.packageId,
    context.workspaceId,
  );
  if (current.version !== validated.version) {
    throw new ValidationError("Review package was modified by another user");
  }
  if (current.deleted_at || current.status === "archived") {
    throw new ValidationError("Review package is already archived");
  }

  const updated = await reviewRepository.archivePackage(validated.packageId, validated.version);

  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.REVIEW_ARCHIVED,
    resourceType: AUDIT_RESOURCE_TYPE,
    resourceId: updated.id,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    userId: context.userId,
    userAgent: requestHeaders.get("user-agent"),
    metadata: { version: updated.version, archiveReason: validated.archiveReason ?? null },
  });

  return {
    packageId: updated.id,
    version: updated.version,
    packageStatus: updated.package_status,
  };
});

export const restoreReviewAction = defineReviewAction<
  { packageId: string; version: number },
  ArchiveReviewActionResult
>({ module: "review.restore" }, REVIEW_PERMISSIONS.ARCHIVE, async (input, context) => {
  const validated = validateArchiveReviewInput(input);

  const supabase = await createServerClient();
  const repositoryContext = createRepositoryContext(
    context.userId,
    context.organizationId,
    context.workspaceId,
  );
  const reviewRepository = new ReviewRepository(supabase, repositoryContext);

  const current = await reviewRepository.validateWorkspaceOwnership(
    validated.packageId,
    context.workspaceId,
  );
  if (current.version !== validated.version) {
    throw new ValidationError("Review package was modified by another user");
  }
  if (!current.deleted_at && current.status !== "archived") {
    throw new ValidationError("Review package is not archived");
  }

  const updated = await reviewRepository.restorePackage(validated.packageId, validated.version);

  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.REVIEW_RESTORED,
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
