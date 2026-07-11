"use server";

import { headers } from "next/headers";
import { AUDIT_RESOURCE_TYPE, OPINION_PERMISSIONS } from "@/constants/opinion";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import { createOpinionAction as defineCompletionAction } from "@/lib/actions/opinion/opinion-action";
import { validateRestoreOpinionVersionInput } from "@/lib/opinion/validation";
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

export const restoreOpinionVersionAction = defineCompletionAction<
  import("@/lib/opinion/validation").RestoreOpinionVersionInput,
  { packageId: string; version: number; versionId: string }
>({ module: "opinion.version.restore" }, OPINION_PERMISSIONS.UPDATE, async (input, context) => {
  const validated = validateRestoreOpinionVersionInput(input);

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

  const updated = await reviewRepository.restoreVersion(
    validated.packageId,
    validated.versionId,
    validated.version,
  );

  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.OPINION_VERSION_CREATED,
    resourceType: AUDIT_RESOURCE_TYPE,
    resourceId: validated.packageId,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    userId: context.userId,
    userAgent: requestHeaders.get("user-agent"),
    metadata: { versionId: validated.versionId },
  });

  return {
    packageId: updated.id,
    version: updated.version,
    versionId: validated.versionId,
  };
});
