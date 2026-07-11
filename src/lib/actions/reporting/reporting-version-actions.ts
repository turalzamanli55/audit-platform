"use server";

import { headers } from "next/headers";
import { AUDIT_RESOURCE_TYPE, REPORTING_PERMISSIONS } from "@/constants/reporting";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import { createReportingAction as defineCompletionAction } from "@/lib/actions/reporting/reporting-action";
import { validateRestoreReportVersionInput } from "@/lib/reporting/validation";
import { createServerClient } from "@/lib/supabase/server";
import { ReportingRepository } from "@/repositories/reporting/reporting-repository";
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

export const restoreReportVersionAction = defineCompletionAction<
  import("@/lib/reporting/validation").RestoreReportVersionInput,
  { packageId: string; version: number; versionId: string }
>({ module: "review.version.restore" }, REPORTING_PERMISSIONS.UPDATE, async (input, context) => {
  const validated = validateRestoreReportVersionInput(input);

  const supabase = await createServerClient();
  const repositoryContext = createRepositoryContext(
    context.userId,
    context.organizationId,
    context.workspaceId,
  );
  const reviewRepository = new ReportingRepository(supabase, repositoryContext);

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
    action: AUDIT_ACTIONS.REPORTING_VERSION_CREATED,
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
