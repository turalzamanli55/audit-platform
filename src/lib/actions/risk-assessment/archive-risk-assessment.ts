"use server";

import { headers } from "next/headers";
import { AUDIT_RESOURCE_TYPE, RISK_ASSESSMENT_PERMISSIONS } from "@/constants/risk-assessment";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import { createRiskAssessmentAction as defineRiskAssessmentAction } from "@/lib/actions/risk-assessment/risk-assessment-action";
import { createServerClient } from "@/lib/supabase/server";
import { ValidationError } from "@/lib/errors";

type RiskAssessmentRow = {
  id: string;
  workspace_id: string;
  status: string;
  deleted_at: string | null;
  assessment_status: string;
  version: number;
};

type QueryResult<T> = Promise<{ data: T | null; error: { message: string } | null }>;

type UntypedQueryBuilder = {
  select: (columns: string) => UntypedQueryBuilder;
  eq: (column: string, value: unknown) => UntypedQueryBuilder;
  update: (values: Record<string, unknown>) => UntypedQueryBuilder;
  maybeSingle: <T>() => QueryResult<T>;
};

type UntypedSupabase = {
  from: (table: string) => UntypedQueryBuilder;
};

async function getAssessmentOrThrow(
  assessmentId: string,
  workspaceId: string,
): Promise<RiskAssessmentRow> {
  const supabase = await createServerClient();
  const db = supabase as unknown as UntypedSupabase;
  const queryResult = await db
    .from("risk_assessments")
    .select("id, workspace_id, status, deleted_at, assessment_status, version")
    .eq("id", assessmentId)
    .maybeSingle<RiskAssessmentRow>();

  if (queryResult.error || !queryResult.data) {
    throw new ValidationError("Risk assessment not found");
  }
  if (queryResult.data.workspace_id !== workspaceId) {
    throw new ValidationError("Risk assessment does not belong to the active workspace");
  }

  return queryResult.data as RiskAssessmentRow;
}

export type ArchiveRiskAssessmentActionInput = {
  assessmentId: string;
  version: number;
  archiveReason?: string | null;
};

export type ArchiveRiskAssessmentActionResult = {
  assessmentId: string;
  version: number;
  status: string;
  assessmentStatus: string;
};

export const archiveRiskAssessmentAction = defineRiskAssessmentAction<
  ArchiveRiskAssessmentActionInput,
  ArchiveRiskAssessmentActionResult
>({ module: "risk_assessment.archive" }, RISK_ASSESSMENT_PERMISSIONS.ARCHIVE, async (input, context) => {
  if (!input.assessmentId) throw new ValidationError("Risk assessment is required");
  if (!Number.isInteger(input.version) || input.version < 1) {
    throw new ValidationError("Risk assessment version is required");
  }

  const current = await getAssessmentOrThrow(input.assessmentId, context.workspaceId);
  if (current.version !== input.version) {
    throw new ValidationError("Risk assessment was modified by another user");
  }
  if (current.deleted_at || current.status === "archived") {
    throw new ValidationError("Risk assessment is already archived");
  }

  const supabase = await createServerClient();
  const db = supabase as unknown as UntypedSupabase;
  const updateResult = await db
    .from("risk_assessments")
    .update({
      deleted_at: new Date().toISOString(),
      deleted_by: context.userId,
      status: "archived",
      assessment_status: "archived",
    })
    .eq("id", input.assessmentId)
    .eq("version", input.version)
    .select("id, status, assessment_status, version")
    .maybeSingle<RiskAssessmentRow>();

  if (updateResult.error || !updateResult.data) {
    throw new ValidationError(updateResult.error?.message ?? "Failed to archive risk assessment");
  }

  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.RISK_ASSESSMENT_ARCHIVED,
    resourceType: AUDIT_RESOURCE_TYPE,
    resourceId: updateResult.data.id,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    userId: context.userId,
    userAgent: requestHeaders.get("user-agent"),
    metadata: {
      version: updateResult.data.version,
      archiveReason: input.archiveReason ?? null,
    },
  });

  return {
    assessmentId: updateResult.data.id,
    version: updateResult.data.version,
    status: updateResult.data.status,
    assessmentStatus: updateResult.data.assessment_status,
  };
});

export const restoreRiskAssessmentAction = defineRiskAssessmentAction<
  { assessmentId: string; version: number },
  ArchiveRiskAssessmentActionResult
>({ module: "risk_assessment.restore" }, RISK_ASSESSMENT_PERMISSIONS.ARCHIVE, async (input, context) => {
  if (!input.assessmentId) throw new ValidationError("Risk assessment is required");
  if (!Number.isInteger(input.version) || input.version < 1) {
    throw new ValidationError("Risk assessment version is required");
  }

  const current = await getAssessmentOrThrow(input.assessmentId, context.workspaceId);
  if (current.version !== input.version) {
    throw new ValidationError("Risk assessment was modified by another user");
  }
  if (!current.deleted_at && current.status !== "archived") {
    throw new ValidationError("Risk assessment is not archived");
  }

  const supabase = await createServerClient();
  const assessmentStatus = current.assessment_status === "archived" ? "in_progress" : current.assessment_status;
  const db = supabase as unknown as UntypedSupabase;
  const updateResult = await db
    .from("risk_assessments")
    .update({
      deleted_at: null,
      deleted_by: null,
      status: "active",
      assessment_status: assessmentStatus,
    })
    .eq("id", input.assessmentId)
    .eq("version", input.version)
    .select("id, status, assessment_status, version")
    .maybeSingle<RiskAssessmentRow>();

  if (updateResult.error || !updateResult.data) {
    throw new ValidationError(updateResult.error?.message ?? "Failed to restore risk assessment");
  }

  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.RISK_ASSESSMENT_RESTORED,
    resourceType: AUDIT_RESOURCE_TYPE,
    resourceId: updateResult.data.id,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    userId: context.userId,
    userAgent: requestHeaders.get("user-agent"),
    metadata: { version: updateResult.data.version },
  });

  return {
    assessmentId: updateResult.data.id,
    version: updateResult.data.version,
    status: updateResult.data.status,
    assessmentStatus: updateResult.data.assessment_status,
  };
});
