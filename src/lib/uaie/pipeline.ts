import { UAIE_MAPPING_CONFIDENCE_THRESHOLD } from "@/constants/uaie";
import { mapColumns } from "@/lib/uaie/column-mapper";
import {
  detectBestSheet,
  detectCurrency,
  detectErp,
  detectHeaderRow,
  detectLanguage,
} from "@/lib/uaie/detectors";
import {
  buildLayoutFingerprint,
  hashHeaders,
  hashWorkbookPayload,
} from "@/lib/uaie/fingerprint";
import { buildTrialBalanceRows, validateNormalizedDataset } from "@/lib/uaie/validation-engine";
import { parseAccountingUpload } from "@/lib/uaie/workbook-parser";
import type { UaieCanonicalField, UaiePipelineResult } from "@/types/uaie";

export async function runUaiePipeline(input: {
  filename: string;
  mimeType?: string | null;
  bytes: Buffer;
  manualMappings?: Array<{ sourceColumnIndex: number; canonicalField: UaieCanonicalField }>;
  preferredSheetName?: string | null;
}): Promise<UaiePipelineResult> {
  const started = Date.now();
  const workbook = await parseAccountingUpload({
    filename: input.filename,
    mimeType: input.mimeType,
    bytes: input.bytes,
  });

  const sheetDetection = detectBestSheet(workbook.sheets);
  const selected =
    (input.preferredSheetName
      ? workbook.sheets.find((sheet) => sheet.name === input.preferredSheetName)
      : null) ?? sheetDetection.selected;

  if (!selected) {
    return {
      selectedSheetName: null,
      sheetConfidence: 0,
      sheetScores: sheetDetection.scores,
      detectedLanguage: null,
      languageConfidence: 0,
      detectedCurrency: null,
      currencyConfidence: 0,
      detectedErp: "unknown",
      erpConfidence: 0,
      headerRowIndex: 0,
      mappings: [],
      mappingConfidence: 0,
      requiresWizard: true,
      workbookHash: hashWorkbookPayload(input.bytes),
      headerHash: hashHeaders([]),
      layoutFingerprint: buildLayoutFingerprint({
        sheetName: "",
        headerRowIndex: 0,
        columnCount: 0,
        mappings: [],
        erp: "unknown",
      }),
      issues: [
        {
          issueCode: "NO_SHEET",
          severity: "blocking",
          message: "No worksheets were found in the uploaded file.",
        },
      ],
      rows: [],
      summary: {
        rowCount: 0,
        validRowCount: 0,
        debitTotal: 0,
        creditTotal: 0,
        balanceTotal: 0,
        outOfBalance: false,
        duplicateCodes: 0,
        missingNames: 0,
      },
      processingMs: Date.now() - started,
    };
  }

  const header = detectHeaderRow(selected);
  const headerRow = selected.rows[header.rowIndex] ?? [];
  const headers = headerRow.map((cell) => (cell == null ? "" : String(cell)));
  const language = detectLanguage(headers);
  const currency = detectCurrency(selected);
  const erp = detectErp({
    filename: input.filename,
    sheetNames: workbook.sheets.map((sheet) => sheet.name),
    headers,
  });

  const mapped = mapColumns({
    sheet: selected,
    headerRowIndex: header.rowIndex,
    manualOverrides: input.manualMappings,
  });

  const rows = buildTrialBalanceRows({
    rows: selected.rows,
    headerRowIndex: header.rowIndex,
    mappings: mapped.mappings,
  });

  const validated = validateNormalizedDataset({
    mappings: mapped.mappings,
    rows,
    detectedCurrency: currency.currency,
  });

  const sheetConfidence =
    sheetDetection.scores.find((item) => item.name === selected.name)?.score ?? 0;

  const overallConfidence = Math.round(
    (sheetConfidence +
      mapped.mappingConfidence +
      language.confidence +
      currency.confidence +
      erp.confidence) /
      5,
  );

  return {
    selectedSheetName: selected.name,
    sheetConfidence,
    sheetScores: sheetDetection.scores,
    detectedLanguage: language.language,
    languageConfidence: language.confidence,
    detectedCurrency: currency.currency,
    currencyConfidence: currency.confidence,
    detectedErp: erp.erp,
    erpConfidence: erp.confidence,
    headerRowIndex: header.rowIndex,
    mappings: mapped.mappings,
    mappingConfidence: mapped.mappingConfidence,
    requiresWizard:
      mapped.requiresWizard ||
      overallConfidence < UAIE_MAPPING_CONFIDENCE_THRESHOLD ||
      validated.issues.some((issue) => issue.severity === "blocking"),
    workbookHash: hashWorkbookPayload(input.bytes),
    headerHash: hashHeaders(headers),
    layoutFingerprint: buildLayoutFingerprint({
      sheetName: selected.name,
      headerRowIndex: header.rowIndex,
      columnCount: headers.length,
      mappings: mapped.mappings.map((mapping) => ({
        index: mapping.sourceColumnIndex,
        field: mapping.canonicalField,
      })),
      erp: erp.erp,
    }),
    issues: validated.issues,
    rows,
    summary: validated.summary,
    processingMs: Date.now() - started,
  };
}
