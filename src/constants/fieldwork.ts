export const FIELDWORK_PERMISSIONS = {
  READ: "fieldwork.read",
  CREATE: "fieldwork.create",
  UPDATE: "fieldwork.update",
  ARCHIVE: "fieldwork.archive",
  ASSIGN: "fieldwork.assign",
  REVIEW: "fieldwork.review",
  COMMENT: "fieldwork.comment",
} as const;

export const AUDIT_RESOURCE_TYPE = "fieldwork";

export const FIELDWORK_PACKAGE_STATUSES = [
  "not_started",
  "in_progress",
  "substantially_complete",
  "archived",
] as const;

export const AUDIT_PROGRAM_STATUSES = [
  "draft",
  "approved",
  "in_execution",
  "substantially_complete",
  "superseded",
] as const;

export const PROCEDURE_TYPES = [
  "test_of_controls",
  "substantive",
  "analytical",
  "sampling",
  "inquiry",
  "observation",
  "inspection",
  "reperformance",
] as const;

export const PROCEDURE_STATUSES = [
  "not_started",
  "in_progress",
  "pending_evidence",
  "submitted_for_review",
  "review_in_progress",
  "returned",
  "review_cleared",
  "complete",
  "blocked",
  "deferred",
] as const;

export const WORKING_PAPER_STATUSES = [
  "draft",
  "in_progress",
  "submitted",
  "under_review",
  "returned",
  "cleared",
  "complete",
  "archived",
] as const;

export const FIELDWORK_EVIDENCE_STATUSES = [
  "pending",
  "recorded",
  "verified",
  "archived",
] as const;

export const FIELDWORK_FINDING_STATUSES = [
  "open",
  "in_review",
  "resolved",
  "closed",
] as const;

export const FIELDWORK_NOTE_TYPES = ["auditor", "review", "internal", "clearance"] as const;

export const FIELDWORK_EVIDENCE_STORAGE_BUCKET = "fieldwork-evidence";

export const LOCKED_FIELDWORK_STATUSES = ["archived"] as const;

export const COMPLETE_PROCEDURE_STATUSES = ["complete", "review_cleared"] as const;

export const FIELDWORK_ACTIVITY_ACTIONS = {
  CREATED: "fieldwork.created",
  UPDATED: "fieldwork.updated",
  ARCHIVED: "fieldwork.archived",
  RESTORED: "fieldwork.restored",
  PROGRAM_UPDATED: "fieldwork.program.updated",
  PROCEDURE_ASSIGNED: "fieldwork.procedure.assigned",
  PROCEDURE_UPDATED: "fieldwork.procedure.updated",
  PROCEDURE_COMPLETED: "fieldwork.procedure.completed",
  PROCEDURE_SUBMITTED: "fieldwork.procedure.submitted",
  PROCEDURE_RETURNED: "fieldwork.procedure.returned",
  PROCEDURE_CLEARED: "fieldwork.procedure.cleared",
  WORKING_PAPER_ADDED: "fieldwork.working_paper.added",
  WORKING_PAPER_UPDATED: "fieldwork.working_paper.updated",
  EVIDENCE_ADDED: "fieldwork.evidence.added",
  FINDING_ADDED: "fieldwork.finding.added",
  NOTE_ADDED: "fieldwork.note.added",
} as const;

export const DEFAULT_AUDIT_PROGRAM_TITLE = "Engagement audit program";

export const DEFAULT_PROCEDURE_GROUPS = [
  {
    key: "financial_areas",
    name: "Financial statement areas",
    description: "Substantive procedures over significant accounts and disclosures.",
    sortOrder: 1,
    procedures: [
      {
        key: "cash",
        title: "Cash and bank confirmations",
        procedureType: "inspection" as const,
        assertion: "existence",
      },
      {
        key: "revenue",
        title: "Revenue substantive testing",
        procedureType: "substantive" as const,
        assertion: "occurrence",
      },
    ],
  },
  {
    key: "controls",
    name: "Controls",
    description: "Tests of controls over key business processes.",
    sortOrder: 2,
    procedures: [
      {
        key: "revenue_controls",
        title: "Revenue process controls",
        procedureType: "test_of_controls" as const,
        assertion: "existence",
      },
    ],
  },
  {
    key: "completion",
    name: "Completion",
    description: "Final analytical and disclosure procedures.",
    sortOrder: 3,
    procedures: [
      {
        key: "completion_analytics",
        title: "Completion analytical review",
        procedureType: "analytical" as const,
        assertion: "valuation",
      },
    ],
  },
] as const;

export const FIELDWORK_LIFECYCLE_STATUSES = ["fieldwork", "review", "completed"] as const;
