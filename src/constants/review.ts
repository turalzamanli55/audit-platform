export const REVIEW_PERMISSIONS = {
  READ: "review.read",
  CREATE: "review.create",
  UPDATE: "review.update",
  ARCHIVE: "review.archive",
  REVIEW: "review.review",
  APPROVE: "review.approve",
  COMMENT: "review.comment",
} as const;

export const AUDIT_RESOURCE_TYPE = "review";

export const REVIEW_PACKAGE_STATUSES = [
  "draft",
  "submitted",
  "under_review",
  "returned",
  "approved",
  "archived",
] as const;

export const REVIEW_ITEM_STATUSES = [
  "pending",
  "under_review",
  "returned",
  "resolved",
] as const;

export const REVIEW_SOURCE_MODULES = [
  "planning",
  "materiality",
  "risk_assessment",
  "fieldwork",
] as const;

export const REVIEW_COMMENT_TYPES = ["review", "reviewer", "internal"] as const;

export const LOCKED_REVIEW_STATUSES = ["approved", "archived"] as const;

export const REVIEW_ITEM_PRIORITIES = ["low", "medium", "high", "critical"] as const;

export const REVIEW_ITEM_SEVERITIES = ["informational", "low", "medium", "high", "critical"] as const;

export const REVIEW_ACTIVITY_ACTIONS = {
  CREATED: "review.created",
  UPDATED: "review.updated",
  ARCHIVED: "review.archived",
  RESTORED: "review.restored",
  SUBMITTED: "review.submitted",
  RETURNED: "review.returned",
  APPROVED: "review.approved",
  ITEM_SYNCED: "review.item.synced",
  ITEM_RESOLVED: "review.item.resolved",
  ITEM_RETURNED: "review.item.returned",
  ITEM_REOPENED: "review.item.reopened",
  ITEM_ASSIGNED: "review.item.assigned",
  ITEM_UPDATED: "review.item.updated",
  COMMENT_ADDED: "review.comment.added",
  COMMENT_UPDATED: "review.comment.updated",
  COMMENT_ARCHIVED: "review.comment.archived",
  COMMENT_RESTORED: "review.comment.restored",
  COMMENT_RESOLVED: "review.comment.resolved",
  COMMENT_REOPENED: "review.comment.reopened",
  VERSION_CREATED: "review.version.created",
  VERSION_RESTORED: "review.version.restored",
} as const;
