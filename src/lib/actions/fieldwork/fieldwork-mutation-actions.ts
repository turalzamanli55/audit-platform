"use server";

import { headers } from "next/headers";
import { AUDIT_RESOURCE_TYPE, FIELDWORK_PERMISSIONS } from "@/constants/fieldwork";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import { createFieldworkAction as defineFieldworkAction } from "@/lib/actions/fieldwork/fieldwork-action";
import { assertPackageEditable } from "@/lib/fieldwork/fieldwork-rules";
import { createServerClient } from "@/lib/supabase/server";
import { FieldworkRepository } from "@/repositories/fieldwork/fieldwork-repository";
import type { RepositoryContext } from "@/types/context";
import type { FieldworkNoteType } from "@/types/fieldwork";
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

export const updateFieldworkProcedureAction = defineFieldworkAction<
  {
    packageId: string;
    procedureId: string;
    procedureVersion: number;
    procedureStatus?: import("@/types/fieldwork").ProcedureStatus;
    assignedAuditorId?: string | null;
    dueDate?: string | null;
    completionPct?: number;
  },
  { procedureId: string; version: number }
>({ module: "fieldwork.procedure.update" }, FIELDWORK_PERMISSIONS.UPDATE, async (input, context) => {
  const supabase = await createServerClient();
  const repository = new FieldworkRepository(
    supabase,
    createRepositoryContext(context.userId, context.organizationId, context.workspaceId),
  );

  const pkg = await repository.validateWorkspaceOwnership(input.packageId, context.workspaceId);
  assertPackageEditable(pkg);

  const procedure = await repository.updateProcedure(input.procedureId, input.procedureVersion, {
    procedure_status: input.procedureStatus,
    assigned_auditor_id: input.assignedAuditorId,
    due_date: input.dueDate,
    completion_pct:
      input.completionPct ??
      (input.procedureStatus
        ? repository.computeProcedureCompletion(input.procedureStatus)
        : undefined),
  });

  await repository.recomputeProgress(pkg.id);

  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.FIELDWORK_PROCEDURE_UPDATED,
    resourceType: AUDIT_RESOURCE_TYPE,
    resourceId: pkg.id,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    userId: context.userId,
    userAgent: requestHeaders.get("user-agent"),
    metadata: { procedureId: procedure.id },
  });

  return { procedureId: procedure.id, version: procedure.version };
});

export const addFieldworkNoteAction = defineFieldworkAction<
  {
    packageId: string;
    body: string;
    noteType?: FieldworkNoteType;
    procedureId?: string | null;
    workingPaperId?: string | null;
  },
  { noteId: string }
>({ module: "fieldwork.note.add" }, FIELDWORK_PERMISSIONS.COMMENT, async (input, context) => {
  if (!input.body?.trim()) throw new ValidationError("Note is required");

  const supabase = await createServerClient();
  const repository = new FieldworkRepository(
    supabase,
    createRepositoryContext(context.userId, context.organizationId, context.workspaceId),
  );

  const pkg = await repository.validateWorkspaceOwnership(input.packageId, context.workspaceId);
  assertPackageEditable(pkg);

  const note = await repository.addNote({
    fieldworkPackageId: pkg.id,
    engagementId: pkg.engagement_id,
    organizationId: pkg.organization_id,
    workspaceId: pkg.workspace_id,
    body: input.body.trim(),
    noteType: input.noteType ?? "auditor",
    auditProcedureId: input.procedureId ?? null,
    workingPaperId: input.workingPaperId ?? null,
  });

  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.FIELDWORK_NOTE_ADDED,
    resourceType: AUDIT_RESOURCE_TYPE,
    resourceId: pkg.id,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    userId: context.userId,
    userAgent: requestHeaders.get("user-agent"),
    metadata: { noteId: note.id },
  });

  return { noteId: note.id };
});

export const addFieldworkEvidenceAction = defineFieldworkAction<
  {
    packageId: string;
    name: string;
    documentType?: string;
    procedureId?: string | null;
    workingPaperId?: string | null;
  },
  { evidenceId: string }
>({ module: "fieldwork.evidence.add" }, FIELDWORK_PERMISSIONS.UPDATE, async (input, context) => {
  if (!input.name?.trim()) throw new ValidationError("Evidence name is required");

  const supabase = await createServerClient();
  const repository = new FieldworkRepository(
    supabase,
    createRepositoryContext(context.userId, context.organizationId, context.workspaceId),
  );

  const pkg = await repository.validateWorkspaceOwnership(input.packageId, context.workspaceId);
  assertPackageEditable(pkg);

  const evidence = await repository.addEvidence({
    fieldworkPackageId: pkg.id,
    engagementId: pkg.engagement_id,
    organizationId: pkg.organization_id,
    workspaceId: pkg.workspace_id,
    name: input.name.trim(),
    documentType: input.documentType,
    auditProcedureId: input.procedureId ?? null,
    workingPaperId: input.workingPaperId ?? null,
  });

  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.FIELDWORK_EVIDENCE_ADDED,
    resourceType: AUDIT_RESOURCE_TYPE,
    resourceId: pkg.id,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    userId: context.userId,
    userAgent: requestHeaders.get("user-agent"),
    metadata: { evidenceId: evidence.id },
  });

  return { evidenceId: evidence.id };
});

export const addFieldworkFindingAction = defineFieldworkAction<
  {
    packageId: string;
    title: string;
    description?: string | null;
    severity?: string;
    procedureId?: string | null;
  },
  { findingId: string }
>({ module: "fieldwork.finding.add" }, FIELDWORK_PERMISSIONS.UPDATE, async (input, context) => {
  if (!input.title?.trim()) throw new ValidationError("Finding title is required");

  const supabase = await createServerClient();
  const repository = new FieldworkRepository(
    supabase,
    createRepositoryContext(context.userId, context.organizationId, context.workspaceId),
  );

  const pkg = await repository.validateWorkspaceOwnership(input.packageId, context.workspaceId);
  assertPackageEditable(pkg);

  const finding = await repository.addFinding({
    fieldworkPackageId: pkg.id,
    engagementId: pkg.engagement_id,
    organizationId: pkg.organization_id,
    workspaceId: pkg.workspace_id,
    title: input.title.trim(),
    description: input.description ?? null,
    severity: input.severity,
    auditProcedureId: input.procedureId ?? null,
  });

  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.FIELDWORK_FINDING_ADDED,
    resourceType: AUDIT_RESOURCE_TYPE,
    resourceId: pkg.id,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    userId: context.userId,
    userAgent: requestHeaders.get("user-agent"),
    metadata: { findingId: finding.id },
  });

  return { findingId: finding.id };
});

export const addWorkingPaperAction = defineFieldworkAction<
  {
    packageId: string;
    procedureId: string;
    title: string;
    referenceCode?: string | null;
    contentNotes?: string | null;
  },
  { workingPaperId: string }
>({ module: "fieldwork.working_paper.add" }, FIELDWORK_PERMISSIONS.UPDATE, async (input, context) => {
  if (!input.title?.trim()) throw new ValidationError("Working paper title is required");

  const supabase = await createServerClient();
  const repository = new FieldworkRepository(
    supabase,
    createRepositoryContext(context.userId, context.organizationId, context.workspaceId),
  );

  const pkg = await repository.validateWorkspaceOwnership(input.packageId, context.workspaceId);
  assertPackageEditable(pkg);

  const paper = await repository.addWorkingPaper({
    auditProcedureId: input.procedureId,
    fieldworkPackageId: pkg.id,
    engagementId: pkg.engagement_id,
    organizationId: pkg.organization_id,
    workspaceId: pkg.workspace_id,
    title: input.title.trim(),
    referenceCode: input.referenceCode ?? null,
    contentNotes: input.contentNotes ?? null,
  });

  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.FIELDWORK_WORKING_PAPER_ADDED,
    resourceType: AUDIT_RESOURCE_TYPE,
    resourceId: pkg.id,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    userId: context.userId,
    userAgent: requestHeaders.get("user-agent"),
    metadata: { workingPaperId: paper.id },
  });

  return { workingPaperId: paper.id };
});
