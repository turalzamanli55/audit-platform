import { COMPLETION_ACTIVITY_ACTIONS } from "@/constants/completion";
import type {
  CompletionWorkspaceSection,
  CompletionWorkspaceView,
} from "@/lib/completion/completion-workspace-view";

export type CompletionWorkspaceNavItem = {
  id: CompletionWorkspaceSection;
  label: string;
  href: string;
};

export type CompletionWorkspaceNavGroup = {
  id: "overview" | "queue" | "findings" | "governance" | "admin";
  label: string;
  items: CompletionWorkspaceNavItem[];
};

export type CompletionWorkspaceLabels = {
  navAriaLabel: string;
  navOverview: string;
  navChecklist: string;
  navOutstandingItems: string;
  navOutstandingItemsPending: string;
  navChecklistResolved: string;
  navManagementLetter: string;
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
  summaryOutstandingItems: string;
  summaryPendingReview: string;
  navGroups: {
    overview: string;
    queue: string;
    findings: string;
    governance: string;
    admin: string;
  };
  sections: Record<CompletionWorkspaceSection, { title: string; description: string }>;
  historyActions: Record<string, string>;
};

export type CompletionCommandCenterLabels = {
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
  kpiOutstandingItems: string;
  kpiReturned: string;
  kpiResolved: string;
  kpiProgress: string;
  kpiWorkflow: string;
  kpiStatus: string;
  kpiVersion: string;
  kpiLastUpdate: string;
  kpiReviewer: string;
  hintPendingReview: string;
  hintOutstandingItems: string;
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
  emptyChecklist: string;
  emptyChecklistDescription: string;
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

export function buildCompletionWorkspaceNavItems(
  locale: string,
  engagementSlug: string,
  labels: Pick<
    CompletionWorkspaceLabels,
    | "navOverview"
    | "navChecklist"
    | "navOutstandingItems"
    | "navOutstandingItemsPending"
    | "navChecklistResolved"
    | "navManagementLetter"
    | "navComments"
    | "navHistory"
    | "navVersions"
    | "navSettings"
  >,
): CompletionWorkspaceNavItem[] {
  const base = `/${locale}/app/engagements/${engagementSlug}/review`;
  return [
    { id: "overview", label: labels.navOverview, href: base },
    { id: "checklist", label: labels.navChecklist, href: `${base}/checklist` },
    { id: "outstanding-items", label: labels.navOutstandingItems, href: `${base}/outstanding-items` },
    { id: "outstanding-items", label: labels.navOutstandingItemsPending, href: `${base}/outstanding-items` },
    { id: "checklist", label: labels.navChecklistResolved, href: `${base}/checklist` },
    { id: "management-letter", label: labels.navManagementLetter, href: `${base}/management-letter` },
    { id: "comments", label: labels.navComments, href: `${base}/comments` },
    { id: "history", label: labels.navHistory, href: `${base}/history` },
    { id: "versions", label: labels.navVersions, href: `${base}/versions` },
    { id: "settings", label: labels.navSettings, href: `${base}/settings` },
  ];
}

export function buildCompletionWorkspaceNavGroups(
  locale: string,
  engagementSlug: string,
  labels: Pick<
    CompletionWorkspaceLabels,
    | "navOverview"
    | "navChecklist"
    | "navOutstandingItems"
    | "navOutstandingItemsPending"
    | "navChecklistResolved"
    | "navManagementLetter"
    | "navComments"
    | "navHistory"
    | "navVersions"
    | "navSettings"
    | "navGroups"
  >,
): CompletionWorkspaceNavGroup[] {
  const items = buildCompletionWorkspaceNavItems(locale, engagementSlug, labels);
  const byId = (id: CompletionWorkspaceSection) => items.find((item) => item.id === id)!;

  const overviewIds = ["overview"] as const;
  const queueIds = ["checklist", "outstanding-items", "checklist"] as const;
  const findingsIds = ["outstanding-items"] as const;
  const governanceIds = ["management-letter", "comments", "history", "versions"] as const;
  const adminIds = ["settings"] as const;

  return [
    { id: "overview", label: labels.navGroups.overview, items: overviewIds.map(byId) },
    { id: "queue", label: labels.navGroups.queue, items: queueIds.map(byId) },
    { id: "findings", label: labels.navGroups.findings, items: findingsIds.map(byId) },
    { id: "governance", label: labels.navGroups.governance, items: governanceIds.map(byId) },
    { id: "admin", label: labels.navGroups.admin, items: adminIds.map(byId) },
  ];
}

export function completionSectionTitle(
  section: CompletionWorkspaceSection,
  labels: Pick<CompletionWorkspaceLabels, "sections">,
): string {
  return labels.sections[section]?.title ?? section;
}

export function completionSectionDescription(
  section: CompletionWorkspaceSection,
  labels: Pick<CompletionWorkspaceLabels, "sections">,
): string | undefined {
  return labels.sections[section]?.description;
}

export function buildCompletionOverviewCards(
  review: CompletionWorkspaceView,
  labels: Pick<
    CompletionWorkspaceLabels,
    | "summaryStatus"
    | "summaryVersion"
    | "summaryProgress"
    | "summaryPending"
    | "summaryReturned"
    | "summaryResolved"
    | "summaryOutstandingItems"
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
      label: labels.summaryOutstandingItems,
      value: String(review.outstandingCount),
    },
    {
      id: "pendingReview",
      label: labels.summaryPendingReview,
      value: String(review.pendingReviewCount),
    },
  ];
}

export function formatCompletionActivityAction(
  action: string,
  actionLabels: CompletionWorkspaceLabels["historyActions"],
): string {
  const map: Record<string, string> = {
    [COMPLETION_ACTIVITY_ACTIONS.CREATED]: actionLabels[COMPLETION_ACTIVITY_ACTIONS.CREATED] ?? action,
    [COMPLETION_ACTIVITY_ACTIONS.UPDATED]: actionLabels[COMPLETION_ACTIVITY_ACTIONS.UPDATED] ?? action,
    [COMPLETION_ACTIVITY_ACTIONS.ARCHIVED]: actionLabels[COMPLETION_ACTIVITY_ACTIONS.ARCHIVED] ?? action,
    [COMPLETION_ACTIVITY_ACTIONS.RESTORED]: actionLabels[COMPLETION_ACTIVITY_ACTIONS.RESTORED] ?? action,
    [COMPLETION_ACTIVITY_ACTIONS.SUBMITTED]: actionLabels[COMPLETION_ACTIVITY_ACTIONS.SUBMITTED] ?? action,
    [COMPLETION_ACTIVITY_ACTIONS.RETURNED]: actionLabels[COMPLETION_ACTIVITY_ACTIONS.RETURNED] ?? action,
    [COMPLETION_ACTIVITY_ACTIONS.APPROVED]: actionLabels[COMPLETION_ACTIVITY_ACTIONS.APPROVED] ?? action,
    [COMPLETION_ACTIVITY_ACTIONS.ITEM_SYNCED]:
      actionLabels[COMPLETION_ACTIVITY_ACTIONS.ITEM_SYNCED] ?? action,
    [COMPLETION_ACTIVITY_ACTIONS.ITEM_RESOLVED]:
      actionLabels[COMPLETION_ACTIVITY_ACTIONS.ITEM_RESOLVED] ?? action,
    [COMPLETION_ACTIVITY_ACTIONS.ITEM_RETURNED]:
      actionLabels[COMPLETION_ACTIVITY_ACTIONS.ITEM_RETURNED] ?? action,
    [COMPLETION_ACTIVITY_ACTIONS.COMMENT_ADDED]:
      actionLabels[COMPLETION_ACTIVITY_ACTIONS.COMMENT_ADDED] ?? action,
    [COMPLETION_ACTIVITY_ACTIONS.VERSION_CREATED]:
      actionLabels[COMPLETION_ACTIVITY_ACTIONS.VERSION_CREATED] ?? action,
  };

  return map[action] ?? action;
}

export function formatCompletionActivitySummary(summary: string | null): string {
  const normalized = summary?.trim();
  return normalized && normalized.length > 0 ? normalized : "—";
}

export function formatReviewCount(template: string, count: number): string {
  return template.replace("{count}", String(count));
}
