import { classifyTrialBalanceAccount } from "@/lib/trial-balance/classify";
import type {
  TrialBalanceBuildResult,
  TrialBalanceBuiltLine,
  TrialBalanceValidationIssue,
} from "@/types/trial-balance";

export type TrialBalanceSourceRow = {
  rowNumber: number;
  accountCode: string | null;
  accountName: string | null;
  debit: number | null;
  credit: number | null;
  balance: number | null;
  currencyCode: string | null;
  isValid: boolean;
};

function num(value: number | null | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function normalizeCode(code: string): string {
  return code.trim().replace(/\s+/g, "");
}

export function buildTrialBalanceFromNormalizedRows(
  rows: TrialBalanceSourceRow[],
  options?: { functionalCurrency?: string | null; exchangeRate?: number },
): TrialBalanceBuildResult {
  const exchangeRate = options?.exchangeRate && options.exchangeRate > 0 ? options.exchangeRate : 1;
  const issues: TrialBalanceValidationIssue[] = [];
  const byCode = new Map<string, TrialBalanceBuiltLine>();

  for (const row of rows) {
    const codeRaw = row.accountCode?.trim() ?? "";
    const nameRaw = row.accountName?.trim() ?? "";
    if (!codeRaw && !nameRaw) continue;
    if (!codeRaw) {
      issues.push({
        issueCode: "MISSING_ACCOUNT_CODE",
        severity: "error",
        message: `Row ${row.rowNumber} is missing an account code`,
      });
      continue;
    }
    if (!nameRaw) {
      issues.push({
        issueCode: "MISSING_ACCOUNT_NAME",
        severity: "warning",
        message: `Account ${codeRaw} is missing a name`,
        accountCode: codeRaw,
      });
    }

    const code = normalizeCode(codeRaw);
    const classification = classifyTrialBalanceAccount(code, nameRaw || code);
    const debit = num(row.debit);
    const credit = num(row.credit);
    let closingBalance = num(row.balance);
    if (row.balance == null) closingBalance = debit - credit;

    const closingDebit = closingBalance >= 0 ? closingBalance : 0;
    const closingCredit = closingBalance < 0 ? Math.abs(closingBalance) : 0;
    const existing = byCode.get(code);

    if (existing) {
      existing.movementDebit += debit;
      existing.movementCredit += credit;
      existing.closingBalance += closingBalance;
      existing.closingDebit = existing.closingBalance >= 0 ? existing.closingBalance : 0;
      existing.closingCredit =
        existing.closingBalance < 0 ? Math.abs(existing.closingBalance) : 0;
      existing.functionalAmount = existing.closingBalance * exchangeRate;
      issues.push({
        issueCode: "DUPLICATE_ACCOUNT_MERGED",
        severity: "warning",
        message: `Duplicate account ${code} merged into a single trial balance line`,
        accountCode: code,
      });
      continue;
    }

    byCode.set(code, {
      accountCode: code,
      accountName: nameRaw || code,
      parentAccountCode: classification.parentPrefix,
      accountLevel: classification.level,
      accountType: classification.accountType,
      category: classification.category,
      subcategory: classification.subcategory,
      classificationConfidence: classification.confidence,
      openingDebit: 0,
      openingCredit: 0,
      movementDebit: debit,
      movementCredit: credit,
      closingDebit,
      closingCredit,
      closingBalance,
      originalCurrency: row.currencyCode,
      exchangeRate,
      functionalAmount: closingBalance * exchangeRate,
      presentationAmount: closingBalance * exchangeRate,
      fxGainLoss: 0,
      leadSchedule: classification.leadSchedule,
      fsStatement: classification.fsStatement,
      isMapped: classification.fsStatement !== "unmapped",
      isOrphan: false,
      sourceRowNumber: row.rowNumber,
      sortOrder: byCode.size,
    });
  }

  const lines = [...byCode.values()].sort((a, b) =>
    a.accountCode.localeCompare(b.accountCode, undefined, { numeric: true }),
  );

  // Resolve hierarchy: mark orphans when parent prefix does not exist.
  const codeSet = new Set(lines.map((line) => line.accountCode));
  for (const line of lines) {
    if (line.parentAccountCode && !codeSet.has(line.parentAccountCode)) {
      // Prefer shorter existing prefix parents
      let parent: string | null = null;
      for (let len = line.parentAccountCode.length; len >= 1; len -= 1) {
        const candidate = line.accountCode.slice(0, len);
        if (candidate !== line.accountCode && codeSet.has(candidate)) {
          parent = candidate;
          break;
        }
      }
      line.parentAccountCode = parent;
      line.isOrphan = parent == null && line.accountLevel > 1;
      if (line.isOrphan) {
        issues.push({
          issueCode: "ORPHAN_ACCOUNT",
          severity: "info",
          message: `Account ${line.accountCode} has no parent in hierarchy`,
          accountCode: line.accountCode,
        });
      }
    }
  }

  const debitTotal = lines.reduce((sum, line) => sum + line.closingDebit, 0);
  const creditTotal = lines.reduce((sum, line) => sum + line.closingCredit, 0);
  const outOfBalanceAmount = Number((debitTotal - creditTotal).toFixed(6));
  const isBalanced = Math.abs(outOfBalanceAmount) < 0.01;

  if (!isBalanced) {
    issues.push({
      issueCode: "OUT_OF_BALANCE",
      severity: "blocking",
      message: `Trial balance is out of balance by ${outOfBalanceAmount}`,
    });
  }

  for (const line of lines) {
    if (line.accountType === "asset" && line.closingBalance < 0) {
      issues.push({
        issueCode: "NEGATIVE_ASSET",
        severity: "warning",
        message: `Asset account ${line.accountCode} has a negative closing balance`,
        accountCode: line.accountCode,
      });
    }
    if (line.accountType === "unknown") {
      issues.push({
        issueCode: "UNCLASSIFIED_ACCOUNT",
        severity: "warning",
        message: `Account ${line.accountCode} could not be classified confidently`,
        accountCode: line.accountCode,
      });
    }
  }

  const warningCount = issues.filter((i) => i.severity === "warning").length;
  const errorCount = issues.filter((i) => i.severity === "error" || i.severity === "blocking").length;
  const mappedCount = lines.filter((l) => l.isMapped).length;

  return {
    lines,
    issues,
    isBalanced,
    outOfBalanceAmount,
    summary: {
      accountCount: lines.length,
      warningCount,
      errorCount,
      mappedCount,
      unmappedCount: lines.length - mappedCount,
      debitTotal,
      creditTotal,
    },
  };
}
