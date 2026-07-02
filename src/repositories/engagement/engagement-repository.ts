import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables, TablesInsert, TablesUpdate } from "@/types/supabase";
import type { RepositoryContext } from "@/types/context";
import type { EngagementLifecycleStatus } from "@/types/engagement";
import { AuthenticatedRepository } from "../base/base-repository";
import {
  applyActiveFilter,
  assertVersionMatch,
  requireRow,
} from "../base/repository-helpers";
import { AuthorizationError, NotFoundError, ValidationError } from "@/lib/errors";
import { toSlug } from "@/utils/auth-validation";
import {
  unwrapSupabaseList,
  unwrapSupabaseMaybeSingle,
  unwrapSupabaseResult,
} from "@/utils/supabase-result";
import { ENGAGEMENT_ACTIVITY_ACTIONS } from "@/constants/engagement";

export type Engagement = Tables<"engagements">;
export type EngagementMember = Tables<"engagement_members">;
export type EngagementActivity = Tables<"engagement_activity">;

export type CreateEngagementRecordInput = Pick<
  TablesInsert<"engagements">,
  | "organization_id"
  | "workspace_id"
  | "company_id"
  | "name"
  | "slug"
  | "engagement_code"
  | "engagement_type"
  | "reporting_framework"
  | "period_start"
  | "period_end"
  | "planned_start"
  | "planned_end"
  | "description"
  | "notes"
>;

export type UpdateEngagementRecordInput = Pick<
  TablesUpdate<"engagements">,
  | "name"
  | "slug"
  | "engagement_code"
  | "engagement_type"
  | "lifecycle_status"
  | "reporting_framework"
  | "period_start"
  | "period_end"
  | "planned_start"
  | "planned_end"
  | "description"
  | "notes"
  | "status"
>;

export type LogEngagementActivityInput = {
  engagementId: string;
  organizationId: string;
  workspaceId: string;
  action: string;
  summary?: string | null;
  metadata?: Record<string, unknown>;
};

export class EngagementRepository extends AuthenticatedRepository {
  constructor(client: SupabaseClient<Database>, context: RepositoryContext) {
    super(client, context);
  }

  async findById(id: string): Promise<Engagement | null> {
    const result = await applyActiveFilter(
      this.client.from("engagements").select("*").eq("id", id),
    ).maybeSingle();

    return unwrapSupabaseMaybeSingle(result);
  }

  async findByIdAnyState(id: string): Promise<Engagement | null> {
    const result = await this.client.from("engagements").select("*").eq("id", id).maybeSingle();
    return unwrapSupabaseMaybeSingle(result);
  }

  async findBySlug(workspaceId: string, slug: string): Promise<Engagement | null> {
    const result = await applyActiveFilter(
      this.client
        .from("engagements")
        .select("*")
        .eq("workspace_id", workspaceId)
        .eq("slug", slug),
    ).maybeSingle();

    return unwrapSupabaseMaybeSingle(result);
  }

  async findBySlugInWorkspace(workspaceId: string, slug: string): Promise<Engagement | null> {
    const active = await this.findBySlug(workspaceId, slug);
    if (active) {
      return active;
    }

    const result = await this.client
      .from("engagements")
      .select("*")
      .eq("workspace_id", workspaceId)
      .eq("slug", slug)
      .maybeSingle();

    return unwrapSupabaseMaybeSingle(result);
  }

  async listByWorkspace(
    workspaceId: string,
    options?: { includeArchived?: boolean; companyId?: string },
  ): Promise<Engagement[]> {
    let query = this.client
      .from("engagements")
      .select("*")
      .eq("workspace_id", workspaceId)
      .order("updated_at", { ascending: false });

    if (options?.companyId) {
      query = query.eq("company_id", options.companyId);
    }

    if (!options?.includeArchived) {
      query = applyActiveFilter(query);
    }

    const result = await query;
    return unwrapSupabaseList(result);
  }

  async create(input: CreateEngagementRecordInput): Promise<Engagement> {
    const result = await this.client.from("engagements").insert(input).select("*").single();
    const engagement = requireRow(unwrapSupabaseResult(result), "Engagement");

    await this.logActivity({
      engagementId: engagement.id,
      organizationId: engagement.organization_id,
      workspaceId: engagement.workspace_id,
      action: ENGAGEMENT_ACTIVITY_ACTIONS.CREATED,
      summary: `Engagement "${engagement.name}" created`,
      metadata: { slug: engagement.slug, companyId: engagement.company_id },
    });

    if (this.userId) {
      await this.addMember({
        engagementId: engagement.id,
        organizationId: engagement.organization_id,
        workspaceId: engagement.workspace_id,
        userId: this.userId,
        memberRole: "engagement_manager",
      });
    }

    return engagement;
  }

  async update(
    id: string,
    expectedVersion: number,
    input: UpdateEngagementRecordInput,
  ): Promise<Engagement> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new NotFoundError("Engagement not found", { id });
    }

    this.validateOptimisticLock(existing, expectedVersion);
    await this.validateWorkspaceOwnership(id, existing.workspace_id);

    const result = await applyActiveFilter(
      this.client
        .from("engagements")
        .update(input)
        .eq("id", id)
        .eq("version", expectedVersion)
        .select("*"),
    ).maybeSingle();

    const engagement = requireRow(unwrapSupabaseMaybeSingle(result), "Engagement", id);

    await this.logActivity({
      engagementId: engagement.id,
      organizationId: engagement.organization_id,
      workspaceId: engagement.workspace_id,
      action: ENGAGEMENT_ACTIVITY_ACTIONS.UPDATED,
      summary: `Engagement "${engagement.name}" updated`,
      metadata: { version: engagement.version },
    });

    return engagement;
  }

  async updateLifecycleStatus(
    id: string,
    expectedVersion: number,
    lifecycleStatus: EngagementLifecycleStatus,
  ): Promise<Engagement> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new NotFoundError("Engagement not found", { id });
    }

    this.validateOptimisticLock(existing, expectedVersion);

    const result = await applyActiveFilter(
      this.client
        .from("engagements")
        .update({ lifecycle_status: lifecycleStatus })
        .eq("id", id)
        .eq("version", expectedVersion)
        .select("*"),
    ).maybeSingle();

    const engagement = requireRow(unwrapSupabaseMaybeSingle(result), "Engagement", id);

    await this.logActivity({
      engagementId: engagement.id,
      organizationId: engagement.organization_id,
      workspaceId: engagement.workspace_id,
      action: ENGAGEMENT_ACTIVITY_ACTIONS.STATUS_CHANGED,
      summary: `Status changed to ${lifecycleStatus}`,
      metadata: {
        previousStatus: existing.lifecycle_status,
        nextStatus: lifecycleStatus,
        version: engagement.version,
      },
    });

    return engagement;
  }

  async archive(id: string, expectedVersion: number): Promise<Engagement> {
    const engagement = await this.softDelete(id, expectedVersion);

    await this.logActivity({
      engagementId: engagement.id,
      organizationId: engagement.organization_id,
      workspaceId: engagement.workspace_id,
      action: ENGAGEMENT_ACTIVITY_ACTIONS.ARCHIVED,
      summary: `Engagement "${engagement.name}" archived`,
      metadata: { version: engagement.version },
    });

    return engagement;
  }

  async restore(id: string, expectedVersion: number): Promise<Engagement> {
    const existing = await this.findByIdAnyState(id);
    if (!existing) {
      throw new NotFoundError("Engagement not found", { id });
    }

    if (!existing.deleted_at && existing.status !== "archived") {
      throw new ValidationError("Engagement is not archived");
    }

    this.validateOptimisticLock(existing, expectedVersion);

    const result = await this.client
      .from("engagements")
      .update({
        deleted_at: null,
        deleted_by: null,
        status: "active",
      })
      .eq("id", id)
      .eq("version", expectedVersion)
      .select("*")
      .maybeSingle();

    const engagement = requireRow(unwrapSupabaseMaybeSingle(result), "Engagement", id);

    await this.logActivity({
      engagementId: engagement.id,
      organizationId: engagement.organization_id,
      workspaceId: engagement.workspace_id,
      action: ENGAGEMENT_ACTIVITY_ACTIONS.RESTORED,
      summary: `Engagement "${engagement.name}" restored`,
      metadata: { version: engagement.version },
    });

    return engagement;
  }

  async softDelete(id: string, expectedVersion: number): Promise<Engagement> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new NotFoundError("Engagement not found", { id });
    }

    this.validateOptimisticLock(existing, expectedVersion);

    const result = await applyActiveFilter(
      this.client
        .from("engagements")
        .update({
          deleted_at: new Date().toISOString(),
          deleted_by: this.userId,
          status: "archived",
        })
        .eq("id", id)
        .eq("version", expectedVersion)
        .select("*"),
    ).maybeSingle();

    return requireRow(unwrapSupabaseMaybeSingle(result), "Engagement", id);
  }

  async listMembers(engagementId: string): Promise<EngagementMember[]> {
    const result = await applyActiveFilter(
      this.client.from("engagement_members").select("*").eq("engagement_id", engagementId),
    ).order("created_at", { ascending: true });

    return unwrapSupabaseList(result);
  }

  async addMember(input: {
    engagementId: string;
    organizationId: string;
    workspaceId: string;
    userId: string;
    memberRole: EngagementMember["member_role"];
  }): Promise<EngagementMember> {
    const result = await this.client
      .from("engagement_members")
      .insert({
        engagement_id: input.engagementId,
        organization_id: input.organizationId,
        workspace_id: input.workspaceId,
        user_id: input.userId,
        member_role: input.memberRole,
      })
      .select("*")
      .single();

    return requireRow(unwrapSupabaseResult(result), "EngagementMember");
  }

  async listActivity(engagementId: string, limit = 100): Promise<EngagementActivity[]> {
    const result = await applyActiveFilter(
      this.client
        .from("engagement_activity")
        .select("*")
        .eq("engagement_id", engagementId)
        .order("created_at", { ascending: false })
        .limit(limit),
    );

    return unwrapSupabaseList(result);
  }

  async logActivity(input: LogEngagementActivityInput): Promise<EngagementActivity> {
    const result = await this.client
      .from("engagement_activity")
      .insert({
        engagement_id: input.engagementId,
        organization_id: input.organizationId,
        workspace_id: input.workspaceId,
        actor_id: this.userId,
        action: input.action,
        summary: input.summary ?? null,
        metadata: (input.metadata ?? {}) as Database["public"]["Tables"]["engagement_activity"]["Insert"]["metadata"],
      })
      .select("*")
      .single();

    return requireRow(unwrapSupabaseResult(result), "EngagementActivity");
  }

  async validateWorkspaceOwnership(engagementId: string, workspaceId: string): Promise<Engagement> {
    const engagement = await this.findByIdAnyState(engagementId);
    if (!engagement) {
      throw new NotFoundError("Engagement not found", { id: engagementId });
    }

    if (engagement.workspace_id !== workspaceId) {
      throw new AuthorizationError("Engagement does not belong to the active workspace", {
        engagementId,
        workspaceId,
      });
    }

    return engagement;
  }

  validateOptimisticLock(
    record: { version: number },
    expectedVersion: number,
    resource = "Engagement",
  ): void {
    assertVersionMatch(record.version, expectedVersion, resource);
  }

  async resolveUniqueSlug(
    workspaceId: string,
    baseSlug: string,
    excludeEngagementId?: string,
  ): Promise<string> {
    let slug = baseSlug;
    let suffix = 1;

    while (true) {
      const existing = await this.findBySlug(workspaceId, slug);
      if (!existing || (excludeEngagementId && existing.id === excludeEngagementId)) {
        return slug;
      }
      slug = `${baseSlug}-${suffix}`;
      suffix += 1;
    }
  }

  async resolveSlugForName(workspaceId: string, name: string): Promise<string> {
    const baseSlug = toSlug(name);
    if (!baseSlug) {
      throw new ValidationError("Engagement name must contain valid characters");
    }

    return this.resolveUniqueSlug(workspaceId, baseSlug);
  }
}
