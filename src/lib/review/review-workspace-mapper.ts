import type { Engagement } from "@/repositories/engagement/engagement-repository";
import { computeReviewProgress } from "@/lib/review/review-rules";
import type { ReviewWorkspaceView } from "@/lib/review/review-workspace-view";
import type {
  ReviewCommentType,
  ReviewItemStatus,
  ReviewPackageStatus,
  ReviewSourceModule,
} from "@/types/review";

export type ReviewPackageRecord = {
  id: string;
  engagement_id: string;
  audit_plan_id: string;
  fieldwork_package_id: string | null;
  package_status: string;
  package_version: number;
  progress_pct: number;
  pending_count: number;
  returned_count: number;
  resolved_count: number;
  open_findings_count: number;
  summary_notes: string | null;
  submitted_at: string | null;
  returned_at: string | null;
  return_notes: string | null;
  approved_at: string | null;
  status: string;
  version: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ReviewItemRecord = {
  id: string;
  source_module: ReviewSourceModule;
  source_entity_type: string;
  source_entity_id: string;
  item_status: ReviewItemStatus;
  title: string;
  description: string | null;
  severity: string | null;
  href: string | null;
  assigned_reviewer_id: string | null;
  return_notes: string | null;
  resolved_at: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type ReviewCommentRecord = {
  id: string;
  comment_type: ReviewCommentType;
  body: string;
  created_at: string;
};

export type ReviewVersionRecord = {
  id: string;
  version_number: number;
  change_summary: string | null;
  created_at: string;
};

export function toReviewWorkspaceView(
  pkg: ReviewPackageRecord,
  engagement: Engagement,
  companyName: string,
  items: ReviewItemRecord[],
  comments: ReviewCommentRecord[],
  versions: ReviewVersionRecord[],
): ReviewWorkspaceView {
  const itemViews = items.map((item) => ({
    id: item.id,
    sourceModule: item.source_module,
    sourceEntityType: item.source_entity_type,
    sourceEntityId: item.source_entity_id,
    itemStatus: item.item_status,
    title: item.title,
    description: item.description,
    severity: item.severity,
    href: item.href,
    assignedReviewerId: item.assigned_reviewer_id,
    returnNotes: item.return_notes,
    resolvedAt: item.resolved_at,
    sortOrder: item.sort_order,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  }));

  const commentViews = comments.map((comment) => ({
    id: comment.id,
    commentType: comment.comment_type,
    body: comment.body,
    createdAt: comment.created_at,
  }));

  const versionViews = versions.map((version) => ({
    id: version.id,
    versionNumber: version.version_number,
    changeSummary: version.change_summary,
    createdAt: version.created_at,
  }));

  const pendingCount = items.filter((item) =>
    ["pending", "under_review"].includes(item.item_status),
  ).length;
  const returnedCount = items.filter((item) => item.item_status === "returned").length;
  const resolvedCount = items.filter((item) => item.item_status === "resolved").length;

  const progressPct = computeReviewProgress({
    totalItems: items.length,
    resolvedCount,
    pendingCount,
    returnedCount,
    hasSummaryNotes: Boolean(pkg.summary_notes?.trim()),
    packageStatus: pkg.package_status,
  });

  const pendingReviewCount = ["submitted", "under_review"].includes(pkg.package_status) ? 1 : 0;

  return {
    id: pkg.id,
    engagementId: pkg.engagement_id,
    engagementSlug: engagement.slug,
    engagementName: engagement.name,
    companyName,
    auditPlanId: pkg.audit_plan_id,
    fieldworkPackageId: pkg.fieldwork_package_id,
    packageStatus: pkg.package_status as ReviewPackageStatus,
    packageVersion: pkg.package_version,
    progressPct: pkg.progress_pct ?? progressPct,
    pendingCount: pkg.pending_count ?? pendingCount,
    returnedCount: pkg.returned_count ?? returnedCount,
    resolvedCount: pkg.resolved_count ?? resolvedCount,
    openFindingsCount: pkg.open_findings_count,
    summaryNotes: pkg.summary_notes,
    items: itemViews,
    comments: commentViews,
    reviewerNotes: commentViews.filter((comment) => comment.commentType === "reviewer"),
    reviewComments: commentViews.filter((comment) => comment.commentType === "review"),
    internalComments: commentViews.filter((comment) => comment.commentType === "internal"),
    versions: versionViews,
    pendingReviewCount,
    status: pkg.status,
    version: pkg.version,
    isArchived: Boolean(pkg.deleted_at) || pkg.status === "archived",
    deletedAt: pkg.deleted_at,
    submittedAt: pkg.submitted_at,
    returnedAt: pkg.returned_at,
    returnNotes: pkg.return_notes,
    approvedAt: pkg.approved_at,
    createdAt: pkg.created_at,
    updatedAt: pkg.updated_at,
  };
}
