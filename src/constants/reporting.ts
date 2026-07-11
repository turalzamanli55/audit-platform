export const REPORTING_PERMISSIONS = {
  READ: "reporting.read",
  CREATE: "reporting.create",
  UPDATE: "reporting.update",
  ARCHIVE: "reporting.archive",
  REVIEW: "reporting.review",
  APPROVE: "reporting.approve",
  COMMENT: "reporting.comment",
} as const;

export const AUDIT_RESOURCE_TYPE = "reporting";

export const REPORTING_PACKAGE_STATUSES = [
  "draft",
  "submitted",
  "under_review",
  "returned",
  "approved",
  "archived",
] as const;

export const REPORT_SECTION_STATUSES = [
  "pending",
  "under_review",
  "returned",
  "resolved",
] as const;

export const REPORT_SECTION_TYPES = [
  "executive_summary",
  "financial_statements",
  "ifrs_notes",
  "management_letter",
  "audit_findings",
  "recommendations",
  "appendices",
] as const;

export const REPORT_COMMENT_TYPES = ["reporting", "reviewer", "internal"] as const;

export const LOCKED_REPORTING_STATUSES = ["approved", "archived"] as const;

export const REPORT_SECTION_PRIORITIES = ["low", "medium", "high", "critical"] as const;

export const REPORT_SECTION_SEVERITIES = [
  "informational",
  "low",
  "medium",
  "high",
  "critical",
] as const;

export const REPORTING_ACTIVITY_ACTIONS = {
  CREATED: "reporting.created",
  UPDATED: "reporting.updated",
  ARCHIVED: "reporting.archived",
  RESTORED: "reporting.restored",
  SUBMITTED: "reporting.submitted",
  RETURNED: "reporting.returned",
  APPROVED: "reporting.approved",
  ITEM_SYNCED: "reporting.section.synced",
  ITEM_RESOLVED: "reporting.section.resolved",
  ITEM_RETURNED: "reporting.section.returned",
  ITEM_REOPENED: "reporting.section.reopened",
  ITEM_ASSIGNED: "reporting.section.assigned",
  ITEM_UPDATED: "reporting.section.updated",
  COMMENT_ADDED: "reporting.comment.added",
  COMMENT_UPDATED: "reporting.comment.updated",
  COMMENT_ARCHIVED: "reporting.comment.archived",
  COMMENT_RESTORED: "reporting.comment.restored",
  COMMENT_RESOLVED: "reporting.comment.resolved",
  COMMENT_REOPENED: "reporting.comment.reopened",
  VERSION_CREATED: "reporting.version.created",
  VERSION_RESTORED: "reporting.version.restored",
} as const;
