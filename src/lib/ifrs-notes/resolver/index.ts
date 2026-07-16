import type {
  IfrsNoteCrossReference,
  IfrsNoteItem,
  IfrsNotePackage,
  IfrsNoteSection,
  IfrsNoteStructure,
} from "@/types/ifrs-notes";

/**
 * Workspace / search resolver for IFRS Notes entities.
 */
export function searchIfrsNoteEntities(input: {
  query: string;
  notePackage: IfrsNotePackage | null;
  structure: IfrsNoteStructure | null;
  sections: IfrsNoteSection[];
  items: IfrsNoteItem[];
  crossReferences: IfrsNoteCrossReference[];
}): Array<{
  kind: "note" | "item" | "cross_reference" | "package";
  id: string;
  label: string;
  meta: string;
}> {
  const q = input.query.trim().toLowerCase();
  if (!q) return [];

  const results: Array<{
    kind: "note" | "item" | "cross_reference" | "package";
    id: string;
    label: string;
    meta: string;
  }> = [];

  if (input.notePackage) {
    const hay = `${input.notePackage.name} ${input.notePackage.standard}`.toLowerCase();
    if (hay.includes(q)) {
      results.push({
        kind: "package",
        id: input.notePackage.id,
        label: input.notePackage.name,
        meta: input.notePackage.packageStatus,
      });
    }
  }

  for (const section of input.sections) {
    const hay = `${section.noteCode} ${section.title} ${section.standardRef ?? ""} ${section.noteType}`.toLowerCase();
    if (hay.includes(q)) {
      results.push({
        kind: "note",
        id: section.id,
        label: `${section.noteCode} · ${section.title}`,
        meta: section.disclosureKind,
      });
    }
  }

  for (const item of input.items) {
    const hay = `${item.itemCode} ${item.title ?? ""} ${item.bodyText}`.toLowerCase();
    if (hay.includes(q)) {
      results.push({
        kind: "item",
        id: item.id,
        label: item.title ?? item.itemCode,
        meta: item.itemKind,
      });
    }
  }

  for (const reference of input.crossReferences) {
    const hay =
      `${reference.referenceLabel} ${reference.statementLineCode ?? ""} ${reference.disclosureCode ?? ""}`.toLowerCase();
    if (hay.includes(q)) {
      results.push({
        kind: "cross_reference",
        id: reference.id,
        label: reference.referenceLabel,
        meta: reference.disclosureCode ?? reference.statementLineCode ?? "xref",
      });
    }
  }

  return results.slice(0, 100);
}
