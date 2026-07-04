import "server-only";

import type { Locale } from "@/i18n";
import type { Dictionary } from "@/i18n/get-dictionary";
import { formatCurrency } from "@/lib/materiality/materiality-workspace-display";
import type { MaterialityWorkspaceView } from "@/lib/materiality/materiality-workspace-view";
import type {
  MaterialityActivityRow,
  MaterialityBenchmarkRow,
  MaterialityCalculationRow,
  MaterialityCommandCenterData,
  MaterialityCommandKpi,
  MaterialityWorkflowStep,
} from "@/types/materiality-command-center";

type CommandCenterLabels = Dictionary["materiality"]["workspace"]["commandCenter"];

const WORKFLOW_STEP_IDS = [
  "draft",
  "submitted",
  "under_review",
  "returned",
  "approved",
  "integrated",
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

function resolveCurrentWorkflowStep(materiality: MaterialityWorkspaceView): string {
  if (materiality.packageStatus === "approved") return "integrated";
  if (materiality.packageStatus === "returned") return "returned";
  if (materiality.packageStatus === "under_review") return "under_review";
  if (materiality.packageStatus === "submitted") return "submitted";
  if (materiality.submittedAt) return "submitted";
  return "draft";
}

function buildWorkflowSteps(
  materiality: MaterialityWorkspaceView,
  labels: CommandCenterLabels,
): { steps: MaterialityWorkflowStep[]; current: string } {
  const current = resolveCurrentWorkflowStep(materiality);
  const currentIndex = WORKFLOW_STEP_IDS.indexOf(current as (typeof WORKFLOW_STEP_IDS)[number]);

  const stepLabels: Record<string, string> = {
    draft: labels.stepDraft,
    submitted: labels.stepSubmitted,
    under_review: labels.stepUnderReview,
    returned: labels.stepReturned,
    approved: labels.stepApproved,
    integrated: labels.stepIntegrated,
  };

  const steps: MaterialityWorkflowStep[] = WORKFLOW_STEP_IDS.map((id, index) => ({
    id,
    label: stepLabels[id] ?? id,
    status:
      index < currentIndex ? "complete" : index === currentIndex ? "current" : "upcoming",
  }));

  return { steps, current };
}

function resolveCalculationMethod(
  materiality: MaterialityWorkspaceView,
  labels: CommandCenterLabels,
): string {
  const overallCalc = materiality.calculations.find((c) => c.calculationType === "overall");
  if (!overallCalc) return labels.methodNotSet;
  if (overallCalc.isManualOverride) return labels.methodManualOverride;
  if (overallCalc.formula?.trim()) return overallCalc.formula.trim();
  return labels.methodBenchmarkPct;
}

function buildRecentChanges(
  materiality: MaterialityWorkspaceView,
  locale: Locale,
  labels: CommandCenterLabels,
  statusLabels: Dictionary["materiality"]["statuses"],
): MaterialityActivityRow[] {
  const events: MaterialityActivityRow[] = [];

  if (materiality.approvedAt) {
    events.push({
      id: `approved-${materiality.approvedAt}`,
      title: statusLabels.approved ?? labels.changeApproved,
      description: labels.changeApprovedDescription,
      time: formatRelativeTime(locale, materiality.approvedAt),
    });
  }
  if (materiality.returnedAt) {
    events.push({
      id: `returned-${materiality.returnedAt}`,
      title: statusLabels.returned ?? labels.changeReturned,
      description: materiality.returnNotes?.trim() || labels.changeReturnedDescription,
      time: formatRelativeTime(locale, materiality.returnedAt),
    });
  }
  if (materiality.submittedAt) {
    events.push({
      id: `submitted-${materiality.submittedAt}`,
      title: statusLabels.submitted ?? labels.changeSubmitted,
      description: labels.changeSubmittedDescription,
      time: formatRelativeTime(locale, materiality.submittedAt),
    });
  }

  for (const version of materiality.versions.slice(0, 4)) {
    events.push({
      id: version.id,
      title: `${labels.versionLabel} ${version.versionNumber}`,
      description: version.changeSummary?.trim() || labels.versionCreated,
      time: formatRelativeTime(locale, version.createdAt),
    });
  }

  events.sort(
    (a, b) =>
      new Date(
        materiality.versions.find((v) => v.id === b.id)?.createdAt ??
          materiality.updatedAt,
      ).getTime() -
      new Date(
        materiality.versions.find((v) => v.id === a.id)?.createdAt ??
          materiality.updatedAt,
      ).getTime(),
  );

  return events.slice(0, 8);
}

export function loadMaterialityCommandCenter(input: {
  locale: Locale;
  materiality: MaterialityWorkspaceView;
  labels: CommandCenterLabels;
  materialityLabels: Dictionary["materiality"];
}): MaterialityCommandCenterData {
  const { locale, materiality, labels, materialityLabels } = input;
  const base = `/${locale}/app/engagements/${materiality.engagementSlug}/materiality`;
  const fmt = (amount: number | null | undefined) =>
    formatCurrency(amount, materiality.currencyCode);

  const selectedBenchmark =
    materiality.benchmarks.find(
      (b) => b.isSelected || b.id === materiality.selectedBenchmarkId,
    ) ?? null;

  const { steps: workflowSteps, current: currentWorkflowStep } = buildWorkflowSteps(
    materiality,
    labels,
  );

  const reviewQueueCount = materiality.pendingReviewCount;
  const approvalVariant =
    materiality.packageStatus === "approved"
      ? "success"
      : materiality.packageStatus === "submitted" ||
          materiality.packageStatus === "under_review"
        ? "warning"
        : materiality.packageStatus === "returned"
          ? "destructive"
          : "default";

  const executive: MaterialityCommandKpi[] = [
    {
      id: "overall",
      label: labels.kpiOverall,
      value: fmt(materiality.overallMateriality),
      hint: labels.hintOverall,
      href: `${base}/overall`,
    },
    {
      id: "performance",
      label: labels.kpiPerformance,
      value: fmt(materiality.performanceMateriality),
      hint:
        materiality.performanceMaterialityPct != null
          ? `${materiality.performanceMaterialityPct}% ${labels.ofOverall}`
          : labels.hintPerformance,
      href: `${base}/performance`,
    },
    {
      id: "specific",
      label: labels.kpiSpecific,
      value:
        materiality.specificMateriality.length > 0
          ? String(materiality.specificMateriality.length)
          : labels.notSet,
      hint: labels.hintSpecific,
      href: `${base}/specific`,
    },
    {
      id: "trivial",
      label: labels.kpiTrivial,
      value: fmt(materiality.trivialThreshold),
      hint:
        materiality.trivialThresholdPct != null
          ? `${materiality.trivialThresholdPct}% ${labels.ofOverall}`
          : labels.hintTrivial,
      href: `${base}/overall`,
    },
  ];

  const materialitySummary: MaterialityCommandKpi[] = [
    {
      id: "benchmark",
      label: labels.kpiBenchmark,
      value: selectedBenchmark
        ? selectedBenchmark.benchmarkLabel ??
          materialityLabels.benchmarkTypes[selectedBenchmark.benchmarkType] ??
          selectedBenchmark.benchmarkType
        : labels.notSet,
      hint: selectedBenchmark
        ? `${selectedBenchmark.percentage}% · ${fmt(selectedBenchmark.benchmarkAmount)}`
        : labels.hintBenchmark,
      href: `${base}/benchmarks`,
    },
    {
      id: "percentage",
      label: labels.kpiPercentage,
      value: selectedBenchmark ? `${selectedBenchmark.percentage}%` : labels.notSet,
      hint: labels.hintPercentage,
      href: `${base}/benchmarks`,
    },
    {
      id: "method",
      label: labels.kpiMethod,
      value: resolveCalculationMethod(materiality, labels),
      hint: labels.hintMethod,
      href: `${base}/calculations`,
    },
    {
      id: "status",
      label: labels.kpiStatus,
      value: materialityLabels.statuses[materiality.packageStatus] ?? materiality.packageStatus,
      hint: `${labels.packageVersion} ${materiality.packageVersion}`,
      variant: approvalVariant,
    },
  ];

  const materialityMetrics: MaterialityCommandKpi[] = [
    {
      id: "workflow",
      label: labels.kpiWorkflow,
      value: materialityLabels.statuses[materiality.packageStatus] ?? materiality.packageStatus,
      hint: labels.hintWorkflow,
      variant: approvalVariant,
    },
    {
      id: "version",
      label: labels.kpiVersion,
      value: String(materiality.packageVersion),
      hint: labels.hintVersion,
      href: `${base}/versions`,
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
      value: String(materiality.openItemsCount),
      hint: labels.hintOpenItems,
      variant: materiality.openItemsCount > 0 ? "warning" : "default",
    },
    {
      id: "last-update",
      label: labels.kpiLastUpdate,
      value: formatDateTime(locale, materiality.updatedAt) ?? labels.notSet,
      hint: labels.hintLastUpdate,
    },
    {
      id: "reviewer",
      label: labels.kpiReviewer,
      value: labels.reviewerNotAssigned,
      hint: labels.hintReviewer,
    },
  ];

  const thresholds: MaterialityCommandCenterData["thresholds"] = [
    {
      id: "overall",
      label: labels.kpiOverall,
      value: fmt(materiality.overallMateriality),
      hint: materiality.basisNotes?.trim().slice(0, 80) ?? null,
      href: `${base}/overall`,
    },
    {
      id: "performance",
      label: labels.kpiPerformance,
      value: fmt(materiality.performanceMateriality),
      hint:
        materiality.performanceMaterialityPct != null
          ? `${materiality.performanceMaterialityPct}% ${labels.ofOverall}`
          : null,
      href: `${base}/performance`,
    },
    {
      id: "specific",
      label: labels.kpiSpecific,
      value:
        materiality.specificMateriality.length > 0
          ? materiality.specificMateriality
              .slice(0, 2)
              .map((item) => `${item.label}: ${fmt(item.amount)}`)
              .join(" · ")
          : labels.notSet,
      hint:
        materiality.specificMateriality.length > 2
          ? `+${materiality.specificMateriality.length - 2} ${labels.moreItems}`
          : null,
      href: `${base}/specific`,
    },
    {
      id: "trivial",
      label: labels.kpiTrivial,
      value: fmt(materiality.trivialThreshold),
      hint:
        materiality.trivialThresholdPct != null
          ? `${materiality.trivialThresholdPct}% ${labels.ofOverall}`
          : null,
      href: `${base}/overall`,
    },
  ];

  const rankedBenchmarks = [...materiality.benchmarks].sort((a, b) => {
    const aCalc = a.calculatedMateriality ?? 0;
    const bCalc = b.calculatedMateriality ?? 0;
    return bCalc - aCalc;
  });

  const benchmarkRanking: MaterialityBenchmarkRow[] = rankedBenchmarks.map((benchmark, index) => ({
    id: benchmark.id,
    label:
      benchmark.benchmarkLabel ??
      materialityLabels.benchmarkTypes[benchmark.benchmarkType] ??
      benchmark.benchmarkType,
    amount: fmt(benchmark.benchmarkAmount),
    percentage: `${benchmark.percentage}%`,
    calculated: fmt(benchmark.calculatedMateriality),
    isSelected: benchmark.isSelected || benchmark.id === materiality.selectedBenchmarkId,
    rank: index + 1,
    href: `${base}/benchmarks`,
  }));

  const mapCalculation = (calc: MaterialityWorkspaceView["calculations"][number]): MaterialityCalculationRow => ({
    id: calc.id,
    type:
      materialityLabels.calculationTypes[calc.calculationType] ?? calc.calculationType,
    input: fmt(calc.inputAmount),
    percentage: calc.percentage != null ? `${calc.percentage}%` : "—",
    result: fmt(calc.resultAmount),
    method: calc.isManualOverride
      ? labels.methodManualOverride
      : calc.formula?.trim() || labels.methodBenchmarkPct,
    isManualOverride: calc.isManualOverride,
    time: formatRelativeTime(locale, calc.createdAt),
    href: `${base}/calculations`,
  });

  const calculations = materiality.calculations.map(mapCalculation).slice(0, 8);
  const calculationFlow = materiality.calculations
    .filter((c) => ["overall", "performance", "trivial"].includes(c.calculationType))
    .map(mapCalculation);

  const versions = materiality.versions.slice(0, 6).map((version) => ({
    id: version.id,
    versionNumber: version.versionNumber,
    summary: version.changeSummary?.trim() || labels.versionCreated,
    time: formatRelativeTime(locale, version.createdAt),
    href: `${base}/versions`,
  }));

  const mapComment = (comment: MaterialityWorkspaceView["comments"][number]): MaterialityCommandCenterData["comments"][number] => ({
    id: comment.id,
    body: comment.body.trim().slice(0, 160),
    type:
      materialityLabels.commentTypes[comment.commentType] ?? comment.commentType,
    time: formatRelativeTime(locale, comment.createdAt),
    href: `${base}/comments`,
  });

  const comments = materiality.comments.slice(0, 6).map(mapComment);
  const reviewComments = materiality.reviewComments.slice(0, 6).map(mapComment);
  const recentChanges = buildRecentChanges(materiality, locale, labels, materialityLabels.statuses);
  const activityFeed = recentChanges;

  const specificTotal = materiality.specificMateriality.reduce((sum, item) => sum + item.amount, 0);
  const specificMaterialitySummary =
    materiality.specificMateriality.length > 0
      ? `${materiality.specificMateriality.length} ${labels.specificItems} · ${fmt(specificTotal)}`
      : labels.notSet;

  return {
    executive,
    materialitySummary,
    materialityMetrics,
    workflowSteps,
    currentWorkflowStep,
    thresholds,
    selectedBenchmark: selectedBenchmark
      ? {
          label:
            selectedBenchmark.benchmarkLabel ??
            materialityLabels.benchmarkTypes[selectedBenchmark.benchmarkType] ??
            selectedBenchmark.benchmarkType,
          amount: fmt(selectedBenchmark.benchmarkAmount),
          percentage: `${selectedBenchmark.percentage}%`,
          calculated: fmt(selectedBenchmark.calculatedMateriality),
        }
      : null,
    calculationMethod: resolveCalculationMethod(materiality, labels),
    benchmarkRanking,
    calculations,
    calculationFlow,
    versions,
    versionTimeline: versions,
    reviewComments,
    comments,
    recentChanges,
    activityFeed,
    reviewQueueCount,
    approvalStatus:
      materialityLabels.statuses[materiality.packageStatus] ?? materiality.packageStatus,
    approvalVariant,
    lastUpdated: formatDateTime(locale, materiality.updatedAt),
    assignedReviewer: null,
    specificMaterialitySummary,
  };
}
