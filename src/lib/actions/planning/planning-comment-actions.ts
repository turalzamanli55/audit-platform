"use server";

import { headers } from "next/headers";
import { AUDIT_RESOURCE_TYPE, PLANNING_PERMISSIONS } from "@/constants/planning";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import { createPlanningAction as definePlanningAction } from "@/lib/actions/planning/planning-action";
import { assertPlanEditable } from "@/lib/planning/planning-rules";
import { createServerClient } from "@/lib/supabase/server";
import { PlanningRepository } from "@/repositories/planning/planning-repository";
import type { RepositoryContext } from "@/types/context";
import { ValidationError } from "@/lib/errors";

export type AddPlanningCommentActionInput = {
  planId: string;
  version: number;
  body: string;
  commentType?: "review" | "general" | "return";
};

export type AddPlanningCommentActionResult = {
  commentId: string;
  planVersion: number;
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

export const addPlanningCommentAction = definePlanningAction<
  AddPlanningCommentActionInput,
  AddPlanningCommentActionResult
>(
  { module: "planning.comment" },
  PLANNING_PERMISSIONS.COMMENT,
  async (input, context) => {
    if (!input.planId) throw new ValidationError("Planning record is required");
    if (!input.body?.trim()) throw new ValidationError("Comment is required");

    const supabase = await createServerClient();
    const repository = new PlanningRepository(
      supabase,
      createRepositoryContext(context.userId, context.organizationId, context.workspaceId),
    );

    const plan = await repository.validateWorkspaceOwnership(input.planId, context.workspaceId);
    assertPlanEditable(plan);

    const comment = await repository.addComment({
      auditPlanId: plan.id,
      engagementId: plan.engagement_id,
      organizationId: plan.organization_id,
      workspaceId: plan.workspace_id,
      body: input.body.trim(),
      commentType: input.commentType ?? "review",
    });

    const requestHeaders = await headers();
    await emitAuditEvent({
      action: AUDIT_ACTIONS.PLANNING_COMMENT_ADDED,
      resourceType: AUDIT_RESOURCE_TYPE,
      resourceId: plan.id,
      organizationId: context.organizationId,
      workspaceId: context.workspaceId,
      userId: context.userId,
      userAgent: requestHeaders.get("user-agent"),
      metadata: { commentId: comment.id },
    });

    return { commentId: comment.id, planVersion: plan.plan_version };
  },
);

export type AddPlanningDocumentActionInput = {
  planId: string;
  version: number;
  name: string;
  documentType: string;
  mimeType?: string | null;
  fileSize?: number | null;
};

export type AddPlanningDocumentActionResult = {
  planId: string;
  version: number;
  documentId: string;
};

export const addPlanningDocumentAction = definePlanningAction<
  AddPlanningDocumentActionInput,
  AddPlanningDocumentActionResult
>({ module: "planning.document.add" }, PLANNING_PERMISSIONS.UPDATE, async (input, context) => {
  if (!input.planId) throw new ValidationError("Planning record is required");
  if (!input.name?.trim()) throw new ValidationError("Document name is required");
  if (!Number.isInteger(input.version) || input.version < 1) {
    throw new ValidationError("Planning version is required");
  }

  const supabase = await createServerClient();
  const repository = new PlanningRepository(
    supabase,
    createRepositoryContext(context.userId, context.organizationId, context.workspaceId),
  );

  const plan = await repository.validateWorkspaceOwnership(input.planId, context.workspaceId);
  assertPlanEditable(plan);
  repository.validateOptimisticLock(plan, input.version);

  const documents = Array.isArray(plan.documents) ? [...(plan.documents as object[])] : [];
  const documentId = crypto.randomUUID();
  documents.push({
    id: documentId,
    name: input.name.trim(),
    documentType: input.documentType?.trim() || "planning_memorandum",
    status: "uploaded",
    createdAt: new Date().toISOString(),
    mimeType: input.mimeType ?? null,
    fileSize: input.fileSize ?? null,
  });

  const updated = await repository.update(plan.id, input.version, {
    documents: documents as never,
  });

  await repository.logActivity({
    auditPlanId: plan.id,
    engagementId: plan.engagement_id,
    organizationId: plan.organization_id,
    workspaceId: plan.workspace_id,
    action: "planning.document.added",
    summary: `Document "${input.name.trim()}" added`,
    metadata: { documentId },
  });

  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.PLANNING_DOCUMENT_ADDED,
    resourceType: AUDIT_RESOURCE_TYPE,
    resourceId: plan.id,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    userId: context.userId,
    userAgent: requestHeaders.get("user-agent"),
    metadata: { documentId },
  });

  return { planId: updated.id, version: updated.version, documentId };
});
