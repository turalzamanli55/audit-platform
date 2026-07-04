import "server-only";

import type { Locale } from "@/i18n";
import type { Dictionary } from "@/i18n/get-dictionary";
import {
  buildRiskHeatmapData,
  formatRiskAssessmentActivityAction,
} from "@/lib/risk-assessment/risk-assessment-workspace-display";
import type { RiskAssessmentWorkspaceView } from "@/lib/risk-assessment/risk-assessment-workspace-view";
import type { RiskAssessmentActivityView } from "@/lib/risk-assessment/load-risk-assessment-activity";
import type {
  RiskAssessmentCommandCenterData,
  RiskCommandKpi,
  RiskWorkflowStep,
} from "@/types/risk-assessment-command-center";
import type { RiskRatingLevel } from "@/types/risk-assessment";

type CommandCenterLabels = Dictionary["riskAssessment"]["workspace"]["commandCenter"];

const WORKFLOW_STEP_IDS = [
  "draft",
  "submitted",
  "under_review",
  "returned",
  "approved",
  "integrated",
] as const;

const RATING_WEIGHTS: Record<RiskRatingLevel, number> = {
  low: 1,
  moderate: 2,
  high: 3,
  significant: 4,
};

const RISK_TYPE_ROUTES: Record<string, string> = {
  inherent: "inherent-risks",
  control: "control-risks",
  detection: "detection-risks",
  fraud: "fraud-risks",
  it: "it-risks",
  compliance: "compliance-risks",
  financial_statement: "financial-statement-risks",
  assertion: "assertion-risks",
  significant: "significant-risks",
};

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

function maxRating(
  ratings: Array<RiskRatingLevel | null>,
): RiskRatingLevel | null {
  let best: RiskRatingLevel | null = null;
  let bestWeight = 0;
  for (const rating of ratings) {
    if (!rating) continue;
    const weight = RATING_WEIGHTS[rating] ?? 0;
    if (weight > bestWeight) {
      bestWeight = weight;
      best = rating;
    }
  }
  return best;
}

function ratingLabel(
  rating: RiskRatingLevel | null,
  labels: Dictionary["riskAssessment"]["ratingLevels"],
  notSet: string,
): string {
  if (!rating) return notSet;
  return labels[rating] ?? rating;
}

function resolveCurrentWorkflowStep(assessment: RiskAssessmentWorkspaceView): string {
  const status = assessment.assessmentStatus as string;
  if (status === "approved") return "integrated";
  if (status === "returned") return "returned";
  if (status === "under_review") return "under_review";
  if (status === "submitted") return "submitted";
  return "draft";
}

function buildWorkflowSteps(
  assessment: RiskAssessmentWorkspaceView,
  labels: CommandCenterLabels,
): { steps: RiskWorkflowStep[]; current: string } {
  const current = resolveCurrentWorkflowStep(assessment);
  const currentIndex = WORKFLOW_STEP_IDS.indexOf(current as (typeof WORKFLOW_STEP_IDS)[number]);

  const stepLabels: Record<string, string> = {
    draft: labels.stepDraft,
    submitted: labels.stepSubmitted,
    under_review: labels.stepUnderReview,
    returned: labels.stepReturned,
    approved: labels.stepApproved,
    integrated: labels.stepIntegrated,
  };

  const steps: RiskWorkflowStep[] = WORKFLOW_STEP_IDS.map((id, index) => ({
    id,
    label: stepLabels[id] ?? id,
    status:
      index < currentIndex ? "complete" : index === currentIndex ? "current" : "upcoming",
  }));

  return { steps, current };
}

function riskTypeHref(base: string, riskType: string): string {
  const segment = RISK_TYPE_ROUTES[riskType] ?? "inherent-risks";
  return `${base}/${segment}`;
}

export function loadRiskAssessmentCommandCenter(input: {
  locale: Locale;
  riskAssessment: RiskAssessmentWorkspaceView;
  activity: RiskAssessmentActivityView;
  labels: CommandCenterLabels;
  riskLabels: Dictionary["riskAssessment"];
}): RiskAssessmentCommandCenterData {
  const { locale, riskAssessment, activity, labels, riskLabels } = input;
  const base = `/${locale}/app/engagements/${riskAssessment.engagementSlug}/risk-assessment`;
  const ratingLabels = riskLabels.ratingLevels;
  const notSet = labels.notSet;

  const items = riskAssessment.registerItems;
  const responseRiskIds = new Set(riskAssessment.responses.map((r) => r.riskItemId));
  const linkedRiskIds = new Set(riskAssessment.procedureLinks.map((l) => l.riskItemId));

  const overallRating = maxRating(items.map((i) => i.residualRating));
  const inherentRating = maxRating(items.map((i) => i.inherentRating));
  const controlRating = maxRating(items.map((i) => i.controlRating));
  const detectionRating = maxRating(items.map((i) => i.detectionRating));
  const residualRating = maxRating(items.map((i) => i.residualRating));

  const countType = (type: string) => items.filter((i) => i.riskType === type).length;
  const ratedAssertions = riskAssessment.heatmap.filter((c) => c.rating != null).length;
  const assertionCoveragePct =
    riskAssessment.heatmap.length > 0
      ? Math.round((ratedAssertions / riskAssessment.heatmap.length) * 100)
      : 0;

  const assignedOwnerCount = new Set(
    items.map((i) => i.ownerId).filter((id): id is string => Boolean(id)),
  ).size;

  const openResponseItems = items.filter((i) => !responseRiskIds.has(i.id));
  const outstandingProcedureItems = items.filter(
    (i) => i.isSignificant && !linkedRiskIds.has(i.id),
  );

  const { steps: workflowSteps, current: currentWorkflowStep } = buildWorkflowSteps(
    riskAssessment,
    labels,
  );

  const reviewQueueCount = riskAssessment.pendingReviewCount;
  const status = riskAssessment.assessmentStatus as string;
  const approvalVariant =
    status === "approved"
      ? "success"
      : status === "submitted" || status === "under_review"
        ? "warning"
        : status === "returned"
          ? "destructive"
          : "default";

  const attentionScore =
    riskAssessment.openItemsCount +
    reviewQueueCount +
    (riskAssessment.significantRiskCount > 0 && !riskAssessment.significantRisksAcknowledgedAt
      ? 1
      : 0);

  const riskHealth =
    attentionScore === 0
      ? labels.healthOnTrack
      : attentionScore <= 2
        ? labels.healthMonitor
        : labels.healthAttention;

  const riskHealthVariant =
    attentionScore === 0 ? "success" : attentionScore <= 2 ? "warning" : "destructive";

  const mapRatingKpi = (
    id: string,
    label: string,
    rating: RiskRatingLevel | null,
    hint: string,
    href: string,
  ): RiskCommandKpi => ({
    id,
    label,
    value: ratingLabel(rating, ratingLabels, notSet),
    hint,
    href,
    variant:
      rating === "significant"
        ? "destructive"
        : rating === "high"
          ? "warning"
          : "default",
  });

  const executive: RiskCommandKpi[] = [
    mapRatingKpi(
      "overall",
      labels.kpiOverall,
      overallRating,
      labels.hintOverall,
      `${base}/scoring`,
    ),
    mapRatingKpi(
      "inherent",
      labels.kpiInherent,
      inherentRating,
      labels.hintInherent,
      `${base}/inherent-risks`,
    ),
    mapRatingKpi(
      "control",
      labels.kpiControl,
      controlRating,
      labels.hintControl,
      `${base}/control-risks`,
    ),
    mapRatingKpi(
      "detection",
      labels.kpiDetection,
      detectionRating,
      labels.hintDetection,
      `${base}/detection-risks`,
    ),
    mapRatingKpi(
      "residual",
      labels.kpiResidual,
      residualRating,
      labels.hintResidual,
      `${base}/scoring`,
    ),
  ];

  const riskSummary: RiskCommandKpi[] = [
    {
      id: "fraud",
      label: labels.kpiFraud,
      value: String(countType("fraud")),
      hint: labels.hintFraud,
      href: `${base}/fraud-risks`,
      variant: countType("fraud") === 0 ? "warning" : "default",
    },
    {
      id: "it",
      label: labels.kpiIt,
      value: String(countType("it")),
      hint: labels.hintIt,
      href: `${base}/it-risks`,
    },
    {
      id: "compliance",
      label: labels.kpiCompliance,
      value: String(countType("compliance")),
      hint: labels.hintCompliance,
      href: `${base}/compliance-risks`,
    },
    {
      id: "financial",
      label: labels.kpiFinancial,
      value: String(countType("financial_statement")),
      hint: labels.hintFinancial,
      href: `${base}/financial-statement-risks`,
    },
    {
      id: "significant",
      label: labels.kpiSignificant,
      value: String(riskAssessment.significantRiskCount),
      hint: labels.hintSignificant,
      href: `${base}/significant-risks`,
      variant: riskAssessment.significantRiskCount > 0 ? "warning" : "default",
    },
    {
      id: "assertion-coverage",
      label: labels.kpiAssertionCoverage,
      value: `${assertionCoveragePct}%`,
      hint: labels.hintAssertionCoverage,
      href: `${base}/assertion-risks`,
    },
  ];

  const riskMetrics: RiskCommandKpi[] = [
    {
      id: "workflow",
      label: labels.kpiWorkflow,
      value: riskLabels.statuses[riskAssessment.assessmentStatus] ?? riskAssessment.assessmentStatus,
      hint: labels.hintWorkflow,
      variant: approvalVariant,
    },
    {
      id: "approval",
      label: labels.kpiApproval,
      value: riskLabels.statuses[riskAssessment.assessmentStatus] ?? riskAssessment.assessmentStatus,
      hint: `${labels.packageVersion} ${riskAssessment.assessmentVersion}`,
      variant: approvalVariant,
    },
    {
      id: "pending",
      label: labels.kpiPendingReview,
      value: String(reviewQueueCount),
      hint: labels.hintPendingReview,
      variant: reviewQueueCount > 0 ? "warning" : "default",
    },
    {
      id: "open-items",
      label: labels.kpiOpenItems,
      value: String(riskAssessment.openItemsCount),
      hint: labels.hintOpenItems,
      variant: riskAssessment.openItemsCount > 0 ? "warning" : "default",
    },
    {
      id: "owners",
      label: labels.kpiOwners,
      value: String(assignedOwnerCount),
      hint: labels.hintOwners,
      href: `${base}/owners`,
    },
    {
      id: "last-update",
      label: labels.kpiLastUpdate,
      value: formatDateTime(locale, riskAssessment.updatedAt) ?? notSet,
      hint: labels.hintLastUpdate,
    },
  ];

  const riskKpis: RiskCommandKpi[] = [
    {
      id: "health",
      label: labels.kpiHealth,
      value: riskHealth,
      hint: labels.hintHealth,
      variant: riskHealthVariant,
    },
    {
      id: "progress",
      label: labels.kpiProgress,
      value: `${riskAssessment.progressPct}%`,
      hint: labels.hintProgress,
    },
    {
      id: "categories",
      label: labels.kpiCategories,
      value: String(riskAssessment.categories.length),
      hint: labels.hintCategories,
      href: `${base}/categories`,
    },
    {
      id: "responses",
      label: labels.kpiResponses,
      value: String(riskAssessment.responses.length),
      hint: labels.hintResponses,
      href: `${base}/responses`,
    },
    {
      id: "procedures",
      label: labels.kpiProcedures,
      value: String(riskAssessment.procedureLinks.length),
      hint: labels.hintProcedures,
      href: `${base}/procedures`,
    },
    {
      id: "comments",
      label: labels.kpiComments,
      value: String(riskAssessment.notes.length),
      hint: labels.hintComments,
      href: `${base}/comments`,
    },
  ];

  const heatmapBuckets = buildRiskHeatmapData(riskAssessment.heatmap).map((bucket) => ({
    rating: bucket.rating,
    label: bucket.rating
      ? (ratingLabels[bucket.rating] ?? bucket.rating)
      : (riskLabels.heatmap.unratedLabel ?? labels.unrated),
    count: bucket.count,
    cssClass: bucket.cssClass,
  }));

  const matrixPreview = riskAssessment.heatmap.slice(0, 12).map((cell) => ({
    id: `${cell.accountName}-${cell.assertion}`,
    accountName: cell.accountName,
    assertion: riskLabels.assertions[cell.assertion] ?? cell.assertion,
    rating: cell.rating,
    ratingLabel: ratingLabel(cell.rating, ratingLabels, labels.unrated),
    isSignificant: cell.isSignificant,
    href: `${base}/matrix`,
  }));

  const categoryCounts = new Map<string, number>();
  for (const item of items) {
    const key = item.categoryName ?? labels.uncategorized;
    categoryCounts.set(key, (categoryCounts.get(key) ?? 0) + 1);
  }
  const categoryDistribution = [...categoryCounts.entries()].map(([name, count], index) => ({
    id: `cat-${index}`,
    name,
    count,
    href: `${base}/categories`,
  }));

  const mapRegisterRow = (item: (typeof items)[number]) => ({
    id: item.id,
    title: item.title,
    riskType: riskLabels.riskTypes[item.riskType] ?? item.riskType,
    residualRating: item.residualRating
      ? (ratingLabels[item.residualRating] ?? item.residualRating)
      : null,
    isSignificant: item.isSignificant,
    ownerId: item.ownerId,
    href: riskTypeHref(base, item.riskType),
  });

  const significantRisks = items.filter((i) => i.isSignificant).slice(0, 8).map(mapRegisterRow);
  const openResponses = openResponseItems.slice(0, 6).map(mapRegisterRow);
  const outstandingProcedures = outstandingProcedureItems.slice(0, 6).map(mapRegisterRow);

  const responses = riskAssessment.responses.slice(0, 6).map((response) => ({
    id: response.id,
    riskTitle: response.riskItemTitle,
    responseType: riskLabels.responseTypes[response.responseType] ?? response.responseType,
    description: response.description.trim().slice(0, 120),
    href: `${base}/responses`,
  }));

  const procedures = riskAssessment.procedureLinks.slice(0, 6).map((link) => ({
    id: link.id,
    riskTitle: link.riskItemTitle,
    procedureReference: link.procedureReference?.trim() || labels.notLinked,
    href: `${base}/procedures`,
  }));

  const mapComment = (note: RiskAssessmentWorkspaceView["notes"][number]) => ({
    id: note.id,
    body: note.body.trim().slice(0, 140),
    type: riskLabels.noteTypes[note.noteType] ?? note.noteType,
    time: formatRelativeTime(locale, note.createdAt),
    href: `${base}/comments`,
  });

  const comments = riskAssessment.notes.slice(0, 6).map(mapComment);
  const reviewComments = riskAssessment.reviewNotes.slice(0, 6).map(mapComment);

  const activityFromDb = activity.entries.map((entry) => ({
    id: entry.id,
    title: formatRiskAssessmentActivityAction(entry.action, riskLabels.history.actions),
    description: entry.summary?.trim() || entry.action,
    time: formatRelativeTime(locale, entry.createdAt),
  }));

  const workflowEvents: typeof activityFromDb = [];
  if (riskAssessment.approvedAt) {
    workflowEvents.push({
      id: `approved-${riskAssessment.approvedAt}`,
      title: riskLabels.statuses.approved ?? labels.changeApproved,
      description: labels.changeApprovedDescription,
      time: formatRelativeTime(locale, riskAssessment.approvedAt),
    });
  }
  if (riskAssessment.submittedAt) {
    workflowEvents.push({
      id: `submitted-${riskAssessment.submittedAt}`,
      title: riskLabels.statuses.submitted ?? labels.changeSubmitted,
      description: labels.changeSubmittedDescription,
      time: formatRelativeTime(locale, riskAssessment.submittedAt),
    });
  }

  const recentChanges = [...workflowEvents, ...activityFromDb].slice(0, 8);
  const activityFeed = [...activityFromDb, ...workflowEvents].slice(0, 12);

  return {
    executive,
    riskSummary,
    riskMetrics,
    riskKpis,
    workflowSteps,
    currentWorkflowStep,
    heatmapBuckets,
    matrixPreview,
    categoryDistribution,
    significantRisks,
    openResponses,
    outstandingProcedures,
    responses,
    procedures,
    reviewComments,
    comments,
    recentChanges,
    activityFeed,
    reviewQueueCount,
    approvalStatus:
      riskLabels.statuses[riskAssessment.assessmentStatus] ?? riskAssessment.assessmentStatus,
    approvalVariant,
    riskHealth,
    riskHealthVariant,
    assignedOwnerCount,
    assertionCoveragePct,
    lastUpdated: formatDateTime(locale, riskAssessment.updatedAt),
  };
}
