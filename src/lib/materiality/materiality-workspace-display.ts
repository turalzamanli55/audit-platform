import {
  MATERIALITY_ACTIVITY_ACTIONS,
  MATERIALITY_PACKAGE_STATUSES,
} from "@/constants/materiality";
import { calculateOverallMateriality } from "@/lib/materiality/materiality-engine";
import type {
  MaterialityWorkspaceSection,
  MaterialityWorkspaceView,
} from "@/lib/materiality/materiality-workspace-view";

export type MaterialityWorkspaceNavItem = {
  id: MaterialityWorkspaceSection;
  label: string;
  href: string;
};

export type MaterialityWorkspaceNavGroup = {
  id: "overview" | "thresholds" | "analysis" | "governance" | "admin";
  label: string;
  items: MaterialityWorkspaceNavItem[];
};

export type MaterialityWorkspaceLabels = {
  navAriaLabel: string;
  navOverview: string;
  navOverall: string;
  navPerformance: string;
  navSpecific: string;
  navBenchmarks: string;
  navCalculations: string;
  navVersions: string;
  navComments: string;
  navHistory: string;
  navSettings: string;
  summaryStatus: string;
  summaryVersion: string;
  summaryProgress: string;
  summaryOverall: string;
  summaryBenchmarks?: string;
  summaryOpenItems?: string;
  summaryPendingReview: string;
  navGroups: {
    overview: string;
    thresholds: string;
    analysis: string;
    governance: string;
    admin: string;
  };
  sections: Record<MaterialityWorkspaceSection, { title: string; description: string }>;
  historyActions: Record<string, string>;
};

export function calculateMaterialityAmount(benchmarkAmount: number, percentage: number): number {
  return calculateOverallMateriality(benchmarkAmount, percentage);
}

export function formatCurrency(
  amount: number | null | undefined,
  currencyCode = "AZN",
): string {
  if (amount == null || !Number.isFinite(amount)) return "—";
  return `${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currencyCode}`;
}

export function buildMaterialityWorkspaceNavItems(
  locale: string,
  engagementSlug: string,
  labels: Pick<
    MaterialityWorkspaceLabels,
    | "navOverview"
    | "navOverall"
    | "navPerformance"
    | "navSpecific"
    | "navBenchmarks"
    | "navCalculations"
    | "navVersions"
    | "navComments"
    | "navHistory"
    | "navSettings"
    | "navGroups"
  >,
): MaterialityWorkspaceNavItem[] {
  const base = `/${locale}/app/engagements/${engagementSlug}/materiality`;
  return [
    { id: "overview", label: labels.navOverview, href: base },
    { id: "overall", label: labels.navOverall, href: `${base}/overall` },
    { id: "performance", label: labels.navPerformance, href: `${base}/performance` },
    { id: "specific", label: labels.navSpecific, href: `${base}/specific` },
    { id: "benchmarks", label: labels.navBenchmarks, href: `${base}/benchmarks` },
    { id: "calculations", label: labels.navCalculations, href: `${base}/calculations` },
    { id: "versions", label: labels.navVersions, href: `${base}/versions` },
    { id: "comments", label: labels.navComments, href: `${base}/comments` },
    { id: "history", label: labels.navHistory, href: `${base}/history` },
    { id: "settings", label: labels.navSettings, href: `${base}/settings` },
  ];
}

export function buildMaterialityWorkspaceNavGroups(
  locale: string,
  engagementSlug: string,
  labels: Pick<
    MaterialityWorkspaceLabels,
    | "navOverview"
    | "navOverall"
    | "navPerformance"
    | "navSpecific"
    | "navBenchmarks"
    | "navCalculations"
    | "navVersions"
    | "navComments"
    | "navHistory"
    | "navSettings"
    | "navGroups"
  >,
): MaterialityWorkspaceNavGroup[] {
  const items = buildMaterialityWorkspaceNavItems(locale, engagementSlug, labels);
  const byId = (id: MaterialityWorkspaceSection) => items.find((item) => item.id === id)!;

  const overviewIds = ["overview"] as const;
  const thresholdIds = ["overall", "performance", "specific"] as const;
  const analysisIds = ["benchmarks", "calculations"] as const;
  const governanceIds = ["versions", "comments", "history"] as const;
  const adminIds = ["settings"] as const;

  return [
    { id: "overview", label: labels.navGroups.overview, items: overviewIds.map(byId) },
    { id: "thresholds", label: labels.navGroups.thresholds, items: thresholdIds.map(byId) },
    { id: "analysis", label: labels.navGroups.analysis, items: analysisIds.map(byId) },
    { id: "governance", label: labels.navGroups.governance, items: governanceIds.map(byId) },
    { id: "admin", label: labels.navGroups.admin, items: adminIds.map(byId) },
  ];
}

export function materialitySectionTitle(
  section: MaterialityWorkspaceSection,
  labels: Pick<MaterialityWorkspaceLabels, "sections">,
): string {
  return labels.sections[section]?.title ?? section;
}

export function materialitySectionDescription(
  section: MaterialityWorkspaceSection,
  labels: Pick<MaterialityWorkspaceLabels, "sections">,
): string | undefined {
  return labels.sections[section]?.description;
}

export function buildMaterialityOverviewCards(
  materialityPackage: MaterialityWorkspaceView,
  labels: Pick<
    MaterialityWorkspaceLabels,
    | "summaryStatus"
    | "summaryVersion"
    | "summaryProgress"
    | "summaryOverall"
    | "summaryBenchmarks"
    | "summaryOpenItems"
    | "summaryPendingReview"
  >,
  statusLabels: Partial<Record<(typeof MATERIALITY_PACKAGE_STATUSES)[number], string>>,
) {
  const statusKey = String(
    materialityPackage.packageStatus,
  ) as (typeof MATERIALITY_PACKAGE_STATUSES)[number];

  const cards = [
    {
      id: "status",
      label: labels.summaryStatus,
      value: statusLabels[statusKey] ?? statusKey,
      hint: `${labels.summaryVersion}: ${materialityPackage.packageVersion}`,
    },
    {
      id: "progress",
      label: labels.summaryProgress,
      value: `${materialityPackage.progressPct}%`,
    },
    {
      id: "overall",
      label: labels.summaryOverall,
      value: formatCurrency(materialityPackage.overallMateriality, materialityPackage.currencyCode),
    },
    {
      id: "pendingReview",
      label: labels.summaryPendingReview,
      value: String(materialityPackage.pendingReviewCount),
    },
  ];

  if (labels.summaryBenchmarks) {
    cards.splice(3, 0, {
      id: "benchmarks",
      label: labels.summaryBenchmarks,
      value: String(materialityPackage.benchmarks.length),
    });
  } else if (labels.summaryOpenItems) {
    cards.splice(3, 0, {
      id: "openItems",
      label: labels.summaryOpenItems,
      value: String(materialityPackage.openItemsCount),
    });
  }

  return cards;
}

export function formatMaterialityActivityAction(
  action: string,
  actionLabels: MaterialityWorkspaceLabels["historyActions"],
): string {
  const map: Record<string, string> = {
    [MATERIALITY_ACTIVITY_ACTIONS.CREATED]: actionLabels[MATERIALITY_ACTIVITY_ACTIONS.CREATED] ?? action,
    [MATERIALITY_ACTIVITY_ACTIONS.UPDATED]: actionLabels[MATERIALITY_ACTIVITY_ACTIONS.UPDATED] ?? action,
    [MATERIALITY_ACTIVITY_ACTIONS.ARCHIVED]: actionLabels[MATERIALITY_ACTIVITY_ACTIONS.ARCHIVED] ?? action,
    [MATERIALITY_ACTIVITY_ACTIONS.RESTORED]: actionLabels[MATERIALITY_ACTIVITY_ACTIONS.RESTORED] ?? action,
    [MATERIALITY_ACTIVITY_ACTIONS.SUBMITTED]: actionLabels[MATERIALITY_ACTIVITY_ACTIONS.SUBMITTED] ?? action,
    [MATERIALITY_ACTIVITY_ACTIONS.RETURNED]: actionLabels[MATERIALITY_ACTIVITY_ACTIONS.RETURNED] ?? action,
    [MATERIALITY_ACTIVITY_ACTIONS.APPROVED]: actionLabels[MATERIALITY_ACTIVITY_ACTIONS.APPROVED] ?? action,
    [MATERIALITY_ACTIVITY_ACTIONS.VERSION_CREATED]:
      actionLabels[MATERIALITY_ACTIVITY_ACTIONS.VERSION_CREATED] ?? action,
    [MATERIALITY_ACTIVITY_ACTIONS.BENCHMARK_UPSERTED]:
      actionLabels[MATERIALITY_ACTIVITY_ACTIONS.BENCHMARK_UPSERTED] ?? action,
    [MATERIALITY_ACTIVITY_ACTIONS.BENCHMARK_SELECTED]:
      actionLabels[MATERIALITY_ACTIVITY_ACTIONS.BENCHMARK_SELECTED] ?? action,
    [MATERIALITY_ACTIVITY_ACTIONS.CALCULATION_RECORDED]:
      actionLabels[MATERIALITY_ACTIVITY_ACTIONS.CALCULATION_RECORDED] ?? action,
    [MATERIALITY_ACTIVITY_ACTIONS.THRESHOLDS_UPDATED]:
      actionLabels[MATERIALITY_ACTIVITY_ACTIONS.THRESHOLDS_UPDATED] ?? action,
    [MATERIALITY_ACTIVITY_ACTIONS.COMMENT_ADDED]:
      actionLabels[MATERIALITY_ACTIVITY_ACTIONS.COMMENT_ADDED] ?? action,
  };

  return map[action] ?? action;
}

export function formatMaterialityActivitySummary(summary: string | null): string {
  const normalized = summary?.trim();
  return normalized && normalized.length > 0 ? normalized : "—";
}
