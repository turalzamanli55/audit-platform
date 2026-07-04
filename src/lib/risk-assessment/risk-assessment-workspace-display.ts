import {
  RISK_ACTIVITY_ACTIONS,
  RISK_RATING_LEVELS,
  RISK_ASSESSMENT_STATUSES,
} from "@/constants/risk-assessment";
import { ratingToHeatmapColor } from "@/lib/risk-assessment/risk-assessment-rules";
import type {
  RiskAssessmentWorkspaceSection,
  RiskAssessmentWorkspaceView,
} from "@/lib/risk-assessment/risk-assessment-workspace-view";
import type { RiskHeatmapCell } from "@/types/risk-assessment";

type RiskRatingLevel = (typeof RISK_RATING_LEVELS)[number];

export type RiskAssessmentWorkspaceNavItem = {
  id: RiskAssessmentWorkspaceSection;
  label: string;
  href: string;
};

export type RiskAssessmentWorkspaceNavGroup = {
  id: "overview" | "register" | "analysis" | "response" | "governance" | "admin";
  label: string;
  items: RiskAssessmentWorkspaceNavItem[];
};

export type RiskAssessmentWorkspaceLabels = {
  navAriaLabel: string;
  navOverview: string;
  navInherentRisks: string;
  navControlRisks: string;
  navDetectionRisks: string;
  navFraudRisks: string;
  navItRisks: string;
  navComplianceRisks: string;
  navFinancialStatementRisks: string;
  navAssertionRisks: string;
  navSignificantRisks: string;
  navCategories: string;
  navScoring: string;
  navHeatmap: string;
  navMatrix: string;
  navResponses: string;
  navProcedures: string;
  navOwners: string;
  navReviewNotes: string;
  navComments: string;
  navHistory: string;
  navSettings: string;
  summaryStatus: string;
  summaryVersion: string;
  summaryProgress: string;
  summarySignificant: string;
  summaryPendingReview: string;
  summaryOpenItems: string;
  navGroups: {
    overview: string;
    register: string;
    analysis: string;
    response: string;
    governance: string;
    admin: string;
  };
  sections: Record<RiskAssessmentWorkspaceSection, { title: string; description: string }>;
  historyActions: Record<string, string>;
};

export function buildRiskAssessmentWorkspaceNavItems(
  locale: string,
  engagementSlug: string,
  labels: Pick<
    RiskAssessmentWorkspaceLabels,
    | "navOverview"
    | "navInherentRisks"
    | "navControlRisks"
    | "navDetectionRisks"
    | "navFraudRisks"
    | "navItRisks"
    | "navComplianceRisks"
    | "navFinancialStatementRisks"
    | "navAssertionRisks"
    | "navSignificantRisks"
    | "navCategories"
    | "navScoring"
    | "navHeatmap"
    | "navMatrix"
    | "navResponses"
    | "navProcedures"
    | "navOwners"
    | "navReviewNotes"
    | "navComments"
    | "navHistory"
    | "navSettings"
    | "navGroups"
  >,
): RiskAssessmentWorkspaceNavItem[] {
  const base = `/${locale}/app/engagements/${engagementSlug}/risk-assessment`;
  return [
    { id: "overview", label: labels.navOverview, href: base },
    { id: "inherent-risks", label: labels.navInherentRisks, href: `${base}/inherent-risks` },
    { id: "control-risks", label: labels.navControlRisks, href: `${base}/control-risks` },
    { id: "detection-risks", label: labels.navDetectionRisks, href: `${base}/detection-risks` },
    { id: "fraud-risks", label: labels.navFraudRisks, href: `${base}/fraud-risks` },
    { id: "it-risks", label: labels.navItRisks, href: `${base}/it-risks` },
    { id: "compliance-risks", label: labels.navComplianceRisks, href: `${base}/compliance-risks` },
    {
      id: "financial-statement-risks",
      label: labels.navFinancialStatementRisks,
      href: `${base}/financial-statement-risks`,
    },
    { id: "assertion-risks", label: labels.navAssertionRisks, href: `${base}/assertion-risks` },
    { id: "significant-risks", label: labels.navSignificantRisks, href: `${base}/significant-risks` },
    { id: "categories", label: labels.navCategories, href: `${base}/categories` },
    { id: "scoring", label: labels.navScoring, href: `${base}/scoring` },
    { id: "heatmap", label: labels.navHeatmap, href: `${base}/heatmap` },
    { id: "matrix", label: labels.navMatrix, href: `${base}/matrix` },
    { id: "responses", label: labels.navResponses, href: `${base}/responses` },
    { id: "procedures", label: labels.navProcedures, href: `${base}/procedures` },
    { id: "owners", label: labels.navOwners, href: `${base}/owners` },
    { id: "review-notes", label: labels.navReviewNotes, href: `${base}/review-notes` },
    { id: "comments", label: labels.navComments, href: `${base}/comments` },
    { id: "history", label: labels.navHistory, href: `${base}/history` },
    { id: "settings", label: labels.navSettings, href: `${base}/settings` },
  ];
}

export function buildRiskAssessmentWorkspaceNavGroups(
  locale: string,
  engagementSlug: string,
  labels: Pick<
    RiskAssessmentWorkspaceLabels,
    | "navOverview"
    | "navInherentRisks"
    | "navControlRisks"
    | "navDetectionRisks"
    | "navFraudRisks"
    | "navItRisks"
    | "navComplianceRisks"
    | "navFinancialStatementRisks"
    | "navAssertionRisks"
    | "navSignificantRisks"
    | "navCategories"
    | "navScoring"
    | "navHeatmap"
    | "navMatrix"
    | "navResponses"
    | "navProcedures"
    | "navOwners"
    | "navReviewNotes"
    | "navComments"
    | "navHistory"
    | "navSettings"
    | "navGroups"
  >,
): RiskAssessmentWorkspaceNavGroup[] {
  const items = buildRiskAssessmentWorkspaceNavItems(locale, engagementSlug, labels);
  const byId = (id: RiskAssessmentWorkspaceSection) => items.find((item) => item.id === id)!;

  const overviewIds = ["overview"] as const;
  const registerIds = [
    "inherent-risks",
    "control-risks",
    "detection-risks",
    "fraud-risks",
    "it-risks",
    "compliance-risks",
    "financial-statement-risks",
    "assertion-risks",
    "significant-risks",
  ] as const;
  const analysisIds = ["categories", "scoring", "heatmap", "matrix"] as const;
  const responseIds = ["responses", "procedures", "owners"] as const;
  const governanceIds = ["review-notes", "comments", "history"] as const;
  const adminIds = ["settings"] as const;

  return [
    { id: "overview", label: labels.navGroups.overview, items: overviewIds.map(byId) },
    { id: "register", label: labels.navGroups.register, items: registerIds.map(byId) },
    { id: "analysis", label: labels.navGroups.analysis, items: analysisIds.map(byId) },
    { id: "response", label: labels.navGroups.response, items: responseIds.map(byId) },
    { id: "governance", label: labels.navGroups.governance, items: governanceIds.map(byId) },
    { id: "admin", label: labels.navGroups.admin, items: adminIds.map(byId) },
  ];
}

export function riskAssessmentSectionTitle(
  section: RiskAssessmentWorkspaceSection,
  labels: Pick<RiskAssessmentWorkspaceLabels, "sections">,
): string {
  return labels.sections[section]?.title ?? section;
}

export function riskAssessmentSectionDescription(
  section: RiskAssessmentWorkspaceSection,
  labels: Pick<RiskAssessmentWorkspaceLabels, "sections">,
): string | undefined {
  return labels.sections[section]?.description;
}

export function buildRiskAssessmentOverviewCards(
  riskAssessment: RiskAssessmentWorkspaceView,
  labels: Pick<
    RiskAssessmentWorkspaceLabels,
    | "summaryStatus"
    | "summaryVersion"
    | "summaryProgress"
    | "summarySignificant"
    | "summaryPendingReview"
    | "summaryOpenItems"
  >,
  statusLabels: Partial<Record<(typeof RISK_ASSESSMENT_STATUSES)[number], string>>,
) {
  const statusKey = String(riskAssessment.assessmentStatus) as (typeof RISK_ASSESSMENT_STATUSES)[number];

  return [
    {
      id: "status",
      label: labels.summaryStatus,
      value: statusLabels[statusKey] ?? statusKey,
      hint: `${labels.summaryVersion}: ${riskAssessment.assessmentVersion}`,
    },
    {
      id: "progress",
      label: labels.summaryProgress,
      value: `${riskAssessment.progressPct}%`,
    },
    {
      id: "significant",
      label: labels.summarySignificant,
      value: String(riskAssessment.significantRiskCount),
    },
    {
      id: "pendingReview",
      label: labels.summaryPendingReview,
      value: String(riskAssessment.pendingReviewCount),
    },
    {
      id: "openItems",
      label: labels.summaryOpenItems,
      value: String(riskAssessment.openItemsCount),
    },
  ];
}

type HeatmapBucket = {
  rating: RiskRatingLevel | null;
  count: number;
  cssClass: string;
};

export function buildRiskHeatmapData(cells: RiskHeatmapCell[]) {
  const buckets: Record<RiskRatingLevel | "none", HeatmapBucket> = {
    low: { rating: "low", count: 0, cssClass: ratingToHeatmapColor("low") },
    moderate: { rating: "moderate", count: 0, cssClass: ratingToHeatmapColor("moderate") },
    high: { rating: "high", count: 0, cssClass: ratingToHeatmapColor("high") },
    significant: {
      rating: "significant",
      count: 0,
      cssClass: ratingToHeatmapColor("significant"),
    },
    none: { rating: null, count: 0, cssClass: ratingToHeatmapColor(null) },
  };

  for (const cell of cells) {
    const rating = cell.rating as RiskRatingLevel | null;
    if (!rating) {
      buckets.none.count += 1;
      continue;
    }
    buckets[rating].count += 1;
  }

  return [...RISK_RATING_LEVELS.map((rating) => buckets[rating]), buckets.none];
}

export function formatRiskAssessmentActivityAction(
  action: string,
  actionLabels: RiskAssessmentWorkspaceLabels["historyActions"],
): string {
  const map: Record<string, string> = {
    [RISK_ACTIVITY_ACTIONS.CREATED]: actionLabels[RISK_ACTIVITY_ACTIONS.CREATED] ?? action,
    [RISK_ACTIVITY_ACTIONS.UPDATED]: actionLabels[RISK_ACTIVITY_ACTIONS.UPDATED] ?? action,
    [RISK_ACTIVITY_ACTIONS.ARCHIVED]: actionLabels[RISK_ACTIVITY_ACTIONS.ARCHIVED] ?? action,
    [RISK_ACTIVITY_ACTIONS.RESTORED]: actionLabels[RISK_ACTIVITY_ACTIONS.RESTORED] ?? action,
    [RISK_ACTIVITY_ACTIONS.SUBMITTED]: actionLabels[RISK_ACTIVITY_ACTIONS.SUBMITTED] ?? action,
    [RISK_ACTIVITY_ACTIONS.RETURNED]: actionLabels[RISK_ACTIVITY_ACTIONS.RETURNED] ?? action,
    [RISK_ACTIVITY_ACTIONS.APPROVED]: actionLabels[RISK_ACTIVITY_ACTIONS.APPROVED] ?? action,
    [RISK_ACTIVITY_ACTIONS.CATEGORY_ADDED]:
      actionLabels[RISK_ACTIVITY_ACTIONS.CATEGORY_ADDED] ?? action,
    [RISK_ACTIVITY_ACTIONS.RISK_ITEM_ADDED]:
      actionLabels[RISK_ACTIVITY_ACTIONS.RISK_ITEM_ADDED] ?? action,
    [RISK_ACTIVITY_ACTIONS.RISK_ITEM_UPDATED]:
      actionLabels[RISK_ACTIVITY_ACTIONS.RISK_ITEM_UPDATED] ?? action,
    [RISK_ACTIVITY_ACTIONS.ASSERTION_RATING_UPDATED]:
      actionLabels[RISK_ACTIVITY_ACTIONS.ASSERTION_RATING_UPDATED] ?? action,
    [RISK_ACTIVITY_ACTIONS.RESPONSE_ADDED]:
      actionLabels[RISK_ACTIVITY_ACTIONS.RESPONSE_ADDED] ?? action,
    [RISK_ACTIVITY_ACTIONS.PROCEDURE_LINKED]:
      actionLabels[RISK_ACTIVITY_ACTIONS.PROCEDURE_LINKED] ?? action,
    [RISK_ACTIVITY_ACTIONS.NOTE_ADDED]: actionLabels[RISK_ACTIVITY_ACTIONS.NOTE_ADDED] ?? action,
    [RISK_ACTIVITY_ACTIONS.SIGNIFICANT_ACKNOWLEDGED]:
      actionLabels[RISK_ACTIVITY_ACTIONS.SIGNIFICANT_ACKNOWLEDGED] ?? action,
  };

  return map[action] ?? action;
}

export function formatRiskAssessmentActivitySummary(summary: string | null): string {
  const normalized = summary?.trim();
  return normalized && normalized.length > 0 ? normalized : "—";
}
