"use server";

import { headers } from "next/headers";
import { AUDIT_RESOURCE_TYPE, OPINION_PERMISSIONS } from "@/constants/opinion";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import { createOpinionAction as defineCompletionAction } from "@/lib/actions/opinion/opinion-action";
import {
  assertCanApprove,
  assertCanReturn,
  assertCanSubmit,
  assertSubmitPrerequisites,
} from "@/lib/opinion/opinion-module-rules";
import { validateOpinionWorkflowInput } from "@/lib/opinion/validation";
import { createServerClient } from "@/lib/supabase/server";
import { OpinionRepository } from "@/repositories/opinion/opinion-repository";
import type { RepositoryContext } from "@/types/context";
import { ValidationError } from "@/lib/errors";

export type OpinionWorkflowInput = {
  packageId: string;
  version: number;
  notes?: string | null;
};

export type OpinionWorkflowResult = {
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

export const submitOpinionAction = defineCompletionAction<
  OpinionWorkflowInput,
  OpinionWorkflowResult
>({ module: "opinion.submit" }, OPINION_PERMISSIONS.UPDATE, async (input, context) => {
  const validated = validateOpinionWorkflowInput(input);

  const supabase = await createServerClient();
  const repositoryContext = createRepositoryContext(
    context.userId,
    context.organizationId,
    context.workspaceId,
  );
  const reviewRepository = new OpinionRepository(supabase, repositoryContext);

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
    action: AUDIT_ACTIONS.OPINION_SUBMITTED,
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

export const returnOpinionAction = defineCompletionAction<
  OpinionWorkflowInput,
  OpinionWorkflowResult
>({ module: "opinion.return" }, OPINION_PERMISSIONS.REVIEW, async (input, context) => {
  const validated = validateOpinionWorkflowInput(input);

  const supabase = await createServerClient();
  const repositoryContext = createRepositoryContext(
    context.userId,
    context.organizationId,
    context.workspaceId,
  );
  const reviewRepository = new OpinionRepository(supabase, repositoryContext);

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
      commentType: "opinion",
      body: validated.notes,
    });
  }

  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.OPINION_RETURNED,
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

export const approveOpinionAction = defineCompletionAction<
  OpinionWorkflowInput,
  OpinionWorkflowResult
>({ module: "opinion.approve" }, OPINION_PERMISSIONS.APPROVE, async (input, context) => {
  const validated = validateOpinionWorkflowInput(input);

  const supabase = await createServerClient();
  const repositoryContext = createRepositoryContext(
    context.userId,
    context.organizationId,
    context.workspaceId,
  );
  const reviewRepository = new OpinionRepository(supabase, repositoryContext);

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
    action: AUDIT_ACTIONS.OPINION_APPROVED,
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
