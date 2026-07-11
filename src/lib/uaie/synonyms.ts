import { normalizeAccountingHeader, normalizeCompact } from "@/lib/uaie/normalize";
import type { UaieCanonicalField } from "@/types/uaie";

export type SynonymEntry = {
  field: UaieCanonicalField;
  terms: string[];
};

/** Multilingual synonym dictionary for accounting headers. */
export const UAIE_SYNONYMS: SynonymEntry[] = [
  {
    field: "account_code",
    terms: [
      "account code",
      "gl",
      "gl account",
      "gl code",
      "account",
      "code",
      "acct",
      "acct code",
      "account no",
      "account number",
      "kod",
      "hesab",
      "hesab kodu",
      "hesab no",
      "счет",
      "код счета",
      "номер счета",
      "konto",
      "kontonummer",
      "numero compte",
      "codigo cuenta",
      "codice conto",
      "حساب",
      "کد حساب",
    ],
  },
  {
    field: "account_name",
    terms: [
      "account name",
      "name",
      "description",
      "title",
      "account description",
      "hesab adi",
      "adı",
      "adi",
      "описание",
      "наименование",
      "название",
      "bezeichnung",
      "libelle",
      "nombre",
      "descrizione",
      "اسم الحساب",
      "نام حساب",
    ],
  },
  {
    field: "debit",
    terms: [
      "debit",
      "dr",
      "debits",
      "debit amount",
      "borc",
      "borç",
      "дебет",
      "soll",
      "debiti",
      "debe",
      "مدين",
      "بدهکار",
    ],
  },
  {
    field: "credit",
    terms: [
      "credit",
      "cr",
      "credits",
      "credit amount",
      "kredit",
      "кредит",
      "haben",
      "avere",
      "haber",
      "دائن",
      "بستانکار",
    ],
  },
  {
    field: "balance",
    terms: [
      "balance",
      "closing",
      "closing balance",
      "ending balance",
      "saldo",
      "qaliq",
      "qalıq",
      "остаток",
      "конечный остаток",
      "endbestand",
      "solde",
      "saldo final",
      "رصيد",
      "مانده",
    ],
  },
  {
    field: "currency",
    terms: [
      "currency",
      "ccy",
      "curr",
      "valyuta",
      "валюта",
      "waehrung",
      "devise",
      "moneda",
      "valuta",
      "عملة",
      "ارز",
    ],
  },
  {
    field: "department",
    terms: [
      "department",
      "dept",
      "departament",
      "отдел",
      "abteilung",
      "departement",
      "departamento",
    ],
  },
  {
    field: "cost_center",
    terms: [
      "cost center",
      "cost centre",
      "cc",
      "kostenstelle",
      "merkez",
      "центр затрат",
      "centre de cout",
    ],
  },
];

const INDEX: Array<{ field: UaieCanonicalField; normalized: string; compact: string }> = [];

for (const entry of UAIE_SYNONYMS) {
  for (const term of entry.terms) {
    INDEX.push({
      field: entry.field,
      normalized: normalizeAccountingHeader(term),
      compact: normalizeCompact(term),
    });
  }
}

export function matchSynonymExact(header: string): UaieCanonicalField | null {
  const normalized = normalizeAccountingHeader(header);
  const compact = normalizeCompact(header);
  if (!normalized) return null;

  for (const entry of INDEX) {
    if (entry.normalized === normalized || entry.compact === compact) {
      return entry.field;
    }
  }
  return null;
}

export function synonymCandidates(header: string): Array<{ field: UaieCanonicalField; term: string }> {
  const normalized = normalizeAccountingHeader(header);
  if (!normalized) return [];
  const out: Array<{ field: UaieCanonicalField; term: string }> = [];
  for (const entry of INDEX) {
    if (
      entry.normalized.includes(normalized) ||
      normalized.includes(entry.normalized) ||
      entry.compact.includes(normalizeCompact(header))
    ) {
      out.push({ field: entry.field, term: entry.normalized });
    }
  }
  return out;
}
