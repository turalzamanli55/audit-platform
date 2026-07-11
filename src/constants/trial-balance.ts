export const TRIAL_BALANCE_PERMISSIONS = {
  READ: "trial_balance.read",
  CREATE: "trial_balance.create",
  UPDATE: "trial_balance.update",
  REVIEW: "trial_balance.review",
  APPROVE: "trial_balance.approve",
  ARCHIVE: "trial_balance.archive",
} as const;

export const AUDIT_RESOURCE_TYPE = "trial_balance";

export const TRIAL_BALANCE_PACKAGE_STATUSES = [
  "draft",
  "validated",
  "submitted",
  "under_review",
  "returned",
  "approved",
  "locked",
  "archived",
] as const;

export const TRIAL_BALANCE_ACCOUNT_TYPES = [
  "asset",
  "liability",
  "equity",
  "revenue",
  "expense",
  "other_income",
  "other_expense",
  "oci",
  "unknown",
] as const;

export const TRIAL_BALANCE_PERIOD_TYPES = [
  "opening",
  "current",
  "closing",
  "monthly",
  "quarterly",
  "yearly",
  "comparative",
  "prior_year",
] as const;

export const TRIAL_BALANCE_ADJUSTMENT_TYPES = [
  "adjustment",
  "journal_entry",
  "reclassification",
  "correction",
  "audit_entry",
  "proposed",
  "approved_entry",
  "rejected_entry",
] as const;

export const TRIAL_BALANCE_ADJUSTMENT_STATUSES = [
  "draft",
  "proposed",
  "approved",
  "rejected",
  "posted",
  "reversed",
] as const;

export const TRIAL_BALANCE_MAPPING_FRAMEWORKS = [
  "ifrs",
  "ias",
  "local_gaap",
  "company",
  "ai_future",
] as const;

export const TRIAL_BALANCE_LEAD_SCHEDULES = [
  "cash",
  "receivables",
  "inventory",
  "ppe",
  "payables",
  "loans",
  "revenue",
  "expenses",
  "equity",
  "other",
  "unmapped",
] as const;

export const TRIAL_BALANCE_FS_STATEMENTS = [
  "statement_of_financial_position",
  "statement_of_profit_or_loss",
  "oci",
  "cash_flow",
  "equity",
  "notes",
  "unmapped",
] as const;

export const LOCKED_TRIAL_BALANCE_STATUSES = ["locked", "archived"] as const;

export const TRIAL_BALANCE_WORKSPACE_SECTIONS = [
  "overview",
  "accounts",
  "hierarchy",
  "adjustments",
  "reclassifications",
  "mappings",
  "validation",
  "currencies",
  "periods",
  "comparatives",
  "history",
  "versions",
  "settings",
  "search",
] as const;

export const TRIAL_BALANCE_ACTIVITY_ACTIONS = {
  CREATED: "trialBalance.created",
  IMPORTED: "trialBalance.imported",
  UPDATED: "trialBalance.updated",
  VALIDATED: "trialBalance.validated",
  SUBMITTED: "trialBalance.submitted",
  RETURNED: "trialBalance.returned",
  APPROVED: "trialBalance.approved",
  LOCKED: "trialBalance.locked",
  ARCHIVED: "trialBalance.archived",
  ADJUSTED: "trialBalance.adjusted",
  MAPPED: "trialBalance.mapped",
  MERGED: "trialBalance.merged",
  SPLIT: "trialBalance.split",
  ROLLED_FORWARD: "trialBalance.rolledForward",
  VERSION_CREATED: "trialBalance.version.created",
  VERSION_RESTORED: "trialBalance.version.restored",
} as const;
