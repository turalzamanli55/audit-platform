import type { UaieColumnMapping, UaieNormalizedRow, UaieValidationIssue } from "@/types/uaie";

function toNumber(value: unknown): number | null {
  if (value == null || value === "") return null;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const text = String(value).trim().replace(/\s/g, "").replace(/,/g, "");
  if (!text) return null;
  const normalized = text.replace(/(?<=\d)\.(?=\d{3}(\D|$))/g, "").replace(",", ".");
  // handle European 1.234,56
  let candidate = text;
  if (/^\d{1,3}(\.\d{3})+(,\d+)?$/.test(text)) {
    candidate = text.replace(/\./g, "").replace(",", ".");
  } else if (/^\d{1,3}(,\d{3})+(\.\d+)?$/.test(text)) {
    candidate = text.replace(/,/g, "");
  } else {
    candidate = normalized;
  }
  const parsed = Number(candidate);
  return Number.isFinite(parsed) ? parsed : null;
}

export function buildTrialBalanceRows(input: {
  rows: unknown[][];
  headerRowIndex: number;
  mappings: UaieColumnMapping[];
}): UaieNormalizedRow[] {
  const fieldIndex = new Map<string, number>();
  for (const mapping of input.mappings) {
    if (mapping.canonicalField === "ignore") continue;
    fieldIndex.set(mapping.canonicalField, mapping.sourceColumnIndex);
  }

  const output: UaieNormalizedRow[] = [];
  for (let i = input.headerRowIndex + 1; i < input.rows.length; i += 1) {
    const row = input.rows[i] ?? [];
    const get = (field: string) => {
      const index = fieldIndex.get(field);
      if (index == null) return null;
      return row[index] ?? null;
    };

    const accountCodeRaw = get("account_code");
    const accountNameRaw = get("account_name");
    const accountCode =
      accountCodeRaw == null || String(accountCodeRaw).trim() === ""
        ? null
        : String(accountCodeRaw).trim();
    const accountName =
      accountNameRaw == null || String(accountNameRaw).trim() === ""
        ? null
        : String(accountNameRaw).trim();

    if (!accountCode && !accountName) continue;

    const debit = toNumber(get("debit"));
    const credit = toNumber(get("credit"));
    let balance = toNumber(get("balance"));
    if (balance == null && (debit != null || credit != null)) {
      balance = (debit ?? 0) - (credit ?? 0);
    }

    const currencyCodeRaw = get("currency");
    const departmentRaw = get("department");
    const costCenterRaw = get("cost_center");

    output.push({
      rowNumber: i + 1,
      accountCode,
      accountName,
      debit,
      credit,
      balance,
      currencyCode:
        currencyCodeRaw == null || String(currencyCodeRaw).trim() === ""
          ? null
          : String(currencyCodeRaw).trim().toUpperCase(),
      department:
        departmentRaw == null || String(departmentRaw).trim() === ""
          ? null
          : String(departmentRaw).trim(),
      costCenter:
        costCenterRaw == null || String(costCenterRaw).trim() === ""
          ? null
          : String(costCenterRaw).trim(),
      sourceRef: `row:${i + 1}`,
      isValid: Boolean(accountCode),
    });
  }

  return output;
}

export function validateNormalizedDataset(input: {
  mappings: UaieColumnMapping[];
  rows: UaieNormalizedRow[];
  detectedCurrency?: string | null;
}): { issues: UaieValidationIssue[]; summary: UaiePipelineResultSummary } {
  const issues: UaieValidationIssue[] = [];
  const mappedFields = new Set(
    input.mappings.filter((m) => m.canonicalField !== "ignore").map((m) => m.canonicalField),
  );

  if (!mappedFields.has("account_code")) {
    issues.push({
      issueCode: "MISSING_ACCOUNT_CODE",
      severity: "blocking",
      message: "Account code column was not detected.",
    });
  }
  if (!mappedFields.has("account_name")) {
    issues.push({
      issueCode: "MISSING_ACCOUNT_NAME",
      severity: "error",
      message: "Account name column was not detected.",
    });
  }
  if (
    !mappedFields.has("balance") &&
    !(mappedFields.has("debit") && mappedFields.has("credit"))
  ) {
    issues.push({
      issueCode: "MISSING_AMOUNT",
      severity: "blocking",
      message: "Neither balance nor debit/credit columns were detected.",
    });
  }

  const codeCounts = new Map<string, number>();
  let debitTotal = 0;
  let creditTotal = 0;
  let balanceTotal = 0;
  let missingNames = 0;
  let validRowCount = 0;

  for (const row of input.rows) {
    if (row.accountCode) {
      codeCounts.set(row.accountCode, (codeCounts.get(row.accountCode) ?? 0) + 1);
    } else {
      issues.push({
        issueCode: "INVALID_ACCOUNT_CODE",
        severity: "error",
        message: "Row is missing an account code.",
        rowNumber: row.rowNumber,
      });
      row.isValid = false;
    }

    if (!row.accountName) {
      missingNames += 1;
      issues.push({
        issueCode: "MISSING_NAME",
        severity: "warning",
        message: "Row is missing an account name.",
        rowNumber: row.rowNumber,
        accountCode: row.accountCode,
      });
    }

    if (row.debit != null) debitTotal += row.debit;
    if (row.credit != null) creditTotal += row.credit;
    if (row.balance != null) balanceTotal += row.balance;

    if (
      row.currencyCode &&
      input.detectedCurrency &&
      row.currencyCode !== input.detectedCurrency
    ) {
      issues.push({
        issueCode: "CURRENCY_MISMATCH",
        severity: "warning",
        message: `Row currency ${row.currencyCode} differs from detected ${input.detectedCurrency}.`,
        rowNumber: row.rowNumber,
        accountCode: row.accountCode,
      });
    }

    if (row.isValid) validRowCount += 1;
  }

  let duplicateCodes = 0;
  for (const [code, count] of codeCounts) {
    if (count > 1) {
      duplicateCodes += count - 1;
      issues.push({
        issueCode: "DUPLICATE_CODE",
        severity: "error",
        message: `Duplicate account code ${code} appears ${count} times.`,
        accountCode: code,
      });
    }
  }

  if (input.rows.length === 0) {
    issues.push({
      issueCode: "EMPTY_ROWS",
      severity: "blocking",
      message: "No accounting rows were extracted from the selected sheet.",
    });
  }

  const hasDebitCredit = mappedFields.has("debit") && mappedFields.has("credit");
  const outOfBalance = hasDebitCredit
    ? Math.abs(debitTotal - creditTotal) > 0.009
    : Math.abs(balanceTotal) > 0.009 && !hasDebitCredit
      ? false
      : hasDebitCredit
        ? Math.abs(debitTotal - creditTotal) > 0.009
        : false;

  if (hasDebitCredit && Math.abs(debitTotal - creditTotal) > 0.009) {
    issues.push({
      issueCode: "OUT_OF_BALANCE",
      severity: "blocking",
      message: `Debits (${debitTotal.toFixed(2)}) do not equal credits (${creditTotal.toFixed(2)}).`,
      metadata: { debitTotal, creditTotal },
    });
  }

  if (mappedFields.has("debit") !== mappedFields.has("credit")) {
    issues.push({
      issueCode: "DEBIT_CREDIT_MISMATCH",
      severity: "error",
      message: "Debit and credit columns must both be present when either is mapped.",
    });
  }

  return {
    issues,
    summary: {
      rowCount: input.rows.length,
      validRowCount,
      debitTotal,
      creditTotal,
      balanceTotal,
      outOfBalance,
      duplicateCodes,
      missingNames,
    },
  };
}

type UaiePipelineResultSummary = {
  rowCount: number;
  validRowCount: number;
  debitTotal: number;
  creditTotal: number;
  balanceTotal: number;
  outOfBalance: boolean;
  duplicateCodes: number;
  missingNames: number;
};
