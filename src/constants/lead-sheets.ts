export const LEAD_SHEET_PERMISSIONS = {
  READ: "lead_sheet.read",
  CREATE: "lead_sheet.create",
  UPDATE: "lead_sheet.update",
  APPROVE: "lead_sheet.approve",
} as const;

export const LEAD_SHEET_STATUSES = ["draft", "in_review", "reconciled", "approved"] as const;

export type LeadSheetStatus = (typeof LEAD_SHEET_STATUSES)[number];

export const AUDIT_RESOURCE_TYPE = "lead_sheet";

export const LEAD_SHEET_FS_AREAS = [
  "cash_and_equivalents",
  "receivables",
  "inventory",
  "property_plant_equipment",
  "intangibles",
  "investments",
  "payables",
  "borrowings",
  "provisions",
  "equity",
  "revenue",
  "cost_of_sales",
  "operating_expenses",
  "finance_items",
  "taxation",
  "other",
] as const;

export type LeadSheetFsArea = (typeof LEAD_SHEET_FS_AREAS)[number];
