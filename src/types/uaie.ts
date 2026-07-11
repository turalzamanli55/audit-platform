import type {
  UAIE_CANONICAL_FIELDS,
  UAIE_DATA_TYPES,
  UAIE_ERP_SYSTEMS,
  UAIE_IMPORT_STATUSES,
} from "@/constants/uaie";

export type UaieImportStatus = (typeof UAIE_IMPORT_STATUSES)[number];
export type UaieDataType = (typeof UAIE_DATA_TYPES)[number];
export type UaieErpSystem = (typeof UAIE_ERP_SYSTEMS)[number];
export type UaieCanonicalField = (typeof UAIE_CANONICAL_FIELDS)[number];

export type UaieCellValue = string | number | boolean | null;

export type UaieSheetMatrix = {
  name: string;
  index: number;
  rows: UaieCellValue[][];
};

export type UaieWorkbookScan = {
  sheets: UaieSheetMatrix[];
  sourceFormat: "xlsx" | "xls" | "csv" | "tsv" | "unknown";
};

export type UaieColumnMapping = {
  sourceColumnIndex: number;
  sourceHeader: string | null;
  canonicalField: UaieCanonicalField;
  confidence: number;
  isManual: boolean;
};

export type UaieValidationIssue = {
  issueCode: string;
  severity: "info" | "warning" | "error" | "blocking";
  message: string;
  rowNumber?: number | null;
  columnIndex?: number | null;
  accountCode?: string | null;
  metadata?: Record<string, unknown>;
};

export type UaieNormalizedRow = {
  rowNumber: number;
  accountCode: string | null;
  accountName: string | null;
  debit: number | null;
  credit: number | null;
  balance: number | null;
  currencyCode: string | null;
  department: string | null;
  costCenter: string | null;
  sourceRef: string | null;
  isValid: boolean;
};

export type UaiePipelineResult = {
  selectedSheetName: string | null;
  sheetConfidence: number;
  sheetScores: Array<{ name: string; score: number; rowCount: number; columnCount: number }>;
  detectedLanguage: string | null;
  languageConfidence: number;
  detectedCurrency: string | null;
  currencyConfidence: number;
  detectedErp: UaieErpSystem;
  erpConfidence: number;
  headerRowIndex: number;
  mappings: UaieColumnMapping[];
  mappingConfidence: number;
  requiresWizard: boolean;
  workbookHash: string;
  headerHash: string;
  layoutFingerprint: string;
  issues: UaieValidationIssue[];
  rows: UaieNormalizedRow[];
  summary: {
    rowCount: number;
    validRowCount: number;
    debitTotal: number;
    creditTotal: number;
    balanceTotal: number;
    outOfBalance: boolean;
    duplicateCodes: number;
    missingNames: number;
  };
  processingMs: number;
};
