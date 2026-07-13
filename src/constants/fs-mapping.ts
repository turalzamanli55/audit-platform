export const FS_MAPPING_PERMISSIONS = {
  READ: "fs_mapping.read",
  CREATE: "fs_mapping.create",
  UPDATE: "fs_mapping.update",
  VALIDATE: "fs_mapping.validate",
  APPROVE: "fs_mapping.approve",
  PUBLISH: "fs_mapping.publish",
  ARCHIVE: "fs_mapping.archive",
} as const;

export const AUDIT_RESOURCE_TYPE = "fs_mapping";

export const FS_MAPPING_SET_STATUSES = [
  "draft",
  "validated",
  "approved",
  "published",
  "archived",
] as const;

export const FS_MAPPING_VERSION_STATUSES = ["draft", "published", "archived"] as const;

export const FS_MAPPING_STANDARDS = ["ifrs", "sme_ifrs", "local_gaap", "custom"] as const;

export const FS_ACCOUNT_CLASSIFICATIONS = [
  "assets",
  "current_assets",
  "non_current_assets",
  "liabilities",
  "current_liabilities",
  "non_current_liabilities",
  "equity",
  "revenue",
  "cost_of_sales",
  "operating_expenses",
  "finance_costs",
  "tax",
  "oci",
  "cash_flow",
  "unclassified",
] as const;

export const FS_MAPPING_RULE_TYPES = [
  "one_to_one",
  "many_to_one",
  "one_to_many",
  "formula",
  "calculated",
  "conditional",
] as const;

export const FS_AGGREGATION_METHODS = [
  "sum",
  "subtract",
  "average",
  "ratio",
  "running_total",
  "weighted",
  "formula",
] as const;

export const FS_STATEMENT_SECTIONS = [
  "statement_of_financial_position",
  "statement_of_profit_or_loss",
  "statement_of_comprehensive_income",
  "statement_of_changes_in_equity",
  "statement_of_cash_flows",
  "other",
] as const;

export const FS_COMPARATIVE_PERIODS = ["current_year", "previous_year", "multi_year"] as const;

export const FS_MAPPING_WORKSPACE_SECTIONS = [
  "overview",
  "explorer",
  "hierarchy",
  "statement-tree",
  "validation",
  "versions",
  "history",
  "search",
] as const;

export const LOCKED_FS_MAPPING_STATUSES = ["published", "archived"] as const;

export const FS_MAPPING_ACTIVITY_ACTIONS = {
  CREATED: "fs_mapping.created",
  UPDATED: "fs_mapping.updated",
  VALIDATED: "fs_mapping.validated",
  APPROVED: "fs_mapping.approved",
  PUBLISHED: "fs_mapping.published",
  ARCHIVED: "fs_mapping.archived",
  ROLLED_BACK: "fs_mapping.rolled_back",
} as const;
