"use server";

import { headers } from "next/headers";
import { AUDIT_RESOURCE_TYPE, RISK_ASSESSMENT_PERMISSIONS } from "@/constants/risk-assessment";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import { createRiskAssessmentAction as defineRiskAssessmentAction } from "@/lib/actions/risk-assessment/risk-assessment-action";
import {
  assertSignificantRisksAcknowledged,
  assertSubmitPrerequisites,
} from "@/lib/risk-assessment/risk-assessment-rules";
import { createServerClient } from "@/lib/supabase/server";
import { PlanningRepository } from "@/repositories/planning/planning-repository";
import type { RepositoryContext } from "@/types/context";
import { ValidationError } from "@/lib/errors";

type RiskAssessmentRow = {
  id: string;
  workspace_id: string;
  engagement_id: string;
  audit_plan_id: string;
  assessment_status: string;
  version: number;
  significant_risks_acknowledged_at: string | null;
};

type RiskItemRow = {
  id: string;
  risk_type: string;
  is_significant: boolean;
};

type ProcedureLinkRow = {
  risk_register_item_id: string;
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
    .select(
      "id, workspace_id, engagement_id, audit_plan_id, assessment_status, version, significant_risks_acknowledged_at",
    )
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

async function loadSubmitData(assessmentId: string) {
  const supabase = await createServerClient();
  const itemsResult = await supabase
    .from("risk_register_items")
    .select("id, risk_type, is_significant")
    .eq("risk_assessment_id", assessmentId)
    .is("deleted_at", null);

  const linksResult = await supabase
    .from("risk_procedure_links")
    .select("risk_register_item_id")
    .eq("risk_assessment_id", assessmentId)
    .is("deleted_at", null);

  return {
    riskItems: (itemsResult.data ?? []) as RiskItemRow[],
    procedureLinks: (linksResult.data ?? []) as ProcedureLinkRow[],
  };
}

export const submitRiskAssessmentAction = defineRiskAssessmentAction<
  RiskAssessmentWorkflowInput,
  RiskAssessmentWorkflowResult
>({ module: "risk_assessment.submit" }, RISK_ASSESSMENT_PERMISSIONS.SUBMIT, async (input, context) => {
  const current = await loadAssessment(input.assessmentId, context.workspaceId, input.version);
  if (!["not_started", "in_progress", "returned"].includes(current.assessment_status)) {
    throw new ValidationError("Only draft or returned risk assessments can be submitted.");
  }

  const { riskItems, procedureLinks } = await loadSubmitData(current.id);
  assertSubmitPrerequisites(
    riskItems.map((item) => ({
      id: item.id,
      riskType: item.risk_type,
      isSignificant: item.is_significant,
    })),
    procedureLinks.map((link) => ({ riskItemId: link.risk_register_item_id })),
  );

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

export const acknowledgeSignificantRisksAction = defineRiskAssessmentAction<
  RiskAssessmentWorkflowInput,
  RiskAssessmentWorkflowResult
>(
  { module: "risk_assessment.significant.acknowledge" },
  RISK_ASSESSMENT_PERMISSIONS.APPROVE,
  async (input, context) => {
    const current = await loadAssessment(input.assessmentId, context.workspaceId, input.version);
    if (["approved", "archived"].includes(current.assessment_status)) {
      throw new ValidationError("Approved risk assessments cannot be modified.");
    }

    const supabase = await createServerClient();
    const db = supabase as unknown as UntypedSupabase;
    const result = await db
      .from("risk_assessments")
      .update({
        significant_risks_acknowledged_at: new Date().toISOString(),
        significant_risks_acknowledged_by: context.userId,
      })
      .eq("id", current.id)
      .eq("version", input.version)
      .select("id, version, assessment_status")
      .maybeSingle<Pick<RiskAssessmentRow, "id" | "version" | "assessment_status">>();

    if (result.error || !result.data) {
      throw new ValidationError(result.error?.message ?? "Failed to acknowledge significant risks");
    }

    const requestHeaders = await headers();
    await emitAuditEvent({
      action: AUDIT_ACTIONS.RISK_ASSESSMENT_SIGNIFICANT_ACKNOWLEDGED,
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
  },
);

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

  const { riskItems } = await loadSubmitData(current.id);
  assertSignificantRisksAcknowledged(
    current,
    riskItems.map((item) => ({ isSignificant: item.is_significant })),
  );

  const supabase = await createServerClient();
  const db = supabase as unknown as UntypedSupabase;
  const result = await db
    .from("risk_assessments")
    .update({
      assessment_status: "approved",
      approved_at: new Date().toISOString(),
      approved_by: context.userId,
    })
    .eq("id", current.id)
    .eq("version", input.version)
    .select("id, version, assessment_status")
    .maybeSingle<Pick<RiskAssessmentRow, "id" | "version" | "assessment_status">>();

  if (result.error || !result.data) {
    throw new ValidationError(result.error?.message ?? "Failed to approve risk assessment");
  }

  const repositoryContext = createRepositoryContext(
    context.userId,
    context.organizationId,
    context.workspaceId,
  );
  const planningRepository = new PlanningRepository(supabase, repositoryContext);
  const plan = await planningRepository.findByEngagementId(current.engagement_id);
  if (plan) {
    await planningRepository.update(plan.id, plan.version, { risk_status: "integrated" });
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
