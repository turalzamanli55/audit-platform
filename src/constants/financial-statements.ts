export const FINANCIAL_STATEMENTS_PERMISSIONS = {
  READ: "financialStatements.read",
  CREATE: "financialStatements.create",
  UPDATE: "financialStatements.update",
  ARCHIVE: "financialStatements.archive",
  REVIEW: "financialStatements.review",
  APPROVE: "financialStatements.approve",
  COMMENT: "financialStatements.comment",
  EXPORT: "financialStatements.export",
} as const;

export const AUDIT_RESOURCE_TYPE = "financial_statements";

export const FINANCIAL_STATEMENT_PACKAGE_STATUSES = [
  "draft",
  "prepared",
  "submitted",
  "under_review",
  "returned",
  "approved",
  "published",
  "archived",
] as const;

export const FINANCIAL_STATEMENT_SECTION_STATUSES = [
  "pending",
  "under_review",
  "returned",
  "resolved",
] as const;

export const FINANCIAL_STATEMENT_SECTION_TYPES = [
  "balance_sheet",
  "income_statement",
  "cash_flow_statement",
  "changes_in_equity",
  "notes_links",
  "cross_references",
] as const;

export const FINANCIAL_STATEMENT_COMMENT_TYPES = [
  "financial_statement",
  "reviewer",
  "internal",
] as const;

export const LOCKED_FINANCIAL_STATEMENT_STATUSES = ["published", "archived"] as const;

export const FINANCIAL_STATEMENT_SECTION_PRIORITIES = ["low", "medium", "high", "critical"] as const;

export const FINANCIAL_STATEMENT_SECTION_SEVERITIES = [
  "informational",
  "low",
  "medium",
  "high",
  "critical",
] as const;

export const FINANCIAL_STATEMENT_ACTIVITY_ACTIONS = {
  CREATED: "financialStatements.created",
  UPDATED: "financialStatements.updated",
  ARCHIVED: "financialStatements.archived",
  RESTORED: "financialStatements.restored",
  PREPARED: "financialStatements.prepared",
  SUBMITTED: "financialStatements.submitted",
  RETURNED: "financialStatements.returned",
  APPROVED: "financialStatements.approved",
  PUBLISHED: "financialStatements.published",
  ITEM_SYNCED: "financialStatements.section.synced",
  ITEM_RESOLVED: "financialStatements.section.resolved",
  ITEM_RETURNED: "financialStatements.section.returned",
  ITEM_REOPENED: "financialStatements.section.reopened",
  ITEM_ASSIGNED: "financialStatements.section.assigned",
  ITEM_UPDATED: "financialStatements.section.updated",
  COMMENT_ADDED: "financialStatements.comment.added",
  COMMENT_UPDATED: "financialStatements.comment.updated",
  COMMENT_ARCHIVED: "financialStatements.comment.archived",
  COMMENT_RESTORED: "financialStatements.comment.restored",
  COMMENT_RESOLVED: "financialStatements.comment.resolved",
  COMMENT_REOPENED: "financialStatements.comment.reopened",
  VERSION_CREATED: "financialStatements.version.created",
  VERSION_RESTORED: "financialStatements.version.restored",
} as const;
