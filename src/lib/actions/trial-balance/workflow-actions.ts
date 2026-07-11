"use server";

import { headers } from "next/headers";
import {
  AUDIT_RESOURCE_TYPE,
  TRIAL_BALANCE_ACTIVITY_ACTIONS,
  TRIAL_BALANCE_PERMISSIONS,
} from "@/constants/trial-balance";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import { createTrialBalanceAction } from "@/lib/actions/trial-balance/trial-balance-action";
import {
  assertTrialBalanceEditable,
  canTransitionTrialBalanceStatus,
} from "@/lib/trial-balance/trial-balance-rules";
import { createServerClient } from "@/lib/supabase/server";
import { TrialBalanceRepository } from "@/repositories/trial-balance/trial-balance-repository";
import type { RepositoryContext } from "@/types/context";
import type { TrialBalancePackageStatus } from "@/types/trial-balance";
import type { Json } from "@/types/supabase";
import { NotFoundError, ValidationError } from "@/lib/errors";

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

async function transition(
  packageId: string,
  to: TrialBalancePackageStatus,
  context: { userId: string; organizationId: string; workspaceId: string },
  options?: { returnNotes?: string; permission?: string },
) {
  const supabase = await createServerClient();
  const repository = new TrialBalanceRepository(
    supabase,
    createRepositoryContext(context.userId, context.organizationId, context.workspaceId),
  );
  const pkg = await repository.requirePackage(packageId);
  if (pkg.workspace_id !== context.workspaceId) throw new NotFoundError("Trial balance not found");
  if (!canTransitionTrialBalanceStatus(pkg.package_status, to)) {
    throw new ValidationError(`Cannot transition from ${pkg.package_status} to ${to}`);
  }

  const patch: Record<string, unknown> = { package_status: to };
  const now = new Date().toISOString();
  if (to === "submitted") {
    patch.submitted_at = now;
    patch.submitted_by = context.userId;
  }
  if (to === "returned") {
    patch.returned_at = now;
    patch.returned_by = context.userId;
    patch.return_notes = options?.returnNotes ?? null;
  }
  if (to === "approved") {
    patch.approved_at = now;
    patch.approved_by = context.userId;
  }
  if (to === "locked") {
    patch.locked_at = now;
    patch.locked_by = context.userId;
  }
  if (to === "archived") {
    patch.deleted_at = now;
    patch.deleted_by = context.userId;
    patch.status = "archived";
  }

  const updated = await repository.updatePackage(pkg.id, patch as never);
  const nextVersion =
    to === "approved" || to === "locked" ? updated.package_version + 1 : updated.package_version;
  if (nextVersion !== updated.package_version) {
    await repository.updatePackage(updated.id, { package_version: nextVersion } as never);
  }
  await repository.createVersion({
    packageId: updated.id,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    versionNumber: nextVersion,
    changeSummary: `Workflow transition to ${to}`,
    snapshotJson: { packageStatus: to } as Json,
  });

  const actionMap: Record<string, string> = {
    validated: TRIAL_BALANCE_ACTIVITY_ACTIONS.VALIDATED,
    submitted: TRIAL_BALANCE_ACTIVITY_ACTIONS.SUBMITTED,
    returned: TRIAL_BALANCE_ACTIVITY_ACTIONS.RETURNED,
    approved: TRIAL_BALANCE_ACTIVITY_ACTIONS.APPROVED,
    locked: TRIAL_BALANCE_ACTIVITY_ACTIONS.LOCKED,
    archived: TRIAL_BALANCE_ACTIVITY_ACTIONS.ARCHIVED,
  };
  await repository.logActivity({
    packageId: updated.id,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    companyId: updated.company_id,
    engagementId: updated.engagement_id,
    action: actionMap[to] ?? TRIAL_BALANCE_ACTIVITY_ACTIONS.UPDATED,
    summary: `Trial balance ${to}`,
  });

  const auditMap: Record<string, string> = {
    validated: AUDIT_ACTIONS.TRIAL_BALANCE_VALIDATED,
    submitted: AUDIT_ACTIONS.TRIAL_BALANCE_SUBMITTED,
    returned: AUDIT_ACTIONS.TRIAL_BALANCE_RETURNED,
    approved: AUDIT_ACTIONS.TRIAL_BALANCE_APPROVED,
    locked: AUDIT_ACTIONS.TRIAL_BALANCE_LOCKED,
    archived: AUDIT_ACTIONS.TRIAL_BALANCE_ARCHIVED,
  };
  const requestHeaders = await headers();
  await emitAuditEvent({
    action: auditMap[to] ?? AUDIT_ACTIONS.TRIAL_BALANCE_UPDATED,
    resourceType: AUDIT_RESOURCE_TYPE,
    resourceId: updated.id,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    userId: context.userId,
    userAgent: requestHeaders.get("user-agent"),
    metadata: { to, permission: options?.permission },
  });

  return { packageId: updated.id, packageStatus: updated.package_status };
}

export const validateTrialBalanceAction = createTrialBalanceAction<
  { packageId: string },
  { packageId: string; packageStatus: string }
>({ module: "trialBalance.validate" }, TRIAL_BALANCE_PERMISSIONS.UPDATE, async (input, context) => {
  const supabase = await createServerClient();
  const repository = new TrialBalanceRepository(
    supabase,
    createRepositoryContext(context.userId, context.organizationId, context.workspaceId),
  );
  const pkg = await repository.requirePackage(input.packageId);
  assertTrialBalanceEditable(pkg);
  if (!pkg.is_balanced) {
    throw new ValidationError("Resolve out-of-balance issues before validating");
  }
  if (pkg.error_count > 0) {
    throw new ValidationError("Resolve blocking validation errors before validating");
  }
  return transition(input.packageId, "validated", context);
});

export const submitTrialBalanceAction = createTrialBalanceAction<
  { packageId: string },
  { packageId: string; packageStatus: string }
>({ module: "trialBalance.submit" }, TRIAL_BALANCE_PERMISSIONS.UPDATE, async (input, context) =>
  transition(input.packageId, "submitted", context),
);

export const startTrialBalanceReviewAction = createTrialBalanceAction<
  { packageId: string },
  { packageId: string; packageStatus: string }
>({ module: "trialBalance.review" }, TRIAL_BALANCE_PERMISSIONS.REVIEW, async (input, context) =>
  transition(input.packageId, "under_review", context),
);

export const returnTrialBalanceAction = createTrialBalanceAction<
  { packageId: string; returnNotes: string },
  { packageId: string; packageStatus: string }
>({ module: "trialBalance.return" }, TRIAL_BALANCE_PERMISSIONS.REVIEW, async (input, context) => {
  if (!input.returnNotes?.trim()) throw new ValidationError("Return notes are required");
  return transition(input.packageId, "returned", context, { returnNotes: input.returnNotes });
});

export const approveTrialBalanceAction = createTrialBalanceAction<
  { packageId: string },
  { packageId: string; packageStatus: string }
>({ module: "trialBalance.approve" }, TRIAL_BALANCE_PERMISSIONS.APPROVE, async (input, context) =>
  transition(input.packageId, "approved", context),
);

export const lockTrialBalanceAction = createTrialBalanceAction<
  { packageId: string },
  { packageId: string; packageStatus: string }
>({ module: "trialBalance.lock" }, TRIAL_BALANCE_PERMISSIONS.APPROVE, async (input, context) =>
  transition(input.packageId, "locked", context),
);

export const archiveTrialBalanceAction = createTrialBalanceAction<
  { packageId: string },
  { packageId: string; packageStatus: string }
>({ module: "trialBalance.archive" }, TRIAL_BALANCE_PERMISSIONS.ARCHIVE, async (input, context) =>
  transition(input.packageId, "archived", context),
);
