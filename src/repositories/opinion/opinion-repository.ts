import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables, TablesInsert, TablesUpdate } from "@/types/supabase";
import type { RepositoryContext } from "@/types/context";
import type { SeedOpinionSectionCandidate } from "@/types/opinion";
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
import { LOCKED_OPINION_STATUSES, OPINION_ACTIVITY_ACTIONS } from "@/constants/opinion";
import { computeOpinionProgress } from "@/lib/opinion/opinion-module-rules";

export type OpinionPackage = Tables<"opinion_packages">;
export type OpinionSection = Tables<"opinion_sections">;
export type OpinionComment = Tables<"opinion_comments">;
export type OpinionVersion = Tables<"opinion_versions">;
export type OpinionActivity = Tables<"opinion_activity">;

export type CreateOpinionPackageInput = Pick<
  TablesInsert<"opinion_packages">,
  "organization_id" | "workspace_id" | "engagement_id" | "audit_plan_id" | "reporting_package_id"
>;

export type UpdateOpinionPackageInput = Partial<
  Pick<
    TablesUpdate<"opinion_packages">,
    | "package_status"
    | "package_version"
    | "progress_pct"
    | "pending_count"
    | "returned_count"
    | "resolved_count"
    | "pending_sections_count"
    | "summary_notes"
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

export type AddCommentInput = {
  reportingPackageId: string;
  commentType?: TablesInsert<"opinion_comments">["comment_type"];
  body: string;
  parentCommentId?: string | null;
  opinionSectionId?: string | null;
  mentions?: string[];
  attachmentMetadata?: Array<{ name: string; type?: string; size?: number; url?: string }>;
};

export type UpdateCommentInput = {
  commentId: string;
  reportingPackageId: string;
  expectedVersion: number;
  body: string;
  mentions?: string[];
  attachmentMetadata?: Array<{ name: string; type?: string; size?: number; url?: string }>;
};

export type UpdateOpinionSectionInput = {
  reportingPackageId: string;
  itemId: string;
  expectedItemVersion: number;
  assignedReviewerId?: string | null;
  priority?: string | null;
  severity?: string | null;
  dueDate?: string | null;
  sectionStatus?: TablesUpdate<"opinion_sections">["section_status"];
};

export type LogOpinionActivityInput = {
  reportingPackageId: string;
  engagementId: string;
  organizationId: string;
  workspaceId: string;
  action: string;
  summary?: string | null;
  metadata?: Record<string, unknown>;
};

export class OpinionRepository extends AuthenticatedRepository {
  constructor(client: SupabaseClient<Database>, context: RepositoryContext) {
    super(client, context);
  }

  async findById(id: string): Promise<OpinionPackage | null> {
    const result = await applyActiveFilter(
      this.client.from("opinion_packages").select("*").eq("id", id),
    ).maybeSingle();
    return unwrapSupabaseMaybeSingle(result);
  }

  async findByIdAnyState(id: string): Promise<OpinionPackage | null> {
    const result = await this.client
      .from("opinion_packages")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    return unwrapSupabaseMaybeSingle(result);
  }

  async findByEngagementId(engagementId: string): Promise<OpinionPackage | null> {
    const result = await applyActiveFilter(
      this.client.from("opinion_packages").select("*").eq("engagement_id", engagementId),
    ).maybeSingle();
    return unwrapSupabaseMaybeSingle(result);
  }

  async findByEngagementIdAnyState(engagementId: string): Promise<OpinionPackage | null> {
    const result = await this.client
      .from("opinion_packages")
      .select("*")
      .eq("engagement_id", engagementId)
      .maybeSingle();
    return unwrapSupabaseMaybeSingle(result);
  }

  async createPackage(input: CreateOpinionPackageInput): Promise<OpinionPackage> {
    const existing = await this.findByEngagementId(input.engagement_id);
    if (existing) {
      throw new ValidationError("Review package already exists for this engagement");
    }

    const result = await this.client
      .from("opinion_packages")
      .insert({
        ...input,
        package_status: "draft",
      })
      .select("*")
      .single();

    const pkg = requireRow(unwrapSupabaseResult(result), "OpinionPackage");

    await this.logActivity({
      reportingPackageId: pkg.id,
      engagementId: pkg.engagement_id,
      organizationId: pkg.organization_id,
      workspaceId: pkg.workspace_id,
      action: OPINION_ACTIVITY_ACTIONS.CREATED,
      summary: "Review package initiated from fieldwork",
      metadata: { packageVersion: pkg.package_version },
    });

    await this.syncItemsFromModules(pkg.id);
    return (await this.findById(pkg.id)) ?? pkg;
  }

  async updatePackage(
    id: string,
    expectedVersion: number,
    input: UpdateOpinionPackageInput,
  ): Promise<OpinionPackage> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new NotFoundError("Review package not found", { id });
    }

    this.ensurePackageIsEditable(existing);
    assertVersionMatch(existing.version, expectedVersion, "OpinionPackage");

    const result = await applyActiveFilter(
      this.client
        .from("opinion_packages")
        .update(input)
        .eq("id", id)
        .eq("version", expectedVersion)
        .select("*"),
    ).maybeSingle();

    const pkg = requireRow(unwrapSupabaseMaybeSingle(result), "OpinionPackage", id);

    await this.logActivity({
      reportingPackageId: pkg.id,
      engagementId: pkg.engagement_id,
      organizationId: pkg.organization_id,
      workspaceId: pkg.workspace_id,
      action: OPINION_ACTIVITY_ACTIONS.UPDATED,
      summary: "Review package updated",
      metadata: { version: pkg.version },
    });

    await this.recomputeProgress(pkg.id);
    return pkg;
  }

  async archivePackage(id: string, expectedVersion: number): Promise<OpinionPackage> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new NotFoundError("Review package not found", { id });
    }
    assertVersionMatch(existing.version, expectedVersion, "OpinionPackage");

    const result = await applyActiveFilter(
      this.client
        .from("opinion_packages")
        .update({
          deleted_at: new Date().toISOString(),
          deleted_by: this.userId,
          status: "archived",
          package_status: "archived",
        })
        .eq("id", id)
        .eq("version", expectedVersion)
        .select("*"),
    ).maybeSingle();

    const pkg = requireRow(unwrapSupabaseMaybeSingle(result), "OpinionPackage", id);

    await this.logActivity({
      reportingPackageId: pkg.id,
      engagementId: pkg.engagement_id,
      organizationId: pkg.organization_id,
      workspaceId: pkg.workspace_id,
      action: OPINION_ACTIVITY_ACTIONS.ARCHIVED,
      summary: "Review package archived",
      metadata: { version: pkg.version },
    });

    return pkg;
  }

  async restorePackage(id: string, expectedVersion: number): Promise<OpinionPackage> {
    const existing = await this.findByIdAnyState(id);
    if (!existing) {
      throw new NotFoundError("Review package not found", { id });
    }
    if (!existing.deleted_at && existing.status !== "archived") {
      throw new ValidationError("Review package is not archived");
    }

    assertVersionMatch(existing.version, expectedVersion, "OpinionPackage");

    const result = await this.client
      .from("opinion_packages")
      .update({
        deleted_at: null,
        deleted_by: null,
        status: "active",
        package_status: existing.package_status === "archived" ? "draft" : existing.package_status,
      })
      .eq("id", id)
      .eq("version", expectedVersion)
      .select("*")
      .maybeSingle();

    const pkg = requireRow(unwrapSupabaseMaybeSingle(result), "OpinionPackage", id);

    await this.logActivity({
      reportingPackageId: pkg.id,
      engagementId: pkg.engagement_id,
      organizationId: pkg.organization_id,
      workspaceId: pkg.workspace_id,
      action: OPINION_ACTIVITY_ACTIONS.RESTORED,
      summary: "Review package restored",
      metadata: { version: pkg.version },
    });

    return pkg;
  }

  async submitForReview(id: string, expectedVersion: number): Promise<OpinionPackage> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new NotFoundError("Review package not found", { id });
    }
    this.ensurePackageIsEditable(existing);
    assertVersionMatch(existing.version, expectedVersion, "OpinionPackage");

    const result = await applyActiveFilter(
      this.client
        .from("opinion_packages")
        .update({
          package_status: "submitted",
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

    const pkg = requireRow(unwrapSupabaseMaybeSingle(result), "OpinionPackage", id);

    await this.markItemsUnderReview(pkg.id);

    await this.logActivity({
      reportingPackageId: pkg.id,
      engagementId: pkg.engagement_id,
      organizationId: pkg.organization_id,
      workspaceId: pkg.workspace_id,
      action: OPINION_ACTIVITY_ACTIONS.SUBMITTED,
      summary: "Review package submitted for approval",
      metadata: { packageVersion: pkg.package_version, version: pkg.version },
    });

    return pkg;
  }

  async returnForRevision(
    id: string,
    expectedVersion: number,
    returnNotes: string | null,
  ): Promise<OpinionPackage> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new NotFoundError("Review package not found", { id });
    }
    assertVersionMatch(existing.version, expectedVersion, "OpinionPackage");

    const result = await applyActiveFilter(
      this.client
        .from("opinion_packages")
        .update({
          package_status: "returned",
          returned_at: new Date().toISOString(),
          returned_by: this.userId,
          return_notes: returnNotes,
        })
        .eq("id", id)
        .eq("version", expectedVersion)
        .select("*"),
    ).maybeSingle();

    const pkg = requireRow(unwrapSupabaseMaybeSingle(result), "OpinionPackage", id);

    await this.logActivity({
      reportingPackageId: pkg.id,
      engagementId: pkg.engagement_id,
      organizationId: pkg.organization_id,
      workspaceId: pkg.workspace_id,
      action: OPINION_ACTIVITY_ACTIONS.RETURNED,
      summary: returnNotes ?? "Review package returned for revision",
      metadata: { packageVersion: pkg.package_version, version: pkg.version },
    });

    return pkg;
  }

  async approve(id: string, expectedVersion: number): Promise<OpinionPackage> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new NotFoundError("Review package not found", { id });
    }
    assertVersionMatch(existing.version, expectedVersion, "OpinionPackage");

    const result = await applyActiveFilter(
      this.client
        .from("opinion_packages")
        .update({
          package_status: "approved",
          approved_at: new Date().toISOString(),
          approved_by: this.userId,
        })
        .eq("id", id)
        .eq("version", expectedVersion)
        .select("*"),
    ).maybeSingle();

    const pkg = requireRow(unwrapSupabaseMaybeSingle(result), "OpinionPackage", id);

    await this.logActivity({
      reportingPackageId: pkg.id,
      engagementId: pkg.engagement_id,
      organizationId: pkg.organization_id,
      workspaceId: pkg.workspace_id,
      action: OPINION_ACTIVITY_ACTIONS.APPROVED,
      summary: "Review package approved",
      metadata: { approvedBy: this.userId, packageVersion: pkg.package_version },
    });

    await this.recomputeProgress(pkg.id);
    return pkg;
  }

  async createVersion(
    reportingPackageId: string,
    changeSummary?: string | null,
  ): Promise<OpinionVersion> {
    const pkg = await this.findById(reportingPackageId);
    if (!pkg) {
      throw new NotFoundError("Review package not found", { id: reportingPackageId });
    }

    const [items, comments] = await Promise.all([
      this.listItems(reportingPackageId),
      this.listComments(reportingPackageId),
    ]);

    const nextVersionNumber = pkg.package_version + 1;
    const snapshot = {
      package: pkg,
      items,
      comments,
    };

    const versionResult = await this.client
      .from("opinion_versions")
      .insert({
        opinion_package_id: pkg.id,
        engagement_id: pkg.engagement_id,
        organization_id: pkg.organization_id,
        workspace_id: pkg.workspace_id,
        version_number: nextVersionNumber,
        snapshot: snapshot as Database["public"]["Tables"]["opinion_versions"]["Insert"]["snapshot"],
        change_summary: changeSummary ?? null,
        created_by: this.userId,
      })
      .select("*")
      .single();

    const version = requireRow(unwrapSupabaseResult(versionResult), "OpinionVersion");

    await this.client
      .from("opinion_packages")
      .update({ package_version: nextVersionNumber })
      .eq("id", pkg.id);

    await this.logActivity({
      reportingPackageId: pkg.id,
      engagementId: pkg.engagement_id,
      organizationId: pkg.organization_id,
      workspaceId: pkg.workspace_id,
      action: OPINION_ACTIVITY_ACTIONS.VERSION_CREATED,
      summary: changeSummary ?? `Version ${nextVersionNumber} created`,
      metadata: { versionNumber: nextVersionNumber, versionId: version.id },
    });

    return version;
  }

  async syncItemsFromModules(reportingPackageId: string): Promise<OpinionSection[]> {
    const pkg = await this.findById(reportingPackageId);
    if (!pkg) {
      throw new NotFoundError("Completion package not found", { id: reportingPackageId });
    }

    const candidates = this.buildDefaultOpinionSections();
    const existingItems = await this.listItems(reportingPackageId, { includeInactive: true });
    const syncedItems: OpinionSection[] = [];

    for (const candidate of candidates) {
      const existing = existingItems.find((item) => item.section_type === candidate.sectionType);

      if (existing) {
        if (existing.deleted_at) continue;
        syncedItems.push(existing);
        continue;
      }

      const insertResult = await this.client
        .from("opinion_sections")
        .insert({
          opinion_package_id: pkg.id,
          engagement_id: pkg.engagement_id,
          organization_id: pkg.organization_id,
          workspace_id: pkg.workspace_id,
          section_type: candidate.sectionType,
          title: candidate.title,
          description: candidate.description ?? null,
          severity: candidate.severity ?? null,
          href: candidate.href ?? null,
          sort_order: candidate.sortOrder,
          section_status: "pending",
        })
        .select("*")
        .single();

      const item = requireRow(unwrapSupabaseResult(insertResult), "OpinionSection");
      syncedItems.push(item);
    }

    if (syncedItems.length > 0) {
      await this.logActivity({
        reportingPackageId: pkg.id,
        engagementId: pkg.engagement_id,
        organizationId: pkg.organization_id,
        workspaceId: pkg.workspace_id,
        action: OPINION_ACTIVITY_ACTIONS.ITEM_SYNCED,
        summary: `Seeded ${candidates.length} opinion sections`,
        metadata: { syncedCount: candidates.length },
      });
    }

    await this.recomputeProgress(reportingPackageId);
    return syncedItems;
  }

  private buildDefaultOpinionSections(): SeedOpinionSectionCandidate[] {
    const defaults: Array<{ sectionType: SeedOpinionSectionCandidate["sectionType"]; title: string }> = [
      { sectionType: "opinion_type", title: "Opinion type" },
      { sectionType: "basis_for_opinion", title: "Basis for opinion" },
      { sectionType: "key_audit_matters", title: "Key audit matters" },
      { sectionType: "emphasis_of_matter", title: "Emphasis of matter" },
      { sectionType: "other_information", title: "Other information" },
      { sectionType: "responsibilities", title: "Responsibilities" },
      { sectionType: "signature", title: "Signature" },
    ];

    return defaults.map((entry, index) => ({
      sectionType: entry.sectionType,
      title: entry.title,
      description: null,
      sortOrder: index,
    }));
  }

  async resolveItem(
    reportingPackageId: string,
    itemId: string,
    expectedItemVersion: number,
  ): Promise<OpinionSection> {
    await this.requirePackageForMutation(reportingPackageId);
    const item = await this.requireItem(reportingPackageId, itemId);
    assertVersionMatch(item.version, expectedItemVersion, "OpinionSection");

    const result = await applyActiveFilter(
      this.client
        .from("opinion_sections")
        .update({
          section_status: "resolved",
          resolved_at: new Date().toISOString(),
          resolved_by: this.userId,
          return_notes: null,
        })
        .eq("id", itemId)
        .eq("version", expectedItemVersion)
        .select("*"),
    ).maybeSingle();

    const updated = requireRow(unwrapSupabaseMaybeSingle(result), "OpinionSection", itemId);

    await this.logActivity({
      reportingPackageId,
      engagementId: updated.engagement_id,
      organizationId: updated.organization_id,
      workspaceId: updated.workspace_id,
      action: OPINION_ACTIVITY_ACTIONS.ITEM_RESOLVED,
      summary: `Opinion section "${updated.title}" resolved`,
      metadata: { itemId: updated.id },
    });

    await this.recomputeProgress(reportingPackageId);
    return updated;
  }

  async returnItem(
    reportingPackageId: string,
    itemId: string,
    expectedItemVersion: number,
    returnNotes: string | null,
  ): Promise<OpinionSection> {
    await this.requirePackageForMutation(reportingPackageId);
    const item = await this.requireItem(reportingPackageId, itemId);
    assertVersionMatch(item.version, expectedItemVersion, "OpinionSection");

    const result = await applyActiveFilter(
      this.client
        .from("opinion_sections")
        .update({
          section_status: "returned",
          return_notes: returnNotes,
          resolved_at: null,
          resolved_by: null,
        })
        .eq("id", itemId)
        .eq("version", expectedItemVersion)
        .select("*"),
    ).maybeSingle();

    const updated = requireRow(unwrapSupabaseMaybeSingle(result), "OpinionSection", itemId);

    await this.logActivity({
      reportingPackageId,
      engagementId: updated.engagement_id,
      organizationId: updated.organization_id,
      workspaceId: updated.workspace_id,
      action: OPINION_ACTIVITY_ACTIONS.ITEM_RETURNED,
      summary: returnNotes ?? `Opinion section "${updated.title}" returned`,
      metadata: { itemId: updated.id },
    });

    await this.recomputeProgress(reportingPackageId);
    return updated;
  }

  async reopenItem(
    reportingPackageId: string,
    itemId: string,
    expectedItemVersion: number,
  ): Promise<OpinionSection> {
    await this.requirePackageForMutation(reportingPackageId);
    const item = await this.requireItem(reportingPackageId, itemId);
    assertVersionMatch(item.version, expectedItemVersion, "OpinionSection");

    if (item.section_status !== "resolved") {
      throw new ValidationError("Only resolved review items can be reopened");
    }

    const result = await applyActiveFilter(
      this.client
        .from("opinion_sections")
        .update({
          section_status: "pending",
          resolved_at: null,
          resolved_by: null,
        })
        .eq("id", itemId)
        .eq("version", expectedItemVersion)
        .select("*"),
    ).maybeSingle();

    const updated = requireRow(unwrapSupabaseMaybeSingle(result), "OpinionSection", itemId);

    await this.logActivity({
      reportingPackageId,
      engagementId: updated.engagement_id,
      organizationId: updated.organization_id,
      workspaceId: updated.workspace_id,
      action: OPINION_ACTIVITY_ACTIONS.ITEM_REOPENED,
      summary: `Opinion section "${updated.title}" reopened`,
      metadata: { itemId: updated.id },
    });

    await this.recomputeProgress(reportingPackageId);
    return updated;
  }

  async updateItem(input: UpdateOpinionSectionInput): Promise<OpinionSection> {
    await this.requirePackageForMutation(input.reportingPackageId);
    const item = await this.requireItem(input.reportingPackageId, input.itemId);
    assertVersionMatch(item.version, input.expectedItemVersion, "OpinionSection");

    const updatePayload: TablesUpdate<"opinion_sections"> = {};
    if (input.assignedReviewerId !== undefined) {
      updatePayload.assigned_reviewer_id = input.assignedReviewerId;
    }
    if (input.priority !== undefined) {
      updatePayload.priority = input.priority;
    }
    if (input.severity !== undefined) {
      updatePayload.severity = input.severity;
    }
    if (input.dueDate !== undefined) {
      updatePayload.due_date = input.dueDate;
    }
    if (input.sectionStatus !== undefined) {
      updatePayload.section_status = input.sectionStatus;
      if (input.sectionStatus === "under_review") {
        updatePayload.resolved_at = null;
        updatePayload.resolved_by = null;
      }
    }

    const result = await applyActiveFilter(
      this.client
        .from("opinion_sections")
        .update(updatePayload)
        .eq("id", input.itemId)
        .eq("version", input.expectedItemVersion)
        .select("*"),
    ).maybeSingle();

    const updated = requireRow(unwrapSupabaseMaybeSingle(result), "OpinionSection", input.itemId);

    const action =
      input.assignedReviewerId !== undefined
        ? OPINION_ACTIVITY_ACTIONS.ITEM_ASSIGNED
        : OPINION_ACTIVITY_ACTIONS.ITEM_UPDATED;

    await this.logActivity({
      reportingPackageId: input.reportingPackageId,
      engagementId: updated.engagement_id,
      organizationId: updated.organization_id,
      workspaceId: updated.workspace_id,
      action,
      summary: `Opinion section "${updated.title}" updated`,
      metadata: { itemId: updated.id },
    });

    await this.recomputeProgress(input.reportingPackageId);
    return updated;
  }

  async addComment(input: AddCommentInput): Promise<OpinionComment> {
    const pkg = await this.requirePackageForMutation(input.reportingPackageId);

    const result = await this.client
      .from("opinion_comments")
      .insert({
        opinion_package_id: pkg.id,
        engagement_id: pkg.engagement_id,
        organization_id: pkg.organization_id,
        workspace_id: pkg.workspace_id,
        comment_type: input.commentType ?? "opinion",
        body: input.body.trim(),
        parent_comment_id: input.parentCommentId ?? null,
        opinion_section_id: input.opinionSectionId ?? null,
        mentions: (input.mentions ?? []) as Database["public"]["Tables"]["opinion_comments"]["Insert"]["mentions"],
        attachment_metadata: (input.attachmentMetadata ??
          []) as Database["public"]["Tables"]["opinion_comments"]["Insert"]["attachment_metadata"],
      })
      .select("*")
      .single();

    const comment = requireRow(unwrapSupabaseResult(result), "OpinionComment");

    await this.logActivity({
      reportingPackageId: pkg.id,
      engagementId: pkg.engagement_id,
      organizationId: pkg.organization_id,
      workspaceId: pkg.workspace_id,
      action: OPINION_ACTIVITY_ACTIONS.COMMENT_ADDED,
      summary: "Review comment added",
      metadata: { commentId: comment.id, commentType: comment.comment_type },
    });

    return comment;
  }

  async listItems(
    reportingPackageId: string,
    options?: { includeInactive?: boolean },
  ): Promise<OpinionSection[]> {
    let query = this.client
      .from("opinion_sections")
      .select("*")
      .eq("opinion_package_id", reportingPackageId)
      .order("sort_order", { ascending: true });

    if (!options?.includeInactive) {
      query = applyActiveFilter(query);
    }

    const result = await query;
    return unwrapSupabaseList(result);
  }

  async listComments(reportingPackageId: string): Promise<OpinionComment[]> {
    const result = await applyActiveFilter(
      this.client
        .from("opinion_comments")
        .select("*")
        .eq("opinion_package_id", reportingPackageId)
        .order("created_at", { ascending: false }),
    );
    return unwrapSupabaseList(result);
  }

  async listCommentsAnyState(reportingPackageId: string): Promise<OpinionComment[]> {
    const result = await this.client
      .from("opinion_comments")
      .select("*")
      .eq("opinion_package_id", reportingPackageId)
      .order("created_at", { ascending: false });
    return unwrapSupabaseList(result);
  }

  async updateComment(input: UpdateCommentInput): Promise<OpinionComment> {
    const pkg = await this.requirePackageForMutation(input.reportingPackageId);
    const comment = await this.requireComment(input.reportingPackageId, input.commentId);
    assertVersionMatch(comment.version, input.expectedVersion, "OpinionComment");

    const result = await applyActiveFilter(
      this.client
        .from("opinion_comments")
        .update({
          body: input.body.trim(),
          mentions: (input.mentions ??
            comment.mentions) as Database["public"]["Tables"]["opinion_comments"]["Update"]["mentions"],
          attachment_metadata: (input.attachmentMetadata ??
            comment.attachment_metadata) as Database["public"]["Tables"]["opinion_comments"]["Update"]["attachment_metadata"],
        })
        .eq("id", input.commentId)
        .eq("version", input.expectedVersion)
        .select("*"),
    ).maybeSingle();

    const updated = requireRow(unwrapSupabaseMaybeSingle(result), "OpinionComment", input.commentId);

    await this.logActivity({
      reportingPackageId: pkg.id,
      engagementId: pkg.engagement_id,
      organizationId: pkg.organization_id,
      workspaceId: pkg.workspace_id,
      action: OPINION_ACTIVITY_ACTIONS.COMMENT_UPDATED,
      summary: "Review comment updated",
      metadata: { commentId: updated.id },
    });

    return updated;
  }

  async archiveComment(reportingPackageId: string, commentId: string, expectedVersion: number): Promise<OpinionComment> {
    const pkg = await this.requirePackageForMutation(reportingPackageId);
    const comment = await this.requireComment(reportingPackageId, commentId);
    assertVersionMatch(comment.version, expectedVersion, "OpinionComment");

    const result = await applyActiveFilter(
      this.client
        .from("opinion_comments")
        .update({
          deleted_at: new Date().toISOString(),
          deleted_by: this.userId,
          status: "archived",
        })
        .eq("id", commentId)
        .eq("version", expectedVersion)
        .select("*"),
    ).maybeSingle();

    const updated = requireRow(unwrapSupabaseMaybeSingle(result), "OpinionComment", commentId);

    await this.logActivity({
      reportingPackageId: pkg.id,
      engagementId: pkg.engagement_id,
      organizationId: pkg.organization_id,
      workspaceId: pkg.workspace_id,
      action: OPINION_ACTIVITY_ACTIONS.COMMENT_ARCHIVED,
      summary: "Review comment archived",
      metadata: { commentId: updated.id },
    });

    return updated;
  }

  async restoreComment(reportingPackageId: string, commentId: string, expectedVersion: number): Promise<OpinionComment> {
    const comment = await this.requireCommentAnyState(reportingPackageId, commentId);
    assertVersionMatch(comment.version, expectedVersion, "OpinionComment");

    const result = await this.client
      .from("opinion_comments")
      .update({
        deleted_at: null,
        deleted_by: null,
        status: "active",
      })
      .eq("id", commentId)
      .eq("version", expectedVersion)
      .select("*")
      .maybeSingle();

    const updated = requireRow(unwrapSupabaseMaybeSingle(result), "OpinionComment", commentId);

    await this.logActivity({
      reportingPackageId,
      engagementId: updated.engagement_id,
      organizationId: updated.organization_id,
      workspaceId: updated.workspace_id,
      action: OPINION_ACTIVITY_ACTIONS.COMMENT_RESTORED,
      summary: "Review comment restored",
      metadata: { commentId: updated.id },
    });

    return updated;
  }

  async resolveComment(reportingPackageId: string, commentId: string, expectedVersion: number): Promise<OpinionComment> {
    const pkg = await this.requirePackageForMutation(reportingPackageId);
    const comment = await this.requireComment(reportingPackageId, commentId);
    assertVersionMatch(comment.version, expectedVersion, "OpinionComment");

    const result = await applyActiveFilter(
      this.client
        .from("opinion_comments")
        .update({
          resolved_at: new Date().toISOString(),
          resolved_by: this.userId,
        })
        .eq("id", commentId)
        .eq("version", expectedVersion)
        .select("*"),
    ).maybeSingle();

    const updated = requireRow(unwrapSupabaseMaybeSingle(result), "OpinionComment", commentId);

    await this.logActivity({
      reportingPackageId: pkg.id,
      engagementId: pkg.engagement_id,
      organizationId: pkg.organization_id,
      workspaceId: pkg.workspace_id,
      action: OPINION_ACTIVITY_ACTIONS.COMMENT_RESOLVED,
      summary: "Review comment resolved",
      metadata: { commentId: updated.id },
    });

    return updated;
  }

  async unresolveComment(reportingPackageId: string, commentId: string, expectedVersion: number): Promise<OpinionComment> {
    const pkg = await this.requirePackageForMutation(reportingPackageId);
    const comment = await this.requireComment(reportingPackageId, commentId);
    assertVersionMatch(comment.version, expectedVersion, "OpinionComment");

    const result = await applyActiveFilter(
      this.client
        .from("opinion_comments")
        .update({
          resolved_at: null,
          resolved_by: null,
        })
        .eq("id", commentId)
        .eq("version", expectedVersion)
        .select("*"),
    ).maybeSingle();

    const updated = requireRow(unwrapSupabaseMaybeSingle(result), "OpinionComment", commentId);

    await this.logActivity({
      reportingPackageId: pkg.id,
      engagementId: pkg.engagement_id,
      organizationId: pkg.organization_id,
      workspaceId: pkg.workspace_id,
      action: OPINION_ACTIVITY_ACTIONS.COMMENT_REOPENED,
      summary: "Review comment reopened",
      metadata: { commentId: updated.id },
    });

    return updated;
  }

  async findVersionById(reportingPackageId: string, versionId: string): Promise<OpinionVersion | null> {
    const result = await this.client
      .from("opinion_versions")
      .select("*")
      .eq("opinion_package_id", reportingPackageId)
      .eq("id", versionId)
      .maybeSingle();
    return unwrapSupabaseMaybeSingle(result);
  }

  async restoreVersion(
    reportingPackageId: string,
    versionId: string,
    expectedPackageVersion: number,
  ): Promise<OpinionPackage> {
    const pkg = await this.findById(reportingPackageId);
    if (!pkg) {
      throw new NotFoundError("Review package not found", { id: reportingPackageId });
    }
    this.ensurePackageIsEditable(pkg);
    assertVersionMatch(pkg.version, expectedPackageVersion, "OpinionPackage");

    const version = await this.findVersionById(reportingPackageId, versionId);
    if (!version) {
      throw new NotFoundError("Review version not found", { id: versionId });
    }

    const snapshot = version.snapshot as {
      package?: { summary_notes?: string | null };
    };

    const result = await applyActiveFilter(
      this.client
        .from("opinion_packages")
        .update({
          summary_notes: snapshot.package?.summary_notes ?? pkg.summary_notes,
        })
        .eq("id", reportingPackageId)
        .eq("version", expectedPackageVersion)
        .select("*"),
    ).maybeSingle();

    const updated = requireRow(unwrapSupabaseMaybeSingle(result), "OpinionPackage", reportingPackageId);

    await this.logActivity({
      reportingPackageId,
      engagementId: updated.engagement_id,
      organizationId: updated.organization_id,
      workspaceId: updated.workspace_id,
      action: OPINION_ACTIVITY_ACTIONS.VERSION_RESTORED,
      summary: `Restored from version ${version.version_number}`,
      metadata: { versionId: version.id, versionNumber: version.version_number },
    });

    return updated;
  }

  async listActivity(reportingPackageId: string, limit = 100): Promise<OpinionActivity[]> {
    const result = await this.client
      .from("opinion_activity")
      .select("*")
      .eq("opinion_package_id", reportingPackageId)
      .order("created_at", { ascending: false })
      .limit(limit);
    return unwrapSupabaseList(result);
  }

  async listVersions(reportingPackageId: string): Promise<OpinionVersion[]> {
    const result = await this.client
      .from("opinion_versions")
      .select("*")
      .eq("opinion_package_id", reportingPackageId)
      .order("version_number", { ascending: false });
    return unwrapSupabaseList(result);
  }

  async logActivity(input: LogOpinionActivityInput): Promise<OpinionActivity> {
    const result = await this.client
      .from("opinion_activity")
      .insert({
        opinion_package_id: input.reportingPackageId,
        engagement_id: input.engagementId,
        organization_id: input.organizationId,
        workspace_id: input.workspaceId,
        created_by: this.userId,
        action: input.action,
        summary: input.summary ?? null,
        metadata: (input.metadata ?? {}) as Database["public"]["Tables"]["opinion_activity"]["Insert"]["metadata"],
      })
      .select("*")
      .single();

    return requireRow(unwrapSupabaseResult(result), "OpinionActivity");
  }

  async recomputeProgress(reportingPackageId: string): Promise<OpinionPackage> {
    const pkg = await this.findById(reportingPackageId);
    if (!pkg) {
      throw new NotFoundError("Review package not found", { id: reportingPackageId });
    }

    const items = await this.listItems(reportingPackageId);
    const pendingCount = items.filter((item) =>
      ["pending", "under_review"].includes(item.section_status),
    ).length;
    const returnedCount = items.filter((item) => item.section_status === "returned").length;
    const resolvedCount = items.filter((item) => item.section_status === "resolved").length;
    const pendingSectionsCount = items.filter(
      (item) => item.section_status !== "resolved" && item.severity === "high",
    ).length;

    const progressPct = computeOpinionProgress({
      totalItems: items.length,
      resolvedCount,
      pendingCount,
      returnedCount,
      hasSummaryNotes: Boolean(pkg.summary_notes?.trim()),
      packageStatus: pkg.package_status,
    });

    const result = await applyActiveFilter(
      this.client
        .from("opinion_packages")
        .update({
          progress_pct: progressPct,
          pending_count: pendingCount,
          returned_count: returnedCount,
          resolved_count: resolvedCount,
          pending_sections_count: pendingSectionsCount,
        })
        .eq("id", reportingPackageId)
        .select("*"),
    ).maybeSingle();

    return requireRow(unwrapSupabaseMaybeSingle(result), "OpinionPackage", reportingPackageId);
  }

  async validateWorkspaceOwnership(
    reportingPackageId: string,
    workspaceId: string,
  ): Promise<OpinionPackage> {
    const pkg = await this.findByIdAnyState(reportingPackageId);
    if (!pkg) {
      throw new NotFoundError("Review package not found", { id: reportingPackageId });
    }

    if (pkg.workspace_id !== workspaceId) {
      throw new AuthorizationError("Review package does not belong to the active workspace", {
        reportingPackageId,
        workspaceId,
      });
    }

    return pkg;
  }

  private async requirePackageForMutation(reportingPackageId: string): Promise<OpinionPackage> {
    const pkg = await this.findById(reportingPackageId);
    if (!pkg) {
      throw new NotFoundError("Review package not found", { id: reportingPackageId });
    }
    this.ensurePackageIsEditable(pkg);
    return pkg;
  }

  private async requireItem(reportingPackageId: string, itemId: string): Promise<OpinionSection> {
    const result = await applyActiveFilter(
      this.client.from("opinion_sections").select("*").eq("id", itemId),
    ).maybeSingle();
    const item = requireRow(unwrapSupabaseMaybeSingle(result), "OpinionSection", itemId);

    if (item.opinion_package_id !== reportingPackageId) {
      throw new ValidationError("Review item does not belong to this review package");
    }

    return item;
  }

  private async requireComment(reportingPackageId: string, commentId: string): Promise<OpinionComment> {
    const result = await applyActiveFilter(
      this.client.from("opinion_comments").select("*").eq("id", commentId),
    ).maybeSingle();
    const comment = requireRow(unwrapSupabaseMaybeSingle(result), "OpinionComment", commentId);

    if (comment.opinion_package_id !== reportingPackageId) {
      throw new ValidationError("Review comment does not belong to this review package");
    }

    return comment;
  }

  private async requireCommentAnyState(
    reportingPackageId: string,
    commentId: string,
  ): Promise<OpinionComment> {
    const result = await this.client
      .from("opinion_comments")
      .select("*")
      .eq("id", commentId)
      .maybeSingle();
    const comment = requireRow(unwrapSupabaseMaybeSingle(result), "OpinionComment", commentId);

    if (comment.opinion_package_id !== reportingPackageId) {
      throw new ValidationError("Review comment does not belong to this review package");
    }

    return comment;
  }

  private async markItemsUnderReview(reportingPackageId: string): Promise<void> {
    const items = await this.listItems(reportingPackageId);
    const pendingItems = items.filter((item) => item.section_status === "pending");

    for (const item of pendingItems) {
      await applyActiveFilter(
        this.client
          .from("opinion_sections")
          .update({ section_status: "under_review" })
          .eq("id", item.id),
      );
    }

    await this.recomputeProgress(reportingPackageId);
  }

  private ensurePackageIsEditable(pkg: OpinionPackage): void {
    if (
      LOCKED_OPINION_STATUSES.includes(
        pkg.package_status as (typeof LOCKED_OPINION_STATUSES)[number],
      )
    ) {
      throw new ValidationError(
        `Review package is locked in status "${pkg.package_status}"`,
      );
    }
  }
}
