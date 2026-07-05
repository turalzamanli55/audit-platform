"use server";

import { headers } from "next/headers";
import { AUDIT_RESOURCE_TYPE, REVIEW_PERMISSIONS } from "@/constants/review";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import { createReviewAction as defineReviewAction } from "@/lib/actions/review/review-action";
import { validateUpdateReviewPackageInput } from "@/lib/review/validation";
import { createServerClient } from "@/lib/supabase/server";
import { ReviewRepository } from "@/repositories/review/review-repository";
import type { RepositoryContext } from "@/types/context";
import { ValidationError } from "@/lib/errors";

export type UpdateReviewPackageActionInput = {
  packageId: string;
  version: number;
  summaryNotes?: string | null;
};

export type UpdateReviewPackageActionResult = {
  packageId: string;
  version: number;
  progressPct: number;
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

export const updateReviewPackageAction = defineReviewAction<
  UpdateReviewPackageActionInput,
  UpdateReviewPackageActionResult
>({ module: "review.update" }, REVIEW_PERMISSIONS.UPDATE, async (input, context) => {
  const validated = validateUpdateReviewPackageInput(input);

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

  const updated = await reviewRepository.updatePackage(validated.packageId, validated.version, {
    summary_notes: validated.summaryNotes,
  });

  await reviewRepository.syncItemsFromModules(updated.id);

  const refreshed = (await reviewRepository.findById(updated.id)) ?? updated;

  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.REVIEW_UPDATED,
    resourceType: AUDIT_RESOURCE_TYPE,
    resourceId: refreshed.id,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    userId: context.userId,
    userAgent: requestHeaders.get("user-agent"),
    metadata: { version: refreshed.version },
  });

  return {
    packageId: refreshed.id,
    version: refreshed.version,
    progressPct: refreshed.progress_pct,
  };
});
