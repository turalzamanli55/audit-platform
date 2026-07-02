export const RISK_ASSESSMENT_PERMISSIONS = {
  READ: "risk_assessment.read",
  CREATE: "risk_assessment.create",
  UPDATE: "risk_assessment.update",
  ARCHIVE: "risk_assessment.archive",
  SUBMIT: "risk_assessment.submit",
  REVIEW: "risk_assessment.review",
  APPROVE: "risk_assessment.approve",
  COMMENT: "risk_assessment.comment",
} as const;

export const AUDIT_RESOURCE_TYPE = "risk_assessment";

export const RISK_ASSESSMENT_STATUSES = [
  "not_started",
  "in_progress",
  "submitted",
  "under_review",
  "approved",
  "archived",
] as const;

export const RISK_TYPES = [
  "inherent",
  "control",
  "detection",
  "fraud",
  "it",
  "compliance",
  "financial_statement",
  "assertion",
  "significant",
] as const;

export const RISK_RATING_LEVELS = ["low", "moderate", "high", "significant"] as const;

export const RISK_LIKELIHOODS = ["low", "moderate", "high"] as const;

export const RISK_IMPACTS = ["low", "moderate", "high"] as const;

export const RISK_RESPONSE_TYPES = [
  "accept",
  "reduce",
  "transfer",
  "avoid",
  "substantive_procedures",
  "test_of_controls",
] as const;

export const ASSERTION_TYPES = [
  "existence",
  "completeness",
  "accuracy",
  "cutoff",
  "classification",
  "presentation",
] as const;

export const RISK_NOTE_TYPES = ["review", "internal"] as const;

export const LOCKED_RISK_ASSESSMENT_STATUSES = ["approved", "archived"] as const;

export const RISK_ACTIVITY_ACTIONS = {
  CREATED: "risk_assessment.created",
  UPDATED: "risk_assessment.updated",
  ARCHIVED: "risk_assessment.archived",
  RESTORED: "risk_assessment.restored",
  SUBMITTED: "risk_assessment.submitted",
  RETURNED: "risk_assessment.returned",
  APPROVED: "risk_assessment.approved",
  CATEGORY_ADDED: "risk_assessment.category.added",
  RISK_ITEM_ADDED: "risk_assessment.risk_item.added",
  RISK_ITEM_UPDATED: "risk_assessment.risk_item.updated",
  ASSERTION_RATING_UPDATED: "risk_assessment.assertion_rating.updated",
  RESPONSE_ADDED: "risk_assessment.response.added",
  PROCEDURE_LINKED: "risk_assessment.procedure.linked",
  NOTE_ADDED: "risk_assessment.note.added",
  SIGNIFICANT_ACKNOWLEDGED: "risk_assessment.significant.acknowledged",
} as const;

export const DEFAULT_RISK_CATEGORIES = [
  {
    key: "financial_reporting",
    name: "Financial reporting",
    description: "Account-level and disclosure risks across the financial statements.",
    sortOrder: 1,
  },
  {
    key: "operations",
    name: "Operations",
    description: "Business process and operational risks affecting the audit.",
    sortOrder: 2,
  },
  {
    key: "compliance",
    name: "Compliance",
    description: "Regulatory and legal compliance risks.",
    sortOrder: 3,
  },
  {
    key: "it",
    name: "Information technology",
    description: "IT general controls, application controls, and data integrity.",
    sortOrder: 4,
  },
  {
    key: "fraud",
    name: "Fraud",
    description: "Fraud risk factors and management override considerations.",
    sortOrder: 5,
  },
] as const;

export const DEFAULT_MATRIX_ACCOUNTS = [
  "Cash and bank",
  "Trade receivables",
  "Inventory",
  "Revenue",
  "Payables and accruals",
] as const;

export const DEFAULT_SEED_RISKS = [
  {
    riskType: "fraud" as const,
    title: "Management override of controls",
    description: "Risk of management override in revenue recognition and journal entries.",
    auditArea: "Revenue",
    isSignificant: true,
    inherentRating: "significant" as const,
    likelihood: "moderate" as const,
    impact: "high" as const,
  },
  {
    riskType: "inherent" as const,
    title: "Revenue recognition complexity",
    description: "Multiple performance obligations and contract modifications.",
    auditArea: "Revenue",
    isSignificant: true,
    inherentRating: "high" as const,
    likelihood: "high" as const,
    impact: "high" as const,
  },
  {
    riskType: "it" as const,
    title: "ERP access and change management",
    description: "User access provisioning and program change controls over financial reporting.",
    auditArea: "IT general controls",
    isSignificant: false,
    inherentRating: "moderate" as const,
    likelihood: "moderate" as const,
    impact: "moderate" as const,
  },
] as const;
