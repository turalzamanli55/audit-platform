"use server";

import { headers } from "next/headers";
import { randomUUID } from "crypto";
import {
  AUDIT_RESOURCE_TYPE,
  FIELDWORK_EVIDENCE_STORAGE_BUCKET,
  FIELDWORK_PERMISSIONS,
} from "@/constants/fieldwork";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import { createFieldworkAction as defineFieldworkAction } from "@/lib/actions/fieldwork/fieldwork-action";
import { assertPackageEditable } from "@/lib/fieldwork/fieldwork-rules";
import { createServerClient } from "@/lib/supabase/server";
import { FieldworkRepository } from "@/repositories/fieldwork/fieldwork-repository";
import type { RepositoryContext } from "@/types/context";
import type { FieldworkTickmark } from "@/types/fieldwork";
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

export const updateWorkingPaperAction = defineFieldworkAction<
  {
    packageId: string;
    workingPaperId: string;
    workingPaperVersion: number;
    procedureId?: string;
    assignedAuditorId?: string | null;
    title?: string;
    contentNotes?: string | null;
  },
  { workingPaperId: string; version: number }
>(
  { module: "fieldwork.working_paper.update" },
  FIELDWORK_PERMISSIONS.UPDATE,
  async (input, context) => {
    const supabase = await createServerClient();
    const repository = new FieldworkRepository(
      supabase,
      createRepositoryContext(context.userId, context.organizationId, context.workspaceId),
    );
    const pkg = await repository.validateWorkspaceOwnership(input.packageId, context.workspaceId);
    assertPackageEditable(pkg);

    const paper = await repository.updateWorkingPaper(
      input.workingPaperId,
      input.workingPaperVersion,
      {
        audit_procedure_id: input.procedureId,
        assigned_auditor_id: input.assignedAuditorId,
        title: input.title?.trim(),
        content_notes: input.contentNotes,
      },
    );

    const requestHeaders = await headers();
    await emitAuditEvent({
      action: AUDIT_ACTIONS.FIELDWORK_WORKING_PAPER_ADDED,
      resourceType: AUDIT_RESOURCE_TYPE,
      resourceId: pkg.id,
      organizationId: context.organizationId,
      workspaceId: context.workspaceId,
      userId: context.userId,
      userAgent: requestHeaders.get("user-agent"),
      metadata: { workingPaperId: paper.id, updated: true },
    });

    return { workingPaperId: paper.id, version: paper.version };
  },
);

export const addWorkingPaperTickmarkAction = defineFieldworkAction<
  {
    packageId: string;
    workingPaperId: string;
    workingPaperVersion: number;
    symbol: string;
    meaning: string;
  },
  { workingPaperId: string; version: number }
>(
  { module: "fieldwork.tickmark.add" },
  FIELDWORK_PERMISSIONS.UPDATE,
  async (input, context) => {
    if (!input.symbol?.trim() || !input.meaning?.trim()) {
      throw new ValidationError("Tickmark symbol and meaning are required");
    }

    const supabase = await createServerClient();
    const repository = new FieldworkRepository(
      supabase,
      createRepositoryContext(context.userId, context.organizationId, context.workspaceId),
    );
    const pkg = await repository.validateWorkspaceOwnership(input.packageId, context.workspaceId);
    assertPackageEditable(pkg);

    const existing = await repository.findWorkingPaperById(input.workingPaperId);
    if (!existing || existing.fieldwork_package_id !== pkg.id) {
      throw new ValidationError("Working paper not found");
    }
    repository.validateOptimisticLock(existing, input.workingPaperVersion, "WorkingPaper");

    const tickmarks = Array.isArray(existing.tickmarks)
      ? (existing.tickmarks as FieldworkTickmark[])
      : [];
    const nextTickmarks: FieldworkTickmark[] = [
      ...tickmarks,
      {
        id: randomUUID(),
        symbol: input.symbol.trim(),
        meaning: input.meaning.trim(),
        createdAt: new Date().toISOString(),
      },
    ];

    const paper = await repository.updateWorkingPaper(input.workingPaperId, input.workingPaperVersion, {
      tickmarks: nextTickmarks as never,
    });

    const requestHeaders = await headers();
    await emitAuditEvent({
      action: AUDIT_ACTIONS.FIELDWORK_TICKMARK_ADDED,
      resourceType: AUDIT_RESOURCE_TYPE,
      resourceId: pkg.id,
      organizationId: context.organizationId,
      workspaceId: context.workspaceId,
      userId: context.userId,
      userAgent: requestHeaders.get("user-agent"),
      metadata: { workingPaperId: paper.id, symbol: input.symbol.trim() },
    });

    return { workingPaperId: paper.id, version: paper.version };
  },
);

export const addTickmarkLibraryEntryAction = defineFieldworkAction<
  { symbol: string; meaning: string },
  { entryId: string }
>(
  { module: "fieldwork.tickmark.library.add" },
  FIELDWORK_PERMISSIONS.UPDATE,
  async (input, context) => {
    if (!input.symbol?.trim() || !input.meaning?.trim()) {
      throw new ValidationError("Tickmark symbol and meaning are required");
    }

    const supabase = await createServerClient();
    const repository = new FieldworkRepository(
      supabase,
      createRepositoryContext(context.userId, context.organizationId, context.workspaceId),
    );

    const entry = await repository.addTickmarkLibraryEntry({
      organizationId: context.organizationId,
      workspaceId: context.workspaceId,
      symbol: input.symbol.trim(),
      meaning: input.meaning.trim(),
    });

    const requestHeaders = await headers();
    await emitAuditEvent({
      action: AUDIT_ACTIONS.FIELDWORK_TICKMARK_ADDED,
      resourceType: AUDIT_RESOURCE_TYPE,
      resourceId: entry.id,
      organizationId: context.organizationId,
      workspaceId: context.workspaceId,
      userId: context.userId,
      userAgent: requestHeaders.get("user-agent"),
      metadata: { library: true, symbol: entry.symbol },
    });

    return { entryId: entry.id };
  },
);

export const uploadFieldworkEvidenceAction = defineFieldworkAction<
  {
    packageId: string;
    name: string;
    documentType?: string;
    procedureId?: string | null;
    workingPaperId?: string | null;
    fileName: string;
    fileBase64: string;
    mimeType: string;
    fileSize: number;
  },
  { evidenceId: string }
>(
  { module: "fieldwork.evidence.upload" },
  FIELDWORK_PERMISSIONS.UPDATE,
  async (input, context) => {
    if (!input.name?.trim()) throw new ValidationError("Evidence name is required");
    if (!input.fileBase64?.trim()) throw new ValidationError("Evidence file is required");

    const supabase = await createServerClient();
    const repository = new FieldworkRepository(
      supabase,
      createRepositoryContext(context.userId, context.organizationId, context.workspaceId),
    );
    const pkg = await repository.validateWorkspaceOwnership(input.packageId, context.workspaceId);
    assertPackageEditable(pkg);

    const evidenceId = randomUUID();
    const storagePath = `${context.workspaceId}/${pkg.engagement_id}/${evidenceId}/${input.fileName}`;
    const fileBuffer = Buffer.from(input.fileBase64, "base64");

    const uploadResult = await supabase.storage
      .from(FIELDWORK_EVIDENCE_STORAGE_BUCKET)
      .upload(storagePath, fileBuffer, {
        contentType: input.mimeType,
        upsert: false,
      });

    if (uploadResult.error) {
      throw new ValidationError(`Evidence upload failed: ${uploadResult.error.message}`);
    }

    const evidence = await repository.addEvidenceWithStorage({
      fieldworkPackageId: pkg.id,
      engagementId: pkg.engagement_id,
      organizationId: pkg.organization_id,
      workspaceId: pkg.workspace_id,
      name: input.name.trim(),
      documentType: input.documentType,
      auditProcedureId: input.procedureId ?? null,
      workingPaperId: input.workingPaperId ?? null,
      mimeType: input.mimeType,
      fileSize: input.fileSize,
      storagePath,
      storageBucket: FIELDWORK_EVIDENCE_STORAGE_BUCKET,
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
      metadata: { evidenceId: evidence.id, storagePath, uploaded: true },
    });

    return { evidenceId: evidence.id };
  },
);
