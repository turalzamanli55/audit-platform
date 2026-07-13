export const FS_RENDERING_PERMISSIONS = {
  READ: "fs_rendering.read",
  CREATE: "fs_rendering.create",
  UPDATE: "fs_rendering.update",
  VALIDATE: "fs_rendering.validate",
  APPROVE: "fs_rendering.approve",
  PUBLISH: "fs_rendering.publish",
  ARCHIVE: "fs_rendering.archive",
} as const;

export const FS_RENDERING_AUDIT_RESOURCE_TYPE = "fs_rendering";

export const FS_RENDER_PRESENTATION_STATUSES = [
  "draft",
  "validated",
  "approved",
  "published",
  "archived",
] as const;

export const FS_RENDER_VERSION_STATUSES = ["draft", "published", "archived"] as const;

export const FS_RENDER_STANDARDS = ["ifrs", "sme_ifrs", "local_gaap", "custom"] as const;

export const FS_RENDER_LAYOUT_MODES = [
  "collapsed",
  "expanded",
  "tree",
  "grouped",
  "flat",
] as const;

export const FS_RENDER_COMPARATIVE_MODES = [
  "current_period",
  "previous_period",
  "multi_year",
] as const;

export const FS_RENDER_STATEMENT_TYPES = [
  "statement_of_financial_position",
  "statement_of_profit_or_loss",
  "statement_of_comprehensive_income",
  "statement_of_changes_in_equity",
  "statement_of_cash_flows",
] as const;

export const FS_RENDER_LINE_STYLES = [
  "normal",
  "subtotal",
  "total",
  "double_total",
  "bold",
  "hidden",
  "calculated",
  "reference",
  "cross_reference",
] as const;

export const FS_RENDERING_WORKSPACE_SECTIONS = [
  "overview",
  "explorer",
  "presentation",
  "layouts",
  "validation",
  "versions",
  "history",
  "search",
] as const;

export const FS_RENDERING_ACTIVITY_ACTIONS = {
  CREATED: "fs_rendering.created",
  UPDATED: "fs_rendering.updated",
  VALIDATED: "fs_rendering.validated",
  APPROVED: "fs_rendering.approved",
  PUBLISHED: "fs_rendering.published",
  ARCHIVED: "fs_rendering.archived",
  ROLLED_BACK: "fs_rendering.rolled_back",
} as const;

export const DEFAULT_FS_RENDER_FORMATTING = {
  currencyCode: "AZN",
  decimals: 2,
  thousandsSeparator: true,
  negativeStyle: "parentheses" as const,
  zeroSuppression: false,
  multiCurrencyDisplay: false,
};
