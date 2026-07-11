import { REPORTING_ACTIVITY_ACTIONS } from "@/constants/reporting";
import type {
  ReportingWorkspaceSection,
  ReportingWorkspaceView,
} from "@/lib/reporting/reporting-workspace-view";

export type ReportingWorkspaceNavItem = {
  id: ReportingWorkspaceSection;
  label: string;
  href: string;
};

export type ReportingWorkspaceNavGroup = {
  id: "overview" | "sections" | "governance" | "admin";
  label: string;
  items: ReportingWorkspaceNavItem[];
};

export type ReportingWorkspaceLabels = {
  navAriaLabel: string;
  navOverview: string;
  navExecutiveSummary: string;
  navFinancialStatements: string;
  navIfrsNotes: string;
  navManagementLetter: string;
  navAuditFindings: string;
  navRecommendations: string;
  navAppendices: string;
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
    sections?: string;
    queue?: string;
    findings?: string;
    governance: string;
    admin: string;
  };
  sections: Record<ReportingWorkspaceSection, { title: string; description: string }>;
  historyActions: Record<string, string>;
};

export type ReportingCommandCenterLabels = Record<string, string>;

export function buildReportingWorkspaceNavItems(
  locale: string,
  engagementSlug: string,
  labels: Pick<
    ReportingWorkspaceLabels,
    | "navOverview"
    | "navExecutiveSummary"
    | "navFinancialStatements"
    | "navIfrsNotes"
    | "navManagementLetter"
    | "navAuditFindings"
    | "navRecommendations"
    | "navAppendices"
    | "navComments"
    | "navHistory"
    | "navVersions"
    | "navSettings"
  >,
): ReportingWorkspaceNavItem[] {
  const base = `/${locale}/app/engagements/${engagementSlug}/reporting`;
  return [
    { id: "overview", label: labels.navOverview, href: base },
    {
      id: "executive-summary",
      label: labels.navExecutiveSummary,
      href: `${base}/executive-summary`,
    },
    {
      id: "financial-statements",
      label: labels.navFinancialStatements,
      href: `${base}/financial-statements`,
    },
    { id: "ifrs-notes", label: labels.navIfrsNotes, href: `${base}/ifrs-notes` },
    {
      id: "management-letter",
      label: labels.navManagementLetter,
      href: `${base}/management-letter`,
    },
    {
      id: "audit-findings",
      label: labels.navAuditFindings,
      href: `${base}/audit-findings`,
    },
    {
      id: "recommendations",
      label: labels.navRecommendations,
      href: `${base}/recommendations`,
    },
    { id: "appendices", label: labels.navAppendices, href: `${base}/appendices` },
    { id: "comments", label: labels.navComments, href: `${base}/comments` },
    { id: "history", label: labels.navHistory, href: `${base}/history` },
    { id: "versions", label: labels.navVersions, href: `${base}/versions` },
    { id: "settings", label: labels.navSettings, href: `${base}/settings` },
  ];
}

export function buildReportingWorkspaceNavGroups(
  locale: string,
  engagementSlug: string,
  labels: Pick<
    ReportingWorkspaceLabels,
    | "navOverview"
    | "navExecutiveSummary"
    | "navFinancialStatements"
    | "navIfrsNotes"
    | "navManagementLetter"
    | "navAuditFindings"
    | "navRecommendations"
    | "navAppendices"
    | "navComments"
    | "navHistory"
    | "navVersions"
    | "navSettings"
    | "navGroups"
  >,
): ReportingWorkspaceNavGroup[] {
  const items = buildReportingWorkspaceNavItems(locale, engagementSlug, labels);
  const byId = (id: ReportingWorkspaceSection) => items.find((item) => item.id === id)!;

  return [
    {
      id: "overview",
      label: labels.navGroups.overview,
      items: (["overview"] as const).map(byId),
    },
    {
      id: "sections",
      label: labels.navGroups.sections ?? labels.navGroups.queue ?? "Sections",
      items: (
        [
          "executive-summary",
          "financial-statements",
          "ifrs-notes",
          "management-letter",
          "audit-findings",
          "recommendations",
          "appendices",
        ] as const
      ).map(byId),
    },
    {
      id: "governance",
      label: labels.navGroups.governance,
      items: (["comments", "history", "versions"] as const).map(byId),
    },
    {
      id: "admin",
      label: labels.navGroups.admin,
      items: (["settings"] as const).map(byId),
    },
  ];
}

export function reportingSectionTitle(
  section: ReportingWorkspaceSection,
  labels: Pick<ReportingWorkspaceLabels, "sections">,
): string {
  return labels.sections[section]?.title ?? section;
}

export function reportingSectionDescription(
  section: ReportingWorkspaceSection,
  labels: Pick<ReportingWorkspaceLabels, "sections">,
): string | undefined {
  return labels.sections[section]?.description;
}

export function buildReportingOverviewCards(
  reporting: ReportingWorkspaceView,
  labels: Pick<
    ReportingWorkspaceLabels,
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
      value: statusLabels[reporting.packageStatus] ?? reporting.packageStatus,
      hint: `${labels.summaryVersion}: ${reporting.packageVersion}`,
    },
    {
      id: "progress",
      label: labels.summaryProgress,
      value: `${reporting.progressPct}%`,
    },
    {
      id: "pending",
      label: labels.summaryPending,
      value: String(reporting.pendingCount),
    },
    {
      id: "returned",
      label: labels.summaryReturned,
      value: String(reporting.returnedCount),
    },
    {
      id: "resolved",
      label: labels.summaryResolved,
      value: String(reporting.resolvedCount),
    },
    {
      id: "pendingSections",
      label: labels.summaryOutstandingItems,
      value: String(reporting.pendingSectionsCount),
    },
    {
      id: "pendingReview",
      label: labels.summaryPendingReview,
      value: String(reporting.pendingReviewCount),
    },
  ];
}

export function formatReportingActivityAction(
  action: string,
  actionLabels: ReportingWorkspaceLabels["historyActions"],
): string {
  return actionLabels[action] ?? action;
}

export function formatReportingActivitySummary(summary: string | null): string {
  const normalized = summary?.trim();
  return normalized && normalized.length > 0 ? normalized : "—";
}

export function formatReportingCount(template: string, count: number): string {
  return template.replace("{count}", String(count));
}

export const formatReportActivityAction = formatReportingActivityAction;
export const formatReportActivitySummary = formatReportingActivitySummary;
export const formatReviewCount = formatReportingCount;

export { REPORTING_ACTIVITY_ACTIONS };
