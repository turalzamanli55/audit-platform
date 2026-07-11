import { FINANCIAL_STATEMENT_ACTIVITY_ACTIONS } from "@/constants/financial-statements";
import type {
  FinancialStatementsWorkspaceSection,
  FinancialStatementsWorkspaceView,
} from "@/lib/financial-statements/financial-statements-workspace-view";

export type FinancialStatementsWorkspaceNavItem = {
  id: FinancialStatementsWorkspaceSection;
  label: string;
  href: string;
};

export type FinancialStatementsWorkspaceNavGroup = {
  id: "overview" | "sections" | "governance" | "admin";
  label: string;
  items: FinancialStatementsWorkspaceNavItem[];
};

export type FinancialStatementsWorkspaceLabels = {
  navAriaLabel: string;
  navOverview: string;
  navBalanceSheet: string;
  navIncomeStatement: string;
  navCashFlowStatement: string;
  navChangesInEquity: string;
  navNotesLinks: string;
  navCrossReferences: string;
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
  sections: Record<FinancialStatementsWorkspaceSection, { title: string; description: string }>;
  historyActions: Record<string, string>;
};

export type FinancialStatementsCommandCenterLabels = Record<string, string>;

export function formatReviewCount(template: string, count: number): string {
  return template.replace("{count}", String(count));
}

export function buildFinancialStatementsWorkspaceNavItems(
  locale: string,
  engagementSlug: string,
  labels: Pick<
    FinancialStatementsWorkspaceLabels,
    | "navOverview"
    | "navBalanceSheet"
    | "navIncomeStatement"
    | "navCashFlowStatement"
    | "navChangesInEquity"
    | "navNotesLinks"
    | "navCrossReferences"
    | "navComments"
    | "navHistory"
    | "navVersions"
    | "navSettings"
  >,
): FinancialStatementsWorkspaceNavItem[] {
  const base = `/${locale}/app/engagements/${engagementSlug}/financial-statements`;
  return [
    { id: "overview", label: labels.navOverview, href: base },
    { id: "balance-sheet", label: labels.navBalanceSheet, href: `${base}/balance-sheet` },
    { id: "income-statement", label: labels.navIncomeStatement, href: `${base}/income-statement` },
    {
      id: "cash-flow-statement",
      label: labels.navCashFlowStatement,
      href: `${base}/cash-flow-statement`,
    },
    {
      id: "changes-in-equity",
      label: labels.navChangesInEquity,
      href: `${base}/changes-in-equity`,
    },
    { id: "notes-links", label: labels.navNotesLinks, href: `${base}/notes-links` },
    {
      id: "cross-references",
      label: labels.navCrossReferences,
      href: `${base}/cross-references`,
    },
    { id: "comments", label: labels.navComments, href: `${base}/comments` },
    { id: "history", label: labels.navHistory, href: `${base}/history` },
    { id: "versions", label: labels.navVersions, href: `${base}/versions` },
    { id: "settings", label: labels.navSettings, href: `${base}/settings` },
  ];
}

export function buildFinancialStatementsWorkspaceNavGroups(
  locale: string,
  engagementSlug: string,
  labels: Pick<
    FinancialStatementsWorkspaceLabels,
    | "navOverview"
    | "navBalanceSheet"
    | "navIncomeStatement"
    | "navCashFlowStatement"
    | "navChangesInEquity"
    | "navNotesLinks"
    | "navCrossReferences"
    | "navComments"
    | "navHistory"
    | "navVersions"
    | "navSettings"
    | "navGroups"
  >,
): FinancialStatementsWorkspaceNavGroup[] {
  const items = buildFinancialStatementsWorkspaceNavItems(locale, engagementSlug, labels);
  const byId = (id: FinancialStatementsWorkspaceSection) => items.find((item) => item.id === id)!;

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
          "balance-sheet",
          "income-statement",
          "cash-flow-statement",
          "changes-in-equity",
          "notes-links",
          "cross-references",
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

export function financialStatementsSectionTitle(
  section: FinancialStatementsWorkspaceSection,
  labels: Pick<FinancialStatementsWorkspaceLabels, "sections">,
): string {
  return labels.sections[section]?.title ?? section;
}

export function financialStatementsSectionDescription(
  section: FinancialStatementsWorkspaceSection,
  labels: Pick<FinancialStatementsWorkspaceLabels, "sections">,
): string | undefined {
  return labels.sections[section]?.description;
}

export function buildFinancialStatementsWorkspaceSummary(
  financialStatements: FinancialStatementsWorkspaceView,
  labels: Pick<
    FinancialStatementsWorkspaceLabels,
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
      value: statusLabels[financialStatements.packageStatus] ?? financialStatements.packageStatus,
    },
    {
      id: "version",
      label: labels.summaryVersion,
      value: String(financialStatements.packageVersion),
    },
    {
      id: "progress",
      label: labels.summaryProgress,
      value: `${financialStatements.progressPct}%`,
    },
    {
      id: "pending",
      label: labels.summaryPending,
      value: String(financialStatements.pendingCount),
    },
    {
      id: "returned",
      label: labels.summaryReturned,
      value: String(financialStatements.returnedCount),
    },
    {
      id: "resolved",
      label: labels.summaryResolved,
      value: String(financialStatements.resolvedCount),
    },
    {
      id: "outstanding",
      label: labels.summaryOutstandingItems,
      value: String(financialStatements.pendingSectionsCount),
    },
    {
      id: "pending-review",
      label: labels.summaryPendingReview,
      value: String(financialStatements.pendingReviewCount),
    },
  ];
}

export function formatFinancialStatementActivityAction(
  action: string,
  historyActions: Record<string, string>,
): string {
  return historyActions[action] ?? action;
}

export function formatFinancialStatementActivitySummary(
  summary: string | null,
  action: string,
): string {
  return summary?.trim() || action;
}

export const FINANCIAL_STATEMENT_HISTORY_ACTION_KEYS = Object.values(
  FINANCIAL_STATEMENT_ACTIVITY_ACTIONS,
);
