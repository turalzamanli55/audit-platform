import { normalizeAccountingHeader, normalizeCompact } from "@/lib/uaie/normalize";
import { UAIE_SYNONYMS } from "@/lib/uaie/synonyms";
import type { UaieCanonicalField } from "@/types/uaie";

export function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const prev = new Array<number>(b.length + 1);
  const curr = new Array<number>(b.length + 1);
  for (let j = 0; j <= b.length; j += 1) prev[j] = j;

  for (let i = 1; i <= a.length; i += 1) {
    curr[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
    }
    for (let j = 0; j <= b.length; j += 1) prev[j] = curr[j]!;
  }
  return prev[b.length]!;
}

export function similarityRatio(a: string, b: string): number {
  const left = normalizeCompact(a);
  const right = normalizeCompact(b);
  if (!left && !right) return 100;
  if (!left || !right) return 0;
  const distance = levenshtein(left, right);
  const maxLen = Math.max(left.length, right.length);
  return Math.round(((maxLen - distance) / maxLen) * 100);
}

export type FuzzyMatchResult = {
  field: UaieCanonicalField;
  confidence: number;
  matchedTerm: string;
};

export function fuzzyMatchCanonicalField(header: string): FuzzyMatchResult | null {
  const normalized = normalizeAccountingHeader(header);
  if (!normalized || normalized.length < 2) return null;

  let best: FuzzyMatchResult | null = null;

  for (const entry of UAIE_SYNONYMS) {
    for (const term of entry.terms) {
      const confidence = similarityRatio(normalized, term);
      if (confidence < 72) continue;
      if (!best || confidence > best.confidence) {
        best = { field: entry.field, confidence, matchedTerm: term };
      }
    }
  }

  return best;
}
