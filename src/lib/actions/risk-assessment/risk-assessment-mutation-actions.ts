"use server";

import { headers } from "next/headers";
import { AUDIT_RESOURCE_TYPE, RISK_ASSESSMENT_PERMISSIONS } from "@/constants/risk-assessment";
import { AUDIT_ACTIONS, emitAuditEvent } from "@/lib/audit";
import { createRiskAssessmentAction as defineRiskAssessmentAction } from "@/lib/actions/risk-assessment/risk-assessment-action";
import { createServerClient } from "@/lib/supabase/server";
import type {
  AssertionType,
  RiskImpact,
  RiskLikelihood,
  RiskNoteType,
  RiskRatingLevel,
  RiskResponseType,
  RiskType,
} from "@/types/risk-assessment";
import { ValidationError } from "@/lib/errors";

type RiskAssessmentRecord = {
  id: string;
  engagement_id: string;
  workspace_id: string;
  assessment_status: string;
  version: number;
};

type RiskItemRecord = {
  id: string;
  version: number;
  risk_assessment_id: string;
};

type QueryResult<T> = Promise<{ data: T | null; error: { message: string } | null }>;

type UntypedQueryBuilder = {
  select: (columns: string) => UntypedQueryBuilder;
  eq: (column: string, value: unknown) => UntypedQueryBuilder;
  is: (column: string, value: null) => UntypedQueryBuilder;
  ilike: (column: string, value: string) => UntypedQueryBuilder;
  update: (values: Record<string, unknown>) => UntypedQueryBuilder;
  insert: (values: Record<string, unknown> | Record<string, unknown>[]) => UntypedQueryBuilder;
  maybeSingle: <T>() => QueryResult<T>;
  single: <T>() => QueryResult<T>;
};

type UntypedSupabase = {
  from: (table: string) => UntypedQueryBuilder;
};

async function loadAssessment(
  assessmentId: string,
  workspaceId: string,
  expectedVersion: number,
): Promise<RiskAssessmentRecord> {
  if (!assessmentId) throw new ValidationError("Risk assessment is required");
  if (!Number.isInteger(expectedVersion) || expectedVersion < 1) {
    throw new ValidationError("Risk assessment version is required");
  }

  const supabase = await createServerClient();
  const db = supabase as unknown as UntypedSupabase;
  const result = await db
    .from("risk_assessments")
    .select("id, engagement_id, workspace_id, assessment_status, version")
    .eq("id", assessmentId)
    .is("deleted_at", null)
    .maybeSingle<RiskAssessmentRecord>();

  if (result.error || !result.data) {
    throw new ValidationError("Risk assessment not found");
  }
  if (result.data.workspace_id !== workspaceId) {
    throw new ValidationError("Risk assessment does not belong to the active workspace");
  }
  if (result.data.version !== expectedVersion) {
    throw new ValidationError("Risk assessment was modified by another user");
  }

  if (["approved", "archived"].includes(result.data.assessment_status)) {
    throw new ValidationError("Approved or archived risk assessments are read-only.");
  }

  return result.data as RiskAssessmentRecord;
}

async function loadRiskItem(riskItemId: string, assessmentId: string): Promise<RiskItemRecord> {
  const supabase = await createServerClient();
  const db = supabase as unknown as UntypedSupabase;
  const result = await db
    .from("risk_register_items")
    .select("id, version, risk_assessment_id")
    .eq("id", riskItemId)
    .is("deleted_at", null)
    .maybeSingle<RiskItemRecord>();

  if (result.error || !result.data || result.data.risk_assessment_id !== assessmentId) {
    throw new ValidationError("Risk item not found");
  }

  return result.data as RiskItemRecord;
}

export const addRiskItemAction = defineRiskAssessmentAction<
  {
    assessmentId: string;
    version: number;
    categoryId?: string | null;
    riskType: RiskType;
    title: string;
    description?: string | null;
    auditArea?: string | null;
    accountName?: string | null;
    linkedAssertion?: AssertionType | null;
    likelihood?: RiskLikelihood | null;
    impact?: RiskImpact | null;
    inherentRating?: RiskRatingLevel | null;
    controlRating?: RiskRatingLevel | null;
    detectionRating?: RiskRatingLevel | null;
    residualRating?: RiskRatingLevel | null;
    isSignificant?: boolean;
    rationale?: string | null;
    ownerId?: string | null;
  },
  { riskItemId: string; version: number }
>({ module: "risk_assessment.risk_item.add" }, RISK_ASSESSMENT_PERMISSIONS.UPDATE, async (input, context) => {
  if (!input.title?.trim()) throw new ValidationError("Risk item title is required");

  const assessment = await loadAssessment(input.assessmentId, context.workspaceId, input.version);
  const supabase = await createServerClient();
  const db = supabase as unknown as UntypedSupabase;
  const insertResult = await db
    .from("risk_register_items")
    .insert({
      risk_assessment_id: assessment.id,
      risk_category_id: input.categoryId ?? null,
      engagement_id: assessment.engagement_id,
      organization_id: context.organizationId,
      workspace_id: context.workspaceId,
      risk_type: input.riskType,
      title: input.title.trim(),
      description: input.description ?? null,
      audit_area: input.auditArea ?? null,
      account_name: input.accountName ?? null,
      linked_assertion: input.linkedAssertion ?? null,
      likelihood: input.likelihood ?? null,
      impact: input.impact ?? null,
      inherent_rating: input.inherentRating ?? null,
      control_rating: input.controlRating ?? null,
      detection_rating: input.detectionRating ?? null,
      residual_rating: input.residualRating ?? null,
      is_significant: Boolean(input.isSignificant),
      rationale: input.rationale ?? null,
      owner_id: input.ownerId ?? null,
    })
    .select("id, version")
    .single<{ id: string; version: number }>();

  if (insertResult.error || !insertResult.data) {
    throw new ValidationError(insertResult.error?.message ?? "Failed to add risk item");
  }

  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.RISK_ASSESSMENT_RISK_ITEM_ADDED,
    resourceType: AUDIT_RESOURCE_TYPE,
    resourceId: assessment.id,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    userId: context.userId,
    userAgent: requestHeaders.get("user-agent"),
    metadata: { riskItemId: insertResult.data.id },
  });

  return { riskItemId: insertResult.data.id, version: insertResult.data.version };
});

export const updateRiskItemAction = defineRiskAssessmentAction<
  {
    assessmentId: string;
    version: number;
    riskItemId: string;
    riskItemVersion: number;
    categoryId?: string | null;
    riskType?: RiskType;
    title?: string;
    description?: string | null;
    auditArea?: string | null;
    accountName?: string | null;
    linkedAssertion?: AssertionType | null;
    likelihood?: RiskLikelihood | null;
    impact?: RiskImpact | null;
    inherentRating?: RiskRatingLevel | null;
    controlRating?: RiskRatingLevel | null;
    detectionRating?: RiskRatingLevel | null;
    residualRating?: RiskRatingLevel | null;
    isSignificant?: boolean;
    rationale?: string | null;
    ownerId?: string | null;
  },
  { riskItemId: string; version: number }
>({ module: "risk_assessment.risk_item.update" }, RISK_ASSESSMENT_PERMISSIONS.UPDATE, async (input, context) => {
  if (!input.riskItemId) throw new ValidationError("Risk item is required");
  if (!Number.isInteger(input.riskItemVersion) || input.riskItemVersion < 1) {
    throw new ValidationError("Risk item version is required");
  }
  if (input.title !== undefined && !input.title.trim()) {
    throw new ValidationError("Risk item title cannot be empty");
  }

  const assessment = await loadAssessment(input.assessmentId, context.workspaceId, input.version);
  await loadRiskItem(input.riskItemId, assessment.id);

  const supabase = await createServerClient();
  const db = supabase as unknown as UntypedSupabase;
  const updateResult = await db
    .from("risk_register_items")
    .update({
      risk_category_id: input.categoryId,
      risk_type: input.riskType,
      title: input.title?.trim(),
      description: input.description,
      audit_area: input.auditArea,
      account_name: input.accountName,
      linked_assertion: input.linkedAssertion,
      likelihood: input.likelihood,
      impact: input.impact,
      inherent_rating: input.inherentRating,
      control_rating: input.controlRating,
      detection_rating: input.detectionRating,
      residual_rating: input.residualRating,
      is_significant: input.isSignificant,
      rationale: input.rationale,
      owner_id: input.ownerId,
    })
    .eq("id", input.riskItemId)
    .eq("version", input.riskItemVersion)
    .select("id, version")
    .maybeSingle<{ id: string; version: number }>();

  if (updateResult.error || !updateResult.data) {
    throw new ValidationError(updateResult.error?.message ?? "Failed to update risk item");
  }

  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.RISK_ASSESSMENT_RISK_ITEM_UPDATED,
    resourceType: AUDIT_RESOURCE_TYPE,
    resourceId: assessment.id,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    userId: context.userId,
    userAgent: requestHeaders.get("user-agent"),
    metadata: { riskItemId: updateResult.data.id },
  });

  return { riskItemId: updateResult.data.id, version: updateResult.data.version };
});

export const addCategoryAction = defineRiskAssessmentAction<
  {
    assessmentId: string;
    version: number;
    name: string;
    description?: string | null;
    sortOrder?: number;
  },
  { categoryId: string; version: number }
>({ module: "risk_assessment.category.add" }, RISK_ASSESSMENT_PERMISSIONS.UPDATE, async (input, context) => {
  if (!input.name?.trim()) throw new ValidationError("Category name is required");

  const assessment = await loadAssessment(input.assessmentId, context.workspaceId, input.version);
  const supabase = await createServerClient();
  const db = supabase as unknown as UntypedSupabase;
  const insertResult = await db
    .from("risk_categories")
    .insert({
      risk_assessment_id: assessment.id,
      engagement_id: assessment.engagement_id,
      organization_id: context.organizationId,
      workspace_id: context.workspaceId,
      name: input.name.trim(),
      description: input.description ?? null,
      sort_order: input.sortOrder ?? 0,
    })
    .select("id, version")
    .single<{ id: string; version: number }>();

  if (insertResult.error || !insertResult.data) {
    throw new ValidationError(insertResult.error?.message ?? "Failed to add category");
  }

  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.RISK_ASSESSMENT_CATEGORY_ADDED,
    resourceType: AUDIT_RESOURCE_TYPE,
    resourceId: assessment.id,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    userId: context.userId,
    userAgent: requestHeaders.get("user-agent"),
    metadata: { categoryId: insertResult.data.id },
  });

  return { categoryId: insertResult.data.id, version: insertResult.data.version };
});

export const upsertAssertionRatingAction = defineRiskAssessmentAction<
  {
    assessmentId: string;
    version: number;
    accountName: string;
    assertion: AssertionType;
    inherentRating?: RiskRatingLevel | null;
    controlRating?: RiskRatingLevel | null;
    compositeRating?: RiskRatingLevel | null;
    isSignificant?: boolean;
    rationale?: string | null;
    ratingId?: string;
    ratingVersion?: number;
  },
  { ratingId: string; version: number }
>(
  { module: "risk_assessment.assertion_rating.upsert" },
  RISK_ASSESSMENT_PERMISSIONS.UPDATE,
  async (input, context) => {
    if (!input.accountName?.trim()) {
      throw new ValidationError("Account name is required");
    }

    const assessment = await loadAssessment(input.assessmentId, context.workspaceId, input.version);
    const supabase = await createServerClient();
    const db = supabase as unknown as UntypedSupabase;

    const existingResult = await db
      .from("risk_assertion_ratings")
      .select("id, version")
      .eq("risk_assessment_id", assessment.id)
      .ilike("account_name", input.accountName.trim())
      .eq("assertion", input.assertion)
      .is("deleted_at", null)
      .maybeSingle<{ id: string; version: number }>();

    if (existingResult.error) {
      throw new ValidationError(existingResult.error.message);
    }

    if (existingResult.data) {
      const updateResult = await db
        .from("risk_assertion_ratings")
        .update({
          inherent_rating: input.inherentRating ?? null,
          control_rating: input.controlRating ?? null,
          composite_rating: input.compositeRating ?? null,
          is_significant: Boolean(input.isSignificant),
          rationale: input.rationale ?? null,
        })
        .eq("id", existingResult.data.id)
        .eq("version", input.ratingVersion ?? existingResult.data.version)
        .select("id, version")
        .maybeSingle<{ id: string; version: number }>();

      if (updateResult.error || !updateResult.data) {
        throw new ValidationError(updateResult.error?.message ?? "Failed to update assertion rating");
      }

      const requestHeaders = await headers();
      await emitAuditEvent({
        action: AUDIT_ACTIONS.RISK_ASSESSMENT_ASSERTION_RATING_UPDATED,
        resourceType: AUDIT_RESOURCE_TYPE,
        resourceId: assessment.id,
        organizationId: context.organizationId,
        workspaceId: context.workspaceId,
        userId: context.userId,
        userAgent: requestHeaders.get("user-agent"),
        metadata: { ratingId: updateResult.data.id, upsert: "update" },
      });

      return { ratingId: updateResult.data.id, version: updateResult.data.version };
    }

    const insertResult = await db
      .from("risk_assertion_ratings")
      .insert({
        risk_assessment_id: assessment.id,
        engagement_id: assessment.engagement_id,
        organization_id: context.organizationId,
        workspace_id: context.workspaceId,
        account_name: input.accountName.trim(),
        assertion: input.assertion,
        inherent_rating: input.inherentRating ?? null,
        control_rating: input.controlRating ?? null,
        composite_rating: input.compositeRating ?? null,
        is_significant: Boolean(input.isSignificant),
        rationale: input.rationale ?? null,
      })
      .select("id, version")
      .single<{ id: string; version: number }>();

    if (insertResult.error || !insertResult.data) {
      throw new ValidationError(insertResult.error?.message ?? "Failed to add assertion rating");
    }

    const requestHeaders = await headers();
    await emitAuditEvent({
      action: AUDIT_ACTIONS.RISK_ASSESSMENT_ASSERTION_RATING_UPDATED,
      resourceType: AUDIT_RESOURCE_TYPE,
      resourceId: assessment.id,
      organizationId: context.organizationId,
      workspaceId: context.workspaceId,
      userId: context.userId,
      userAgent: requestHeaders.get("user-agent"),
      metadata: { ratingId: insertResult.data.id, upsert: "insert" },
    });

    return { ratingId: insertResult.data.id, version: insertResult.data.version };
  },
);

export const addResponseAction = defineRiskAssessmentAction<
  {
    assessmentId: string;
    version: number;
    riskItemId: string;
    responseType: RiskResponseType;
    description: string;
  },
  { responseId: string; version: number }
>({ module: "risk_assessment.response.add" }, RISK_ASSESSMENT_PERMISSIONS.UPDATE, async (input, context) => {
  if (!input.description?.trim()) throw new ValidationError("Response description is required");

  const assessment = await loadAssessment(input.assessmentId, context.workspaceId, input.version);
  await loadRiskItem(input.riskItemId, assessment.id);

  const supabase = await createServerClient();
  const db = supabase as unknown as UntypedSupabase;
  const insertResult = await db
    .from("risk_responses")
    .insert({
      risk_assessment_id: assessment.id,
      risk_register_item_id: input.riskItemId,
      engagement_id: assessment.engagement_id,
      organization_id: context.organizationId,
      workspace_id: context.workspaceId,
      response_type: input.responseType,
      description: input.description.trim(),
    })
    .select("id, version")
    .single<{ id: string; version: number }>();

  if (insertResult.error || !insertResult.data) {
    throw new ValidationError(insertResult.error?.message ?? "Failed to add risk response");
  }

  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.RISK_ASSESSMENT_RESPONSE_ADDED,
    resourceType: AUDIT_RESOURCE_TYPE,
    resourceId: assessment.id,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    userId: context.userId,
    userAgent: requestHeaders.get("user-agent"),
    metadata: { responseId: insertResult.data.id, riskItemId: input.riskItemId },
  });

  return { responseId: insertResult.data.id, version: insertResult.data.version };
});

export const addProcedureLinkAction = defineRiskAssessmentAction<
  {
    assessmentId: string;
    version: number;
    riskItemId: string;
    auditProcedureId?: string | null;
    procedureReference?: string | null;
  },
  { linkId: string; version: number }
>(
  { module: "risk_assessment.procedure_link.add" },
  RISK_ASSESSMENT_PERMISSIONS.UPDATE,
  async (input, context) => {
    const assessment = await loadAssessment(input.assessmentId, context.workspaceId, input.version);
    await loadRiskItem(input.riskItemId, assessment.id);

    const supabase = await createServerClient();
    const db = supabase as unknown as UntypedSupabase;
    const insertResult = await db
      .from("risk_procedure_links")
      .insert({
        risk_assessment_id: assessment.id,
        risk_register_item_id: input.riskItemId,
        audit_procedure_id: input.auditProcedureId ?? null,
        engagement_id: assessment.engagement_id,
        organization_id: context.organizationId,
        workspace_id: context.workspaceId,
        procedure_reference: input.procedureReference?.trim() || null,
      })
      .select("id, version")
      .single<{ id: string; version: number }>();

    if (insertResult.error || !insertResult.data) {
      throw new ValidationError(insertResult.error?.message ?? "Failed to add procedure link");
    }

    const requestHeaders = await headers();
    await emitAuditEvent({
      action: AUDIT_ACTIONS.RISK_ASSESSMENT_PROCEDURE_LINKED,
      resourceType: AUDIT_RESOURCE_TYPE,
      resourceId: assessment.id,
      organizationId: context.organizationId,
      workspaceId: context.workspaceId,
      userId: context.userId,
      userAgent: requestHeaders.get("user-agent"),
      metadata: { linkId: insertResult.data.id, riskItemId: input.riskItemId },
    });

    return { linkId: insertResult.data.id, version: insertResult.data.version };
  },
);

export const addNoteAction = defineRiskAssessmentAction<
  {
    assessmentId: string;
    version: number;
    body: string;
    noteType?: RiskNoteType;
    riskItemId?: string | null;
  },
  { noteId: string; version: number }
>({ module: "risk_assessment.note.add" }, RISK_ASSESSMENT_PERMISSIONS.COMMENT, async (input, context) => {
  if (!input.body?.trim()) throw new ValidationError("Note is required");

  const assessment = await loadAssessment(input.assessmentId, context.workspaceId, input.version);
  if (input.riskItemId) {
    await loadRiskItem(input.riskItemId, assessment.id);
  }

  const supabase = await createServerClient();
  const db = supabase as unknown as UntypedSupabase;
  const insertResult = await db
    .from("risk_notes")
    .insert({
      risk_assessment_id: assessment.id,
      engagement_id: assessment.engagement_id,
      organization_id: context.organizationId,
      workspace_id: context.workspaceId,
      note_type: input.noteType ?? "review",
      body: input.body.trim(),
      risk_register_item_id: input.riskItemId ?? null,
    })
    .select("id, version")
    .single<{ id: string; version: number }>();

  if (insertResult.error || !insertResult.data) {
    throw new ValidationError(insertResult.error?.message ?? "Failed to add note");
  }

  const requestHeaders = await headers();
  await emitAuditEvent({
    action: AUDIT_ACTIONS.RISK_ASSESSMENT_NOTE_ADDED,
    resourceType: AUDIT_RESOURCE_TYPE,
    resourceId: assessment.id,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId,
    userId: context.userId,
    userAgent: requestHeaders.get("user-agent"),
    metadata: { noteId: insertResult.data.id, riskItemId: input.riskItemId ?? null },
  });

  return { noteId: insertResult.data.id, version: insertResult.data.version };
});
