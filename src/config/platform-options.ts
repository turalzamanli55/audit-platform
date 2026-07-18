/** Static option lists for Platform Console admin forms (English only). */

export const TENANT_TYPE_OPTIONS = [
  { value: "solo", label: "Solo" },
  { value: "business", label: "Business" },
  { value: "enterprise", label: "Enterprise" },
] as const;

/** Roles assignable to tenant users (Platform Owner is intentionally excluded). */
export const ASSIGNABLE_ROLE_OPTIONS = [
  { value: "organization_owner", label: "Organization Owner" },
  { value: "organization_admin", label: "Organization Admin" },
  { value: "workspace_admin", label: "Workspace Admin" },
  { value: "manager", label: "Manager" },
  { value: "member", label: "Member" },
  { value: "viewer", label: "Viewer" },
] as const;

export const MODULE_OPTIONS = [
  { value: "planning", label: "Planning" },
  { value: "materiality", label: "Materiality" },
  { value: "risk", label: "Risk" },
  { value: "working_papers", label: "Working Papers" },
  { value: "lead_sheets", label: "Lead Sheets" },
  { value: "reporting", label: "Reporting" },
  { value: "financial_statements", label: "Financial Statements" },
  { value: "ifrs_notes", label: "IFRS Notes" },
  { value: "ai", label: "AI" },
  { value: "ocr", label: "OCR" },
  { value: "import", label: "Import" },
  { value: "analytics", label: "Analytics" },
] as const;
