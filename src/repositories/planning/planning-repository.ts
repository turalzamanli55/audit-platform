import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables, TablesInsert, TablesUpdate } from "@/types/supabase";
import type { RepositoryContext } from "@/types/context";
import type { PlanningStatus } from "@/types/planning";
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
  DEFAULT_PLANNING_CHECKLIST,
  DEFAULT_PLANNING_TIMELINE,
  PLANNING_ACTIVITY_ACTIONS,
} from "@/constants/planning";

export type AuditPlan = Tables<"audit_plans">;
export type PlanningActivity = Tables<"planning_activity">;

export type CreateAuditPlanInput = Pick<
  TablesInsert<"audit_plans">,
  | "organization_id"
  | "workspace_id"
  | "engagement_id"
  | "financial_reporting_framework"
>;

export type UpdateAuditPlanInput = Partial<
  Pick<
    TablesUpdate<"audit_plans">,
    | "planning_status"
    | "audit_strategy"
    | "engagement_objectives"
    | "scope_of_audit"
    | "financial_reporting_framework"
    | "planning_notes"
    | "materiality_status"
    | "risk_status"
    | "timeline"
    | "team_planning"
    | "checklist"
    | "documents"
    | "submitted_at"
    | "submitted_by"
    | "approved_at"
    | "approved_by"
    | "returned_at"
    | "returned_by"
    | "return_notes"
    | "revision_history"
    | "plan_version"
    | "status"
  >
>;

export type PlanningComment = Tables<"planning_comments">;

export type AddPlanningCommentInput = {
  auditPlanId: string;
  engagementId: string;
  organizationId: string;
  workspaceId: string;
  body: string;
  commentType?: "review" | "general" | "return";
};

export type LogPlanningActivityInput = {
  auditPlanId: string;
  engagementId: string;
  organizationId: string;
  workspaceId: string;
  action: string;
  summary?: string | null;
  metadata?: Record<string, unknown>;
};

export class PlanningRepository extends AuthenticatedRepository {
  constructor(client: SupabaseClient<Database>, context: RepositoryContext) {
    super(client, context);
  }

  async findById(id: string): Promise<AuditPlan | null> {
    const result = await applyActiveFilter(
      this.client.from("audit_plans").select("*").eq("id", id),
    ).maybeSingle();

    return unwrapSupabaseMaybeSingle(result);
  }

  async findByIdAnyState(id: string): Promise<AuditPlan | null> {
    const result = await this.client.from("audit_plans").select("*").eq("id", id).maybeSingle();
    return unwrapSupabaseMaybeSingle(result);
  }

  async findByEngagementId(engagementId: string): Promise<AuditPlan | null> {
    const result = await applyActiveFilter(
      this.client.from("audit_plans").select("*").eq("engagement_id", engagementId),
    ).maybeSingle();

    return unwrapSupabaseMaybeSingle(result);
  }

  async findByEngagementIdAnyState(engagementId: string): Promise<AuditPlan | null> {
    const result = await this.client
      .from("audit_plans")
      .select("*")
      .eq("engagement_id", engagementId)
      .maybeSingle();

    return unwrapSupabaseMaybeSingle(result);
  }

  async create(input: CreateAuditPlanInput): Promise<AuditPlan> {
    const existing = await this.findByEngagementId(input.engagement_id);
    if (existing) {
      throw new ValidationError("Planning already exists for this engagement");
    }

    const result = await this.client
      .from("audit_plans")
      .insert({
        ...input,
        planning_status: "in_progress",
        checklist: DEFAULT_PLANNING_CHECKLIST as unknown as Database["public"]["Tables"]["audit_plans"]["Insert"]["checklist"],
        timeline: DEFAULT_PLANNING_TIMELINE as unknown as Database["public"]["Tables"]["audit_plans"]["Insert"]["timeline"],
        team_planning: {},
        documents: [],
        materiality_status: "placeholder",
        risk_status: "placeholder",
      })
      .select("*")
      .single();

    const plan = requireRow(unwrapSupabaseResult(result), "AuditPlan");

    await this.logActivity({
      auditPlanId: plan.id,
      engagementId: plan.engagement_id,
      organizationId: plan.organization_id,
      workspaceId: plan.workspace_id,
      action: PLANNING_ACTIVITY_ACTIONS.CREATED,
      summary: "Audit planning initiated",
      metadata: { planVersion: plan.plan_version },
    });

    return plan;
  }

  async update(
    id: string,
    expectedVersion: number,
    input: UpdateAuditPlanInput,
  ): Promise<AuditPlan> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new NotFoundError("Audit plan not found", { id });
    }

    this.validateOptimisticLock(existing, expectedVersion);
    await this.validateWorkspaceOwnership(id, existing.workspace_id);

    const result = await applyActiveFilter(
      this.client
        .from("audit_plans")
        .update(input)
        .eq("id", id)
        .eq("version", expectedVersion)
        .select("*"),
    ).maybeSingle();

    const plan = requireRow(unwrapSupabaseMaybeSingle(result), "AuditPlan", id);

    await this.logActivity({
      auditPlanId: plan.id,
      engagementId: plan.engagement_id,
      organizationId: plan.organization_id,
      workspaceId: plan.workspace_id,
      action: PLANNING_ACTIVITY_ACTIONS.UPDATED,
      summary: "Audit plan updated",
      metadata: { version: plan.version },
    });

    return plan;
  }

  async updatePlanningStatus(
    id: string,
    expectedVersion: number,
    planningStatus: PlanningStatus,
    extra?: Partial<UpdateAuditPlanInput>,
  ): Promise<AuditPlan> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new NotFoundError("Audit plan not found", { id });
    }

    this.validateOptimisticLock(existing, expectedVersion);

    const result = await applyActiveFilter(
      this.client
        .from("audit_plans")
        .update({ planning_status: planningStatus, ...extra })
        .eq("id", id)
        .eq("version", expectedVersion)
        .select("*"),
    ).maybeSingle();

    const plan = requireRow(unwrapSupabaseMaybeSingle(result), "AuditPlan", id);

    await this.logActivity({
      auditPlanId: plan.id,
      engagementId: plan.engagement_id,
      organizationId: plan.organization_id,
      workspaceId: plan.workspace_id,
      action: PLANNING_ACTIVITY_ACTIONS.STATUS_CHANGED,
      summary: `Planning status changed to ${planningStatus}`,
      metadata: {
        previousStatus: existing.planning_status,
        nextStatus: planningStatus,
        version: plan.version,
        planVersion: plan.plan_version,
      },
    });

    return plan;
  }

  async submitForReview(id: string, expectedVersion: number): Promise<AuditPlan> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new NotFoundError("Audit plan not found", { id });
    }

    const plan = await this.updatePlanningStatus(id, expectedVersion, "pending_review", {
      submitted_at: new Date().toISOString(),
      submitted_by: this.userId,
      returned_at: null,
      returned_by: null,
      return_notes: null,
    });

    await this.logActivity({
      auditPlanId: plan.id,
      engagementId: plan.engagement_id,
      organizationId: plan.organization_id,
      workspaceId: plan.workspace_id,
      action: PLANNING_ACTIVITY_ACTIONS.SUBMITTED,
      summary: "Audit plan submitted for partner review",
      metadata: { planVersion: plan.plan_version, version: plan.version },
    });

    return plan;
  }

  async returnForRevision(
    id: string,
    expectedVersion: number,
    returnNotes: string | null,
  ): Promise<AuditPlan> {
    const plan = await this.updatePlanningStatus(id, expectedVersion, "returned", {
      returned_at: new Date().toISOString(),
      returned_by: this.userId,
      return_notes: returnNotes,
    });

    await this.logActivity({
      auditPlanId: plan.id,
      engagementId: plan.engagement_id,
      organizationId: plan.organization_id,
      workspaceId: plan.workspace_id,
      action: PLANNING_ACTIVITY_ACTIONS.RETURNED,
      summary: returnNotes ?? "Audit plan returned for revision",
      metadata: { planVersion: plan.plan_version, version: plan.version },
    });

    return plan;
  }

  async approve(id: string, expectedVersion: number): Promise<AuditPlan> {
    const plan = await this.updatePlanningStatus(id, expectedVersion, "approved", {
      approved_at: new Date().toISOString(),
      approved_by: this.userId,
    });

    await this.logActivity({
      auditPlanId: plan.id,
      engagementId: plan.engagement_id,
      organizationId: plan.organization_id,
      workspaceId: plan.workspace_id,
      action: PLANNING_ACTIVITY_ACTIONS.APPROVED,
      summary: "Audit plan approved — fieldwork gate cleared",
      metadata: {
        planVersion: plan.plan_version,
        version: plan.version,
        approvedBy: this.userId,
      },
    });

    return plan;
  }

  async revise(id: string, expectedVersion: number, summary?: string | null): Promise<AuditPlan> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new NotFoundError("Audit plan not found", { id });
    }

    this.validateOptimisticLock(existing, expectedVersion);

    const history = Array.isArray(existing.revision_history)
      ? [...(existing.revision_history as Record<string, unknown>[])]
      : [];

    history.push({
      planVersion: existing.plan_version,
      planningStatus: existing.planning_status,
      revisedAt: new Date().toISOString(),
      revisedBy: this.userId,
      summary: summary ?? null,
    });

    const result = await applyActiveFilter(
      this.client
        .from("audit_plans")
        .update({
          planning_status: "in_progress",
          plan_version: existing.plan_version + 1,
          revision_history: history as never,
          approved_at: null,
          approved_by: null,
          submitted_at: null,
          submitted_by: null,
          returned_at: null,
          returned_by: null,
          return_notes: null,
        })
        .eq("id", id)
        .eq("version", expectedVersion)
        .select("*"),
    ).maybeSingle();

    const plan = requireRow(unwrapSupabaseMaybeSingle(result), "AuditPlan", id);

    await this.logActivity({
      auditPlanId: plan.id,
      engagementId: plan.engagement_id,
      organizationId: plan.organization_id,
      workspaceId: plan.workspace_id,
      action: PLANNING_ACTIVITY_ACTIONS.REVISED,
      summary: summary ?? `Plan revised to version ${plan.plan_version}`,
      metadata: {
        previousPlanVersion: existing.plan_version,
        planVersion: plan.plan_version,
        version: plan.version,
      },
    });

    return plan;
  }

  async archive(id: string, expectedVersion: number): Promise<AuditPlan> {
    const plan = await this.softDelete(id, expectedVersion);

    await this.logActivity({
      auditPlanId: plan.id,
      engagementId: plan.engagement_id,
      organizationId: plan.organization_id,
      workspaceId: plan.workspace_id,
      action: PLANNING_ACTIVITY_ACTIONS.ARCHIVED,
      summary: "Audit plan archived",
      metadata: { version: plan.version },
    });

    return plan;
  }

  async restore(id: string, expectedVersion: number): Promise<AuditPlan> {
    const existing = await this.findByIdAnyState(id);
    if (!existing) {
      throw new NotFoundError("Audit plan not found", { id });
    }

    if (!existing.deleted_at && existing.status !== "archived") {
      throw new ValidationError("Audit plan is not archived");
    }

    this.validateOptimisticLock(existing, expectedVersion);

    const result = await this.client
      .from("audit_plans")
      .update({
        deleted_at: null,
        deleted_by: null,
        status: "active",
      })
      .eq("id", id)
      .eq("version", expectedVersion)
      .select("*")
      .maybeSingle();

    const plan = requireRow(unwrapSupabaseMaybeSingle(result), "AuditPlan", id);

    await this.logActivity({
      auditPlanId: plan.id,
      engagementId: plan.engagement_id,
      organizationId: plan.organization_id,
      workspaceId: plan.workspace_id,
      action: PLANNING_ACTIVITY_ACTIONS.RESTORED,
      summary: "Audit plan restored",
      metadata: { version: plan.version },
    });

    return plan;
  }

  async softDelete(id: string, expectedVersion: number): Promise<AuditPlan> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new NotFoundError("Audit plan not found", { id });
    }

    this.validateOptimisticLock(existing, expectedVersion);

    const result = await applyActiveFilter(
      this.client
        .from("audit_plans")
        .update({
          deleted_at: new Date().toISOString(),
          deleted_by: this.userId,
          status: "archived",
        })
        .eq("id", id)
        .eq("version", expectedVersion)
        .select("*"),
    ).maybeSingle();

    return requireRow(unwrapSupabaseMaybeSingle(result), "AuditPlan", id);
  }

  async listActivity(auditPlanId: string, limit = 100): Promise<PlanningActivity[]> {
    const result = await applyActiveFilter(
      this.client
        .from("planning_activity")
        .select("*")
        .eq("audit_plan_id", auditPlanId)
        .order("created_at", { ascending: false })
        .limit(limit),
    );

    return unwrapSupabaseList(result);
  }

  async logActivity(input: LogPlanningActivityInput): Promise<PlanningActivity> {
    const result = await this.client
      .from("planning_activity")
      .insert({
        audit_plan_id: input.auditPlanId,
        engagement_id: input.engagementId,
        organization_id: input.organizationId,
        workspace_id: input.workspaceId,
        actor_id: this.userId,
        action: input.action,
        summary: input.summary ?? null,
        metadata: (input.metadata ?? {}) as Database["public"]["Tables"]["planning_activity"]["Insert"]["metadata"],
      })
      .select("*")
      .single();

    return requireRow(unwrapSupabaseResult(result), "PlanningActivity");
  }

  async listComments(auditPlanId: string, limit = 100): Promise<PlanningComment[]> {
    const result = await applyActiveFilter(
      this.client
        .from("planning_comments")
        .select("*")
        .eq("audit_plan_id", auditPlanId)
        .order("created_at", { ascending: false })
        .limit(limit),
    );

    return unwrapSupabaseList(result);
  }

  async addComment(input: AddPlanningCommentInput): Promise<PlanningComment> {
    const result = await this.client
      .from("planning_comments")
      .insert({
        audit_plan_id: input.auditPlanId,
        engagement_id: input.engagementId,
        organization_id: input.organizationId,
        workspace_id: input.workspaceId,
        author_id: this.userId,
        body: input.body.trim(),
        comment_type: input.commentType ?? "review",
      })
      .select("*")
      .single();

    const comment = requireRow(unwrapSupabaseResult(result), "PlanningComment");

    await this.logActivity({
      auditPlanId: input.auditPlanId,
      engagementId: input.engagementId,
      organizationId: input.organizationId,
      workspaceId: input.workspaceId,
      action: PLANNING_ACTIVITY_ACTIONS.COMMENT_ADDED,
      summary: "Planning review comment added",
      metadata: { commentId: comment.id },
    });

    return comment;
  }

  async validateWorkspaceOwnership(planId: string, workspaceId: string): Promise<AuditPlan> {
    const plan = await this.findByIdAnyState(planId);
    if (!plan) {
      throw new NotFoundError("Audit plan not found", { id: planId });
    }

    if (plan.workspace_id !== workspaceId) {
      throw new AuthorizationError("Audit plan does not belong to the active workspace", {
        planId,
        workspaceId,
      });
    }

    return plan;
  }

  validateOptimisticLock(
    record: { version: number },
    expectedVersion: number,
    resource = "AuditPlan",
  ): void {
    assertVersionMatch(record.version, expectedVersion, resource);
  }
}
