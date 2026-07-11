import { UAIE_MAPPING_CONFIDENCE_THRESHOLD } from "@/constants/uaie";
import { detectColumnsByContext } from "@/lib/uaie/detectors";
import { fuzzyMatchCanonicalField } from "@/lib/uaie/fuzzy";
import { matchSynonymExact } from "@/lib/uaie/synonyms";
import type { UaieCanonicalField, UaieColumnMapping, UaieSheetMatrix } from "@/types/uaie";

const REQUIRED_FIELDS: UaieCanonicalField[] = ["account_code", "account_name"];

export function mapColumns(input: {
  sheet: UaieSheetMatrix;
  headerRowIndex: number;
  manualOverrides?: Array<{ sourceColumnIndex: number; canonicalField: UaieCanonicalField }>;
}): { mappings: UaieColumnMapping[]; mappingConfidence: number; requiresWizard: boolean } {
  const headerRow = input.sheet.rows[input.headerRowIndex] ?? [];
  const width = Math.max(
    headerRow.length,
    input.sheet.rows.reduce((max, row) => Math.max(max, row.length), 0),
  );

  const mappings: UaieColumnMapping[] = [];
  const used = new Set<UaieCanonicalField>();

  for (let index = 0; index < width; index += 1) {
    const sourceHeader = headerRow[index] == null ? null : String(headerRow[index]);
    const manual = input.manualOverrides?.find((item) => item.sourceColumnIndex === index);
    if (manual) {
      mappings.push({
        sourceColumnIndex: index,
        sourceHeader,
        canonicalField: manual.canonicalField,
        confidence: 100,
        isManual: true,
      });
      if (manual.canonicalField !== "ignore") used.add(manual.canonicalField);
      continue;
    }

    let field: UaieCanonicalField = "ignore";
    let confidence = 0;

    if (sourceHeader) {
      const exact = matchSynonymExact(sourceHeader);
      if (exact) {
        field = exact;
        confidence = 98;
      } else {
        const fuzzy = fuzzyMatchCanonicalField(sourceHeader);
        if (fuzzy && fuzzy.confidence >= 78) {
          field = fuzzy.field;
          confidence = fuzzy.confidence;
        }
      }
    }

    if (field !== "ignore" && used.has(field)) {
      // Prefer first strong match; demote duplicates
      field = "ignore";
      confidence = Math.min(confidence, 40);
    }

    if (field !== "ignore") used.add(field);

    mappings.push({
      sourceColumnIndex: index,
      sourceHeader,
      canonicalField: field,
      confidence,
      isManual: false,
    });
  }

  // Context fill for missing required / amount fields
  const context = detectColumnsByContext(input.sheet, input.headerRowIndex);
  for (const candidate of context) {
    const existing = mappings.find((m) => m.sourceColumnIndex === candidate.index);
    if (!existing) continue;
    if (existing.canonicalField !== "ignore" && existing.confidence >= 85) continue;
    if (used.has(candidate.field) && candidate.field !== "balance") continue;
    existing.canonicalField = candidate.field;
    existing.confidence = Math.max(existing.confidence, candidate.confidence);
    used.add(candidate.field);
  }

  // If we have debit+credit, demote ambiguous balance duplicates unless no debit/credit
  const hasDebit = mappings.some((m) => m.canonicalField === "debit");
  const hasCredit = mappings.some((m) => m.canonicalField === "credit");
  if (hasDebit && hasCredit) {
    for (const mapping of mappings) {
      if (mapping.canonicalField === "balance" && !mapping.isManual && mapping.confidence < 95) {
        // keep balance if present; still valid TB style
      }
    }
  }

  const mappedRequired = REQUIRED_FIELDS.every((field) =>
    mappings.some((m) => m.canonicalField === field && m.confidence >= 70),
  );
  const hasAmount = mappings.some((m) =>
    ["debit", "credit", "balance"].includes(m.canonicalField),
  );

  const confidences = mappings
    .filter((m) => m.canonicalField !== "ignore")
    .map((m) => m.confidence);
  const mappingConfidence =
    confidences.length === 0
      ? 0
      : Math.round(confidences.reduce((sum, value) => sum + value, 0) / confidences.length);

  const requiresWizard =
    !mappedRequired ||
    !hasAmount ||
    mappingConfidence < UAIE_MAPPING_CONFIDENCE_THRESHOLD;

  return { mappings, mappingConfidence, requiresWizard };
}
