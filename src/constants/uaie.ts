export const UAIE_PERMISSIONS = {
  READ: "uaie.read",
  CREATE: "uaie.create",
  UPDATE: "uaie.update",
  VALIDATE: "uaie.validate",
  ARCHIVE: "uaie.archive",
  LEARN: "uaie.learn",
  REVIEW: "uaie.review",
  APPROVE: "uaie.approve",
  ADMIN: "uaie.admin",
} as const;

export const UAIE_INTELLIGENCE_SUGGESTION_THRESHOLD = 75;

export const AUDIT_RESOURCE_TYPE = "uaie";

export const UAIE_IMPORT_STATUSES = [
  "uploaded",
  "scanning",
  "mapping_required",
  "mapped",
  "validating",
  "validated",
  "staged",
  "failed",
  "cancelled",
  "superseded",
  "archived",
] as const;

export const UAIE_DATA_TYPES = [
  "trial_balance",
  "general_ledger",
  "chart_of_accounts",
  "supporting_schedule",
  "unknown",
] as const;

export const UAIE_ERP_SYSTEMS = [
  "sap",
  "sap_business_one",
  "oracle",
  "oracle_netsuite",
  "microsoft_dynamics",
  "dynamics_365",
  "1c",
  "logo",
  "netsis",
  "mikro",
  "quickbooks",
  "xero",
  "sage",
  "zoho_books",
  "odoo",
  "manual_excel",
  "unknown",
] as const;

export const UAIE_CANONICAL_FIELDS = [
  "account_code",
  "account_name",
  "debit",
  "credit",
  "balance",
  "currency",
  "department",
  "cost_center",
  "ignore",
] as const;

export const UAIE_MAPPING_CONFIDENCE_THRESHOLD = 95;

export const UAIE_ACTIVITY_ACTIONS = {
  UPLOADED: "uaie.uploaded",
  SCANNED: "uaie.scanned",
  MAPPED: "uaie.mapped",
  VALIDATED: "uaie.validated",
  STAGED: "uaie.staged",
  FAILED: "uaie.failed",
  CANCELLED: "uaie.cancelled",
  ARCHIVED: "uaie.archived",
  PROFILE_SAVED: "uaie.profile.saved",
  REPROCESSED: "uaie.reprocessed",
  DICTIONARY_APPROVED: "uaie.dictionary.approved",
  DICTIONARY_REJECTED: "uaie.dictionary.rejected",
  DICTIONARY_MERGED: "uaie.dictionary.merged",
  DICTIONARY_DISABLED: "uaie.dictionary.disabled",
  DICTIONARY_RESTORED: "uaie.dictionary.restored",
  UNKNOWN_APPROVED: "uaie.unknown.approved",
  UNKNOWN_REJECTED: "uaie.unknown.rejected",
  UNKNOWN_IGNORED: "uaie.unknown.ignored",
  TEMPLATE_PROMOTED: "uaie.template.promoted",
  TEMPLATE_ROLLED_BACK: "uaie.template.rolled_back",
} as const;

export const UAIE_INTELLIGENCE_SECTIONS = [
  "overview",
  "sessions",
  "unknown-headers",
  "dictionary",
  "erp-templates",
  "customer-templates",
  "fingerprints",
  "mappings",
  "analytics",
  "health",
  "unknown-words",
  "suggestions",
  "timeline",
  "history",
  "admin",
  "search",
] as const;

export const UAIE_STORAGE_BUCKET = "uaie-imports";
