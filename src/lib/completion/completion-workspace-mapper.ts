import type { Engagement } from "@/repositories/engagement/engagement-repository";
import { computeCompletionProgress } from "@/lib/completion/completion-module-rules";
import type { CompletionWorkspaceView, CompletionCommentView } from "@/lib/completion/completion-workspace-view";
import type {
  CompletionCommentType,
  CompletionItemStatus,
  CompletionItemType,
  CompletionPackageStatus,
} from "@/types/completion";

export type CompletionPackageRecord = {
  id: string;
  engagement_id: string;
  audit_plan_id: string;
  review_package_id: string | null;
  package_status: string;
  package_version: number;
  progress_pct: number;
  pending_count: number;
  returned_count: number;
  resolved_count: number;
  outstanding_count: number;
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

export type CompletionItemRecord = {
  id: string;
  item_type: CompletionItemType;
  item_status: CompletionItemStatus;
  title: string;
  description: string | null;
  severity: string | null;
  priority: string | null;
  due_date: string | null;
  href: string | null;
  assigned_reviewer_id: string | null;
  return_notes: string | null;
  resolved_at: string | null;
  sort_order: number;
  version: number;
  created_at: string;
  updated_at: string;
};

export type CompletionCommentRecord = {
  id: string;
  comment_type: CompletionCommentType;
  body: string;
  parent_comment_id: string | null;
  completion_item_id: string | null;
  mentions: unknown;
  attachment_metadata: unknown;
  resolved_at: string | null;
  created_by: string | null;
  deleted_at: string | null;
  status: string;
  version: number;
  created_at: string;
  updated_at: string;
};

export type CompletionVersionRecord = {
  id: string;
  version_number: number;
  change_summary: string | null;
  snapshot: unknown;
  created_at: string;
};

export function toCompletionWorkspaceView(
  pkg: CompletionPackageRecord,
  engagement: Engagement,
  companyName: string,
  items: CompletionItemRecord[],
  comments: CompletionCommentRecord[],
  versions: CompletionVersionRecord[],
): CompletionWorkspaceView {
  const itemViews = items.map((item) => ({
    id: item.id,
    itemType: item.item_type,
    itemStatus: item.item_status,
    title: item.title,
    description: item.description,
    severity: item.severity,
    priority: item.priority,
    dueDate: item.due_date,
    href: item.href,
    assignedReviewerId: item.assigned_reviewer_id,
    returnNotes: item.return_notes,
    resolvedAt: item.resolved_at,
    sortOrder: item.sort_order,
    version: item.version,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  }));

  const commentViews = comments.map((comment) => ({
    id: comment.id,
    commentType: comment.comment_type,
    body: comment.body,
    parentCommentId: comment.parent_comment_id,
    completionItemId: comment.completion_item_id,
    mentions: Array.isArray(comment.mentions) ? (comment.mentions as string[]) : [],
    attachments: Array.isArray(comment.attachment_metadata)
      ? (comment.attachment_metadata as CompletionCommentView["attachments"])
      : [],
    resolvedAt: comment.resolved_at,
    createdBy: comment.created_by,
    version: comment.version,
    isArchived: Boolean(comment.deleted_at) || comment.status === "archived",
    createdAt: comment.created_at,
    updatedAt: comment.updated_at,
  }));

  const latestVersionNumber = versions.length
    ? Math.max(...versions.map((version) => version.version_number))
    : pkg.package_version;

  const versionViews = versions.map((version) => ({
    id: version.id,
    versionNumber: version.version_number,
    changeSummary: version.change_summary,
    snapshot:
      version.snapshot && typeof version.snapshot === "object"
        ? (version.snapshot as Record<string, unknown>)
        : null,
    isLatest: version.version_number === latestVersionNumber,
    createdAt: version.created_at,
  }));

  const pendingCount = items.filter((item) =>
    ["pending", "under_review"].includes(item.item_status),
  ).length;
  const returnedCount = items.filter((item) => item.item_status === "returned").length;
  const resolvedCount = items.filter((item) => item.item_status === "resolved").length;

  const progressPct = computeCompletionProgress({
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
    reviewPackageId: pkg.review_package_id,
    packageStatus: pkg.package_status as CompletionPackageStatus,
    packageVersion: pkg.package_version,
    progressPct: pkg.progress_pct ?? progressPct,
    pendingCount: pkg.pending_count ?? pendingCount,
    returnedCount: pkg.returned_count ?? returnedCount,
    resolvedCount: pkg.resolved_count ?? resolvedCount,
    outstandingCount: pkg.outstanding_count,
    summaryNotes: pkg.summary_notes,
    items: itemViews,
    comments: commentViews,
    reviewerNotes: commentViews.filter((comment) => comment.commentType === "reviewer"),
    completionComments: commentViews.filter((comment) => comment.commentType === "completion"),
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
