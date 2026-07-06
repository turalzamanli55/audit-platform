export const COMPLETION_PERMISSIONS = {
  READ: "completion.read",
  CREATE: "completion.create",
  UPDATE: "completion.update",
  ARCHIVE: "completion.archive",
  REVIEW: "completion.review",
  APPROVE: "completion.approve",
  COMMENT: "completion.comment",
} as const;

export const AUDIT_RESOURCE_TYPE = "completion";

export const COMPLETION_PACKAGE_STATUSES = [
  "draft",
  "submitted",
  "under_review",
  "returned",
  "approved",
  "archived",
] as const;

export const COMPLETION_ITEM_STATUSES = [
  "pending",
  "under_review",
  "returned",
  "resolved",
] as const;

export const COMPLETION_ITEM_TYPES = [
  "checklist",
  "outstanding_item",
  "management_letter",
  "subsequent_events",
  "going_concern",
  "representation_letter",
  "final_analytics",
] as const;

export const COMPLETION_COMMENT_TYPES = ["completion", "reviewer", "internal"] as const;

export const LOCKED_COMPLETION_STATUSES = ["approved", "archived"] as const;

export const COMPLETION_ITEM_PRIORITIES = ["low", "medium", "high", "critical"] as const;

export const COMPLETION_ITEM_SEVERITIES = [
  "informational",
  "low",
  "medium",
  "high",
  "critical",
] as const;

export const COMPLETION_ACTIVITY_ACTIONS = {
  CREATED: "completion.created",
  UPDATED: "completion.updated",
  ARCHIVED: "completion.archived",
  RESTORED: "completion.restored",
  SUBMITTED: "completion.submitted",
  RETURNED: "completion.returned",
  APPROVED: "completion.approved",
  ITEM_SYNCED: "completion.item.synced",
  ITEM_RESOLVED: "completion.item.resolved",
  ITEM_RETURNED: "completion.item.returned",
  ITEM_REOPENED: "completion.item.reopened",
  ITEM_ASSIGNED: "completion.item.assigned",
  ITEM_UPDATED: "completion.item.updated",
  COMMENT_ADDED: "completion.comment.added",
  COMMENT_UPDATED: "completion.comment.updated",
  COMMENT_ARCHIVED: "completion.comment.archived",
  COMMENT_RESTORED: "completion.comment.restored",
  COMMENT_RESOLVED: "completion.comment.resolved",
  COMMENT_REOPENED: "completion.comment.reopened",
  VERSION_CREATED: "completion.version.created",
  VERSION_RESTORED: "completion.version.restored",
} as const;
