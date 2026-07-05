import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables, TablesInsert, TablesUpdate } from "@/types/supabase";
import type { RepositoryContext } from "@/types/context";
import type { SyncReviewItemCandidate } from "@/types/review";
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
import { LOCKED_REVIEW_STATUSES, REVIEW_ACTIVITY_ACTIONS } from "@/constants/review";
import { computeReviewProgress } from "@/lib/review/review-rules";

export type ReviewPackage = Tables<"review_packages">;
export type ReviewItem = Tables<"review_items">;
export type ReviewComment = Tables<"review_comments">;
export type ReviewVersion = Tables<"review_versions">;
export type ReviewActivity = Tables<"review_activity">;

export type CreateReviewPackageInput = Pick<
  TablesInsert<"review_packages">,
  "organization_id" | "workspace_id" | "engagement_id" | "audit_plan_id" | "fieldwork_package_id"
>;

export type UpdateReviewPackageInput = Partial<
  Pick<
    TablesUpdate<"review_packages">,
    | "package_status"
    | "package_version"
    | "progress_pct"
    | "pending_count"
    | "returned_count"
    | "resolved_count"
    | "open_findings_count"
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
  commentType?: TablesInsert<"review_comments">["comment_type"];
  body: string;
};

export type LogReviewActivityInput = {
  reviewPackageId: string;
  engagementId: string;
  organizationId: string;
  workspaceId: string;
  action: string;
  summary?: string | null;
  metadata?: Record<string, unknown>;
};

export class ReviewRepository extends AuthenticatedRepository {
  constructor(client: SupabaseClient<Database>, context: RepositoryContext) {
    super(client, context);
  }

  async findById(id: string): Promise<ReviewPackage | null> {
    const result = await applyActiveFilter(
      this.client.from("review_packages").select("*").eq("id", id),
    ).maybeSingle();
    return unwrapSupabaseMaybeSingle(result);
  }

  async findByIdAnyState(id: string): Promise<ReviewPackage | null> {
    const result = await this.client
      .from("review_packages")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    return unwrapSupabaseMaybeSingle(result);
  }

  async findByEngagementId(engagementId: string): Promise<ReviewPackage | null> {
    const result = await applyActiveFilter(
      this.client.from("review_packages").select("*").eq("engagement_id", engagementId),
    ).maybeSingle();
    return unwrapSupabaseMaybeSingle(result);
  }

  async findByEngagementIdAnyState(engagementId: string): Promise<ReviewPackage | null> {
    const result = await this.client
      .from("review_packages")
      .select("*")
      .eq("engagement_id", engagementId)
      .maybeSingle();
    return unwrapSupabaseMaybeSingle(result);
  }

  async createPackage(input: CreateReviewPackageInput): Promise<ReviewPackage> {
    const existing = await this.findByEngagementId(input.engagement_id);
    if (existing) {
      throw new ValidationError("Review package already exists for this engagement");
    }

    const result = await this.client
      .from("review_packages")
      .insert({
        ...input,
        package_status: "draft",
      })
      .select("*")
      .single();

    const pkg = requireRow(unwrapSupabaseResult(result), "ReviewPackage");

    await this.logActivity({
      reviewPackageId: pkg.id,
      engagementId: pkg.engagement_id,
      organizationId: pkg.organization_id,
      workspaceId: pkg.workspace_id,
      action: REVIEW_ACTIVITY_ACTIONS.CREATED,
      summary: "Review package initiated from fieldwork",
      metadata: { packageVersion: pkg.package_version },
    });

    await this.syncItemsFromModules(pkg.id);
    return (await this.findById(pkg.id)) ?? pkg;
  }

  async updatePackage(
    id: string,
    expectedVersion: number,
    input: UpdateReviewPackageInput,
  ): Promise<ReviewPackage> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new NotFoundError("Review package not found", { id });
    }

    this.ensurePackageIsEditable(existing);
    assertVersionMatch(existing.version, expectedVersion, "ReviewPackage");

    const result = await applyActiveFilter(
      this.client
        .from("review_packages")
        .update(input)
        .eq("id", id)
        .eq("version", expectedVersion)
        .select("*"),
    ).maybeSingle();

    const pkg = requireRow(unwrapSupabaseMaybeSingle(result), "ReviewPackage", id);

    await this.logActivity({
      reviewPackageId: pkg.id,
      engagementId: pkg.engagement_id,
      organizationId: pkg.organization_id,
      workspaceId: pkg.workspace_id,
      action: REVIEW_ACTIVITY_ACTIONS.UPDATED,
      summary: "Review package updated",
      metadata: { version: pkg.version },
    });

    await this.recomputeProgress(pkg.id);
    return pkg;
  }

  async archivePackage(id: string, expectedVersion: number): Promise<ReviewPackage> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new NotFoundError("Review package not found", { id });
    }
    assertVersionMatch(existing.version, expectedVersion, "ReviewPackage");

    const result = await applyActiveFilter(
      this.client
        .from("review_packages")
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

    const pkg = requireRow(unwrapSupabaseMaybeSingle(result), "ReviewPackage", id);

    await this.logActivity({
      reviewPackageId: pkg.id,
      engagementId: pkg.engagement_id,
      organizationId: pkg.organization_id,
      workspaceId: pkg.workspace_id,
      action: REVIEW_ACTIVITY_ACTIONS.ARCHIVED,
      summary: "Review package archived",
      metadata: { version: pkg.version },
    });

    return pkg;
  }

  async restorePackage(id: string, expectedVersion: number): Promise<ReviewPackage> {
    const existing = await this.findByIdAnyState(id);
    if (!existing) {
      throw new NotFoundError("Review package not found", { id });
    }
    if (!existing.deleted_at && existing.status !== "archived") {
      throw new ValidationError("Review package is not archived");
    }

    assertVersionMatch(existing.version, expectedVersion, "ReviewPackage");

    const result = await this.client
      .from("review_packages")
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

    const pkg = requireRow(unwrapSupabaseMaybeSingle(result), "ReviewPackage", id);

    await this.logActivity({
      reviewPackageId: pkg.id,
      engagementId: pkg.engagement_id,
      organizationId: pkg.organization_id,
      workspaceId: pkg.workspace_id,
      action: REVIEW_ACTIVITY_ACTIONS.RESTORED,
      summary: "Review package restored",
      metadata: { version: pkg.version },
    });

    return pkg;
  }

  async submitForReview(id: string, expectedVersion: number): Promise<ReviewPackage> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new NotFoundError("Review package not found", { id });
    }
    this.ensurePackageIsEditable(existing);
    assertVersionMatch(existing.version, expectedVersion, "ReviewPackage");

    const result = await applyActiveFilter(
      this.client
        .from("review_packages")
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

    const pkg = requireRow(unwrapSupabaseMaybeSingle(result), "ReviewPackage", id);

    await this.logActivity({
      reviewPackageId: pkg.id,
      engagementId: pkg.engagement_id,
      organizationId: pkg.organization_id,
      workspaceId: pkg.workspace_id,
      action: REVIEW_ACTIVITY_ACTIONS.SUBMITTED,
      summary: "Review package submitted for approval",
      metadata: { packageVersion: pkg.package_version, version: pkg.version },
    });

    return pkg;
  }

  async returnForRevision(
    id: string,
    expectedVersion: number,
    returnNotes: string | null,
  ): Promise<ReviewPackage> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new NotFoundError("Review package not found", { id });
    }
    assertVersionMatch(existing.version, expectedVersion, "ReviewPackage");

    const result = await applyActiveFilter(
      this.client
        .from("review_packages")
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

    const pkg = requireRow(unwrapSupabaseMaybeSingle(result), "ReviewPackage", id);

    await this.logActivity({
      reviewPackageId: pkg.id,
      engagementId: pkg.engagement_id,
      organizationId: pkg.organization_id,
      workspaceId: pkg.workspace_id,
      action: REVIEW_ACTIVITY_ACTIONS.RETURNED,
      summary: returnNotes ?? "Review package returned for revision",
      metadata: { packageVersion: pkg.package_version, version: pkg.version },
    });

    return pkg;
  }

  async approve(id: string, expectedVersion: number): Promise<ReviewPackage> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new NotFoundError("Review package not found", { id });
    }
    assertVersionMatch(existing.version, expectedVersion, "ReviewPackage");

    const result = await applyActiveFilter(
      this.client
        .from("review_packages")
        .update({
          package_status: "approved",
          approved_at: new Date().toISOString(),
          approved_by: this.userId,
        })
        .eq("id", id)
        .eq("version", expectedVersion)
        .select("*"),
    ).maybeSingle();

    const pkg = requireRow(unwrapSupabaseMaybeSingle(result), "ReviewPackage", id);

    await this.logActivity({
      reviewPackageId: pkg.id,
      engagementId: pkg.engagement_id,
      organizationId: pkg.organization_id,
      workspaceId: pkg.workspace_id,
      action: REVIEW_ACTIVITY_ACTIONS.APPROVED,
      summary: "Review package approved",
      metadata: { approvedBy: this.userId, packageVersion: pkg.package_version },
    });

    await this.recomputeProgress(pkg.id);
    return pkg;
  }

  async createVersion(
    reviewPackageId: string,
    changeSummary?: string | null,
  ): Promise<ReviewVersion> {
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
      .from("review_versions")
      .insert({
        review_package_id: pkg.id,
        engagement_id: pkg.engagement_id,
        organization_id: pkg.organization_id,
        workspace_id: pkg.workspace_id,
        version_number: nextVersionNumber,
        snapshot: snapshot as Database["public"]["Tables"]["review_versions"]["Insert"]["snapshot"],
        change_summary: changeSummary ?? null,
        created_by: this.userId,
      })
      .select("*")
      .single();

    const version = requireRow(unwrapSupabaseResult(versionResult), "ReviewVersion");

    await this.client
      .from("review_packages")
      .update({ package_version: nextVersionNumber })
      .eq("id", pkg.id);

    await this.logActivity({
      reviewPackageId: pkg.id,
      engagementId: pkg.engagement_id,
      organizationId: pkg.organization_id,
      workspaceId: pkg.workspace_id,
      action: REVIEW_ACTIVITY_ACTIONS.VERSION_CREATED,
      summary: changeSummary ?? `Version ${nextVersionNumber} created`,
      metadata: { versionNumber: nextVersionNumber, versionId: version.id },
    });

    return version;
  }

  async syncItemsFromModules(reviewPackageId: string): Promise<ReviewItem[]> {
    const pkg = await this.findById(reviewPackageId);
    if (!pkg) {
      throw new NotFoundError("Review package not found", { id: reviewPackageId });
    }

    const candidates = await this.collectPendingReviewCandidates(pkg.engagement_id);
    const existingItems = await this.listItems(reviewPackageId, { includeInactive: true });
    const syncedItems: ReviewItem[] = [];

    for (const candidate of candidates) {
      const existing = existingItems.find(
        (item) =>
          item.source_module === candidate.sourceModule &&
          item.source_entity_type === candidate.sourceEntityType &&
          item.source_entity_id === candidate.sourceEntityId,
      );

      if (existing) {
        if (existing.deleted_at) continue;

        const updateResult = await applyActiveFilter(
          this.client
            .from("review_items")
            .update({
              title: candidate.title,
              description: candidate.description ?? null,
              severity: candidate.severity ?? null,
              href: candidate.href ?? null,
              sort_order: candidate.sortOrder ?? existing.sort_order,
              item_status:
                existing.item_status === "resolved" ? "pending" : existing.item_status,
            })
            .eq("id", existing.id)
            .select("*"),
        ).maybeSingle();

        const item = requireRow(unwrapSupabaseMaybeSingle(updateResult), "ReviewItem", existing.id);
        syncedItems.push(item);
      } else {
        const insertResult = await this.client
          .from("review_items")
          .insert({
            review_package_id: pkg.id,
            engagement_id: pkg.engagement_id,
            organization_id: pkg.organization_id,
            workspace_id: pkg.workspace_id,
            source_module: candidate.sourceModule,
            source_entity_type: candidate.sourceEntityType,
            source_entity_id: candidate.sourceEntityId,
            title: candidate.title,
            description: candidate.description ?? null,
            severity: candidate.severity ?? null,
            href: candidate.href ?? null,
            sort_order: candidate.sortOrder ?? syncedItems.length,
            item_status: "pending",
          })
          .select("*")
          .single();

        const item = requireRow(unwrapSupabaseResult(insertResult), "ReviewItem");
        syncedItems.push(item);
      }
    }

    const candidateKeys = new Set(
      candidates.map(
        (candidate) =>
          `${candidate.sourceModule}:${candidate.sourceEntityType}:${candidate.sourceEntityId}`,
      ),
    );

    for (const item of existingItems) {
      if (item.deleted_at) continue;
      const key = `${item.source_module}:${item.source_entity_type}:${item.source_entity_id}`;
      if (!candidateKeys.has(key) && item.item_status !== "resolved") {
        const updateResult = await applyActiveFilter(
          this.client
            .from("review_items")
            .update({
              item_status: "resolved",
              resolved_at: new Date().toISOString(),
              resolved_by: this.userId,
            })
            .eq("id", item.id)
            .select("*"),
        ).maybeSingle();

        const resolved = requireRow(unwrapSupabaseMaybeSingle(updateResult), "ReviewItem", item.id);
        syncedItems.push(resolved);
      }
    }

    if (syncedItems.length > 0) {
      await this.logActivity({
        reviewPackageId: pkg.id,
        engagementId: pkg.engagement_id,
        organizationId: pkg.organization_id,
        workspaceId: pkg.workspace_id,
        action: REVIEW_ACTIVITY_ACTIONS.ITEM_SYNCED,
        summary: `Synced ${candidates.length} pending review items from modules`,
        metadata: { syncedCount: candidates.length },
      });
    }

    await this.recomputeProgress(reviewPackageId);
    return syncedItems;
  }

  async resolveItem(
    reviewPackageId: string,
    itemId: string,
    expectedItemVersion: number,
  ): Promise<ReviewItem> {
    await this.requirePackageForMutation(reviewPackageId);
    const item = await this.requireItem(reviewPackageId, itemId);
    assertVersionMatch(item.version, expectedItemVersion, "ReviewItem");

    const result = await applyActiveFilter(
      this.client
        .from("review_items")
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

    const updated = requireRow(unwrapSupabaseMaybeSingle(result), "ReviewItem", itemId);

    await this.logActivity({
      reviewPackageId,
      engagementId: updated.engagement_id,
      organizationId: updated.organization_id,
      workspaceId: updated.workspace_id,
      action: REVIEW_ACTIVITY_ACTIONS.ITEM_RESOLVED,
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
  ): Promise<ReviewItem> {
    await this.requirePackageForMutation(reviewPackageId);
    const item = await this.requireItem(reviewPackageId, itemId);
    assertVersionMatch(item.version, expectedItemVersion, "ReviewItem");

    const result = await applyActiveFilter(
      this.client
        .from("review_items")
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

    const updated = requireRow(unwrapSupabaseMaybeSingle(result), "ReviewItem", itemId);

    await this.logActivity({
      reviewPackageId,
      engagementId: updated.engagement_id,
      organizationId: updated.organization_id,
      workspaceId: updated.workspace_id,
      action: REVIEW_ACTIVITY_ACTIONS.ITEM_RETURNED,
      summary: returnNotes ?? `Review item "${updated.title}" returned`,
      metadata: { itemId: updated.id },
    });

    await this.recomputeProgress(reviewPackageId);
    return updated;
  }

  async addComment(input: AddCommentInput): Promise<ReviewComment> {
    const pkg = await this.requirePackageForMutation(input.reviewPackageId);

    const result = await this.client
      .from("review_comments")
      .insert({
        review_package_id: pkg.id,
        engagement_id: pkg.engagement_id,
        organization_id: pkg.organization_id,
        workspace_id: pkg.workspace_id,
        comment_type: input.commentType ?? "review",
        body: input.body.trim(),
      })
      .select("*")
      .single();

    const comment = requireRow(unwrapSupabaseResult(result), "ReviewComment");

    await this.logActivity({
      reviewPackageId: pkg.id,
      engagementId: pkg.engagement_id,
      organizationId: pkg.organization_id,
      workspaceId: pkg.workspace_id,
      action: REVIEW_ACTIVITY_ACTIONS.COMMENT_ADDED,
      summary: "Review comment added",
      metadata: { commentId: comment.id, commentType: comment.comment_type },
    });

    return comment;
  }

  async listItems(
    reviewPackageId: string,
    options?: { includeInactive?: boolean },
  ): Promise<ReviewItem[]> {
    let query = this.client
      .from("review_items")
      .select("*")
      .eq("review_package_id", reviewPackageId)
      .order("sort_order", { ascending: true });

    if (!options?.includeInactive) {
      query = applyActiveFilter(query);
    }

    const result = await query;
    return unwrapSupabaseList(result);
  }

  async listComments(reviewPackageId: string): Promise<ReviewComment[]> {
    const result = await applyActiveFilter(
      this.client
        .from("review_comments")
        .select("*")
        .eq("review_package_id", reviewPackageId)
        .order("created_at", { ascending: false }),
    );
    return unwrapSupabaseList(result);
  }

  async listActivity(reviewPackageId: string, limit = 100): Promise<ReviewActivity[]> {
    const result = await this.client
      .from("review_activity")
      .select("*")
      .eq("review_package_id", reviewPackageId)
      .order("created_at", { ascending: false })
      .limit(limit);
    return unwrapSupabaseList(result);
  }

  async listVersions(reviewPackageId: string): Promise<ReviewVersion[]> {
    const result = await this.client
      .from("review_versions")
      .select("*")
      .eq("review_package_id", reviewPackageId)
      .order("version_number", { ascending: false });
    return unwrapSupabaseList(result);
  }

  async logActivity(input: LogReviewActivityInput): Promise<ReviewActivity> {
    const result = await this.client
      .from("review_activity")
      .insert({
        review_package_id: input.reviewPackageId,
        engagement_id: input.engagementId,
        organization_id: input.organizationId,
        workspace_id: input.workspaceId,
        created_by: this.userId,
        action: input.action,
        summary: input.summary ?? null,
        metadata: (input.metadata ?? {}) as Database["public"]["Tables"]["review_activity"]["Insert"]["metadata"],
      })
      .select("*")
      .single();

    return requireRow(unwrapSupabaseResult(result), "ReviewActivity");
  }

  async recomputeProgress(reviewPackageId: string): Promise<ReviewPackage> {
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
    const openFindingsCount = items.filter(
      (item) => item.item_status !== "resolved" && item.severity === "high",
    ).length;

    const progressPct = computeReviewProgress({
      totalItems: items.length,
      resolvedCount,
      pendingCount,
      returnedCount,
      hasSummaryNotes: Boolean(pkg.summary_notes?.trim()),
      packageStatus: pkg.package_status,
    });

    const result = await applyActiveFilter(
      this.client
        .from("review_packages")
        .update({
          progress_pct: progressPct,
          pending_count: pendingCount,
          returned_count: returnedCount,
          resolved_count: resolvedCount,
          open_findings_count: openFindingsCount,
        })
        .eq("id", reviewPackageId)
        .select("*"),
    ).maybeSingle();

    return requireRow(unwrapSupabaseMaybeSingle(result), "ReviewPackage", reviewPackageId);
  }

  async validateWorkspaceOwnership(
    reviewPackageId: string,
    workspaceId: string,
  ): Promise<ReviewPackage> {
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

  private async collectPendingReviewCandidates(
    engagementId: string,
  ): Promise<SyncReviewItemCandidate[]> {
    const candidates: SyncReviewItemCandidate[] = [];
    let sortOrder = 0;

    const planResult = await applyActiveFilter(
      this.client.from("audit_plans").select("*").eq("engagement_id", engagementId),
    ).maybeSingle();
    const plan = unwrapSupabaseMaybeSingle(planResult);

    if (plan?.planning_status === "pending_review") {
      candidates.push({
        sourceModule: "planning",
        sourceEntityType: "audit_plan",
        sourceEntityId: plan.id,
        title: "Audit plan pending review",
        description: "Planning package submitted and awaiting partner review",
        sortOrder: sortOrder++,
      });
    }

    const materialityResult = await applyActiveFilter(
      this.client.from("materiality_packages").select("*").eq("engagement_id", engagementId),
    ).maybeSingle();
    const materiality = unwrapSupabaseMaybeSingle(materialityResult);

    if (
      materiality &&
      ["submitted", "under_review"].includes(materiality.package_status)
    ) {
      candidates.push({
        sourceModule: "materiality",
        sourceEntityType: "materiality_package",
        sourceEntityId: materiality.id,
        title: "Materiality package pending review",
        description: "Materiality determination submitted for review",
        sortOrder: sortOrder++,
      });
    }

    const riskResult = await applyActiveFilter(
      this.client.from("risk_assessments").select("*").eq("engagement_id", engagementId),
    ).maybeSingle();
    const risk = unwrapSupabaseMaybeSingle(riskResult);

    if (risk && ["submitted", "under_review"].includes(risk.assessment_status)) {
      candidates.push({
        sourceModule: "risk_assessment",
        sourceEntityType: "risk_assessment",
        sourceEntityId: risk.id,
        title: "Risk assessment pending review",
        description: "Risk assessment submitted for review",
        sortOrder: sortOrder++,
      });
    }

    const fieldworkResult = await applyActiveFilter(
      this.client.from("fieldwork_packages").select("*").eq("engagement_id", engagementId),
    ).maybeSingle();
    const fieldwork = unwrapSupabaseMaybeSingle(fieldworkResult);

    if (fieldwork) {
      const proceduresResult = await applyActiveFilter(
        this.client
          .from("audit_procedures")
          .select("*")
          .eq("fieldwork_package_id", fieldwork.id)
          .in("procedure_status", ["submitted_for_review", "review_in_progress"]),
      );
      const procedures = unwrapSupabaseList(proceduresResult);

      for (const procedure of procedures) {
        candidates.push({
          sourceModule: "fieldwork",
          sourceEntityType: "audit_procedure",
          sourceEntityId: procedure.id,
          title: procedure.title,
          description: procedure.description,
          sortOrder: sortOrder++,
        });
      }

      const papersResult = await applyActiveFilter(
        this.client
          .from("working_papers")
          .select("*")
          .eq("fieldwork_package_id", fieldwork.id)
          .in("paper_status", ["submitted", "under_review"]),
      );
      const papers = unwrapSupabaseList(papersResult);

      for (const paper of papers) {
        candidates.push({
          sourceModule: "fieldwork",
          sourceEntityType: "working_paper",
          sourceEntityId: paper.id,
          title: paper.title,
          description: paper.reference_code,
          sortOrder: sortOrder++,
        });
      }
    }

    return candidates;
  }

  private async requirePackageForMutation(reviewPackageId: string): Promise<ReviewPackage> {
    const pkg = await this.findById(reviewPackageId);
    if (!pkg) {
      throw new NotFoundError("Review package not found", { id: reviewPackageId });
    }
    this.ensurePackageIsEditable(pkg);
    return pkg;
  }

  private async requireItem(reviewPackageId: string, itemId: string): Promise<ReviewItem> {
    const result = await applyActiveFilter(
      this.client.from("review_items").select("*").eq("id", itemId),
    ).maybeSingle();
    const item = requireRow(unwrapSupabaseMaybeSingle(result), "ReviewItem", itemId);

    if (item.review_package_id !== reviewPackageId) {
      throw new ValidationError("Review item does not belong to this review package");
    }

    return item;
  }

  private ensurePackageIsEditable(pkg: ReviewPackage): void {
    if (
      LOCKED_REVIEW_STATUSES.includes(
        pkg.package_status as (typeof LOCKED_REVIEW_STATUSES)[number],
      )
    ) {
      throw new ValidationError(
        `Review package is locked in status "${pkg.package_status}"`,
      );
    }
  }
}
