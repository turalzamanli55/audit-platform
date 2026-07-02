"use server";

import { headers } from "next/headers";
import { AUDIT_RESOURCE_TYPE, FIELDWORK_PERMISSIONS } from "@/constants/fieldwork";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import { createFieldworkAction as defineFieldworkAction } from "@/lib/actions/fieldwork/fieldwork-action";
import {
  assertCanClearWorkingPaper,
  assertCanReturnWorkingPaper,
  assertCanSubmitWorkingPaper,
  assertPackageEditable,
} from "@/lib/fieldwork/fieldwork-rules";
import { createServerClient } from "@/lib/supabase/server";
import { FieldworkRepository } from "@/repositories/fieldwork/fieldwork-repository";
import type { RepositoryContext } from "@/types/context";
import { ValidationError } from "@/lib/errors";

export type FieldworkWorkingPaperWorkflowInput = {
  packageId: string;
  workingPaperId: string;
  workingPaperVersion: number;
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

async function getPaperContext(
  repository: FieldworkRepository,
  packageId: string,
  workingPaperId: string,
  workingPaperVersion: number,
  workspaceId: string,
) {
  const pkg = await repository.validateWorkspaceOwnership(packageId, workspaceId);
  assertPackageEditable(pkg);
  const paper = await repository.findWorkingPaperById(workingPaperId);
  if (!paper || paper.fieldwork_package_id !== packageId) {
    throw new ValidationError("Working paper not found");
  }
  repository.validateOptimisticLock(paper, workingPaperVersion, "WorkingPaper");
  return { pkg, paper };
}

export const submitFieldworkWorkingPaperAction = defineFieldworkAction<
  FieldworkWorkingPaperWorkflowInput,
  { workingPaperId: string; version: number; paperStatus: string }
>(
  { module: "fieldwork.working_paper.submit" },
  FIELDWORK_PERMISSIONS.UPDATE,
  async (input, context) => {
    const supabase = await createServerClient();
    const repository = new FieldworkRepository(
      supabase,
      createRepositoryContext(context.userId, context.organizationId, context.workspaceId),
    );
    const { pkg, paper } = await getPaperContext(
      repository,
      input.packageId,
      input.workingPaperId,
      input.workingPaperVersion,
      context.workspaceId,
    );

    assertCanSubmitWorkingPaper(paper);
    const updated = await repository.submitWorkingPaperForReview(paper.id, input.workingPaperVersion);

    const requestHeaders = await headers();
    await emitAuditEvent({
      action: AUDIT_ACTIONS.FIELDWORK_WORKING_PAPER_ADDED,
      resourceType: AUDIT_RESOURCE_TYPE,
      resourceId: pkg.id,
      organizationId: context.organizationId,
      workspaceId: context.workspaceId,
      userId: context.userId,
      userAgent: requestHeaders.get("user-agent"),
      metadata: { workingPaperId: updated.id, submitted: true },
    });

    return {
      workingPaperId: updated.id,
      version: updated.version,
      paperStatus: updated.paper_status,
    };
  },
);

export const returnFieldworkWorkingPaperAction = defineFieldworkAction<
  FieldworkWorkingPaperWorkflowInput,
  { workingPaperId: string; version: number; paperStatus: string }
>(
  { module: "fieldwork.working_paper.return" },
  FIELDWORK_PERMISSIONS.REVIEW,
  async (input, context) => {
    const supabase = await createServerClient();
    const repository = new FieldworkRepository(
      supabase,
      createRepositoryContext(context.userId, context.organizationId, context.workspaceId),
    );
    const { pkg, paper } = await getPaperContext(
      repository,
      input.packageId,
      input.workingPaperId,
      input.workingPaperVersion,
      context.workspaceId,
    );

    assertCanReturnWorkingPaper(paper);
    const updated = await repository.returnWorkingPaper(
      paper.id,
      input.workingPaperVersion,
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
        workingPaperId: paper.id,
      });
    }

    return {
      workingPaperId: updated.id,
      version: updated.version,
      paperStatus: updated.paper_status,
    };
  },
);

export const clearFieldworkWorkingPaperAction = defineFieldworkAction<
  FieldworkWorkingPaperWorkflowInput,
  { workingPaperId: string; version: number; paperStatus: string }
>(
  { module: "fieldwork.working_paper.clear" },
  FIELDWORK_PERMISSIONS.REVIEW,
  async (input, context) => {
    const supabase = await createServerClient();
    const repository = new FieldworkRepository(
      supabase,
      createRepositoryContext(context.userId, context.organizationId, context.workspaceId),
    );
    const { pkg, paper } = await getPaperContext(
      repository,
      input.packageId,
      input.workingPaperId,
      input.workingPaperVersion,
      context.workspaceId,
    );

    assertCanClearWorkingPaper(paper);
    const updated = await repository.clearWorkingPaperReview(
      paper.id,
      input.workingPaperVersion,
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
        workingPaperId: paper.id,
      });
    }

    return {
      workingPaperId: updated.id,
      version: updated.version,
      paperStatus: updated.paper_status,
    };
  },
);
