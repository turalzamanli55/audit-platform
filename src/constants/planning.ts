export const PLANNING_PERMISSIONS = {
  READ: "planning.read",
  CREATE: "planning.create",
  UPDATE: "planning.update",
  ARCHIVE: "planning.archive",
  SUBMIT: "planning.submit",
  REVIEW: "planning.review",
  APPROVE: "planning.approve",
  COMMENT: "planning.comment",
} as const;

export const PLANNING_PARTNER_ROLES = ["engagement_partner"] as const;
export const PLANNING_MANAGER_ROLES = ["engagement_partner", "engagement_manager"] as const;

export const LOCKED_PLANNING_STATUSES = ["approved", "superseded"] as const;
export const EDITABLE_PLANNING_STATUSES = ["not_started", "in_progress", "returned"] as const;

export const PLANNING_STATUSES = [
  "not_started",
  "in_progress",
  "pending_review",
  "returned",
  "approved",
  "superseded",
] as const;

export const INTEGRATION_READINESS_STATUSES = [
  "not_configured",
  "placeholder",
  "integrated",
] as const;

export const AUDIT_RESOURCE_TYPE = "planning";

export const PLANNING_ACTIVITY_ACTIONS = {
  CREATED: "planning.created",
  UPDATED: "planning.updated",
  STATUS_CHANGED: "planning.status.changed",
  ARCHIVED: "planning.archived",
  RESTORED: "planning.restored",
  CHECKLIST_UPDATED: "planning.checklist.updated",
  TIMELINE_UPDATED: "planning.timeline.updated",
  SUBMITTED: "planning.submitted",
  RETURNED: "planning.returned",
  APPROVED: "planning.approved",
  REVISED: "planning.revised",
  COMMENT_ADDED: "planning.comment.added",
  DOCUMENT_ADDED: "planning.document.added",
  DOCUMENT_REMOVED: "planning.document.removed",
} as const;

export const DEFAULT_PLANNING_CHECKLIST = [
  { id: "objectives", key: "objectives", completed: false },
  { id: "scope", key: "scope", completed: false },
  { id: "strategy", key: "strategy", completed: false },
  { id: "framework", key: "framework", completed: false },
  { id: "materiality", key: "materiality", completed: false },
  { id: "risk", key: "risk", completed: false },
  { id: "team", key: "team", completed: false },
  { id: "timeline", key: "timeline", completed: false },
] as const;

export const DEFAULT_PLANNING_TIMELINE = [
  { id: "planning", key: "planning", startDate: null, endDate: null },
  { id: "fieldwork", key: "fieldwork", startDate: null, endDate: null },
  { id: "review", key: "review", startDate: null, endDate: null },
  { id: "completion", key: "completion", startDate: null, endDate: null },
] as const;
