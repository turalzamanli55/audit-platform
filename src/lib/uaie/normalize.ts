/**
 * Universal Accounting Import Engine — header / text normalization.
 * Strips noise, folds case, and applies Azerbaijani latinization.
 */

const AZ_MAP: Record<string, string> = {
  ə: "e",
  Ə: "e",
  ı: "i",
  I: "i",
  İ: "i",
  ş: "s",
  Ş: "s",
  ç: "c",
  Ç: "c",
  ğ: "g",
  Ğ: "g",
  ö: "o",
  Ö: "o",
  ü: "u",
  Ü: "u",
};

const DIACRITIC_RE = /[\u0300-\u036f]/g;

export function latinizeAzerbaijani(input: string): string {
  let out = "";
  for (const ch of input) {
    out += AZ_MAP[ch] ?? ch;
  }
  return out;
}

export function stripDiacritics(input: string): string {
  return input.normalize("NFD").replace(DIACRITIC_RE, "");
}

export function normalizeAccountingHeader(raw: unknown): string {
  if (raw == null) return "";
  let value = String(raw);
  value = latinizeAzerbaijani(value);
  value = stripDiacritics(value);
  value = value.toLowerCase();
  value = value.replace(/[\u00a0\t\r\n]+/g, " ");
  value = value.replace(/[_./\\|:;,+*#@!?()[\]{}'"`~^=<>]+/g, " ");
  value = value.replace(/-/g, " ");
  value = value.replace(/\s+/g, " ").trim();
  return value;
}

export function normalizeCompact(raw: unknown): string {
  return normalizeAccountingHeader(raw).replace(/\s+/g, "");
}
