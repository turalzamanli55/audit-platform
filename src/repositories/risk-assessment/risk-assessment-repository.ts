import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables, TablesInsert, TablesUpdate } from "@/types/supabase";
import type { RepositoryContext } from "@/types/context";
import { AuthenticatedRepository } from "../base/base-repository";
import {
  applyActiveFilter,
  assertVersionMatch,
  requireRow,
} from "../base/repository-helpers";
import { AuthorizationError, NotFoundError, ValidationError } from "@/lib/errors";
import {
  unwrapSupabaseList,
  unwrapSupabaseMaybeSingle,
  unwrapSupabaseResult,
} from "@/utils/supabase-result";
import {
  ASSERTION_TYPES,
  DEFAULT_MATRIX_ACCOUNTS,
  DEFAULT_RISK_CATEGORIES,
  DEFAULT_SEED_RISKS,
  LOCKED_RISK_ASSESSMENT_STATUSES,
  RISK_ACTIVITY_ACTIONS,
} from "@/constants/risk-assessment";

export type RiskAssessment = Tables<"risk_assessments">;
export type RiskCategory = Tables<"risk_categories">;
export type RiskRegisterItem = Tables<"risk_register_items">;
export type RiskAssertionRating = Tables<"risk_assertion_ratings">;
export type RiskResponse = Tables<"risk_responses">;
export type RiskProcedureLink = Tables<"risk_procedure_links">;
export type RiskNote = Tables<"risk_notes">;
export type RiskActivity = Tables<"risk_activity">;

export type CreateRiskAssessmentInput = Pick<
  TablesInsert<"risk_assessments">,
  "organization_id" | "workspace_id" | "engagement_id" | "audit_plan_id"
>;

export type UpdateRiskAssessmentInput = Partial<
  Pick<
    TablesUpdate<"risk_assessments">,
    | "assessment_status"
    | "assessment_version"
    | "progress_pct"
    | "return_notes"
    | "submitted_at"
    | "submitted_by"
    | "returned_at"
    | "returned_by"
    | "approved_at"
    | "approved_by"
    | "status"
  >
>;

export type AddRiskCategoryInput = {
  riskAssessmentId: string;
  name: string;
  description?: string | null;
  sortOrder?: number;
};

export type AddRiskRegisterItemInput = {
  riskAssessmentId: string;
  riskCategoryId?: string | null;
  riskType: TablesInsert<"risk_register_items">["risk_type"];
  title: string;
  description?: string | null;
  auditArea?: string | null;
  accountName?: string | null;
  linkedAssertion?: TablesInsert<"risk_register_items">["linked_assertion"];
  likelihood?: TablesInsert<"risk_register_items">["likelihood"];
  impact?: TablesInsert<"risk_register_items">["impact"];
  inherentRating?: TablesInsert<"risk_register_items">["inherent_rating"];
  controlRating?: TablesInsert<"risk_register_items">["control_rating"];
  detectionRating?: TablesInsert<"risk_register_items">["detection_rating"];
  residualRating?: TablesInsert<"risk_register_items">["residual_rating"];
  isSignificant?: boolean;
  ownerId?: string | null;
  rationale?: string | null;
  sortOrder?: number;
};

export type UpdateRiskRegisterItemInput = Partial<
  Pick<
    TablesUpdate<"risk_register_items">,
    | "risk_category_id"
    | "risk_type"
    | "title"
    | "description"
    | "audit_area"
    | "account_name"
    | "linked_assertion"
    | "likelihood"
    | "impact"
    | "inherent_rating"
    | "control_rating"
    | "detection_rating"
    | "residual_rating"
    | "is_significant"
    | "owner_id"
    | "rationale"
    | "sort_order"
  >
>;

export type UpsertAssertionRatingInput = {
  riskAssessmentId: string;
  accountName: string;
  assertion: TablesInsert<"risk_assertion_ratings">["assertion"];
  expectedVersion?: number;
  inherentRating?: TablesInsert<"risk_assertion_ratings">["inherent_rating"];
  controlRating?: TablesInsert<"risk_assertion_ratings">["control_rating"];
  compositeRating?: TablesInsert<"risk_assertion_ratings">["composite_rating"];
  isSignificant?: boolean;
  rationale?: string | null;
};

export type AddRiskResponseInput = {
  riskAssessmentId: string;
  riskRegisterItemId: string;
  responseType: TablesInsert<"risk_responses">["response_type"];
  description: string;
};

export type AddRiskProcedureLinkInput = {
  riskAssessmentId: string;
  riskRegisterItemId: string;
  auditProcedureId?: string | null;
  procedureReference?: string | null;
};

export type AddRiskNoteInput = {
  riskAssessmentId: string;
  noteType?: TablesInsert<"risk_notes">["note_type"];
  body: string;
  riskRegisterItemId?: string | null;
};

export type LogRiskActivityInput = {
  riskAssessmentId: string;
  engagementId: string;
  organizationId: string;
  workspaceId: string;
  action: string;
  summary?: string | null;
  metadata?: Record<string, unknown>;
};

export class RiskAssessmentRepository extends AuthenticatedRepository {
  constructor(client: SupabaseClient<Database>, context: RepositoryContext) {
    super(client, context);
  }

  async findById(id: string): Promise<RiskAssessment | null> {
    const result = await applyActiveFilter(
      this.client.from("risk_assessments").select("*").eq("id", id),
    ).maybeSingle();
    return unwrapSupabaseMaybeSingle(result);
  }

  async findByIdAnyState(id: string): Promise<RiskAssessment | null> {
    const result = await this.client
      .from("risk_assessments")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    return unwrapSupabaseMaybeSingle(result);
  }

  async findByEngagementId(engagementId: string): Promise<RiskAssessment | null> {
    const result = await applyActiveFilter(
      this.client.from("risk_assessments").select("*").eq("engagement_id", engagementId),
    ).maybeSingle();
    return unwrapSupabaseMaybeSingle(result);
  }

  async findByEngagementIdAnyState(engagementId: string): Promise<RiskAssessment | null> {
    const result = await this.client
      .from("risk_assessments")
      .select("*")
      .eq("engagement_id", engagementId)
      .maybeSingle();
    return unwrapSupabaseMaybeSingle(result);
  }

  async createAssessment(input: CreateRiskAssessmentInput): Promise<RiskAssessment> {
    const existing = await this.findByEngagementId(input.engagement_id);
    if (existing) {
      throw new ValidationError("Risk assessment already exists for this engagement");
    }

    const result = await this.client
      .from("risk_assessments")
      .insert({
        ...input,
        assessment_status: "in_progress",
      })
      .select("*")
      .single();

    const assessment = requireRow(unwrapSupabaseResult(result), "RiskAssessment");
    const categoryMap = await this.seedDefaultCategories(assessment);
    await this.seedDefaultAssertionMatrix(assessment);
    await this.seedDefaultRiskRegister(assessment, categoryMap);

    await this.logActivity({
      riskAssessmentId: assessment.id,
      engagementId: assessment.engagement_id,
      organizationId: assessment.organization_id,
      workspaceId: assessment.workspace_id,
      action: RISK_ACTIVITY_ACTIONS.CREATED,
      summary: "Risk assessment initiated from approved audit plan",
      metadata: { assessmentVersion: assessment.assessment_version },
    });

    await this.recomputeProgress(assessment.id);
    return assessment;
  }

  async updateAssessment(
    id: string,
    expectedVersion: number,
    input: UpdateRiskAssessmentInput,
  ): Promise<RiskAssessment> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new NotFoundError("Risk assessment not found", { id });
    }

    this.ensureAssessmentIsEditable(existing);
    assertVersionMatch(existing.version, expectedVersion, "RiskAssessment");

    const result = await applyActiveFilter(
      this.client
        .from("risk_assessments")
        .update(input)
        .eq("id", id)
        .eq("version", expectedVersion)
        .select("*"),
    ).maybeSingle();

    const assessment = requireRow(unwrapSupabaseMaybeSingle(result), "RiskAssessment", id);

    await this.logActivity({
      riskAssessmentId: assessment.id,
      engagementId: assessment.engagement_id,
      organizationId: assessment.organization_id,
      workspaceId: assessment.workspace_id,
      action: RISK_ACTIVITY_ACTIONS.UPDATED,
      summary: "Risk assessment updated",
      metadata: { version: assessment.version },
    });

    return assessment;
  }

  async archive(id: string, expectedVersion: number): Promise<RiskAssessment> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new NotFoundError("Risk assessment not found", { id });
    }
    assertVersionMatch(existing.version, expectedVersion, "RiskAssessment");

    const result = await applyActiveFilter(
      this.client
        .from("risk_assessments")
        .update({
          deleted_at: new Date().toISOString(),
          deleted_by: this.userId,
          status: "archived",
          assessment_status: "archived",
        })
        .eq("id", id)
        .eq("version", expectedVersion)
        .select("*"),
    ).maybeSingle();

    const assessment = requireRow(unwrapSupabaseMaybeSingle(result), "RiskAssessment", id);

    await this.logActivity({
      riskAssessmentId: assessment.id,
      engagementId: assessment.engagement_id,
      organizationId: assessment.organization_id,
      workspaceId: assessment.workspace_id,
      action: RISK_ACTIVITY_ACTIONS.ARCHIVED,
      summary: "Risk assessment archived",
      metadata: { version: assessment.version },
    });

    return assessment;
  }

  async restore(id: string, expectedVersion: number): Promise<RiskAssessment> {
    const existing = await this.findByIdAnyState(id);
    if (!existing) {
      throw new NotFoundError("Risk assessment not found", { id });
    }
    if (!existing.deleted_at && existing.status !== "archived") {
      throw new ValidationError("Risk assessment is not archived");
    }

    assertVersionMatch(existing.version, expectedVersion, "RiskAssessment");

    const result = await this.client
      .from("risk_assessments")
      .update({
        deleted_at: null,
        deleted_by: null,
        status: "active",
        assessment_status: "in_progress",
      })
      .eq("id", id)
      .eq("version", expectedVersion)
      .select("*")
      .maybeSingle();

    const assessment = requireRow(unwrapSupabaseMaybeSingle(result), "RiskAssessment", id);

    await this.logActivity({
      riskAssessmentId: assessment.id,
      engagementId: assessment.engagement_id,
      organizationId: assessment.organization_id,
      workspaceId: assessment.workspace_id,
      action: RISK_ACTIVITY_ACTIONS.RESTORED,
      summary: "Risk assessment restored",
      metadata: { version: assessment.version },
    });

    return assessment;
  }

  async submitForReview(id: string, expectedVersion: number): Promise<RiskAssessment> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new NotFoundError("Risk assessment not found", { id });
    }
    this.ensureAssessmentIsEditable(existing);
    assertVersionMatch(existing.version, expectedVersion, "RiskAssessment");

    const result = await applyActiveFilter(
      this.client
        .from("risk_assessments")
        .update({
          assessment_status: "submitted",
          submitted_at: new Date().toISOString(),
          submitted_by: this.userId,
          returned_at: null,
          returned_by: null,
          return_notes: null,
        })
        .eq("id", id)
        .eq("version", expectedVersion)
        .select("*"),
    ).maybeSingle();

    const assessment = requireRow(unwrapSupabaseMaybeSingle(result), "RiskAssessment", id);

    await this.logActivity({
      riskAssessmentId: assessment.id,
      engagementId: assessment.engagement_id,
      organizationId: assessment.organization_id,
      workspaceId: assessment.workspace_id,
      action: RISK_ACTIVITY_ACTIONS.SUBMITTED,
      summary: "Risk assessment submitted for review",
      metadata: { assessmentVersion: assessment.assessment_version, version: assessment.version },
    });

    return assessment;
  }

  async returnForRevision(
    id: string,
    expectedVersion: number,
    returnNotes: string | null,
  ): Promise<RiskAssessment> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new NotFoundError("Risk assessment not found", { id });
    }
    assertVersionMatch(existing.version, expectedVersion, "RiskAssessment");

    const result = await applyActiveFilter(
      this.client
        .from("risk_assessments")
        .update({
          assessment_status: "in_progress",
          returned_at: new Date().toISOString(),
          returned_by: this.userId,
          return_notes: returnNotes,
        })
        .eq("id", id)
        .eq("version", expectedVersion)
        .select("*"),
    ).maybeSingle();

    const assessment = requireRow(unwrapSupabaseMaybeSingle(result), "RiskAssessment", id);

    await this.logActivity({
      riskAssessmentId: assessment.id,
      engagementId: assessment.engagement_id,
      organizationId: assessment.organization_id,
      workspaceId: assessment.workspace_id,
      action: RISK_ACTIVITY_ACTIONS.RETURNED,
      summary: returnNotes ?? "Risk assessment returned for revision",
      metadata: { assessmentVersion: assessment.assessment_version, version: assessment.version },
    });

    return assessment;
  }

  async approve(id: string, expectedVersion: number): Promise<RiskAssessment> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new NotFoundError("Risk assessment not found", { id });
    }
    assertVersionMatch(existing.version, expectedVersion, "RiskAssessment");

    const now = new Date().toISOString();
    const result = await applyActiveFilter(
      this.client
        .from("risk_assessments")
        .update({
          assessment_status: "approved",
          approved_at: now,
          approved_by: this.userId,
          significant_risks_acknowledged_at: now,
          significant_risks_acknowledged_by: this.userId,
        })
        .eq("id", id)
        .eq("version", expectedVersion)
        .select("*"),
    ).maybeSingle();

    const assessment = requireRow(unwrapSupabaseMaybeSingle(result), "RiskAssessment", id);

    await this.logActivity({
      riskAssessmentId: assessment.id,
      engagementId: assessment.engagement_id,
      organizationId: assessment.organization_id,
      workspaceId: assessment.workspace_id,
      action: RISK_ACTIVITY_ACTIONS.SIGNIFICANT_ACKNOWLEDGED,
      summary: "Significant risks acknowledged on approval",
      metadata: { acknowledgedBy: this.userId, assessmentVersion: assessment.assessment_version },
    });

    await this.logActivity({
      riskAssessmentId: assessment.id,
      engagementId: assessment.engagement_id,
      organizationId: assessment.organization_id,
      workspaceId: assessment.workspace_id,
      action: RISK_ACTIVITY_ACTIONS.APPROVED,
      summary: "Risk assessment approved",
      metadata: { approvedBy: this.userId, assessmentVersion: assessment.assessment_version },
    });

    return assessment;
  }

  async listActivity(riskAssessmentId: string, limit = 100): Promise<RiskActivity[]> {
    const result = await applyActiveFilter(
      this.client
        .from("risk_activity")
        .select("*")
        .eq("risk_assessment_id", riskAssessmentId)
        .order("created_at", { ascending: false })
        .limit(limit),
    );
    return unwrapSupabaseList(result);
  }

  async logActivity(input: LogRiskActivityInput): Promise<RiskActivity> {
    const result = await this.client
      .from("risk_activity")
      .insert({
        risk_assessment_id: input.riskAssessmentId,
        engagement_id: input.engagementId,
        organization_id: input.organizationId,
        workspace_id: input.workspaceId,
        created_by: this.userId,
        action: input.action,
        summary: input.summary ?? null,
        metadata: (input.metadata ?? {}) as Database["public"]["Tables"]["risk_activity"]["Insert"]["metadata"],
      })
      .select("*")
      .single();

    return requireRow(unwrapSupabaseResult(result), "RiskActivity");
  }

  async listCategories(riskAssessmentId: string): Promise<RiskCategory[]> {
    const result = await applyActiveFilter(
      this.client
        .from("risk_categories")
        .select("*")
        .eq("risk_assessment_id", riskAssessmentId)
        .order("sort_order", { ascending: true }),
    );
    return unwrapSupabaseList(result);
  }

  async listRegisterItems(riskAssessmentId: string): Promise<RiskRegisterItem[]> {
    const result = await applyActiveFilter(
      this.client
        .from("risk_register_items")
        .select("*")
        .eq("risk_assessment_id", riskAssessmentId)
        .order("sort_order", { ascending: true }),
    );
    return unwrapSupabaseList(result);
  }

  async listAssertionRatings(riskAssessmentId: string): Promise<RiskAssertionRating[]> {
    const result = await applyActiveFilter(
      this.client
        .from("risk_assertion_ratings")
        .select("*")
        .eq("risk_assessment_id", riskAssessmentId)
        .order("account_name", { ascending: true })
        .order("assertion", { ascending: true }),
    );
    return unwrapSupabaseList(result);
  }

  async listResponses(riskAssessmentId: string): Promise<RiskResponse[]> {
    const result = await applyActiveFilter(
      this.client
        .from("risk_responses")
        .select("*")
        .eq("risk_assessment_id", riskAssessmentId)
        .order("created_at", { ascending: false }),
    );
    return unwrapSupabaseList(result);
  }

  async listProcedureLinks(riskAssessmentId: string): Promise<RiskProcedureLink[]> {
    const result = await applyActiveFilter(
      this.client
        .from("risk_procedure_links")
        .select("*")
        .eq("risk_assessment_id", riskAssessmentId)
        .order("created_at", { ascending: false }),
    );
    return unwrapSupabaseList(result);
  }

  async listNotes(riskAssessmentId: string): Promise<RiskNote[]> {
    const result = await applyActiveFilter(
      this.client
        .from("risk_notes")
        .select("*")
        .eq("risk_assessment_id", riskAssessmentId)
        .order("created_at", { ascending: false }),
    );
    return unwrapSupabaseList(result);
  }

  async addCategory(input: AddRiskCategoryInput): Promise<RiskCategory> {
    const assessment = await this.requireAssessmentForMutation(input.riskAssessmentId);
    const result = await this.client
      .from("risk_categories")
      .insert({
        risk_assessment_id: assessment.id,
        engagement_id: assessment.engagement_id,
        organization_id: assessment.organization_id,
        workspace_id: assessment.workspace_id,
        name: input.name.trim(),
        description: input.description ?? null,
        sort_order: input.sortOrder ?? 0,
      })
      .select("*")
      .single();

    const category = requireRow(unwrapSupabaseResult(result), "RiskCategory");

    await this.logActivity({
      riskAssessmentId: assessment.id,
      engagementId: assessment.engagement_id,
      organizationId: assessment.organization_id,
      workspaceId: assessment.workspace_id,
      action: RISK_ACTIVITY_ACTIONS.CATEGORY_ADDED,
      summary: `Category "${category.name}" added`,
      metadata: { categoryId: category.id },
    });

    return category;
  }

  async addRegisterItem(input: AddRiskRegisterItemInput): Promise<RiskRegisterItem> {
    const assessment = await this.requireAssessmentForMutation(input.riskAssessmentId);

    const result = await this.client
      .from("risk_register_items")
      .insert({
        risk_assessment_id: assessment.id,
        risk_category_id: input.riskCategoryId ?? null,
        engagement_id: assessment.engagement_id,
        organization_id: assessment.organization_id,
        workspace_id: assessment.workspace_id,
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
        is_significant: input.isSignificant ?? false,
        owner_id: input.ownerId ?? null,
        rationale: input.rationale ?? null,
        sort_order: input.sortOrder ?? 0,
      })
      .select("*")
      .single();

    const item = requireRow(unwrapSupabaseResult(result), "RiskRegisterItem");

    await this.logActivity({
      riskAssessmentId: assessment.id,
      engagementId: assessment.engagement_id,
      organizationId: assessment.organization_id,
      workspaceId: assessment.workspace_id,
      action: RISK_ACTIVITY_ACTIONS.RISK_ITEM_ADDED,
      summary: `Risk item "${item.title}" added`,
      metadata: { riskRegisterItemId: item.id },
    });

    await this.recomputeProgress(assessment.id);
    return item;
  }

  async updateRegisterItem(
    id: string,
    expectedVersion: number,
    input: UpdateRiskRegisterItemInput,
  ): Promise<RiskRegisterItem> {
    const existing = await applyActiveFilter(
      this.client.from("risk_register_items").select("*").eq("id", id),
    ).maybeSingle();
    const item = requireRow(unwrapSupabaseMaybeSingle(existing), "RiskRegisterItem", id);

    const assessment = await this.requireAssessmentForMutation(item.risk_assessment_id);
    assertVersionMatch(item.version, expectedVersion, "RiskRegisterItem");

    const result = await applyActiveFilter(
      this.client
        .from("risk_register_items")
        .update(input)
        .eq("id", id)
        .eq("version", expectedVersion)
        .select("*"),
    ).maybeSingle();

    const updated = requireRow(unwrapSupabaseMaybeSingle(result), "RiskRegisterItem", id);

    await this.logActivity({
      riskAssessmentId: assessment.id,
      engagementId: assessment.engagement_id,
      organizationId: assessment.organization_id,
      workspaceId: assessment.workspace_id,
      action: RISK_ACTIVITY_ACTIONS.RISK_ITEM_UPDATED,
      summary: `Risk item "${updated.title}" updated`,
      metadata: { riskRegisterItemId: id, version: updated.version },
    });

    await this.recomputeProgress(assessment.id);
    return updated;
  }

  async upsertAssertionRating(input: UpsertAssertionRatingInput): Promise<RiskAssertionRating> {
    const assessment = await this.requireAssessmentForMutation(input.riskAssessmentId);
    const accountName = input.accountName.trim();

    const existingResult = await applyActiveFilter(
      this.client
        .from("risk_assertion_ratings")
        .select("*")
        .eq("risk_assessment_id", input.riskAssessmentId)
        .eq("account_name", accountName)
        .eq("assertion", input.assertion),
    ).maybeSingle();

    const existing = unwrapSupabaseMaybeSingle(existingResult);
    let rating: RiskAssertionRating;

    if (existing) {
      if (typeof input.expectedVersion === "number") {
        assertVersionMatch(existing.version, input.expectedVersion, "RiskAssertionRating");
      }

      const updateResult = await applyActiveFilter(
        this.client
          .from("risk_assertion_ratings")
          .update({
            inherent_rating: input.inherentRating ?? existing.inherent_rating,
            control_rating: input.controlRating ?? existing.control_rating,
            composite_rating: input.compositeRating ?? existing.composite_rating,
            is_significant: input.isSignificant ?? existing.is_significant,
            rationale: input.rationale ?? existing.rationale,
          })
          .eq("id", existing.id)
          .eq("version", existing.version)
          .select("*"),
      ).maybeSingle();

      rating = requireRow(
        unwrapSupabaseMaybeSingle(updateResult),
        "RiskAssertionRating",
        existing.id,
      );
    } else {
      const insertResult = await this.client
        .from("risk_assertion_ratings")
        .insert({
          risk_assessment_id: assessment.id,
          engagement_id: assessment.engagement_id,
          organization_id: assessment.organization_id,
          workspace_id: assessment.workspace_id,
          account_name: accountName,
          assertion: input.assertion,
          inherent_rating: input.inherentRating ?? null,
          control_rating: input.controlRating ?? null,
          composite_rating: input.compositeRating ?? null,
          is_significant: input.isSignificant ?? false,
          rationale: input.rationale ?? null,
        })
        .select("*")
        .single();

      rating = requireRow(unwrapSupabaseResult(insertResult), "RiskAssertionRating");
    }

    await this.logActivity({
      riskAssessmentId: assessment.id,
      engagementId: assessment.engagement_id,
      organizationId: assessment.organization_id,
      workspaceId: assessment.workspace_id,
      action: RISK_ACTIVITY_ACTIONS.ASSERTION_RATING_UPDATED,
      summary: `Assertion rating updated for ${rating.account_name} (${rating.assertion})`,
      metadata: { ratingId: rating.id, accountName: rating.account_name, assertion: rating.assertion },
    });

    await this.recomputeProgress(assessment.id);
    return rating;
  }

  async addResponse(input: AddRiskResponseInput): Promise<RiskResponse> {
    const assessment = await this.requireAssessmentForMutation(input.riskAssessmentId);
    await this.requireRegisterItemInAssessment(input.riskAssessmentId, input.riskRegisterItemId);

    const result = await this.client
      .from("risk_responses")
      .insert({
        risk_assessment_id: assessment.id,
        risk_register_item_id: input.riskRegisterItemId,
        engagement_id: assessment.engagement_id,
        organization_id: assessment.organization_id,
        workspace_id: assessment.workspace_id,
        response_type: input.responseType,
        description: input.description.trim(),
      })
      .select("*")
      .single();

    const response = requireRow(unwrapSupabaseResult(result), "RiskResponse");

    await this.logActivity({
      riskAssessmentId: assessment.id,
      engagementId: assessment.engagement_id,
      organizationId: assessment.organization_id,
      workspaceId: assessment.workspace_id,
      action: RISK_ACTIVITY_ACTIONS.RESPONSE_ADDED,
      summary: "Risk response added",
      metadata: { responseId: response.id, riskRegisterItemId: response.risk_register_item_id },
    });

    return response;
  }

  async addProcedureLink(input: AddRiskProcedureLinkInput): Promise<RiskProcedureLink> {
    const assessment = await this.requireAssessmentForMutation(input.riskAssessmentId);
    await this.requireRegisterItemInAssessment(input.riskAssessmentId, input.riskRegisterItemId);

    const result = await this.client
      .from("risk_procedure_links")
      .insert({
        risk_assessment_id: assessment.id,
        risk_register_item_id: input.riskRegisterItemId,
        audit_procedure_id: input.auditProcedureId ?? null,
        engagement_id: assessment.engagement_id,
        organization_id: assessment.organization_id,
        workspace_id: assessment.workspace_id,
        procedure_reference: input.procedureReference ?? null,
      })
      .select("*")
      .single();

    const link = requireRow(unwrapSupabaseResult(result), "RiskProcedureLink");

    await this.logActivity({
      riskAssessmentId: assessment.id,
      engagementId: assessment.engagement_id,
      organizationId: assessment.organization_id,
      workspaceId: assessment.workspace_id,
      action: RISK_ACTIVITY_ACTIONS.PROCEDURE_LINKED,
      summary: "Audit procedure linked to risk item",
      metadata: { linkId: link.id, riskRegisterItemId: link.risk_register_item_id },
    });

    return link;
  }

  async addNote(input: AddRiskNoteInput): Promise<RiskNote> {
    const assessment = await this.requireAssessmentForMutation(input.riskAssessmentId);
    if (input.riskRegisterItemId) {
      await this.requireRegisterItemInAssessment(input.riskAssessmentId, input.riskRegisterItemId);
    }

    const result = await this.client
      .from("risk_notes")
      .insert({
        risk_assessment_id: assessment.id,
        engagement_id: assessment.engagement_id,
        organization_id: assessment.organization_id,
        workspace_id: assessment.workspace_id,
        note_type: input.noteType ?? "review",
        body: input.body.trim(),
        risk_register_item_id: input.riskRegisterItemId ?? null,
      })
      .select("*")
      .single();

    const note = requireRow(unwrapSupabaseResult(result), "RiskNote");

    await this.logActivity({
      riskAssessmentId: assessment.id,
      engagementId: assessment.engagement_id,
      organizationId: assessment.organization_id,
      workspaceId: assessment.workspace_id,
      action: RISK_ACTIVITY_ACTIONS.NOTE_ADDED,
      summary: "Risk note added",
      metadata: { noteId: note.id, noteType: note.note_type },
    });

    return note;
  }

  async recomputeProgress(riskAssessmentId: string): Promise<RiskAssessment> {
    const assessment = await this.findById(riskAssessmentId);
    if (!assessment) {
      throw new NotFoundError("Risk assessment not found", { id: riskAssessmentId });
    }

    const registerItems = await this.listRegisterItems(riskAssessmentId);
    const registerCompletionPct =
      registerItems.length === 0
        ? 0
        : Math.round(
            (registerItems.filter((item) => this.isRegisterItemComplete(item)).length /
              registerItems.length) *
              100,
          );

    const matrixRows = await this.listAssertionRatings(riskAssessmentId);
    const matrixCompletionPct =
      matrixRows.length === 0
        ? 0
        : Math.round(
            (matrixRows.filter((row) => row.composite_rating !== null).length / matrixRows.length) *
              100,
          );

    const progressPct = Math.round((registerCompletionPct + matrixCompletionPct) / 2);
    const nextStatus =
      assessment.assessment_status === "not_started" && progressPct > 0
        ? "in_progress"
        : assessment.assessment_status;

    const result = await applyActiveFilter(
      this.client
        .from("risk_assessments")
        .update({
          progress_pct: progressPct,
          assessment_status: nextStatus,
        })
        .eq("id", riskAssessmentId)
        .select("*"),
    ).maybeSingle();

    return requireRow(unwrapSupabaseMaybeSingle(result), "RiskAssessment", riskAssessmentId);
  }

  async validateWorkspaceOwnership(
    riskAssessmentId: string,
    workspaceId: string,
  ): Promise<RiskAssessment> {
    const assessment = await this.findByIdAnyState(riskAssessmentId);
    if (!assessment) {
      throw new NotFoundError("Risk assessment not found", { id: riskAssessmentId });
    }

    if (assessment.workspace_id !== workspaceId) {
      throw new AuthorizationError(
        "Risk assessment does not belong to the active workspace",
        {
          riskAssessmentId,
          workspaceId,
        },
      );
    }

    return assessment;
  }

  private async requireAssessmentForMutation(riskAssessmentId: string): Promise<RiskAssessment> {
    const assessment = await this.findById(riskAssessmentId);
    if (!assessment) {
      throw new NotFoundError("Risk assessment not found", { id: riskAssessmentId });
    }
    this.ensureAssessmentIsEditable(assessment);
    return assessment;
  }

  private ensureAssessmentIsEditable(assessment: RiskAssessment): void {
    if (
      LOCKED_RISK_ASSESSMENT_STATUSES.includes(
        assessment.assessment_status as (typeof LOCKED_RISK_ASSESSMENT_STATUSES)[number],
      )
    ) {
      throw new ValidationError(
        `Risk assessment is locked in status "${assessment.assessment_status}"`,
      );
    }
  }

  private async requireRegisterItemInAssessment(
    riskAssessmentId: string,
    riskRegisterItemId: string,
  ): Promise<RiskRegisterItem> {
    const result = await applyActiveFilter(
      this.client.from("risk_register_items").select("*").eq("id", riskRegisterItemId),
    ).maybeSingle();
    const item = requireRow(unwrapSupabaseMaybeSingle(result), "RiskRegisterItem", riskRegisterItemId);
    if (item.risk_assessment_id !== riskAssessmentId) {
      throw new ValidationError("Risk register item does not belong to this risk assessment", {
        riskAssessmentId,
        riskRegisterItemId,
      });
    }
    return item;
  }

  private async seedDefaultCategories(
    assessment: RiskAssessment,
  ): Promise<Record<string, string>> {
    const categories = DEFAULT_RISK_CATEGORIES.map((category) => ({
      risk_assessment_id: assessment.id,
      engagement_id: assessment.engagement_id,
      organization_id: assessment.organization_id,
      workspace_id: assessment.workspace_id,
      name: category.name,
      description: category.description,
      sort_order: category.sortOrder,
    }));

    const result = await this.client.from("risk_categories").insert(categories).select("*");
    const rows = unwrapSupabaseList(result);
    const map: Record<string, string> = {};
    for (const row of rows) {
      const key = DEFAULT_RISK_CATEGORIES.find((category) => category.name === row.name)?.key;
      if (key) {
        map[key] = row.id;
      }
    }
    return map;
  }

  private async seedDefaultAssertionMatrix(assessment: RiskAssessment): Promise<void> {
    const rows = DEFAULT_MATRIX_ACCOUNTS.flatMap((account) =>
      ASSERTION_TYPES.map((assertion) => ({
        risk_assessment_id: assessment.id,
        engagement_id: assessment.engagement_id,
        organization_id: assessment.organization_id,
        workspace_id: assessment.workspace_id,
        account_name: account,
        assertion,
      })),
    );

    if (rows.length > 0) {
      await this.client.from("risk_assertion_ratings").insert(rows);
    }
  }

  private async seedDefaultRiskRegister(
    assessment: RiskAssessment,
    categoryMap: Record<string, string>,
  ): Promise<void> {
    const rows = DEFAULT_SEED_RISKS.map((risk, index) => ({
      risk_assessment_id: assessment.id,
      risk_category_id: this.resolveSeedCategoryId(risk.riskType, categoryMap),
      engagement_id: assessment.engagement_id,
      organization_id: assessment.organization_id,
      workspace_id: assessment.workspace_id,
      risk_type: risk.riskType,
      title: risk.title,
      description: risk.description,
      audit_area: risk.auditArea,
      account_name: risk.auditArea,
      linked_assertion: null,
      likelihood: risk.likelihood,
      impact: risk.impact,
      inherent_rating: risk.inherentRating,
      control_rating: null,
      detection_rating: null,
      residual_rating: null,
      is_significant: risk.isSignificant,
      owner_id: null,
      rationale: "Seeded from default risk library",
      sort_order: index + 1,
    }));

    if (rows.length > 0) {
      await this.client.from("risk_register_items").insert(rows);
    }
  }

  private resolveSeedCategoryId(riskType: string, categoryMap: Record<string, string>): string | null {
    if (riskType === "fraud" && categoryMap.fraud) {
      return categoryMap.fraud;
    }
    if (riskType === "it" && categoryMap.it) {
      return categoryMap.it;
    }
    if (riskType === "compliance" && categoryMap.compliance) {
      return categoryMap.compliance;
    }
    return categoryMap.financial_reporting ?? null;
  }

  private isRegisterItemComplete(item: RiskRegisterItem): boolean {
    return Boolean(
      item.inherent_rating &&
        item.likelihood &&
        item.impact &&
        (item.residual_rating || item.control_rating || item.detection_rating),
    );
  }
}
