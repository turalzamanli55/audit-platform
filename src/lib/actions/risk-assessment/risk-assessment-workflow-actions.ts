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
  engagement_id: string;
  assessment_status: string;
  version: number;
};

type QueryResult<T> = Promise<{ data: T | null; error: { message: string } | null }>;

type UntypedQueryBuilder = {
  select: (columns: string) => UntypedQueryBuilder;
  eq: (column: string, value: unknown) => UntypedQueryBuilder;
  is: (column: string, value: null) => UntypedQueryBuilder;
  update: (values: Record<string, unknown>) => UntypedQueryBuilder;
  insert: (values: Record<string, unknown>) => Promise<{ error: { message: string } | null }>;
  maybeSingle: <T>() => QueryResult<T>;
};

type UntypedSupabase = {
  from: (table: string) => UntypedQueryBuilder;
};

export type RiskAssessmentWorkflowInput = {
  assessmentId: string;
  version: number;
  notes?: string | null;
};

export type RiskAssessmentWorkflowResult = {
  assessmentId: string;
  version: number;
  assessmentStatus: string;
};

async function loadAssessment(
  assessmentId: string,
  workspaceId: string,
  expectedVersion: number,
): Promise<RiskAssessmentRow> {
  if (!assessmentId) throw new ValidationError("Risk assessment is required");
  if (!Number.isInteger(expectedVersion) || expectedVersion < 1) {
    throw new ValidationError("Risk assessment version is required");
  }

  const supabase = await createServerClient();
  const db = supabase as unknown as UntypedSupabase;
  const result = await db
    .from("risk_assessments")
    .select("id, workspace_id, engagement_id, assessment_status, version")
    .eq("id", assessmentId)
    .is("deleted_at", null)
    .maybeSingle<RiskAssessmentRow>();

  if (result.error || !result.data) {
    throw new ValidationError("Risk assessment not found");
  }
  if (result.data.workspace_id !== workspaceId) {
    throw new ValidationError("Risk assessment does not belong to the active workspace");
  }
  if (result.data.version !== expectedVersion) {
    throw new ValidationError("Risk assessment was modified by another user");
  }

  return result.data as RiskAssessmentRow;
}

export const submitRiskAssessmentAction = defineRiskAssessmentAction<
  RiskAssessmentWorkflowInput,
  RiskAssessmentWorkflowResult
>({ module: "risk_assessment.submit" }, RISK_ASSESSMENT_PERMISSIONS.SUBMIT, async (input, context) => {
  const current = await loadAssessment(input.assessmentId, context.workspaceId, input.version);
  if (!["not_started", "in_progress", "returned"].includes(current.assessment_status)) {
    throw new ValidationError("Only draft or returned risk assessments can be submitted.");
  }

  const supabase = await createServerClient();
  const db = supabase as unknown as UntypedSupabase;
  const result = await db
    .from("risk_assessments")
    .update({
      assessment_status: "submitted",
      submitted_at: new Date().toISOString(),
      submitted_by: context.userId,
      returned_at: null,
      returned_by: null,
      return_notes: null,
    })
    .eq("id", current.id)
    .eq("version", input.version)
    .select("id, version, assessment_status")
    .maybeSingle<Pick<RiskAssessmentRow, "id" | "version" | "assessment_status">>();

  if (result.error || !result.data) {
    throw new ValidationError(result.error?.message ?? "Failed to submit risk assessment");
  }

  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.RISK_ASSESSMENT_SUBMITTED,
    resourceType: AUDIT_RESOURCE_TYPE,
    resourceId: result.data.id,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    userId: context.userId,
    userAgent: requestHeaders.get("user-agent"),
    metadata: { version: result.data.version },
  });

  return {
    assessmentId: result.data.id,
    version: result.data.version,
    assessmentStatus: result.data.assessment_status,
  };
});

export const returnRiskAssessmentAction = defineRiskAssessmentAction<
  RiskAssessmentWorkflowInput,
  RiskAssessmentWorkflowResult
>({ module: "risk_assessment.return" }, RISK_ASSESSMENT_PERMISSIONS.REVIEW, async (input, context) => {
  const current = await loadAssessment(input.assessmentId, context.workspaceId, input.version);
  if (!["submitted", "under_review"].includes(current.assessment_status)) {
    throw new ValidationError("Only submitted risk assessments can be returned.");
  }

  const returnNotes = input.notes?.trim() || null;
  const supabase = await createServerClient();
  const db = supabase as unknown as UntypedSupabase;
  const result = await db
    .from("risk_assessments")
    .update({
      assessment_status: "returned",
      returned_at: new Date().toISOString(),
      returned_by: context.userId,
      return_notes: returnNotes,
    })
    .eq("id", current.id)
    .eq("version", input.version)
    .select("id, version, assessment_status")
    .maybeSingle<Pick<RiskAssessmentRow, "id" | "version" | "assessment_status">>();

  if (result.error || !result.data) {
    throw new ValidationError(result.error?.message ?? "Failed to return risk assessment");
  }

  if (returnNotes) {
    const noteInsertResult = await db.from("risk_notes").insert({
      risk_assessment_id: current.id,
      engagement_id: current.engagement_id,
      organization_id: context.organizationId,
      workspace_id: context.workspaceId,
      note_type: "review",
      body: returnNotes,
      risk_register_item_id: null,
    });
    if (noteInsertResult.error) {
      throw new ValidationError(noteInsertResult.error.message);
    }
  }

  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.RISK_ASSESSMENT_RETURNED,
    resourceType: AUDIT_RESOURCE_TYPE,
    resourceId: result.data.id,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    userId: context.userId,
    userAgent: requestHeaders.get("user-agent"),
    metadata: { version: result.data.version },
  });

  return {
    assessmentId: result.data.id,
    version: result.data.version,
    assessmentStatus: result.data.assessment_status,
  };
});

export const approveRiskAssessmentAction = defineRiskAssessmentAction<
  RiskAssessmentWorkflowInput,
  RiskAssessmentWorkflowResult
>({ module: "risk_assessment.approve" }, RISK_ASSESSMENT_PERMISSIONS.APPROVE, async (input, context) => {
  const current = await loadAssessment(input.assessmentId, context.workspaceId, input.version);
  if (!["submitted", "under_review"].includes(current.assessment_status)) {
    throw new ValidationError("Only submitted risk assessments can be approved.");
  }

  const supabase = await createServerClient();
  const db = supabase as unknown as UntypedSupabase;
  const result = await db
    .from("risk_assessments")
    .update({
      assessment_status: "approved",
      approved_at: new Date().toISOString(),
      approved_by: context.userId,
      significant_risks_acknowledged_at: new Date().toISOString(),
      significant_risks_acknowledged_by: context.userId,
    })
    .eq("id", current.id)
    .eq("version", input.version)
    .select("id, version, assessment_status")
    .maybeSingle<Pick<RiskAssessmentRow, "id" | "version" | "assessment_status">>();

  if (result.error || !result.data) {
    throw new ValidationError(result.error?.message ?? "Failed to approve risk assessment");
  }

  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.RISK_ASSESSMENT_APPROVED,
    resourceType: AUDIT_RESOURCE_TYPE,
    resourceId: result.data.id,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    userId: context.userId,
    userAgent: requestHeaders.get("user-agent"),
    metadata: { version: result.data.version },
  });

  return {
    assessmentId: result.data.id,
    version: result.data.version,
    assessmentStatus: result.data.assessment_status,
  };
});
