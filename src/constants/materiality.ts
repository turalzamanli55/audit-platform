export const MATERIALITY_PERMISSIONS = {
  READ: "materiality.read",
  CREATE: "materiality.create",
  UPDATE: "materiality.update",
  ARCHIVE: "materiality.archive",
  REVIEW: "materiality.review",
  APPROVE: "materiality.approve",
  COMMENT: "materiality.comment",
} as const;

export const AUDIT_RESOURCE_TYPE = "materiality";

export const MATERIALITY_PACKAGE_STATUSES = [
  "draft",
  "submitted",
  "under_review",
  "returned",
  "approved",
  "archived",
] as const;

export const MATERIALITY_BENCHMARK_TYPES = [
  "revenue",
  "profit_before_tax",
  "ebitda",
  "total_assets",
  "equity",
  "expenses",
  "manual",
] as const;

export const MATERIALITY_CALCULATION_TYPES = [
  "overall",
  "performance",
  "specific",
  "trivial",
] as const;

export const MATERIALITY_COMMENT_TYPES = ["review", "internal"] as const;

export const DEFAULT_PERFORMANCE_MATERIALITY_PCT = 75;

export const DEFAULT_TRIVIAL_THRESHOLD_PCT = 5;

export const DEFAULT_MATERIALITY_BENCHMARKS = [
  { type: "revenue" as const, label: "Revenue", percentage: 1, sortOrder: 1 },
  { type: "profit_before_tax" as const, label: "Profit before tax", percentage: 5, sortOrder: 2 },
  { type: "total_assets" as const, label: "Total assets", percentage: 2, sortOrder: 3 },
  { type: "manual" as const, label: "Manual benchmark", percentage: 1, sortOrder: 4 },
] as const;

export const LOCKED_MATERIALITY_STATUSES = ["approved", "archived"] as const;

export const MATERIALITY_ACTIVITY_ACTIONS = {
  CREATED: "materiality.created",
  UPDATED: "materiality.updated",
  ARCHIVED: "materiality.archived",
  RESTORED: "materiality.restored",
  SUBMITTED: "materiality.submitted",
  RETURNED: "materiality.returned",
  APPROVED: "materiality.approved",
  BENCHMARK_ADDED: "materiality.benchmark.added",
  BENCHMARK_UPDATED: "materiality.benchmark.updated",
  BENCHMARK_UPSERTED: "materiality.benchmark.upserted",
  BENCHMARK_SELECTED: "materiality.benchmark.selected",
  CALCULATION_RECORDED: "materiality.calculation.recorded",
  THRESHOLD_UPDATED: "materiality.threshold.updated",
  THRESHOLDS_UPDATED: "materiality.thresholds.updated",
  COMMENT_ADDED: "materiality.comment.added",
  VERSION_CREATED: "materiality.version.created",
} as const;
