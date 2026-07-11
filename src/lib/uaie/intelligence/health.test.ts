import { describe, expect, it } from "vitest";
import { calculateImportHealth } from "./health";
import type { UaiePipelineResult } from "@/types/uaie";

function basePipeline(overrides: Partial<UaiePipelineResult> = {}): UaiePipelineResult {
  return {
    selectedSheetName: "TB",
    sheetConfidence: 90,
    sheetScores: [{ name: "TB", score: 90, rowCount: 10, columnCount: 4 }],
    detectedLanguage: "en",
    languageConfidence: 88,
    detectedCurrency: "AZN",
    currencyConfidence: 80,
    detectedErp: "sap",
    erpConfidence: 70,
    headerRowIndex: 0,
    mappings: [
      {
        sourceColumnIndex: 0,
        sourceHeader: "Account",
        canonicalField: "account_code",
        confidence: 98,
        isManual: false,
      },
      {
        sourceColumnIndex: 1,
        sourceHeader: "Name",
        canonicalField: "account_name",
        confidence: 97,
        isManual: false,
      },
      {
        sourceColumnIndex: 2,
        sourceHeader: "Balance",
        canonicalField: "balance",
        confidence: 96,
        isManual: false,
      },
    ],
    mappingConfidence: 97,
    requiresWizard: false,
    workbookHash: "a",
    headerHash: "b",
    layoutFingerprint: "c",
    issues: [],
    rows: [],
    summary: {
      rowCount: 10,
      validRowCount: 10,
      debitTotal: 0,
      creditTotal: 0,
      balanceTotal: 0,
      outOfBalance: false,
      duplicateCodes: 0,
      missingNames: 0,
    },
    processingMs: 12,
    ...overrides,
  };
}

describe("calculateImportHealth", () => {
  it("scores a healthy balanced workbook highly", () => {
    const health = calculateImportHealth(basePipeline());
    expect(health.overallHealth).toBeGreaterThanOrEqual(80);
    expect(health.columnHealth).toBe(100);
  });

  it("penalizes blocking validation issues", () => {
    const health = calculateImportHealth(
      basePipeline({
        issues: [
          {
            issueCode: "OUT_OF_BALANCE",
            severity: "blocking",
            message: "Out of balance",
          },
        ],
        summary: {
          rowCount: 10,
          validRowCount: 8,
          debitTotal: 1,
          creditTotal: 2,
          balanceTotal: 0,
          outOfBalance: true,
          duplicateCodes: 0,
          missingNames: 0,
        },
      }),
    );
    expect(health.validationHealth).toBeLessThanOrEqual(60);
    expect(health.balanceHealth).toBe(35);
  });
});
