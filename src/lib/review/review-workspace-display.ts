import { REVIEW_ACTIVITY_ACTIONS } from "@/constants/review";
import type {
  ReviewWorkspaceSection,
  ReviewWorkspaceView,
} from "@/lib/review/review-workspace-view";

export type ReviewWorkspaceNavItem = {
  id: ReviewWorkspaceSection;
  label: string;
  href: string;
};

export type ReviewWorkspaceNavGroup = {
  id: "overview" | "queue" | "findings" | "governance" | "admin";
  label: string;
  items: ReviewWorkspaceNavItem[];
};

export type ReviewWorkspaceLabels = {
  navAriaLabel: string;
  navOverview: string;
  navReviewQueue: string;
  navOpenFindings: string;
  navPendingReviews: string;
  navResolvedReviews: string;
  navReviewerNotes: string;
  navComments: string;
  navHistory: string;
  navVersions: string;
  navSettings: string;
  summaryStatus: string;
  summaryVersion: string;
  summaryProgress: string;
  summaryPending: string;
  summaryReturned: string;
  summaryResolved: string;
  summaryOpenFindings: string;
  summaryPendingReview: string;
  navGroups: {
    overview: string;
    queue: string;
    findings: string;
    governance: string;
    admin: string;
  };
  sections: Record<ReviewWorkspaceSection, { title: string; description: string }>;
  historyActions: Record<string, string>;
};

export type ReviewCommandCenterLabels = {
  heroTitle: string;
  executiveTitle: string;
  summaryTitle: string;
  metricsTitle: string;
  workflowTitle: string;
  workflowDescription: string;
  reviewQueueTitle: string;
  reviewQueueDescription: string;
  returnedTitle: string;
  returnedDescription: string;
  resolvedTitle: string;
  resolvedDescription: string;
  findingsTitle: string;
  findingsDescription: string;
  activityTitle: string;
  activityDescription: string;
  recentChangesTitle: string;
  recentChangesDescription: string;
  commentsTitle: string;
  commentsDescription: string;
  reviewNotesTitle: string;
  reviewNotesDescription: string;
  versionTimelineTitle: string;
  versionTimelineDescription: string;
  stepDraft: string;
  stepSubmitted: string;
  stepUnderReview: string;
  stepReturned: string;
  stepApproved: string;
  openWorkflow: string;
  viewHistory: string;
  viewComments: string;
  packageVersion: string;
  lastUpdate: string;
  notSet: string;
  versionLabel: string;
  versionCreated: string;
  kpiPendingReview: string;
  kpiOpenFindings: string;
  kpiReturned: string;
  kpiResolved: string;
  kpiProgress: string;
  kpiWorkflow: string;
  kpiStatus: string;
  kpiVersion: string;
  kpiLastUpdate: string;
  kpiReviewer: string;
  hintPendingReview: string;
  hintOpenFindings: string;
  hintReturned: string;
  hintResolved: string;
  hintProgress: string;
  hintWorkflow: string;
  hintVersion: string;
  hintLastUpdate: string;
  hintReviewer: string;
  reviewerNotAssigned: string;
  changeApproved: string;
  changeApprovedDescription: string;
  changeReturned: string;
  changeReturnedDescription: string;
  changeSubmitted: string;
  changeSubmittedDescription: string;
  emptyReviewQueue: string;
  emptyReviewQueueDescription: string;
  emptyReturned: string;
  emptyReturnedDescription: string;
  emptyResolved: string;
  emptyResolvedDescription: string;
  emptyFindings: string;
  emptyFindingsDescription: string;
  emptyChanges: string;
  emptyChangesDescription: string;
  emptyComments: string;
  emptyCommentsDescription: string;
  emptyReviewNotes: string;
  emptyReviewNotesDescription: string;
  emptyActivity: string;
  emptyActivityDescription: string;
  emptyVersions: string;
  emptyVersionsDescription: string;
  moduleColumn: string;
  statusColumn: string;
  severityColumn: string;
  titleColumn: string;
};

export function buildReviewWorkspaceNavItems(
  locale: string,
  engagementSlug: string,
  labels: Pick<
    ReviewWorkspaceLabels,
    | "navOverview"
    | "navReviewQueue"
    | "navOpenFindings"
    | "navPendingReviews"
    | "navResolvedReviews"
    | "navReviewerNotes"
    | "navComments"
    | "navHistory"
    | "navVersions"
    | "navSettings"
  >,
): ReviewWorkspaceNavItem[] {
  const base = `/${locale}/app/engagements/${engagementSlug}/review`;
  return [
    { id: "overview", label: labels.navOverview, href: base },
    { id: "review-queue", label: labels.navReviewQueue, href: `${base}/review-queue` },
    { id: "open-findings", label: labels.navOpenFindings, href: `${base}/open-findings` },
    { id: "pending-reviews", label: labels.navPendingReviews, href: `${base}/pending-reviews` },
    { id: "resolved-reviews", label: labels.navResolvedReviews, href: `${base}/resolved-reviews` },
    { id: "reviewer-notes", label: labels.navReviewerNotes, href: `${base}/reviewer-notes` },
    { id: "comments", label: labels.navComments, href: `${base}/comments` },
    { id: "history", label: labels.navHistory, href: `${base}/history` },
    { id: "versions", label: labels.navVersions, href: `${base}/versions` },
    { id: "settings", label: labels.navSettings, href: `${base}/settings` },
  ];
}

export function buildReviewWorkspaceNavGroups(
  locale: string,
  engagementSlug: string,
  labels: Pick<
    ReviewWorkspaceLabels,
    | "navOverview"
    | "navReviewQueue"
    | "navOpenFindings"
    | "navPendingReviews"
    | "navResolvedReviews"
    | "navReviewerNotes"
    | "navComments"
    | "navHistory"
    | "navVersions"
    | "navSettings"
    | "navGroups"
  >,
): ReviewWorkspaceNavGroup[] {
  const items = buildReviewWorkspaceNavItems(locale, engagementSlug, labels);
  const byId = (id: ReviewWorkspaceSection) => items.find((item) => item.id === id)!;

  const overviewIds = ["overview"] as const;
  const queueIds = ["review-queue", "pending-reviews", "resolved-reviews"] as const;
  const findingsIds = ["open-findings"] as const;
  const governanceIds = ["reviewer-notes", "comments", "history", "versions"] as const;
  const adminIds = ["settings"] as const;

  return [
    { id: "overview", label: labels.navGroups.overview, items: overviewIds.map(byId) },
    { id: "queue", label: labels.navGroups.queue, items: queueIds.map(byId) },
    { id: "findings", label: labels.navGroups.findings, items: findingsIds.map(byId) },
    { id: "governance", label: labels.navGroups.governance, items: governanceIds.map(byId) },
    { id: "admin", label: labels.navGroups.admin, items: adminIds.map(byId) },
  ];
}

export function reviewSectionTitle(
  section: ReviewWorkspaceSection,
  labels: Pick<ReviewWorkspaceLabels, "sections">,
): string {
  return labels.sections[section]?.title ?? section;
}

export function reviewSectionDescription(
  section: ReviewWorkspaceSection,
  labels: Pick<ReviewWorkspaceLabels, "sections">,
): string | undefined {
  return labels.sections[section]?.description;
}

export function buildReviewOverviewCards(
  review: ReviewWorkspaceView,
  labels: Pick<
    ReviewWorkspaceLabels,
    | "summaryStatus"
    | "summaryVersion"
    | "summaryProgress"
    | "summaryPending"
    | "summaryReturned"
    | "summaryResolved"
    | "summaryOpenFindings"
    | "summaryPendingReview"
  >,
  statusLabels: Record<string, string>,
) {
  return [
    {
      id: "status",
      label: labels.summaryStatus,
      value: statusLabels[review.packageStatus] ?? review.packageStatus,
      hint: `${labels.summaryVersion}: ${review.packageVersion}`,
    },
    {
      id: "progress",
      label: labels.summaryProgress,
      value: `${review.progressPct}%`,
    },
    {
      id: "pending",
      label: labels.summaryPending,
      value: String(review.pendingCount),
    },
    {
      id: "returned",
      label: labels.summaryReturned,
      value: String(review.returnedCount),
    },
    {
      id: "resolved",
      label: labels.summaryResolved,
      value: String(review.resolvedCount),
    },
    {
      id: "openFindings",
      label: labels.summaryOpenFindings,
      value: String(review.openFindingsCount),
    },
    {
      id: "pendingReview",
      label: labels.summaryPendingReview,
      value: String(review.pendingReviewCount),
    },
  ];
}

export function formatReviewActivityAction(
  action: string,
  actionLabels: ReviewWorkspaceLabels["historyActions"],
): string {
  const map: Record<string, string> = {
    [REVIEW_ACTIVITY_ACTIONS.CREATED]: actionLabels[REVIEW_ACTIVITY_ACTIONS.CREATED] ?? action,
    [REVIEW_ACTIVITY_ACTIONS.UPDATED]: actionLabels[REVIEW_ACTIVITY_ACTIONS.UPDATED] ?? action,
    [REVIEW_ACTIVITY_ACTIONS.ARCHIVED]: actionLabels[REVIEW_ACTIVITY_ACTIONS.ARCHIVED] ?? action,
    [REVIEW_ACTIVITY_ACTIONS.RESTORED]: actionLabels[REVIEW_ACTIVITY_ACTIONS.RESTORED] ?? action,
    [REVIEW_ACTIVITY_ACTIONS.SUBMITTED]: actionLabels[REVIEW_ACTIVITY_ACTIONS.SUBMITTED] ?? action,
    [REVIEW_ACTIVITY_ACTIONS.RETURNED]: actionLabels[REVIEW_ACTIVITY_ACTIONS.RETURNED] ?? action,
    [REVIEW_ACTIVITY_ACTIONS.APPROVED]: actionLabels[REVIEW_ACTIVITY_ACTIONS.APPROVED] ?? action,
    [REVIEW_ACTIVITY_ACTIONS.ITEM_SYNCED]:
      actionLabels[REVIEW_ACTIVITY_ACTIONS.ITEM_SYNCED] ?? action,
    [REVIEW_ACTIVITY_ACTIONS.ITEM_RESOLVED]:
      actionLabels[REVIEW_ACTIVITY_ACTIONS.ITEM_RESOLVED] ?? action,
    [REVIEW_ACTIVITY_ACTIONS.ITEM_RETURNED]:
      actionLabels[REVIEW_ACTIVITY_ACTIONS.ITEM_RETURNED] ?? action,
    [REVIEW_ACTIVITY_ACTIONS.COMMENT_ADDED]:
      actionLabels[REVIEW_ACTIVITY_ACTIONS.COMMENT_ADDED] ?? action,
    [REVIEW_ACTIVITY_ACTIONS.VERSION_CREATED]:
      actionLabels[REVIEW_ACTIVITY_ACTIONS.VERSION_CREATED] ?? action,
  };

  return map[action] ?? action;
}

export function formatReviewActivitySummary(summary: string | null): string {
  const normalized = summary?.trim();
  return normalized && normalized.length > 0 ? normalized : "—";
}

export function formatReviewCount(template: string, count: number): string {
  return template.replace("{count}", String(count));
}
