export const IFRS_NOTES_PERMISSIONS = {
  READ: "ifrs_notes.read",
  CREATE: "ifrs_notes.create",
  UPDATE: "ifrs_notes.update",
  VALIDATE: "ifrs_notes.validate",
  REVIEW: "ifrs_notes.review",
  APPROVE: "ifrs_notes.approve",
  PUBLISH: "ifrs_notes.publish",
  ARCHIVE: "ifrs_notes.archive",
} as const;

export const IFRS_NOTES_AUDIT_RESOURCE_TYPE = "ifrs_notes";

export const IFRS_NOTE_PACKAGE_STATUSES = [
  "draft",
  "validated",
  "in_review",
  "manager_review",
  "partner_review",
  "approved",
  "published",
  "archived",
] as const;

export const IFRS_NOTE_VERSION_STATUSES = [
  "draft",
  "in_review",
  "approved",
  "published",
  "archived",
] as const;

export const IFRS_NOTE_STANDARDS = ["ifrs", "ias", "ifric", "sic", "sme_ifrs"] as const;

export const IFRS_NOTE_TYPES = [
  "accounting_policies",
  "judgements",
  "estimates",
  "property_plant_equipment",
  "intangible_assets",
  "inventories",
  "receivables",
  "cash",
  "borrowings",
  "leases",
  "revenue",
  "expenses",
  "tax",
  "deferred_tax",
  "employee_benefits",
  "share_capital",
  "financial_instruments",
  "related_parties",
  "events_after_reporting_period",
  "going_concern",
  "commitments",
  "contingencies",
  "segment_reporting",
  "other_notes",
] as const;

export const IFRS_DISCLOSURE_KINDS = [
  "mandatory",
  "conditional",
  "optional",
  "custom",
] as const;

export const IFRS_NOTE_ITEM_KINDS = [
  "section",
  "subsection",
  "paragraph",
  "table",
  "list",
  "cross_reference",
  "attachment",
] as const;

export const IFRS_NOTES_WORKSPACE_SECTIONS = [
  "overview",
  "explorer",
  "disclosures",
  "cross-references",
  "validation",
  "versions",
  "history",
  "search",
] as const;

export const IFRS_NOTES_ACTIVITY_ACTIONS = {
  CREATED: "ifrs_notes.created",
  UPDATED: "ifrs_notes.updated",
  VALIDATED: "ifrs_notes.validated",
  REVIEWED: "ifrs_notes.reviewed",
  APPROVED: "ifrs_notes.approved",
  PUBLISHED: "ifrs_notes.published",
  ARCHIVED: "ifrs_notes.archived",
  ROLLED_BACK: "ifrs_notes.rolled_back",
} as const;
