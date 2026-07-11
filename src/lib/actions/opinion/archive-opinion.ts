"use server";

import { headers } from "next/headers";
import { AUDIT_RESOURCE_TYPE, OPINION_PERMISSIONS } from "@/constants/opinion";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import { createOpinionAction as defineCompletionAction } from "@/lib/actions/opinion/opinion-action";
import { validateArchiveReportingInput } from "@/lib/opinion/validation";
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

export const archiveOpinionAction = defineCompletionAction<
  ArchiveReviewActionInput,
  ArchiveReviewActionResult
>({ module: "opinion.archive" }, OPINION_PERMISSIONS.ARCHIVE, async (input, context) => {
  const validated = validateArchiveReportingInput(input);

  const supabase = await createServerClient();
  const repositoryContext = createRepositoryContext(
    context.userId,
    context.organizationId,
    context.workspaceId,
  );
  const reviewRepository = new OpinionRepository(supabase, repositoryContext);

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
    action: AUDIT_ACTIONS.OPINION_ARCHIVED,
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

export const restoreOpinionAction = defineCompletionAction<
  { packageId: string; version: number },
  ArchiveReviewActionResult
>({ module: "opinion.restore" }, OPINION_PERMISSIONS.ARCHIVE, async (input, context) => {
  const validated = validateArchiveReportingInput(input);

  const supabase = await createServerClient();
  const repositoryContext = createRepositoryContext(
    context.userId,
    context.organizationId,
    context.workspaceId,
  );
  const reviewRepository = new OpinionRepository(supabase, repositoryContext);

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
    action: AUDIT_ACTIONS.OPINION_RESTORED,
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
