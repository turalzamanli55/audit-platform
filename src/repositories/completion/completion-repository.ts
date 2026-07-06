import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables, TablesInsert, TablesUpdate } from "@/types/supabase";
import type { RepositoryContext } from "@/types/context";
import type { SeedCompletionItemCandidate } from "@/types/completion";
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
import { LOCKED_COMPLETION_STATUSES, COMPLETION_ACTIVITY_ACTIONS } from "@/constants/completion";
import { computeCompletionProgress } from "@/lib/completion/completion-module-rules";

export type CompletionPackage = Tables<"completion_packages">;
export type CompletionItem = Tables<"completion_items">;
export type CompletionComment = Tables<"completion_comments">;
export type CompletionVersion = Tables<"completion_versions">;
export type CompletionActivity = Tables<"completion_activity">;

export type CreateCompletionPackageInput = Pick<
  TablesInsert<"completion_packages">,
  "organization_id" | "workspace_id" | "engagement_id" | "audit_plan_id" | "review_package_id"
>;

export type UpdateCompletionPackageInput = Partial<
  Pick<
    TablesUpdate<"completion_packages">,
    | "package_status"
    | "package_version"
    | "progress_pct"
    | "pending_count"
    | "returned_count"
    | "resolved_count"
    | "outstanding_count"
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
  reviewPackageId: string;
  commentType?: TablesInsert<"completion_comments">["comment_type"];
  body: string;
  parentCommentId?: string | null;
  reviewItemId?: string | null;
  mentions?: string[];
  attachmentMetadata?: Array<{ name: string; type?: string; size?: number; url?: string }>;
};

export type UpdateCommentInput = {
  commentId: string;
  reviewPackageId: string;
  expectedVersion: number;
  body: string;
  mentions?: string[];
  attachmentMetadata?: Array<{ name: string; type?: string; size?: number; url?: string }>;
};

export type UpdateCompletionItemInput = {
  reviewPackageId: string;
  itemId: string;
  expectedItemVersion: number;
  assignedReviewerId?: string | null;
  priority?: string | null;
  severity?: string | null;
  dueDate?: string | null;
  itemStatus?: TablesUpdate<"completion_items">["item_status"];
};

export type LogCompletionActivityInput = {
  reviewPackageId: string;
  engagementId: string;
  organizationId: string;
  workspaceId: string;
  action: string;
  summary?: string | null;
  metadata?: Record<string, unknown>;
};

export class CompletionRepository extends AuthenticatedRepository {
  constructor(client: SupabaseClient<Database>, context: RepositoryContext) {
    super(client, context);
  }

  async findById(id: string): Promise<CompletionPackage | null> {
    const result = await applyActiveFilter(
      this.client.from("completion_packages").select("*").eq("id", id),
    ).maybeSingle();
    return unwrapSupabaseMaybeSingle(result);
  }

  async findByIdAnyState(id: string): Promise<CompletionPackage | null> {
    const result = await this.client
      .from("completion_packages")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    return unwrapSupabaseMaybeSingle(result);
  }

  async findByEngagementId(engagementId: string): Promise<CompletionPackage | null> {
    const result = await applyActiveFilter(
      this.client.from("completion_packages").select("*").eq("engagement_id", engagementId),
    ).maybeSingle();
    return unwrapSupabaseMaybeSingle(result);
  }

  async findByEngagementIdAnyState(engagementId: string): Promise<CompletionPackage | null> {
    const result = await this.client
      .from("completion_packages")
      .select("*")
      .eq("engagement_id", engagementId)
      .maybeSingle();
    return unwrapSupabaseMaybeSingle(result);
  }

  async createPackage(input: CreateCompletionPackageInput): Promise<CompletionPackage> {
    const existing = await this.findByEngagementId(input.engagement_id);
    if (existing) {
      throw new ValidationError("Review package already exists for this engagement");
    }

    const result = await this.client
      .from("completion_packages")
      .insert({
        ...input,
        package_status: "draft",
      })
      .select("*")
      .single();

    const pkg = requireRow(unwrapSupabaseResult(result), "CompletionPackage");

    await this.logActivity({
      reviewPackageId: pkg.id,
      engagementId: pkg.engagement_id,
      organizationId: pkg.organization_id,
      workspaceId: pkg.workspace_id,
      action: COMPLETION_ACTIVITY_ACTIONS.CREATED,
      summary: "Review package initiated from fieldwork",
      metadata: { packageVersion: pkg.package_version },
    });

    await this.syncItemsFromModules(pkg.id);
    return (await this.findById(pkg.id)) ?? pkg;
  }

  async updatePackage(
    id: string,
    expectedVersion: number,
    input: UpdateCompletionPackageInput,
  ): Promise<CompletionPackage> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new NotFoundError("Review package not found", { id });
    }

    this.ensurePackageIsEditable(existing);
    assertVersionMatch(existing.version, expectedVersion, "CompletionPackage");

    const result = await applyActiveFilter(
      this.client
        .from("completion_packages")
        .update(input)
        .eq("id", id)
        .eq("version", expectedVersion)
        .select("*"),
    ).maybeSingle();

    const pkg = requireRow(unwrapSupabaseMaybeSingle(result), "CompletionPackage", id);

    await this.logActivity({
      reviewPackageId: pkg.id,
      engagementId: pkg.engagement_id,
      organizationId: pkg.organization_id,
      workspaceId: pkg.workspace_id,
      action: COMPLETION_ACTIVITY_ACTIONS.UPDATED,
      summary: "Review package updated",
      metadata: { version: pkg.version },
    });

    await this.recomputeProgress(pkg.id);
    return pkg;
  }

  async archivePackage(id: string, expectedVersion: number): Promise<CompletionPackage> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new NotFoundError("Review package not found", { id });
    }
    assertVersionMatch(existing.version, expectedVersion, "CompletionPackage");

    const result = await applyActiveFilter(
      this.client
        .from("completion_packages")
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

    const pkg = requireRow(unwrapSupabaseMaybeSingle(result), "CompletionPackage", id);

    await this.logActivity({
      reviewPackageId: pkg.id,
      engagementId: pkg.engagement_id,
      organizationId: pkg.organization_id,
      workspaceId: pkg.workspace_id,
      action: COMPLETION_ACTIVITY_ACTIONS.ARCHIVED,
      summary: "Review package archived",
      metadata: { version: pkg.version },
    });

    return pkg;
  }

  async restorePackage(id: string, expectedVersion: number): Promise<CompletionPackage> {
    const existing = await this.findByIdAnyState(id);
    if (!existing) {
      throw new NotFoundError("Review package not found", { id });
    }
    if (!existing.deleted_at && existing.status !== "archived") {
      throw new ValidationError("Review package is not archived");
    }

    assertVersionMatch(existing.version, expectedVersion, "CompletionPackage");

    const result = await this.client
      .from("completion_packages")
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

    const pkg = requireRow(unwrapSupabaseMaybeSingle(result), "CompletionPackage", id);

    await this.logActivity({
      reviewPackageId: pkg.id,
      engagementId: pkg.engagement_id,
      organizationId: pkg.organization_id,
      workspaceId: pkg.workspace_id,
      action: COMPLETION_ACTIVITY_ACTIONS.RESTORED,
      summary: "Review package restored",
      metadata: { version: pkg.version },
    });

    return pkg;
  }

  async submitForReview(id: string, expectedVersion: number): Promise<CompletionPackage> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new NotFoundError("Review package not found", { id });
    }
    this.ensurePackageIsEditable(existing);
    assertVersionMatch(existing.version, expectedVersion, "CompletionPackage");

    const result = await applyActiveFilter(
      this.client
        .from("completion_packages")
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

    const pkg = requireRow(unwrapSupabaseMaybeSingle(result), "CompletionPackage", id);

    await this.markItemsUnderReview(pkg.id);

    await this.logActivity({
      reviewPackageId: pkg.id,
      engagementId: pkg.engagement_id,
      organizationId: pkg.organization_id,
      workspaceId: pkg.workspace_id,
      action: COMPLETION_ACTIVITY_ACTIONS.SUBMITTED,
      summary: "Review package submitted for approval",
      metadata: { packageVersion: pkg.package_version, version: pkg.version },
    });

    return pkg;
  }

  async returnForRevision(
    id: string,
    expectedVersion: number,
    returnNotes: string | null,
  ): Promise<CompletionPackage> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new NotFoundError("Review package not found", { id });
    }
    assertVersionMatch(existing.version, expectedVersion, "CompletionPackage");

    const result = await applyActiveFilter(
      this.client
        .from("completion_packages")
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

    const pkg = requireRow(unwrapSupabaseMaybeSingle(result), "CompletionPackage", id);

    await this.logActivity({
      reviewPackageId: pkg.id,
      engagementId: pkg.engagement_id,
      organizationId: pkg.organization_id,
      workspaceId: pkg.workspace_id,
      action: COMPLETION_ACTIVITY_ACTIONS.RETURNED,
      summary: returnNotes ?? "Review package returned for revision",
      metadata: { packageVersion: pkg.package_version, version: pkg.version },
    });

    return pkg;
  }

  async approve(id: string, expectedVersion: number): Promise<CompletionPackage> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new NotFoundError("Review package not found", { id });
    }
    assertVersionMatch(existing.version, expectedVersion, "CompletionPackage");

    const result = await applyActiveFilter(
      this.client
        .from("completion_packages")
        .update({
          package_status: "approved",
          approved_at: new Date().toISOString(),
          approved_by: this.userId,
        })
        .eq("id", id)
        .eq("version", expectedVersion)
        .select("*"),
    ).maybeSingle();

    const pkg = requireRow(unwrapSupabaseMaybeSingle(result), "CompletionPackage", id);

    await this.logActivity({
      reviewPackageId: pkg.id,
      engagementId: pkg.engagement_id,
      organizationId: pkg.organization_id,
      workspaceId: pkg.workspace_id,
      action: COMPLETION_ACTIVITY_ACTIONS.APPROVED,
      summary: "Review package approved",
      metadata: { approvedBy: this.userId, packageVersion: pkg.package_version },
    });

    await this.recomputeProgress(pkg.id);
    return pkg;
  }

  async createVersion(
    reviewPackageId: string,
    changeSummary?: string | null,
  ): Promise<CompletionVersion> {
    const pkg = await this.findById(reviewPackageId);
    if (!pkg) {
      throw new NotFoundError("Review package not found", { id: reviewPackageId });
    }

    const [items, comments] = await Promise.all([
      this.listItems(reviewPackageId),
      this.listComments(reviewPackageId),
    ]);

    const nextVersionNumber = pkg.package_version + 1;
    const snapshot = {
      package: pkg,
      items,
      comments,
    };

    const versionResult = await this.client
      .from("completion_versions")
      .insert({
        completion_package_id: pkg.id,
        engagement_id: pkg.engagement_id,
        organization_id: pkg.organization_id,
        workspace_id: pkg.workspace_id,
        version_number: nextVersionNumber,
        snapshot: snapshot as Database["public"]["Tables"]["completion_versions"]["Insert"]["snapshot"],
        change_summary: changeSummary ?? null,
        created_by: this.userId,
      })
      .select("*")
      .single();

    const version = requireRow(unwrapSupabaseResult(versionResult), "CompletionVersion");

    await this.client
      .from("completion_packages")
      .update({ package_version: nextVersionNumber })
      .eq("id", pkg.id);

    await this.logActivity({
      reviewPackageId: pkg.id,
      engagementId: pkg.engagement_id,
      organizationId: pkg.organization_id,
      workspaceId: pkg.workspace_id,
      action: COMPLETION_ACTIVITY_ACTIONS.VERSION_CREATED,
      summary: changeSummary ?? `Version ${nextVersionNumber} created`,
      metadata: { versionNumber: nextVersionNumber, versionId: version.id },
    });

    return version;
  }

  async syncItemsFromModules(reviewPackageId: string): Promise<CompletionItem[]> {
    const pkg = await this.findById(reviewPackageId);
    if (!pkg) {
      throw new NotFoundError("Completion package not found", { id: reviewPackageId });
    }

    const candidates = this.buildDefaultCompletionItems();
    const existingItems = await this.listItems(reviewPackageId, { includeInactive: true });
    const syncedItems: CompletionItem[] = [];

    for (const candidate of candidates) {
      const existing = existingItems.find((item) => item.item_type === candidate.itemType);

      if (existing) {
        if (existing.deleted_at) continue;
        syncedItems.push(existing);
        continue;
      }

      const insertResult = await this.client
        .from("completion_items")
        .insert({
          completion_package_id: pkg.id,
          engagement_id: pkg.engagement_id,
          organization_id: pkg.organization_id,
          workspace_id: pkg.workspace_id,
          item_type: candidate.itemType,
          title: candidate.title,
          description: candidate.description ?? null,
          severity: candidate.severity ?? null,
          href: candidate.href ?? null,
          sort_order: candidate.sortOrder,
          item_status: "pending",
        })
        .select("*")
        .single();

      const item = requireRow(unwrapSupabaseResult(insertResult), "CompletionItem");
      syncedItems.push(item);
    }

    if (syncedItems.length > 0) {
      await this.logActivity({
        reviewPackageId: pkg.id,
        engagementId: pkg.engagement_id,
        organizationId: pkg.organization_id,
        workspaceId: pkg.workspace_id,
        action: COMPLETION_ACTIVITY_ACTIONS.ITEM_SYNCED,
        summary: `Seeded ${candidates.length} completion checklist items`,
        metadata: { syncedCount: candidates.length },
      });
    }

    await this.recomputeProgress(reviewPackageId);
    return syncedItems;
  }

  private buildDefaultCompletionItems(): SeedCompletionItemCandidate[] {
    const defaults: Array<{ itemType: SeedCompletionItemCandidate["itemType"]; title: string }> = [
      { itemType: "checklist", title: "Completion checklist sign-off" },
      { itemType: "outstanding_item", title: "Outstanding completion items" },
      { itemType: "management_letter", title: "Management letter" },
      { itemType: "subsequent_events", title: "Subsequent events review" },
      { itemType: "going_concern", title: "Going concern assessment" },
      { itemType: "representation_letter", title: "Representation letter" },
      { itemType: "final_analytics", title: "Final analytical procedures" },
    ];

    return defaults.map((entry, index) => ({
      itemType: entry.itemType,
      title: entry.title,
      description: null,
      sortOrder: index,
    }));
  }

  async resolveItem(
    reviewPackageId: string,
    itemId: string,
    expectedItemVersion: number,
  ): Promise<CompletionItem> {
    await this.requirePackageForMutation(reviewPackageId);
    const item = await this.requireItem(reviewPackageId, itemId);
    assertVersionMatch(item.version, expectedItemVersion, "CompletionItem");

    const result = await applyActiveFilter(
      this.client
        .from("completion_items")
        .update({
          item_status: "resolved",
          resolved_at: new Date().toISOString(),
          resolved_by: this.userId,
          return_notes: null,
        })
        .eq("id", itemId)
        .eq("version", expectedItemVersion)
        .select("*"),
    ).maybeSingle();

    const updated = requireRow(unwrapSupabaseMaybeSingle(result), "CompletionItem", itemId);

    await this.logActivity({
      reviewPackageId,
      engagementId: updated.engagement_id,
      organizationId: updated.organization_id,
      workspaceId: updated.workspace_id,
      action: COMPLETION_ACTIVITY_ACTIONS.ITEM_RESOLVED,
      summary: `Review item "${updated.title}" resolved`,
      metadata: { itemId: updated.id },
    });

    await this.recomputeProgress(reviewPackageId);
    return updated;
  }

  async returnItem(
    reviewPackageId: string,
    itemId: string,
    expectedItemVersion: number,
    returnNotes: string | null,
  ): Promise<CompletionItem> {
    await this.requirePackageForMutation(reviewPackageId);
    const item = await this.requireItem(reviewPackageId, itemId);
    assertVersionMatch(item.version, expectedItemVersion, "CompletionItem");

    const result = await applyActiveFilter(
      this.client
        .from("completion_items")
        .update({
          item_status: "returned",
          return_notes: returnNotes,
          resolved_at: null,
          resolved_by: null,
        })
        .eq("id", itemId)
        .eq("version", expectedItemVersion)
        .select("*"),
    ).maybeSingle();

    const updated = requireRow(unwrapSupabaseMaybeSingle(result), "CompletionItem", itemId);

    await this.logActivity({
      reviewPackageId,
      engagementId: updated.engagement_id,
      organizationId: updated.organization_id,
      workspaceId: updated.workspace_id,
      action: COMPLETION_ACTIVITY_ACTIONS.ITEM_RETURNED,
      summary: returnNotes ?? `Review item "${updated.title}" returned`,
      metadata: { itemId: updated.id },
    });

    await this.recomputeProgress(reviewPackageId);
    return updated;
  }

  async reopenItem(
    reviewPackageId: string,
    itemId: string,
    expectedItemVersion: number,
  ): Promise<CompletionItem> {
    await this.requirePackageForMutation(reviewPackageId);
    const item = await this.requireItem(reviewPackageId, itemId);
    assertVersionMatch(item.version, expectedItemVersion, "CompletionItem");

    if (item.item_status !== "resolved") {
      throw new ValidationError("Only resolved review items can be reopened");
    }

    const result = await applyActiveFilter(
      this.client
        .from("completion_items")
        .update({
          item_status: "pending",
          resolved_at: null,
          resolved_by: null,
        })
        .eq("id", itemId)
        .eq("version", expectedItemVersion)
        .select("*"),
    ).maybeSingle();

    const updated = requireRow(unwrapSupabaseMaybeSingle(result), "CompletionItem", itemId);

    await this.logActivity({
      reviewPackageId,
      engagementId: updated.engagement_id,
      organizationId: updated.organization_id,
      workspaceId: updated.workspace_id,
      action: COMPLETION_ACTIVITY_ACTIONS.ITEM_REOPENED,
      summary: `Review item "${updated.title}" reopened`,
      metadata: { itemId: updated.id },
    });

    await this.recomputeProgress(reviewPackageId);
    return updated;
  }

  async updateItem(input: UpdateCompletionItemInput): Promise<CompletionItem> {
    await this.requirePackageForMutation(input.reviewPackageId);
    const item = await this.requireItem(input.reviewPackageId, input.itemId);
    assertVersionMatch(item.version, input.expectedItemVersion, "CompletionItem");

    const updatePayload: TablesUpdate<"completion_items"> = {};
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
    if (input.itemStatus !== undefined) {
      updatePayload.item_status = input.itemStatus;
      if (input.itemStatus === "under_review") {
        updatePayload.resolved_at = null;
        updatePayload.resolved_by = null;
      }
    }

    const result = await applyActiveFilter(
      this.client
        .from("completion_items")
        .update(updatePayload)
        .eq("id", input.itemId)
        .eq("version", input.expectedItemVersion)
        .select("*"),
    ).maybeSingle();

    const updated = requireRow(unwrapSupabaseMaybeSingle(result), "CompletionItem", input.itemId);

    const action =
      input.assignedReviewerId !== undefined
        ? COMPLETION_ACTIVITY_ACTIONS.ITEM_ASSIGNED
        : COMPLETION_ACTIVITY_ACTIONS.ITEM_UPDATED;

    await this.logActivity({
      reviewPackageId: input.reviewPackageId,
      engagementId: updated.engagement_id,
      organizationId: updated.organization_id,
      workspaceId: updated.workspace_id,
      action,
      summary: `Review item "${updated.title}" updated`,
      metadata: { itemId: updated.id },
    });

    await this.recomputeProgress(input.reviewPackageId);
    return updated;
  }

  async addComment(input: AddCommentInput): Promise<CompletionComment> {
    const pkg = await this.requirePackageForMutation(input.reviewPackageId);

    const result = await this.client
      .from("completion_comments")
      .insert({
        completion_package_id: pkg.id,
        engagement_id: pkg.engagement_id,
        organization_id: pkg.organization_id,
        workspace_id: pkg.workspace_id,
        comment_type: input.commentType ?? "completion",
        body: input.body.trim(),
        parent_comment_id: input.parentCommentId ?? null,
        completion_item_id: input.reviewItemId ?? null,
        mentions: (input.mentions ?? []) as Database["public"]["Tables"]["completion_comments"]["Insert"]["mentions"],
        attachment_metadata: (input.attachmentMetadata ??
          []) as Database["public"]["Tables"]["completion_comments"]["Insert"]["attachment_metadata"],
      })
      .select("*")
      .single();

    const comment = requireRow(unwrapSupabaseResult(result), "CompletionComment");

    await this.logActivity({
      reviewPackageId: pkg.id,
      engagementId: pkg.engagement_id,
      organizationId: pkg.organization_id,
      workspaceId: pkg.workspace_id,
      action: COMPLETION_ACTIVITY_ACTIONS.COMMENT_ADDED,
      summary: "Review comment added",
      metadata: { commentId: comment.id, commentType: comment.comment_type },
    });

    return comment;
  }

  async listItems(
    reviewPackageId: string,
    options?: { includeInactive?: boolean },
  ): Promise<CompletionItem[]> {
    let query = this.client
      .from("completion_items")
      .select("*")
      .eq("completion_package_id", reviewPackageId)
      .order("sort_order", { ascending: true });

    if (!options?.includeInactive) {
      query = applyActiveFilter(query);
    }

    const result = await query;
    return unwrapSupabaseList(result);
  }

  async listComments(reviewPackageId: string): Promise<CompletionComment[]> {
    const result = await applyActiveFilter(
      this.client
        .from("completion_comments")
        .select("*")
        .eq("completion_package_id", reviewPackageId)
        .order("created_at", { ascending: false }),
    );
    return unwrapSupabaseList(result);
  }

  async listCommentsAnyState(reviewPackageId: string): Promise<CompletionComment[]> {
    const result = await this.client
      .from("completion_comments")
      .select("*")
      .eq("completion_package_id", reviewPackageId)
      .order("created_at", { ascending: false });
    return unwrapSupabaseList(result);
  }

  async updateComment(input: UpdateCommentInput): Promise<CompletionComment> {
    const pkg = await this.requirePackageForMutation(input.reviewPackageId);
    const comment = await this.requireComment(input.reviewPackageId, input.commentId);
    assertVersionMatch(comment.version, input.expectedVersion, "CompletionComment");

    const result = await applyActiveFilter(
      this.client
        .from("completion_comments")
        .update({
          body: input.body.trim(),
          mentions: (input.mentions ??
            comment.mentions) as Database["public"]["Tables"]["completion_comments"]["Update"]["mentions"],
          attachment_metadata: (input.attachmentMetadata ??
            comment.attachment_metadata) as Database["public"]["Tables"]["completion_comments"]["Update"]["attachment_metadata"],
        })
        .eq("id", input.commentId)
        .eq("version", input.expectedVersion)
        .select("*"),
    ).maybeSingle();

    const updated = requireRow(unwrapSupabaseMaybeSingle(result), "CompletionComment", input.commentId);

    await this.logActivity({
      reviewPackageId: pkg.id,
      engagementId: pkg.engagement_id,
      organizationId: pkg.organization_id,
      workspaceId: pkg.workspace_id,
      action: COMPLETION_ACTIVITY_ACTIONS.COMMENT_UPDATED,
      summary: "Review comment updated",
      metadata: { commentId: updated.id },
    });

    return updated;
  }

  async archiveComment(reviewPackageId: string, commentId: string, expectedVersion: number): Promise<CompletionComment> {
    const pkg = await this.requirePackageForMutation(reviewPackageId);
    const comment = await this.requireComment(reviewPackageId, commentId);
    assertVersionMatch(comment.version, expectedVersion, "CompletionComment");

    const result = await applyActiveFilter(
      this.client
        .from("completion_comments")
        .update({
          deleted_at: new Date().toISOString(),
          deleted_by: this.userId,
          status: "archived",
        })
        .eq("id", commentId)
        .eq("version", expectedVersion)
        .select("*"),
    ).maybeSingle();

    const updated = requireRow(unwrapSupabaseMaybeSingle(result), "CompletionComment", commentId);

    await this.logActivity({
      reviewPackageId: pkg.id,
      engagementId: pkg.engagement_id,
      organizationId: pkg.organization_id,
      workspaceId: pkg.workspace_id,
      action: COMPLETION_ACTIVITY_ACTIONS.COMMENT_ARCHIVED,
      summary: "Review comment archived",
      metadata: { commentId: updated.id },
    });

    return updated;
  }

  async restoreComment(reviewPackageId: string, commentId: string, expectedVersion: number): Promise<CompletionComment> {
    const comment = await this.requireCommentAnyState(reviewPackageId, commentId);
    assertVersionMatch(comment.version, expectedVersion, "CompletionComment");

    const result = await this.client
      .from("completion_comments")
      .update({
        deleted_at: null,
        deleted_by: null,
        status: "active",
      })
      .eq("id", commentId)
      .eq("version", expectedVersion)
      .select("*")
      .maybeSingle();

    const updated = requireRow(unwrapSupabaseMaybeSingle(result), "CompletionComment", commentId);

    await this.logActivity({
      reviewPackageId,
      engagementId: updated.engagement_id,
      organizationId: updated.organization_id,
      workspaceId: updated.workspace_id,
      action: COMPLETION_ACTIVITY_ACTIONS.COMMENT_RESTORED,
      summary: "Review comment restored",
      metadata: { commentId: updated.id },
    });

    return updated;
  }

  async resolveComment(reviewPackageId: string, commentId: string, expectedVersion: number): Promise<CompletionComment> {
    const pkg = await this.requirePackageForMutation(reviewPackageId);
    const comment = await this.requireComment(reviewPackageId, commentId);
    assertVersionMatch(comment.version, expectedVersion, "CompletionComment");

    const result = await applyActiveFilter(
      this.client
        .from("completion_comments")
        .update({
          resolved_at: new Date().toISOString(),
          resolved_by: this.userId,
        })
        .eq("id", commentId)
        .eq("version", expectedVersion)
        .select("*"),
    ).maybeSingle();

    const updated = requireRow(unwrapSupabaseMaybeSingle(result), "CompletionComment", commentId);

    await this.logActivity({
      reviewPackageId: pkg.id,
      engagementId: pkg.engagement_id,
      organizationId: pkg.organization_id,
      workspaceId: pkg.workspace_id,
      action: COMPLETION_ACTIVITY_ACTIONS.COMMENT_RESOLVED,
      summary: "Review comment resolved",
      metadata: { commentId: updated.id },
    });

    return updated;
  }

  async unresolveComment(reviewPackageId: string, commentId: string, expectedVersion: number): Promise<CompletionComment> {
    const pkg = await this.requirePackageForMutation(reviewPackageId);
    const comment = await this.requireComment(reviewPackageId, commentId);
    assertVersionMatch(comment.version, expectedVersion, "CompletionComment");

    const result = await applyActiveFilter(
      this.client
        .from("completion_comments")
        .update({
          resolved_at: null,
          resolved_by: null,
        })
        .eq("id", commentId)
        .eq("version", expectedVersion)
        .select("*"),
    ).maybeSingle();

    const updated = requireRow(unwrapSupabaseMaybeSingle(result), "CompletionComment", commentId);

    await this.logActivity({
      reviewPackageId: pkg.id,
      engagementId: pkg.engagement_id,
      organizationId: pkg.organization_id,
      workspaceId: pkg.workspace_id,
      action: COMPLETION_ACTIVITY_ACTIONS.COMMENT_REOPENED,
      summary: "Review comment reopened",
      metadata: { commentId: updated.id },
    });

    return updated;
  }

  async findVersionById(reviewPackageId: string, versionId: string): Promise<CompletionVersion | null> {
    const result = await this.client
      .from("completion_versions")
      .select("*")
      .eq("completion_package_id", reviewPackageId)
      .eq("id", versionId)
      .maybeSingle();
    return unwrapSupabaseMaybeSingle(result);
  }

  async restoreVersion(
    reviewPackageId: string,
    versionId: string,
    expectedPackageVersion: number,
  ): Promise<CompletionPackage> {
    const pkg = await this.findById(reviewPackageId);
    if (!pkg) {
      throw new NotFoundError("Review package not found", { id: reviewPackageId });
    }
    this.ensurePackageIsEditable(pkg);
    assertVersionMatch(pkg.version, expectedPackageVersion, "CompletionPackage");

    const version = await this.findVersionById(reviewPackageId, versionId);
    if (!version) {
      throw new NotFoundError("Review version not found", { id: versionId });
    }

    const snapshot = version.snapshot as {
      package?: { summary_notes?: string | null };
    };

    const result = await applyActiveFilter(
      this.client
        .from("completion_packages")
        .update({
          summary_notes: snapshot.package?.summary_notes ?? pkg.summary_notes,
        })
        .eq("id", reviewPackageId)
        .eq("version", expectedPackageVersion)
        .select("*"),
    ).maybeSingle();

    const updated = requireRow(unwrapSupabaseMaybeSingle(result), "CompletionPackage", reviewPackageId);

    await this.logActivity({
      reviewPackageId,
      engagementId: updated.engagement_id,
      organizationId: updated.organization_id,
      workspaceId: updated.workspace_id,
      action: COMPLETION_ACTIVITY_ACTIONS.VERSION_RESTORED,
      summary: `Restored from version ${version.version_number}`,
      metadata: { versionId: version.id, versionNumber: version.version_number },
    });

    return updated;
  }

  async listActivity(reviewPackageId: string, limit = 100): Promise<CompletionActivity[]> {
    const result = await this.client
      .from("completion_activity")
      .select("*")
      .eq("completion_package_id", reviewPackageId)
      .order("created_at", { ascending: false })
      .limit(limit);
    return unwrapSupabaseList(result);
  }

  async listVersions(reviewPackageId: string): Promise<CompletionVersion[]> {
    const result = await this.client
      .from("completion_versions")
      .select("*")
      .eq("completion_package_id", reviewPackageId)
      .order("version_number", { ascending: false });
    return unwrapSupabaseList(result);
  }

  async logActivity(input: LogCompletionActivityInput): Promise<CompletionActivity> {
    const result = await this.client
      .from("completion_activity")
      .insert({
        completion_package_id: input.reviewPackageId,
        engagement_id: input.engagementId,
        organization_id: input.organizationId,
        workspace_id: input.workspaceId,
        created_by: this.userId,
        action: input.action,
        summary: input.summary ?? null,
        metadata: (input.metadata ?? {}) as Database["public"]["Tables"]["completion_activity"]["Insert"]["metadata"],
      })
      .select("*")
      .single();

    return requireRow(unwrapSupabaseResult(result), "CompletionActivity");
  }

  async recomputeProgress(reviewPackageId: string): Promise<CompletionPackage> {
    const pkg = await this.findById(reviewPackageId);
    if (!pkg) {
      throw new NotFoundError("Review package not found", { id: reviewPackageId });
    }

    const items = await this.listItems(reviewPackageId);
    const pendingCount = items.filter((item) =>
      ["pending", "under_review"].includes(item.item_status),
    ).length;
    const returnedCount = items.filter((item) => item.item_status === "returned").length;
    const resolvedCount = items.filter((item) => item.item_status === "resolved").length;
    const outstandingCount = items.filter(
      (item) => item.item_status !== "resolved" && item.severity === "high",
    ).length;

    const progressPct = computeCompletionProgress({
      totalItems: items.length,
      resolvedCount,
      pendingCount,
      returnedCount,
      hasSummaryNotes: Boolean(pkg.summary_notes?.trim()),
      packageStatus: pkg.package_status,
    });

    const result = await applyActiveFilter(
      this.client
        .from("completion_packages")
        .update({
          progress_pct: progressPct,
          pending_count: pendingCount,
          returned_count: returnedCount,
          resolved_count: resolvedCount,
          outstanding_count: outstandingCount,
        })
        .eq("id", reviewPackageId)
        .select("*"),
    ).maybeSingle();

    return requireRow(unwrapSupabaseMaybeSingle(result), "CompletionPackage", reviewPackageId);
  }

  async validateWorkspaceOwnership(
    reviewPackageId: string,
    workspaceId: string,
  ): Promise<CompletionPackage> {
    const pkg = await this.findByIdAnyState(reviewPackageId);
    if (!pkg) {
      throw new NotFoundError("Review package not found", { id: reviewPackageId });
    }

    if (pkg.workspace_id !== workspaceId) {
      throw new AuthorizationError("Review package does not belong to the active workspace", {
        reviewPackageId,
        workspaceId,
      });
    }

    return pkg;
  }

  private async requirePackageForMutation(reviewPackageId: string): Promise<CompletionPackage> {
    const pkg = await this.findById(reviewPackageId);
    if (!pkg) {
      throw new NotFoundError("Review package not found", { id: reviewPackageId });
    }
    this.ensurePackageIsEditable(pkg);
    return pkg;
  }

  private async requireItem(reviewPackageId: string, itemId: string): Promise<CompletionItem> {
    const result = await applyActiveFilter(
      this.client.from("completion_items").select("*").eq("id", itemId),
    ).maybeSingle();
    const item = requireRow(unwrapSupabaseMaybeSingle(result), "CompletionItem", itemId);

    if (item.completion_package_id !== reviewPackageId) {
      throw new ValidationError("Review item does not belong to this review package");
    }

    return item;
  }

  private async requireComment(reviewPackageId: string, commentId: string): Promise<CompletionComment> {
    const result = await applyActiveFilter(
      this.client.from("completion_comments").select("*").eq("id", commentId),
    ).maybeSingle();
    const comment = requireRow(unwrapSupabaseMaybeSingle(result), "CompletionComment", commentId);

    if (comment.completion_package_id !== reviewPackageId) {
      throw new ValidationError("Review comment does not belong to this review package");
    }

    return comment;
  }

  private async requireCommentAnyState(
    reviewPackageId: string,
    commentId: string,
  ): Promise<CompletionComment> {
    const result = await this.client
      .from("completion_comments")
      .select("*")
      .eq("id", commentId)
      .maybeSingle();
    const comment = requireRow(unwrapSupabaseMaybeSingle(result), "CompletionComment", commentId);

    if (comment.completion_package_id !== reviewPackageId) {
      throw new ValidationError("Review comment does not belong to this review package");
    }

    return comment;
  }

  private async markItemsUnderReview(reviewPackageId: string): Promise<void> {
    const items = await this.listItems(reviewPackageId);
    const pendingItems = items.filter((item) => item.item_status === "pending");

    for (const item of pendingItems) {
      await applyActiveFilter(
        this.client
          .from("completion_items")
          .update({ item_status: "under_review" })
          .eq("id", item.id),
      );
    }

    await this.recomputeProgress(reviewPackageId);
  }

  private ensurePackageIsEditable(pkg: CompletionPackage): void {
    if (
      LOCKED_COMPLETION_STATUSES.includes(
        pkg.package_status as (typeof LOCKED_COMPLETION_STATUSES)[number],
      )
    ) {
      throw new ValidationError(
        `Review package is locked in status "${pkg.package_status}"`,
      );
    }
  }
}
