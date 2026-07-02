"use server";

import { headers } from "next/headers";
import { AUDIT_RESOURCE_TYPE, FIELDWORK_PERMISSIONS } from "@/constants/fieldwork";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import { createFieldworkAction as defineFieldworkAction } from "@/lib/actions/fieldwork/fieldwork-action";
import { createServerClient } from "@/lib/supabase/server";
import { FieldworkRepository } from "@/repositories/fieldwork/fieldwork-repository";
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

export type ArchiveFieldworkActionInput = {
  packageId: string;
  version: number;
  archiveReason?: string | null;
};

export const archiveFieldworkAction = defineFieldworkAction<
  ArchiveFieldworkActionInput,
  { packageId: string; version: number }
>({ module: "fieldwork.archive" }, FIELDWORK_PERMISSIONS.ARCHIVE, async (input, context) => {
  if (!input.packageId) throw new ValidationError("Fieldwork package is required");
  if (!Number.isInteger(input.version) || input.version < 1) {
    throw new ValidationError("Fieldwork version is required");
  }

  const supabase = await createServerClient();
  const repository = new FieldworkRepository(
    supabase,
    createRepositoryContext(context.userId, context.organizationId, context.workspaceId),
  );

  await repository.validateWorkspaceOwnership(input.packageId, context.workspaceId);
  const pkg = await repository.archivePackage(input.packageId, input.version);

  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.FIELDWORK_ARCHIVED,
    resourceType: AUDIT_RESOURCE_TYPE,
    resourceId: pkg.id,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    userId: context.userId,
    userAgent: requestHeaders.get("user-agent"),
    metadata: { version: pkg.version, reason: input.archiveReason ?? null },
  });

  return { packageId: pkg.id, version: pkg.version };
});

export const restoreFieldworkAction = defineFieldworkAction<
  { packageId: string; version: number },
  { packageId: string; version: number }
>({ module: "fieldwork.restore" }, FIELDWORK_PERMISSIONS.ARCHIVE, async (input, context) => {
  if (!input.packageId) throw new ValidationError("Fieldwork package is required");

  const supabase = await createServerClient();
  const repository = new FieldworkRepository(
    supabase,
    createRepositoryContext(context.userId, context.organizationId, context.workspaceId),
  );

  await repository.validateWorkspaceOwnership(input.packageId, context.workspaceId);
  const pkg = await repository.restorePackage(input.packageId, input.version);

  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.FIELDWORK_RESTORED,
    resourceType: AUDIT_RESOURCE_TYPE,
    resourceId: pkg.id,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    userId: context.userId,
    userAgent: requestHeaders.get("user-agent"),
    metadata: { version: pkg.version },
  });

  return { packageId: pkg.id, version: pkg.version };
});
