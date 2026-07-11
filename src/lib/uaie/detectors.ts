import { normalizeAccountingHeader, normalizeCompact } from "@/lib/uaie/normalize";
import { matchSynonymExact } from "@/lib/uaie/synonyms";
import { fuzzyMatchCanonicalField } from "@/lib/uaie/fuzzy";
import type { UaieCanonicalField, UaieCellValue, UaieSheetMatrix } from "@/types/uaie";

const SHEET_KEYWORDS = [
  "trial balance",
  "tb",
  "main ledger",
  "general ledger",
  "gl",
  "chart of accounts",
  "coa",
  "balance",
  "accounting",
  "saldo",
  "qaliq",
  "оборотно",
  "сальдовая",
  "hesablar",
  "muhasebe",
];

export function scoreSheet(sheet: UaieSheetMatrix): number {
  let score = 0;
  const name = normalizeAccountingHeader(sheet.name);
  for (const keyword of SHEET_KEYWORDS) {
    if (name === keyword) score += 40;
    else if (name.includes(keyword)) score += 25;
  }
  score += Math.min(30, sheet.rows.length / 5);
  const width = sheet.rows.reduce((max, row) => Math.max(max, row.length), 0);
  if (width >= 3 && width <= 12) score += 15;
  else if (width > 12) score += 5;

  const sample = sheet.rows.slice(0, 30);
  let headerish = 0;
  let numericish = 0;
  for (const row of sample) {
    for (const cell of row) {
      if (typeof cell === "string" && matchSynonymExact(cell)) headerish += 1;
      if (typeof cell === "number" || (typeof cell === "string" && /^-?\d+([.,]\d+)?$/.test(cell.trim()))) {
        numericish += 1;
      }
    }
  }
  score += Math.min(20, headerish * 4);
  score += Math.min(15, numericish / 4);

  return Math.max(0, Math.min(100, Math.round(score)));
}

export function detectBestSheet(sheets: UaieSheetMatrix[]): {
  selected: UaieSheetMatrix | null;
  scores: Array<{ name: string; score: number; rowCount: number; columnCount: number }>;
} {
  const scores = sheets.map((sheet) => ({
    name: sheet.name,
    score: scoreSheet(sheet),
    rowCount: sheet.rows.length,
    columnCount: sheet.rows.reduce((max, row) => Math.max(max, row.length), 0),
  }));
  scores.sort((a, b) => b.score - a.score);
  const top = scores[0];
  const selected = top ? sheets.find((s) => s.name === top.name) ?? null : null;
  return { selected, scores };
}

export function detectHeaderRow(sheet: UaieSheetMatrix): { rowIndex: number; confidence: number } {
  let bestIndex = 0;
  let bestScore = -1;

  const limit = Math.min(sheet.rows.length, 40);
  for (let i = 0; i < limit; i += 1) {
    const row = sheet.rows[i] ?? [];
    let score = 0;
    let nonEmpty = 0;
    for (const cell of row) {
      if (cell == null || String(cell).trim() === "") continue;
      nonEmpty += 1;
      const text = String(cell);
      if (matchSynonymExact(text)) score += 8;
      else if ((fuzzyMatchCanonicalField(text)?.confidence ?? 0) >= 80) score += 5;
      else if (/[a-zA-Zа-яА-ЯəƏıİöÖüÜğĞşŞçÇ]/.test(text)) score += 1;
      if (/^-?\d+([.,]\d+)?$/.test(text.trim())) score -= 2;
    }
    if (nonEmpty >= 2) score += 2;
    if (score > bestScore) {
      bestScore = score;
      bestIndex = i;
    }
  }

  return {
    rowIndex: bestIndex,
    confidence: Math.max(0, Math.min(100, bestScore * 4)),
  };
}

function isAccountCodeLike(value: UaieCellValue): boolean {
  if (value == null) return false;
  const text = String(value).trim();
  if (!text) return false;
  return /^[A-Za-z0-9][A-Za-z0-9.\-\/]{1,24}$/.test(text) && /\d/.test(text);
}

function isAccountNameLike(value: UaieCellValue): boolean {
  if (value == null) return false;
  const text = String(value).trim();
  if (!text || text.length < 2) return false;
  if (/^-?\d+([.,]\d+)?$/.test(text)) return false;
  return /[a-zA-Zа-яА-ЯəƏıİöÖüÜğĞşŞçÇ]/.test(text);
}

function isAmountLike(value: UaieCellValue): boolean {
  if (typeof value === "number" && Number.isFinite(value)) return true;
  if (value == null) return false;
  const text = String(value).trim().replace(/\s/g, "").replace(",", ".");
  return /^-?\d+(\.\d+)?$/.test(text);
}

export function detectColumnsByContext(
  sheet: UaieSheetMatrix,
  headerRowIndex: number,
): Array<{ index: number; field: UaieCanonicalField; confidence: number }> {
  const dataRows = sheet.rows.slice(headerRowIndex + 1, headerRowIndex + 61);
  const width = dataRows.reduce((max, row) => Math.max(max, row.length), 0);
  const results: Array<{ index: number; field: UaieCanonicalField; confidence: number }> = [];

  for (let col = 0; col < width; col += 1) {
    let codeHits = 0;
    let nameHits = 0;
    let amountHits = 0;
    let samples = 0;
    for (const row of dataRows) {
      const value = row[col];
      if (value == null || String(value).trim() === "") continue;
      samples += 1;
      if (isAccountCodeLike(value)) codeHits += 1;
      if (isAccountNameLike(value)) nameHits += 1;
      if (isAmountLike(value)) amountHits += 1;
    }
    if (samples < 3) continue;
    const codeRatio = codeHits / samples;
    const nameRatio = nameHits / samples;
    const amountRatio = amountHits / samples;

    if (codeRatio >= 0.7) {
      results.push({ index: col, field: "account_code", confidence: Math.round(codeRatio * 100) });
    } else if (nameRatio >= 0.7) {
      results.push({ index: col, field: "account_name", confidence: Math.round(nameRatio * 100) });
    } else if (amountRatio >= 0.75) {
      results.push({ index: col, field: "balance", confidence: Math.round(amountRatio * 90) });
    }
  }

  return results;
}

export function detectLanguage(headers: string[]): { language: string | null; confidence: number } {
  const joined = headers.map((h) => normalizeAccountingHeader(h)).join(" ");
  if (!joined) return { language: null, confidence: 0 };

  const tests: Array<{ language: string; needles: string[] }> = [
    { language: "az", needles: ["qaliq", "hesab", "borc", "kredit", "valyuta"] },
    { language: "ru", needles: ["счет", "дебет", "кредит", "остаток", "наименование"] },
    { language: "tr", needles: ["hesap", "borc", "alacak", "bakiye"] },
    { language: "de", needles: ["konto", "soll", "haben", "saldo"] },
    { language: "fr", needles: ["compte", "debit", "credit", "solde", "libelle"] },
    { language: "es", needles: ["cuenta", "debe", "haber", "saldo"] },
    { language: "it", needles: ["conto", "dare", "avere", "saldo"] },
    { language: "ar", needles: ["حساب", "مدين", "دائن", "رصيد"] },
    { language: "fa", needles: ["حساب", "بدهکار", "بستانکار", "مانده"] },
    { language: "en", needles: ["account", "debit", "credit", "balance", "description"] },
  ];

  let best = { language: "en", confidence: 20 };
  for (const test of tests) {
    let hits = 0;
    for (const needle of test.needles) {
      if (joined.includes(normalizeAccountingHeader(needle))) hits += 1;
    }
    const confidence = Math.min(100, hits * 22);
    if (confidence > best.confidence) best = { language: test.language, confidence };
  }
  return best;
}

const CURRENCY_CODES = [
  "AZN",
  "USD",
  "EUR",
  "GBP",
  "TRY",
  "RUB",
  "CHF",
  "AED",
  "SAR",
  "JPY",
  "CNY",
];

export function detectCurrency(sheet: UaieSheetMatrix): {
  currency: string | null;
  confidence: number;
} {
  const blob = sheet.rows
    .slice(0, 80)
    .flat()
    .map((cell) => (cell == null ? "" : String(cell)))
    .join(" ");
  const upper = blob.toUpperCase();
  for (const code of CURRENCY_CODES) {
    if (new RegExp(`\\b${code}\\b`).test(upper)) {
      return { currency: code, confidence: 88 };
    }
  }
  if (/manat|₼/.test(blob.toLowerCase())) return { currency: "AZN", confidence: 80 };
  if (/\$/.test(blob)) return { currency: "USD", confidence: 55 };
  if (/€/.test(blob)) return { currency: "EUR", confidence: 55 };
  return { currency: null, confidence: 0 };
}

export function detectErp(input: {
  filename: string;
  sheetNames: string[];
  headers: string[];
}): { erp: import("@/types/uaie").UaieErpSystem; confidence: number } {
  const blob = normalizeCompact(
    [input.filename, ...input.sheetNames, ...input.headers].join(" "),
  );

  const rules: Array<{ erp: import("@/types/uaie").UaieErpSystem; needles: string[]; boost: number }> = [
    { erp: "sap", needles: ["sap", "bseg", "bkpf", "fagl"], boost: 35 },
    { erp: "sap_business_one", needles: ["businessone", "sapb1", "obpl"], boost: 40 },
    { erp: "oracle_netsuite", needles: ["netsuite", "nsaccount"], boost: 40 },
    { erp: "oracle", needles: ["oracle", "glje", "oracleebs"], boost: 30 },
    { erp: "dynamics_365", needles: ["dynamics365", "d365", "finops"], boost: 40 },
    { erp: "microsoft_dynamics", needles: ["dynamics", "navision", "gpcompany"], boost: 30 },
    { erp: "1c", needles: ["1c", "1с", "оборотносальдовая"], boost: 40 },
    { erp: "logo", needles: ["logo", "go3", "tiger"], boost: 35 },
    { erp: "netsis", needles: ["netsis"], boost: 45 },
    { erp: "mikro", needles: ["mikro"], boost: 45 },
    { erp: "quickbooks", needles: ["quickbooks", "qbo", "qb"], boost: 40 },
    { erp: "xero", needles: ["xero"], boost: 45 },
    { erp: "sage", needles: ["sage"], boost: 40 },
    { erp: "zoho_books", needles: ["zohobooks", "zoho"], boost: 40 },
    { erp: "odoo", needles: ["odoo"], boost: 45 },
  ];

  let best: { erp: import("@/types/uaie").UaieErpSystem; confidence: number } = {
    erp: "manual_excel",
    confidence: 35,
  };

  for (const rule of rules) {
    let hits = 0;
    for (const needle of rule.needles) {
      if (blob.includes(normalizeCompact(needle))) hits += 1;
    }
    if (hits === 0) continue;
    const confidence = Math.min(98, rule.boost + hits * 18);
    if (confidence > best.confidence) best = { erp: rule.erp, confidence };
  }

  if (best.confidence < 50) best = { erp: "unknown", confidence: best.confidence };
  return best;
}
