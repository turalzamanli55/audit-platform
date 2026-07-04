import type { Engagement } from "@/repositories/engagement/engagement-repository";
import {
  computeMaterialityProgress,
  computeOpenMaterialityItems,
} from "@/lib/materiality/materiality-rules";
import type { MaterialityWorkspaceView } from "@/lib/materiality/materiality-workspace-view";
import type {
  MaterialityBenchmarkType,
  MaterialityCalculationType,
  MaterialityCommentType,
  MaterialityPackageStatus,
  SpecificMaterialityItem,
} from "@/types/materiality";

export type MaterialityPackageRecord = {
  id: string;
  engagement_id: string;
  audit_plan_id: string;
  package_status: string;
  package_version: number;
  progress_pct: number;
  currency_code: string;
  overall_materiality: number | null;
  performance_materiality: number | null;
  performance_materiality_pct: number | null;
  specific_materiality: unknown;
  trivial_threshold: number | null;
  trivial_threshold_pct: number | null;
  basis_notes: string | null;
  selected_benchmark_id: string | null;
  submitted_at: string | null;
  returned_at: string | null;
  return_notes: string | null;
  approved_at: string | null;
  status: string;
  version: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
};

export type MaterialityBenchmarkRecord = {
  id: string;
  benchmark_type: MaterialityBenchmarkType;
  benchmark_label: string | null;
  benchmark_amount: number;
  percentage: number;
  calculated_materiality: number | null;
  is_selected: boolean;
  rationale: string | null;
  sort_order: number;
  version: number;
};

export type MaterialityCalculationRecord = {
  id: string;
  benchmark_id: string | null;
  calculation_type: MaterialityCalculationType;
  input_amount: number | null;
  percentage: number | null;
  result_amount: number | null;
  is_manual_override: boolean;
  explanation: string | null;
  formula: string | null;
  created_at: string;
};

export type MaterialityCommentRecord = {
  id: string;
  comment_type: MaterialityCommentType;
  body: string;
  created_at: string;
};

export type MaterialityVersionRecord = {
  id: string;
  version_number: number;
  change_summary: string | null;
  created_at: string;
};

function parseSpecificMateriality(value: unknown): SpecificMaterialityItem[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (item): item is SpecificMaterialityItem =>
      typeof item === "object" &&
      item !== null &&
      typeof (item as SpecificMaterialityItem).id === "string" &&
      typeof (item as SpecificMaterialityItem).label === "string" &&
      typeof (item as SpecificMaterialityItem).amount === "number",
  );
}

export function toMaterialityWorkspaceView(
  pkg: MaterialityPackageRecord,
  engagement: Engagement,
  companyName: string,
  benchmarks: MaterialityBenchmarkRecord[],
  calculations: MaterialityCalculationRecord[],
  comments: MaterialityCommentRecord[],
  versions: MaterialityVersionRecord[],
): MaterialityWorkspaceView {
  const benchmarkViews = benchmarks.map((benchmark) => ({
    id: benchmark.id,
    benchmarkType: benchmark.benchmark_type,
    benchmarkLabel: benchmark.benchmark_label,
    benchmarkAmount: Number(benchmark.benchmark_amount),
    percentage: Number(benchmark.percentage),
    calculatedMateriality:
      benchmark.calculated_materiality != null ? Number(benchmark.calculated_materiality) : null,
    isSelected: benchmark.is_selected,
    rationale: benchmark.rationale,
    sortOrder: benchmark.sort_order,
    version: benchmark.version,
  }));

  const calculationViews = calculations.map((calculation) => ({
    id: calculation.id,
    calculationType: calculation.calculation_type,
    inputAmount: calculation.input_amount != null ? Number(calculation.input_amount) : null,
    percentage: calculation.percentage != null ? Number(calculation.percentage) : null,
    resultAmount: calculation.result_amount != null ? Number(calculation.result_amount) : null,
    isManualOverride: calculation.is_manual_override,
    explanation: calculation.explanation,
    formula: calculation.formula,
    benchmarkId: calculation.benchmark_id,
    createdAt: calculation.created_at,
  }));

  const commentViews = comments.map((comment) => ({
    id: comment.id,
    commentType: comment.comment_type,
    body: comment.body,
    createdAt: comment.created_at,
  }));

  const versionViews = versions.map((version) => ({
    id: version.id,
    versionNumber: version.version_number,
    changeSummary: version.change_summary,
    createdAt: version.created_at,
  }));

  const specificMateriality = parseSpecificMateriality(pkg.specific_materiality);
  const pendingReviewCount = ["submitted", "under_review"].includes(pkg.package_status) ? 1 : 0;
  const openItemsCount = computeOpenMaterialityItems(pkg, benchmarks);

  const progressPct = computeMaterialityProgress({
    totalBenchmarks: benchmarks.length,
    benchmarksWithAmount: benchmarks.filter((benchmark) => Number(benchmark.benchmark_amount) > 0)
      .length,
    hasSelectedBenchmark: Boolean(pkg.selected_benchmark_id),
    hasOverallMateriality: pkg.overall_materiality != null,
    hasPerformanceMateriality: pkg.performance_materiality != null,
    hasTrivialThreshold: pkg.trivial_threshold != null,
    hasBasisNotes: Boolean(pkg.basis_notes?.trim()),
  });

  return {
    id: pkg.id,
    engagementId: pkg.engagement_id,
    engagementSlug: engagement.slug,
    engagementName: engagement.name,
    companyName,
    auditPlanId: pkg.audit_plan_id,
    packageStatus: pkg.package_status as MaterialityPackageStatus,
    packageVersion: pkg.package_version,
    progressPct: pkg.progress_pct ?? progressPct,
    currencyCode: pkg.currency_code,
    overallMateriality: pkg.overall_materiality != null ? Number(pkg.overall_materiality) : null,
    performanceMateriality:
      pkg.performance_materiality != null ? Number(pkg.performance_materiality) : null,
    performanceMaterialityPct:
      pkg.performance_materiality_pct != null ? Number(pkg.performance_materiality_pct) : null,
    specificMateriality,
    trivialThreshold: pkg.trivial_threshold != null ? Number(pkg.trivial_threshold) : null,
    trivialThresholdPct:
      pkg.trivial_threshold_pct != null ? Number(pkg.trivial_threshold_pct) : null,
    basisNotes: pkg.basis_notes,
    selectedBenchmarkId: pkg.selected_benchmark_id,
    benchmarks: benchmarkViews,
    calculations: calculationViews,
    comments: commentViews,
    reviewComments: commentViews.filter((comment) => comment.commentType === "review"),
    internalComments: commentViews.filter((comment) => comment.commentType === "internal"),
    versions: versionViews,
    pendingReviewCount,
    openItemsCount,
    status: pkg.status,
    version: pkg.version,
    isArchived: Boolean(pkg.deleted_at) || pkg.status === "archived",
    deletedAt: pkg.deleted_at,
    submittedAt: pkg.submitted_at,
    returnedAt: pkg.returned_at,
    returnNotes: pkg.return_notes,
    approvedAt: pkg.approved_at,
    createdAt: pkg.created_at,
    updatedAt: pkg.updated_at,
  };
}
