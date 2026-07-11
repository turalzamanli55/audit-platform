import "server-only";

import type { Locale } from "@/i18n";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { OpinionActivityView } from "@/lib/opinion/opinion-workspace-view";
import type { OpinionWorkspaceView } from "@/lib/opinion/opinion-workspace-view";
import type {
  OpinionCommandCenterData,
  ReviewCommandKpi,
  OpinionWorkflowStep,
} from "@/types/opinion-command-center";

type CommandCenterLabels = Dictionary["opinion"]["workspace"]["commandCenter"];

const WORKFLOW_STEP_IDS = [
  "draft",
  "submitted",
  "under_review",
  "returned",
  "approved",
] as const;

function formatRelativeTime(locale: Locale, createdAt: string): string {
  const date = new Date(createdAt);
  const diffMs = date.getTime() - Date.now();
  const diffMinutes = Math.round(diffMs / 60_000);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  if (Math.abs(diffMinutes) < 60) return rtf.format(diffMinutes, "minute");
  const diffHours = Math.round(diffMinutes / 60);
  if (Math.abs(diffHours) < 24) return rtf.format(diffHours, "hour");
  const diffDays = Math.round(diffHours / 24);
  if (Math.abs(diffDays) < 7) return rtf.format(diffDays, "day");
  return new Intl.DateTimeFormat(locale, { month: "short", day: "numeric" }).format(date);
}

function formatDateTime(locale: Locale, iso: string | null): string | null {
  if (!iso) return null;
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

function resolveCurrentWorkflowStep(review: OpinionWorkspaceView): string {
  if (review.packageStatus === "approved") return "approved";
  if (review.packageStatus === "returned") return "returned";
  if (review.packageStatus === "under_review") return "under_review";
  if (review.packageStatus === "submitted") return "submitted";
  if (review.submittedAt) return "submitted";
  return "draft";
}

function buildWorkflowSteps(
  review: OpinionWorkspaceView,
  labels: CommandCenterLabels,
): { steps: OpinionWorkflowStep[]; current: string } {
  const current = resolveCurrentWorkflowStep(review);
  const currentIndex = WORKFLOW_STEP_IDS.indexOf(current as (typeof WORKFLOW_STEP_IDS)[number]);

  const stepLabels: Record<string, string> = {
    draft: labels.stepDraft,
    submitted: labels.stepSubmitted,
    under_review: labels.stepUnderReview,
    returned: labels.stepReturned,
    approved: labels.stepApproved,
  };

  const steps: OpinionWorkflowStep[] = WORKFLOW_STEP_IDS.map((id, index) => ({
    id,
    label: stepLabels[id] ?? id,
    status:
      index < currentIndex ? "complete" : index === currentIndex ? "current" : "upcoming",
  }));

  return { steps, current };
}

function buildRecentChanges(
  review: OpinionWorkspaceView,
  locale: Locale,
  labels: CommandCenterLabels,
  statusLabels: Record<string, string>,
): OpinionCommandCenterData["recentChanges"] {
  const events: OpinionCommandCenterData["recentChanges"] = [];

  if (review.approvedAt) {
    events.push({
      id: `approved-${review.approvedAt}`,
      title: statusLabels.approved ?? labels.changeApproved,
      description: labels.changeApprovedDescription,
      time: formatRelativeTime(locale, review.approvedAt),
    });
  }
  if (review.returnedAt) {
    events.push({
      id: `returned-${review.returnedAt}`,
      title: statusLabels.returned ?? labels.changeReturned,
      description: review.returnNotes?.trim() || labels.changeReturnedDescription,
      time: formatRelativeTime(locale, review.returnedAt),
    });
  }
  if (review.submittedAt) {
    events.push({
      id: `submitted-${review.submittedAt}`,
      title: statusLabels.submitted ?? labels.changeSubmitted,
      description: labels.changeSubmittedDescription,
      time: formatRelativeTime(locale, review.submittedAt),
    });
  }

  for (const version of review.versions.slice(0, 4)) {
    events.push({
      id: version.id,
      title: `${labels.versionLabel} ${version.versionNumber}`,
      description: version.changeSummary?.trim() || labels.versionCreated,
      time: formatRelativeTime(locale, version.createdAt),
    });
  }

  return events.slice(0, 8);
}

function mapItem(
  review: OpinionWorkspaceView,
  item: OpinionWorkspaceView["items"][number],
  locale: string,
  sectionTypeLabels: Record<string, string>,
  sectionStatusLabels: Record<string, string>,
): OpinionCommandCenterData["reviewQueue"][number] {
  const base = `/${locale}/app/engagements/${review.engagementSlug}/opinion`;
  return {
    id: item.id,
    title: item.title,
    sectionType: sectionTypeLabels[item.sectionType] ?? item.sectionType,
    sourceEntityType: item.sectionType,
    sectionStatus: sectionStatusLabels[item.sectionStatus] ?? item.sectionStatus,
    severity: item.severity,
    assignedReviewerId: item.assignedReviewerId,
    href: item.href ?? `${base}/opinion-type`,
  };
}

export function loadOpinionCommandCenter(input: {
  locale: Locale;
  opinion: OpinionWorkspaceView;
  activity?: OpinionActivityView;
  labels: CommandCenterLabels;
  statusLabels: Record<string, string>;
  sectionTypeLabels: Record<string, string>;
  sectionStatusLabels: Record<string, string>;
  commentTypeLabels: Record<string, string>;
}): OpinionCommandCenterData {
  const {
    locale,
    opinion: review,
    activity,
    labels,
    statusLabels,
    sectionTypeLabels,
    sectionStatusLabels,
    commentTypeLabels,
  } = input;
  const base = `/${locale}/app/engagements/${review.engagementSlug}/opinion`;

  const { steps: workflowSteps, current: currentWorkflowStep } = buildWorkflowSteps(
    review,
    labels,
  );

  const reviewQueueCount = review.pendingReviewCount;
  const approvalVariant =
    review.packageStatus === "approved"
      ? "success"
      : review.packageStatus === "submitted" || review.packageStatus === "under_review"
        ? "warning"
        : review.packageStatus === "returned"
          ? "destructive"
          : "default";

  const pendingItems = review.items.filter((item) =>
    ["pending", "under_review"].includes(item.sectionStatus),
  );
  const returnedItems = review.items.filter((item) => item.sectionStatus === "returned");
  const resolvedItems = review.items.filter((item) => item.sectionStatus === "resolved");

  const moduleCounts = review.items.reduce<Record<string, number>>((counts, item) => {
    counts[item.sectionType] = (counts[item.sectionType] ?? 0) + 1;
    return counts;
  }, {});

  const statusCounts = review.items.reduce<Record<string, number>>((counts, item) => {
    counts[item.sectionStatus] = (counts[item.sectionStatus] ?? 0) + 1;
    return counts;
  }, {});

  const executive: ReviewCommandKpi[] = [
    {
      id: "pending",
      label: labels.kpiPendingReview,
      value: String(review.pendingCount),
      hint: labels.hintPendingReview,
      href: `${base}/outstanding-items`,
      variant: review.pendingCount > 0 ? "warning" : "default",
    },
    {
      id: "findings",
      label: labels.kpiOutstandingItems,
      value: String(review.pendingSectionsCount),
      hint: labels.hintOutstandingItems,
      href: `${base}/outstanding-items`,
      variant: review.pendingSectionsCount > 0 ? "warning" : "default",
    },
    {
      id: "returned",
      label: labels.kpiReturned,
      value: String(review.returnedCount),
      hint: labels.hintReturned,
      href: `${base}/checklist`,
      variant: review.returnedCount > 0 ? "destructive" : "default",
    },
    {
      id: "resolved",
      label: labels.kpiResolved,
      value: String(review.resolvedCount),
      hint: labels.hintResolved,
      href: `${base}/checklist`,
      variant: review.resolvedCount > 0 ? "success" : "default",
    },
  ];

  const reviewSummary: ReviewCommandKpi[] = [
    {
      id: "progress",
      label: labels.kpiProgress,
      value: `${review.progressPct}%`,
      hint: labels.hintProgress,
    },
    {
      id: "workflow",
      label: labels.kpiWorkflow,
      value: statusLabels[review.packageStatus] ?? review.packageStatus,
      hint: labels.hintWorkflow,
      variant: approvalVariant,
    },
    {
      id: "status",
      label: labels.kpiStatus,
      value: statusLabels[review.packageStatus] ?? review.packageStatus,
      hint: `${labels.packageVersion} ${review.packageVersion}`,
      variant: approvalVariant,
    },
    {
      id: "version",
      label: labels.kpiVersion,
      value: String(review.packageVersion),
      hint: labels.hintVersion,
      href: `${base}/versions`,
    },
  ];

  const reviewMetrics: ReviewCommandKpi[] = [
    {
      id: "pending-review",
      label: labels.kpiPendingReview,
      value: String(reviewQueueCount),
      hint: labels.hintPendingReview,
      variant: reviewQueueCount > 0 ? "warning" : "default",
    },
    {
      id: "last-update",
      label: labels.kpiLastUpdate,
      value: formatDateTime(locale, review.updatedAt) ?? labels.notSet,
      hint: labels.hintLastUpdate,
    },
    {
      id: "reviewer",
      label: labels.kpiReviewer,
      value: labels.reviewerNotAssigned,
      hint: labels.hintReviewer,
    },
  ];

  const mapComment = (
    comment: OpinionWorkspaceView["comments"][number],
  ): OpinionCommandCenterData["comments"][number] => ({
    id: comment.id,
    body: comment.body.trim().slice(0, 160),
    type: commentTypeLabels[comment.commentType] ?? comment.commentType,
    time: formatRelativeTime(locale, comment.createdAt),
    href: `${base}/comments`,
  });

  const comments = review.comments.slice(0, 6).map(mapComment);
  const completionComments = review.reviewerNotes.slice(0, 6).map(mapComment);
  const recentChanges = buildRecentChanges(review, locale, labels, statusLabels);

  const activityFeed =
    activity?.entries.slice(0, 8).map((entry) => ({
      id: entry.id,
      title: entry.action,
      description: entry.summary?.trim() || labels.notSet,
      time: formatRelativeTime(locale, entry.createdAt),
    })) ?? recentChanges;

  const versions = review.versions.slice(0, 6).map((version) => ({
    id: version.id,
    versionNumber: version.versionNumber,
    summary: version.changeSummary?.trim() || labels.versionCreated,
    time: formatRelativeTime(locale, version.createdAt),
    href: `${base}/versions`,
  }));

  return {
    executive,
    reviewSummary,
    reviewMetrics,
    workflowSteps,
    currentWorkflowStep,
    moduleBuckets: Object.entries(moduleCounts).map(([module, count]) => ({
      id: module,
      label: sectionTypeLabels[module] ?? module,
      count,
      href: `${base}/checklist`,
    })),
    statusBuckets: Object.entries(statusCounts).map(([status, count]) => ({
      id: status,
      label: sectionStatusLabels[status] ?? status,
      count,
      href: `${base}/checklist`,
    })),
    reviewQueue: pendingItems.slice(0, 8).map((item) =>
      mapItem(review, item, locale, sectionTypeLabels, sectionStatusLabels),
    ),
    returnedItems: returnedItems.slice(0, 6).map((item) =>
      mapItem(review, item, locale, sectionTypeLabels, sectionStatusLabels),
    ),
    resolvedItems: resolvedItems.slice(0, 6).map((item) =>
      mapItem(review, item, locale, sectionTypeLabels, sectionStatusLabels),
    ),
    completionComments,
    comments,
    versions,
    versionTimeline: versions,
    recentChanges,
    activityFeed,
    reviewQueueCount,
    approvalStatus: statusLabels[review.packageStatus] ?? review.packageStatus,
    approvalVariant,
    lastUpdated: formatDateTime(locale, review.updatedAt),
    assignedReviewer: null,
    summaryNotes: review.summaryNotes?.trim() || null,
  };
}
