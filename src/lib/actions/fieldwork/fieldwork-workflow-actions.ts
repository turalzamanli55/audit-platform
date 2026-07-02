"use server";

import { headers } from "next/headers";
import { AUDIT_RESOURCE_TYPE, FIELDWORK_PERMISSIONS } from "@/constants/fieldwork";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import { createFieldworkAction as defineFieldworkAction } from "@/lib/actions/fieldwork/fieldwork-action";
import {
  assertCanClearProcedure,
  assertCanCompleteProcedure,
  assertCanReturnProcedure,
  assertCanSubmitProcedure,
  assertPackageEditable,
} from "@/lib/fieldwork/fieldwork-rules";
import { createServerClient } from "@/lib/supabase/server";
import { FieldworkRepository } from "@/repositories/fieldwork/fieldwork-repository";
import type { RepositoryContext } from "@/types/context";
import { ValidationError } from "@/lib/errors";

export type FieldworkProcedureWorkflowInput = {
  packageId: string;
  procedureId: string;
  procedureVersion: number;
  notes?: string | null;
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

async function getProcedureContext(
  repository: FieldworkRepository,
  packageId: string,
  procedureId: string,
  procedureVersion: number,
  workspaceId: string,
) {
  const pkg = await repository.validateWorkspaceOwnership(packageId, workspaceId);
  assertPackageEditable(pkg);
  const procedure = await repository.findProcedureById(procedureId);
  if (!procedure || procedure.fieldwork_package_id !== packageId) {
    throw new ValidationError("Audit procedure not found");
  }
  repository.validateOptimisticLock(procedure, procedureVersion, "AuditProcedure");
  return { pkg, procedure };
}

export const submitFieldworkProcedureAction = defineFieldworkAction<
  FieldworkProcedureWorkflowInput,
  { procedureId: string; version: number; procedureStatus: string }
>(
  { module: "fieldwork.procedure.submit" },
  FIELDWORK_PERMISSIONS.UPDATE,
  async (input, context) => {
    const supabase = await createServerClient();
    const repository = new FieldworkRepository(
      supabase,
      createRepositoryContext(context.userId, context.organizationId, context.workspaceId),
    );
    const { pkg, procedure } = await getProcedureContext(
      repository,
      input.packageId,
      input.procedureId,
      input.procedureVersion,
      context.workspaceId,
    );

    assertCanSubmitProcedure(procedure);
    const updated = await repository.submitProcedureForReview(procedure.id, input.procedureVersion);

    const requestHeaders = await headers();
    await emitAuditEvent({
      action: AUDIT_ACTIONS.FIELDWORK_PROCEDURE_SUBMITTED,
      resourceType: AUDIT_RESOURCE_TYPE,
      resourceId: pkg.id,
      organizationId: context.organizationId,
      workspaceId: context.workspaceId,
      userId: context.userId,
      userAgent: requestHeaders.get("user-agent"),
      metadata: { procedureId: updated.id },
    });

    return {
      procedureId: updated.id,
      version: updated.version,
      procedureStatus: updated.procedure_status,
    };
  },
);

export const returnFieldworkProcedureAction = defineFieldworkAction<
  FieldworkProcedureWorkflowInput,
  { procedureId: string; version: number; procedureStatus: string }
>(
  { module: "fieldwork.procedure.return" },
  FIELDWORK_PERMISSIONS.REVIEW,
  async (input, context) => {
    const supabase = await createServerClient();
    const repository = new FieldworkRepository(
      supabase,
      createRepositoryContext(context.userId, context.organizationId, context.workspaceId),
    );
    const { pkg, procedure } = await getProcedureContext(
      repository,
      input.packageId,
      input.procedureId,
      input.procedureVersion,
      context.workspaceId,
    );

    assertCanReturnProcedure(procedure);
    const updated = await repository.returnProcedure(
      procedure.id,
      input.procedureVersion,
      input.notes?.trim() || null,
    );

    if (input.notes?.trim()) {
      await repository.addNote({
        fieldworkPackageId: pkg.id,
        engagementId: pkg.engagement_id,
        organizationId: pkg.organization_id,
        workspaceId: pkg.workspace_id,
        body: input.notes.trim(),
        noteType: "review",
        auditProcedureId: procedure.id,
      });
    }

    const requestHeaders = await headers();
    await emitAuditEvent({
      action: AUDIT_ACTIONS.FIELDWORK_PROCEDURE_RETURNED,
      resourceType: AUDIT_RESOURCE_TYPE,
      resourceId: pkg.id,
      organizationId: context.organizationId,
      workspaceId: context.workspaceId,
      userId: context.userId,
      userAgent: requestHeaders.get("user-agent"),
      metadata: { procedureId: updated.id },
    });

    return {
      procedureId: updated.id,
      version: updated.version,
      procedureStatus: updated.procedure_status,
    };
  },
);

export const clearFieldworkProcedureAction = defineFieldworkAction<
  FieldworkProcedureWorkflowInput,
  { procedureId: string; version: number; procedureStatus: string }
>(
  { module: "fieldwork.procedure.clear" },
  FIELDWORK_PERMISSIONS.REVIEW,
  async (input, context) => {
    const supabase = await createServerClient();
    const repository = new FieldworkRepository(
      supabase,
      createRepositoryContext(context.userId, context.organizationId, context.workspaceId),
    );
    const { pkg, procedure } = await getProcedureContext(
      repository,
      input.packageId,
      input.procedureId,
      input.procedureVersion,
      context.workspaceId,
    );

    assertCanClearProcedure(procedure);
    const updated = await repository.clearProcedureReview(
      procedure.id,
      input.procedureVersion,
      input.notes?.trim() || null,
    );

    if (input.notes?.trim()) {
      await repository.addNote({
        fieldworkPackageId: pkg.id,
        engagementId: pkg.engagement_id,
        organizationId: pkg.organization_id,
        workspaceId: pkg.workspace_id,
        body: input.notes.trim(),
        noteType: "clearance",
        auditProcedureId: procedure.id,
      });
    }

    const requestHeaders = await headers();
    await emitAuditEvent({
      action: AUDIT_ACTIONS.FIELDWORK_PROCEDURE_CLEARED,
      resourceType: AUDIT_RESOURCE_TYPE,
      resourceId: pkg.id,
      organizationId: context.organizationId,
      workspaceId: context.workspaceId,
      userId: context.userId,
      userAgent: requestHeaders.get("user-agent"),
      metadata: { procedureId: updated.id },
    });

    return {
      procedureId: updated.id,
      version: updated.version,
      procedureStatus: updated.procedure_status,
    };
  },
);

export const completeFieldworkProcedureAction = defineFieldworkAction<
  FieldworkProcedureWorkflowInput,
  { procedureId: string; version: number; procedureStatus: string }
>(
  { module: "fieldwork.procedure.complete" },
  FIELDWORK_PERMISSIONS.UPDATE,
  async (input, context) => {
    const supabase = await createServerClient();
    const repository = new FieldworkRepository(
      supabase,
      createRepositoryContext(context.userId, context.organizationId, context.workspaceId),
    );
    const { pkg, procedure } = await getProcedureContext(
      repository,
      input.packageId,
      input.procedureId,
      input.procedureVersion,
      context.workspaceId,
    );

    assertCanCompleteProcedure(procedure);
    const updated = await repository.completeProcedure(procedure.id, input.procedureVersion);

    const requestHeaders = await headers();
    await emitAuditEvent({
      action: AUDIT_ACTIONS.FIELDWORK_PROCEDURE_UPDATED,
      resourceType: AUDIT_RESOURCE_TYPE,
      resourceId: pkg.id,
      organizationId: context.organizationId,
      workspaceId: context.workspaceId,
      userId: context.userId,
      userAgent: requestHeaders.get("user-agent"),
      metadata: { procedureId: updated.id, completed: true },
    });

    return {
      procedureId: updated.id,
      version: updated.version,
      procedureStatus: updated.procedure_status,
    };
  },
);

export const assignFieldworkProcedureAction = defineFieldworkAction<
  {
    packageId: string;
    procedureId: string;
    procedureVersion: number;
    assignedAuditorId: string | null;
    dueDate?: string | null;
  },
  { procedureId: string; version: number }
>(
  { module: "fieldwork.procedure.assign" },
  FIELDWORK_PERMISSIONS.ASSIGN,
  async (input, context) => {
    const supabase = await createServerClient();
    const repository = new FieldworkRepository(
      supabase,
      createRepositoryContext(context.userId, context.organizationId, context.workspaceId),
    );
    const { pkg } = await getProcedureContext(
      repository,
      input.packageId,
      input.procedureId,
      input.procedureVersion,
      context.workspaceId,
    );

    const updated = await repository.assignProcedure(
      input.procedureId,
      input.procedureVersion,
      input.assignedAuditorId,
      input.dueDate ?? null,
    );

    const requestHeaders = await headers();
    await emitAuditEvent({
      action: AUDIT_ACTIONS.FIELDWORK_PROCEDURE_ASSIGNED,
      resourceType: AUDIT_RESOURCE_TYPE,
      resourceId: pkg.id,
      organizationId: context.organizationId,
      workspaceId: context.workspaceId,
      userId: context.userId,
      userAgent: requestHeaders.get("user-agent"),
      metadata: { procedureId: updated.id, assignedAuditorId: input.assignedAuditorId },
    });

    return { procedureId: updated.id, version: updated.version };
  },
);
