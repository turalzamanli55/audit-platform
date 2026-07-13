import type {
  FsAccountClassification,
  FsClassificationResult,
  FsStatementSection,
} from "@/types/fs-mapping";

function startsWithAny(code: string, prefixes: string[]): boolean {
  return prefixes.some((prefix) => code.startsWith(prefix));
}

function includesAny(text: string, tokens: string[]): boolean {
  return tokens.some((token) => text.includes(token));
}

function result(
  classification: FsAccountClassification,
  statementSection: FsStatementSection,
  confidence: number,
  categoryLabel: string,
  parentClassification: FsAccountClassification | null = null,
): FsClassificationResult {
  return { classification, statementSection, confidence, categoryLabel, parentClassification };
}

/**
 * Account Classification — maps TB accounts to FS classification buckets.
 * Pure domain logic. No DB. No report generation.
 */
export function classifyFsAccount(
  accountCode: string,
  accountName: string,
): FsClassificationResult {
  const code = accountCode.trim();
  const name = accountName.trim().toLowerCase();
  const first = code.charAt(0);

  if (
    startsWithAny(code, ["1"]) ||
    includesAny(name, ["cash", "bank", "receivable", "inventory", "asset", "aktiv", "ppe", "intangible"])
  ) {
    const isCurrent =
      startsWithAny(code, ["10", "11", "12", "13", "14"]) ||
      includesAny(name, ["cash", "bank", "receivable", "inventory", "prepayment"]);
    return result(
      isCurrent ? "current_assets" : "non_current_assets",
      "statement_of_financial_position",
      first === "1" ? 92 : 78,
      isCurrent ? "Current Assets" : "Non-current Assets",
      "assets",
    );
  }

  if (
    startsWithAny(code, ["2"]) ||
    includesAny(name, ["payable", "loan", "liabilit", "kredit", "borc", "provision", "deferred tax liability"])
  ) {
    const isCurrent =
      startsWithAny(code, ["20", "21", "22", "23"]) ||
      includesAny(name, ["trade payable", "accrual", "current"]);
    return result(
      isCurrent ? "current_liabilities" : "non_current_liabilities",
      "statement_of_financial_position",
      first === "2" ? 90 : 75,
      isCurrent ? "Current Liabilities" : "Non-current Liabilities",
      "liabilities",
    );
  }

  if (
    startsWithAny(code, ["3"]) ||
    includesAny(name, ["equity", "capital", "retained", "kapital", "reserve", "share capital"])
  ) {
    return result("equity", "statement_of_changes_in_equity", first === "3" ? 90 : 72, "Equity");
  }

  if (
    startsWithAny(code, ["4", "7"]) ||
    includesAny(name, ["revenue", "income", "sales", "gəlir", "turnover"])
  ) {
    return result("revenue", "statement_of_profit_or_loss", first === "4" || first === "7" ? 88 : 70, "Revenue");
  }

  if (
    includesAny(name, ["cost of sales", "cost of goods", "cogs", "direct cost"]) ||
    startsWithAny(code, ["50", "51"])
  ) {
    return result("cost_of_sales", "statement_of_profit_or_loss", 86, "Cost of Sales");
  }

  if (
    includesAny(name, ["finance cost", "interest expense", "borrowing cost"]) ||
    startsWithAny(code, ["66", "67"])
  ) {
    return result("finance_costs", "statement_of_profit_or_loss", 84, "Finance Costs");
  }

  if (
    includesAny(name, ["income tax", "tax expense", "corporation tax"]) ||
    startsWithAny(code, ["68"])
  ) {
    return result("tax", "statement_of_profit_or_loss", 84, "Tax");
  }

  if (
    includesAny(name, ["other comprehensive", "oci", "revaluation surplus", "fx translation"])
  ) {
    return result("oci", "statement_of_comprehensive_income", 80, "OCI");
  }

  if (
    includesAny(name, ["cash flow", "operating cash", "investing cash", "financing cash"])
  ) {
    return result("cash_flow", "statement_of_cash_flows", 75, "Cash Flow");
  }

  if (
    startsWithAny(code, ["5", "6", "8", "9"]) ||
    includesAny(name, ["expense", "salary", "depreciation", "amortisation", "admin", "operating"])
  ) {
    return result("operating_expenses", "statement_of_profit_or_loss", first === "5" || first === "6" ? 82 : 68, "Operating Expenses");
  }

  return result("unclassified", "other", 40, "Unclassified");
}

export function expandClassificationFamily(
  classification: FsAccountClassification,
): FsAccountClassification[] {
  switch (classification) {
    case "current_assets":
    case "non_current_assets":
      return ["assets", classification];
    case "current_liabilities":
    case "non_current_liabilities":
      return ["liabilities", classification];
    default:
      return [classification];
  }
}
