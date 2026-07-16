"use server";

import { headers } from "next/headers";
import { AUDIT_RESOURCE_TYPE, WORKING_PAPER_MANAGEMENT_PERMISSIONS } from "@/constants/fieldwork";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import { createFieldworkAction as defineFieldworkAction } from "@/lib/actions/fieldwork/fieldwork-action";
import {
  assertWorkingPaperSignOffOrder,
  assertWorkingPaperSnapshotAllowed,
  isWorkingPaperSignOffRole,
  nextWorkingPaperVersionNumber,
  type WorkingPaperSignOffRole,
} from "@/lib/fieldwork/working-paper-management";
import { createServerClient } from "@/lib/supabase/server";
import { WorkingPaperManagementRepository } from "@/repositories/fieldwork/working-paper-management-repository";
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

export type SnapshotWorkingPaperVersionInput = {
  workingPaperId: string;
  changeSummary?: string | null;
};

export type SnapshotWorkingPaperVersionResult = {
  workingPaperId: string;
  versionId: string;
  versionNumber: number;
};

export const snapshotWorkingPaperVersionAction = defineFieldworkAction<
  SnapshotWorkingPaperVersionInput,
  SnapshotWorkingPaperVersionResult
>(
  { module: "fieldwork.working-paper.version.create" },
  WORKING_PAPER_MANAGEMENT_PERMISSIONS.VERSION_CREATE,
  async (input, context) => {
    if (!input.workingPaperId) {
      throw new ValidationError("Working paper is required");
    }

    const supabase = await createServerClient();
    const repository = new WorkingPaperManagementRepository(
      supabase,
      createRepositoryContext(context.userId, context.organizationId, context.workspaceId),
    );

    const paper = await repository.requireWorkingPaperInWorkspace(
      input.workingPaperId,
      context.workspaceId,
    );
    assertWorkingPaperSnapshotAllowed(paper);

    const versions = await repository.listVersions(paper.id);
    const versionNumber = nextWorkingPaperVersionNumber(
      versions.map((version) => version.version_number),
    );

    const created = await repository.createVersionSnapshot({
      paper,
      versionNumber,
      changeSummary: input.changeSummary ?? null,
    });

    const requestHeaders = await headers();
    await emitAuditEvent({
      action: AUDIT_ACTIONS.WORKING_PAPER_VERSION_CREATED,
      resourceType: AUDIT_RESOURCE_TYPE,
      resourceId: paper.id,
      organizationId: context.organizationId,
      workspaceId: context.workspaceId,
      userId: context.userId,
      userAgent: requestHeaders.get("user-agent"),
      metadata: { versionNumber, changeSummary: input.changeSummary ?? null },
    });

    return {
      workingPaperId: paper.id,
      versionId: created.id,
      versionNumber: created.version_number,
    };
  },
);

export type SignOffWorkingPaperInput = {
  workingPaperId: string;
  versionNumber: number;
  role: string;
  note?: string | null;
};

export type SignOffWorkingPaperResult = {
  workingPaperId: string;
  versionNumber: number;
  role: WorkingPaperSignOffRole;
  signOffId: string;
};

export const signOffWorkingPaperAction = defineFieldworkAction<
  SignOffWorkingPaperInput,
  SignOffWorkingPaperResult
>(
  { module: "fieldwork.working-paper.sign-off" },
  WORKING_PAPER_MANAGEMENT_PERMISSIONS.SIGN_OFF,
  async (input, context) => {
    if (!input.workingPaperId) {
      throw new ValidationError("Working paper is required");
    }
    if (!Number.isInteger(input.versionNumber) || input.versionNumber < 1) {
      throw new ValidationError("Working paper version is required");
    }
    if (!isWorkingPaperSignOffRole(input.role)) {
      throw new ValidationError("Sign-off role must be preparer, reviewer, or partner");
    }

    const supabase = await createServerClient();
    const repository = new WorkingPaperManagementRepository(
      supabase,
      createRepositoryContext(context.userId, context.organizationId, context.workspaceId),
    );

    const paper = await repository.requireWorkingPaperInWorkspace(
      input.workingPaperId,
      context.workspaceId,
    );

    const versions = await repository.listVersions(paper.id);
    if (!versions.some((version) => version.version_number === input.versionNumber)) {
      throw new ValidationError(`Working paper version ${input.versionNumber} does not exist`);
    }

    const existing = await repository.listSignOffs(paper.id, input.versionNumber);
    assertWorkingPaperSignOffOrder(
      existing
        .map((signOff) => signOff.sign_off_role)
        .filter(isWorkingPaperSignOffRole),
      input.role,
    );

    const signOff = await repository.recordSignOff({
      paper,
      versionNumber: input.versionNumber,
      role: input.role,
      note: input.note ?? null,
    });

    const requestHeaders = await headers();
    await emitAuditEvent({
      action: AUDIT_ACTIONS.WORKING_PAPER_SIGNED_OFF,
      resourceType: AUDIT_RESOURCE_TYPE,
      resourceId: paper.id,
      organizationId: context.organizationId,
      workspaceId: context.workspaceId,
      userId: context.userId,
      userAgent: requestHeaders.get("user-agent"),
      metadata: { versionNumber: input.versionNumber, role: input.role },
    });

    return {
      workingPaperId: paper.id,
      versionNumber: input.versionNumber,
      role: input.role,
      signOffId: signOff.id,
    };
  },
);

export type ListWorkingPaperVersionsInput = {
  workingPaperId: string;
};

export type ListWorkingPaperVersionsResult = {
  workingPaperId: string;
  versions: Array<{
    id: string;
    versionNumber: number;
    title: string;
    paperStatus: string;
    changeSummary: string | null;
    createdAt: string;
    signOffs: Array<{ role: string; signedBy: string; signedAt: string; note: string | null }>;
  }>;
};

export const listWorkingPaperVersionsAction = defineFieldworkAction<
  ListWorkingPaperVersionsInput,
  ListWorkingPaperVersionsResult
>(
  { module: "fieldwork.working-paper.version.list" },
  WORKING_PAPER_MANAGEMENT_PERMISSIONS.VERSION_READ,
  async (input, context) => {
    if (!input.workingPaperId) {
      throw new ValidationError("Working paper is required");
    }

    const supabase = await createServerClient();
    const repository = new WorkingPaperManagementRepository(
      supabase,
      createRepositoryContext(context.userId, context.organizationId, context.workspaceId),
    );

    const paper = await repository.requireWorkingPaperInWorkspace(
      input.workingPaperId,
      context.workspaceId,
    );

    const [versions, signOffs] = await Promise.all([
      repository.listVersions(paper.id),
      repository.listSignOffs(paper.id),
    ]);

    return {
      workingPaperId: paper.id,
      versions: versions.map((version) => ({
        id: version.id,
        versionNumber: version.version_number,
        title: version.title,
        paperStatus: version.paper_status,
        changeSummary: version.change_summary,
        createdAt: version.created_at,
        signOffs: signOffs
          .filter((signOff) => signOff.version_number === version.version_number)
          .map((signOff) => ({
            role: signOff.sign_off_role,
            signedBy: signOff.signed_by,
            signedAt: signOff.signed_at,
            note: signOff.note,
          })),
      })),
    };
  },
);
