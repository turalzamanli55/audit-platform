"use server";

import { headers } from "next/headers";
import { AUDIT_RESOURCE_TYPE, COMPLETION_PERMISSIONS } from "@/constants/completion";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import { createCompletionAction as defineCompletionAction } from "@/lib/actions/completion/completion-action";
import { validateUpdateCompletionPackageInput } from "@/lib/completion/validation";
import { createServerClient } from "@/lib/supabase/server";
import { CompletionRepository } from "@/repositories/completion/completion-repository";
import type { RepositoryContext } from "@/types/context";
import { ValidationError } from "@/lib/errors";

export type UpdateCompletionPackageActionInput = {
  packageId: string;
  version: number;
  summaryNotes?: string | null;
};

export type UpdateCompletionPackageActionResult = {
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

export const updateCompletionPackageAction = defineCompletionAction<
  UpdateCompletionPackageActionInput,
  UpdateCompletionPackageActionResult
>({ module: "review.update" }, COMPLETION_PERMISSIONS.UPDATE, async (input, context) => {
  const validated = validateUpdateCompletionPackageInput(input);

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

  const updated = await reviewRepository.updatePackage(validated.packageId, validated.version, {
    summary_notes: validated.summaryNotes,
  });

  await reviewRepository.syncItemsFromModules(updated.id);

  const refreshed = (await reviewRepository.findById(updated.id)) ?? updated;

  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.COMPLETION_UPDATED,
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
