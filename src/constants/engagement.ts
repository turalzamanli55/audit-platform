export const ENGAGEMENT_PERMISSIONS = {
  READ: "engagement.read",
  CREATE: "engagement.create",
  UPDATE: "engagement.update",
  ARCHIVE: "engagement.archive",
  DELETE: "engagement.delete",
} as const;

export const ENGAGEMENT_TYPES = [
  "statutory_audit",
  "review",
  "agreed_upon_procedures",
  "advisory",
  "other",
] as const;

export const ENGAGEMENT_LIFECYCLE_STATUSES = [
  "draft",
  "planning",
  "fieldwork",
  "review",
  "completed",
  "closed",
] as const;

export const ENGAGEMENT_MEMBER_ROLES = [
  "engagement_partner",
  "engagement_manager",
  "senior",
  "staff",
  "reviewer",
  "observer",
] as const;

export const ENGAGEMENT_REPORTING_FRAMEWORKS = ["IFRS", "LOCAL_GAAP", "OTHER"] as const;

export const AUDIT_RESOURCE_TYPE = "engagement";

export const ENGAGEMENT_ACTIVITY_ACTIONS = {
  CREATED: "engagement.created",
  UPDATED: "engagement.updated",
  STATUS_CHANGED: "engagement.status.changed",
  ARCHIVED: "engagement.archived",
  RESTORED: "engagement.restored",
  MEMBER_ADDED: "engagement.member.added",
  MEMBER_REMOVED: "engagement.member.removed",
} as const;
