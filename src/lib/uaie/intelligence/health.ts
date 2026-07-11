import type { UaiePipelineResult } from "@/types/uaie";

export type UaieImportHealthScores = {
  workbookHealth: number;
  headerHealth: number;
  columnHealth: number;
  languageHealth: number;
  currencyHealth: number;
  balanceHealth: number;
  validationHealth: number;
  overallHealth: number;
};

function clamp(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function calculateImportHealth(pipeline: UaiePipelineResult): UaieImportHealthScores {
  const blocking = pipeline.issues.filter((issue) => issue.severity === "blocking").length;
  const errors = pipeline.issues.filter((issue) => issue.severity === "error").length;
  const warnings = pipeline.issues.filter((issue) => issue.severity === "warning").length;
  const mapped = pipeline.mappings.filter((mapping) => mapping.canonicalField !== "ignore");
  const hasCode = mapped.some((mapping) => mapping.canonicalField === "account_code");
  const hasName = mapped.some((mapping) => mapping.canonicalField === "account_name");
  const hasAmount = mapped.some((mapping) =>
    ["debit", "credit", "balance"].includes(mapping.canonicalField),
  );

  const workbookHealth = clamp(
    pipeline.sheetConfidence * 0.7 + (pipeline.selectedSheetName ? 30 : 0),
  );
  const headerHealth = clamp(pipeline.mappingConfidence);
  const columnHealth = clamp(
    (hasCode ? 34 : 0) + (hasName ? 33 : 0) + (hasAmount ? 33 : 0),
  );
  const languageHealth = clamp(pipeline.languageConfidence);
  const currencyHealth = clamp(pipeline.currencyConfidence);
  const balanceHealth = clamp(
    pipeline.summary.outOfBalance
      ? 35
      : pipeline.summary.rowCount > 0
        ? 100 - warnings * 5
        : 50,
  );
  const validationHealth = clamp(100 - blocking * 40 - errors * 15 - warnings * 5);

  const overallHealth = clamp(
    (workbookHealth +
      headerHealth +
      columnHealth +
      languageHealth +
      currencyHealth +
      balanceHealth +
      validationHealth) /
      7,
  );

  return {
    workbookHealth,
    headerHealth,
    columnHealth,
    languageHealth,
    currencyHealth,
    balanceHealth,
    validationHealth,
    overallHealth,
  };
}
