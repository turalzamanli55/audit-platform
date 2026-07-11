import { OPINION_ACTIVITY_ACTIONS } from "@/constants/opinion";
import type {
  OpinionWorkspaceSection,
  OpinionWorkspaceView,
} from "@/lib/opinion/opinion-workspace-view";

export type OpinionWorkspaceNavItem = {
  id: OpinionWorkspaceSection;
  label: string;
  href: string;
};

export type OpinionWorkspaceNavGroup = {
  id: "overview" | "sections" | "governance" | "admin";
  label: string;
  items: OpinionWorkspaceNavItem[];
};

export type OpinionWorkspaceLabels = {
  navAriaLabel: string;
  navOverview: string;
  navOpinionType: string;
  navBasisForOpinion: string;
  navKeyAuditMatters: string;
  navEmphasisOfMatter: string;
  navOtherInformation: string;
  navResponsibilities: string;
  navSignature: string;
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
  sections: Record<OpinionWorkspaceSection, { title: string; description: string }>;
  historyActions: Record<string, string>;
};

export type OpinionCommandCenterLabels = Record<string, string>;

export function buildOpinionWorkspaceNavItems(
  locale: string,
  engagementSlug: string,
  labels: Pick<
    OpinionWorkspaceLabels,
    | "navOverview"
    | "navOpinionType"
    | "navBasisForOpinion"
    | "navKeyAuditMatters"
    | "navEmphasisOfMatter"
    | "navOtherInformation"
    | "navResponsibilities"
    | "navSignature"
    | "navComments"
    | "navHistory"
    | "navVersions"
    | "navSettings"
  >,
): OpinionWorkspaceNavItem[] {
  const base = `/${locale}/app/engagements/${engagementSlug}/opinion`;
  return [
    { id: "overview", label: labels.navOverview, href: base },
    {
      id: "opinion-type",
      label: labels.navOpinionType,
      href: `${base}/opinion-type`,
    },
    {
      id: "basis-for-opinion",
      label: labels.navBasisForOpinion,
      href: `${base}/basis-for-opinion`,
    },
    { id: "key-audit-matters", label: labels.navKeyAuditMatters, href: `${base}/key-audit-matters` },
    {
      id: "emphasis-of-matter",
      label: labels.navEmphasisOfMatter,
      href: `${base}/emphasis-of-matter`,
    },
    {
      id: "other-information",
      label: labels.navOtherInformation,
      href: `${base}/other-information`,
    },
    {
      id: "responsibilities",
      label: labels.navResponsibilities,
      href: `${base}/responsibilities`,
    },
    { id: "signature", label: labels.navSignature, href: `${base}/signature` },
    { id: "comments", label: labels.navComments, href: `${base}/comments` },
    { id: "history", label: labels.navHistory, href: `${base}/history` },
    { id: "versions", label: labels.navVersions, href: `${base}/versions` },
    { id: "settings", label: labels.navSettings, href: `${base}/settings` },
  ];
}

export function buildOpinionWorkspaceNavGroups(
  locale: string,
  engagementSlug: string,
  labels: Pick<
    OpinionWorkspaceLabels,
    | "navOverview"
    | "navOpinionType"
    | "navBasisForOpinion"
    | "navKeyAuditMatters"
    | "navEmphasisOfMatter"
    | "navOtherInformation"
    | "navResponsibilities"
    | "navSignature"
    | "navComments"
    | "navHistory"
    | "navVersions"
    | "navSettings"
    | "navGroups"
  >,
): OpinionWorkspaceNavGroup[] {
  const items = buildOpinionWorkspaceNavItems(locale, engagementSlug, labels);
  const byId = (id: OpinionWorkspaceSection) => items.find((item) => item.id === id)!;

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
          "opinion-type",
          "basis-for-opinion",
          "key-audit-matters",
          "emphasis-of-matter",
          "other-information",
          "responsibilities",
          "signature",
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

export function opinionSectionTitle(
  section: OpinionWorkspaceSection,
  labels: Pick<OpinionWorkspaceLabels, "sections">,
): string {
  return labels.sections[section]?.title ?? section;
}

export function opinionSectionDescription(
  section: OpinionWorkspaceSection,
  labels: Pick<OpinionWorkspaceLabels, "sections">,
): string | undefined {
  return labels.sections[section]?.description;
}

export function buildOpinionOverviewCards(
  reporting: OpinionWorkspaceView,
  labels: Pick<
    OpinionWorkspaceLabels,
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
  actionLabels: OpinionWorkspaceLabels["historyActions"],
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

export const formatOpinionActivityAction = formatReportingActivityAction;
export const formatOpinionActivitySummary = formatReportingActivitySummary;
export const formatReviewCount = formatReportingCount;

export { OPINION_ACTIVITY_ACTIONS };
