export const OPINION_PERMISSIONS = {
  READ: "opinion.read",
  CREATE: "opinion.create",
  UPDATE: "opinion.update",
  ARCHIVE: "opinion.archive",
  REVIEW: "opinion.review",
  APPROVE: "opinion.approve",
  COMMENT: "opinion.comment",
} as const;

export const AUDIT_RESOURCE_TYPE = "opinion";

export const OPINION_PACKAGE_STATUSES = [
  "draft",
  "submitted",
  "under_review",
  "returned",
  "approved",
  "archived",
] as const;

export const OPINION_SECTION_STATUSES = [
  "pending",
  "under_review",
  "returned",
  "resolved",
] as const;

export const OPINION_SECTION_TYPES = [
  "opinion_type",
  "basis_for_opinion",
  "key_audit_matters",
  "emphasis_of_matter",
  "other_information",
  "responsibilities",
  "signature",
] as const;

export const OPINION_TYPES = [
  "unqualified",
  "qualified",
  "adverse",
  "disclaimer",
] as const;

export const OPINION_COMMENT_TYPES = ["opinion", "reviewer", "internal"] as const;

export const LOCKED_OPINION_STATUSES = ["approved", "archived"] as const;

export const OPINION_SECTION_PRIORITIES = ["low", "medium", "high", "critical"] as const;

export const OPINION_SECTION_SEVERITIES = [
  "informational",
  "low",
  "medium",
  "high",
  "critical",
] as const;

export const OPINION_ACTIVITY_ACTIONS = {
  CREATED: "opinion.created",
  UPDATED: "opinion.updated",
  ARCHIVED: "opinion.archived",
  RESTORED: "opinion.restored",
  SUBMITTED: "opinion.submitted",
  RETURNED: "opinion.returned",
  APPROVED: "opinion.approved",
  ITEM_SYNCED: "opinion.section.synced",
  ITEM_RESOLVED: "opinion.section.resolved",
  ITEM_RETURNED: "opinion.section.returned",
  ITEM_REOPENED: "opinion.section.reopened",
  ITEM_ASSIGNED: "opinion.section.assigned",
  ITEM_UPDATED: "opinion.section.updated",
  COMMENT_ADDED: "opinion.comment.added",
  COMMENT_UPDATED: "opinion.comment.updated",
  COMMENT_ARCHIVED: "opinion.comment.archived",
  COMMENT_RESTORED: "opinion.comment.restored",
  COMMENT_RESOLVED: "opinion.comment.resolved",
  COMMENT_REOPENED: "opinion.comment.reopened",
  VERSION_CREATED: "opinion.version.created",
  VERSION_RESTORED: "opinion.version.restored",
} as const;
