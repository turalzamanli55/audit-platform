import type {
  TrialBalanceAccountType,
  TrialBalanceFsStatement,
  TrialBalanceLeadSchedule,
} from "@/types/trial-balance";

type ClassificationResult = {
  accountType: TrialBalanceAccountType;
  category: string;
  subcategory: string | null;
  confidence: number;
  leadSchedule: TrialBalanceLeadSchedule;
  fsStatement: TrialBalanceFsStatement;
  level: number;
  parentPrefix: string | null;
};

function startsWithAny(code: string, prefixes: string[]): boolean {
  return prefixes.some((prefix) => code.startsWith(prefix));
}

function includesAny(text: string, tokens: string[]): boolean {
  return tokens.some((token) => text.includes(token));
}

/**
 * Enterprise account classifier using code ranges + multilingual name heuristics.
 */
export function classifyTrialBalanceAccount(
  accountCode: string,
  accountName: string,
): ClassificationResult {
  const code = accountCode.trim();
  const name = accountName.trim().toLowerCase();
  const first = code.charAt(0);

  if (
    startsWithAny(code, ["1"]) ||
    includesAny(name, ["cash", "bank", "receivable", "inventory", "asset", "aktiv", "налич", "касс"])
  ) {
    const isCurrent = startsWithAny(code, ["10", "11", "12", "13", "14"]) || includesAny(name, ["cash", "bank", "receivable", "inventory"]);
    const lead: TrialBalanceLeadSchedule = includesAny(name, ["cash", "bank", "kassa", "налич"])
      ? "cash"
      : includesAny(name, ["receivable", "debitor", "дебит"])
        ? "receivables"
        : includesAny(name, ["inventory", "stock", "mal"])
          ? "inventory"
          : includesAny(name, ["ppe", "fixed", "equipment", "property", "əsas"])
            ? "ppe"
            : "other";
    return {
      accountType: "asset",
      category: isCurrent ? "Current Assets" : "Non-current Assets",
      subcategory: lead === "other" ? null : lead,
      confidence: first === "1" ? 92 : 78,
      leadSchedule: lead,
      fsStatement: "statement_of_financial_position",
      level: code.length >= 4 ? 3 : 2,
      parentPrefix: code.length >= 3 ? code.slice(0, Math.max(1, code.length - 1)) : null,
    };
  }

  if (
    startsWithAny(code, ["2"]) ||
    includesAny(name, ["payable", "loan", "liabilit", "kredit", "borc", "обязат"])
  ) {
    const lead: TrialBalanceLeadSchedule = includesAny(name, ["loan", "borrow", "kredit"])
      ? "loans"
      : "payables";
    return {
      accountType: "liability",
      category: startsWithAny(code, ["20", "21", "22"]) ? "Current Liabilities" : "Non-current Liabilities",
      subcategory: lead,
      confidence: first === "2" ? 90 : 75,
      leadSchedule: lead,
      fsStatement: "statement_of_financial_position",
      level: code.length >= 4 ? 3 : 2,
      parentPrefix: code.length >= 3 ? code.slice(0, Math.max(1, code.length - 1)) : null,
    };
  }

  if (
    startsWithAny(code, ["3"]) ||
    includesAny(name, ["equity", "capital", "retained", "kapital", "капитал"])
  ) {
    return {
      accountType: "equity",
      category: "Equity",
      subcategory: null,
      confidence: first === "3" ? 90 : 72,
      leadSchedule: "equity",
      fsStatement: "equity",
      level: code.length >= 4 ? 3 : 2,
      parentPrefix: code.length >= 3 ? code.slice(0, Math.max(1, code.length - 1)) : null,
    };
  }

  if (
    startsWithAny(code, ["4", "7"]) ||
    includesAny(name, ["revenue", "income", "sales", "gəlir", "выруч", "доход"])
  ) {
    const other = includesAny(name, ["other income", "digər gəlir", "проч"]);
    return {
      accountType: other ? "other_income" : "revenue",
      category: other ? "Other Income" : "Revenue",
      subcategory: null,
      confidence: first === "4" || first === "7" ? 88 : 70,
      leadSchedule: "revenue",
      fsStatement: "statement_of_profit_or_loss",
      level: code.length >= 4 ? 3 : 2,
      parentPrefix: code.length >= 3 ? code.slice(0, Math.max(1, code.length - 1)) : null,
    };
  }

  if (
    startsWithAny(code, ["5", "6", "8"]) ||
    includesAny(name, ["expense", "cost", "xərc", "расход", "затрат"])
  ) {
    const other = includesAny(name, ["other expense", "digər xərc"]);
    return {
      accountType: other ? "other_expense" : "expense",
      category: other ? "Other Expense" : "Expenses",
      subcategory: null,
      confidence: ["5", "6", "8"].includes(first) ? 88 : 70,
      leadSchedule: "expenses",
      fsStatement: "statement_of_profit_or_loss",
      level: code.length >= 4 ? 3 : 2,
      parentPrefix: code.length >= 3 ? code.slice(0, Math.max(1, code.length - 1)) : null,
    };
  }

  if (includesAny(name, ["oci", "comprehensive", "digər məcmu"])) {
    return {
      accountType: "oci",
      category: "OCI",
      subcategory: null,
      confidence: 80,
      leadSchedule: "other",
      fsStatement: "oci",
      level: 2,
      parentPrefix: null,
    };
  }

  return {
    accountType: "unknown",
    category: "Unclassified",
    subcategory: null,
    confidence: 35,
    leadSchedule: "unmapped",
    fsStatement: "unmapped",
    level: 1,
    parentPrefix: null,
  };
}
