import type { BuiltNoteDraft } from "@/lib/ifrs-notes/notes";
import type { IfrsNoteItem, IfrsNoteSection, IfrsNoteStructure } from "@/types/ifrs-notes";

/**
 * Section Builder — assemble hierarchical note structure for workspace rendering.
 */
export function buildNoteStructure(input: {
  sections: IfrsNoteSection[];
  items: IfrsNoteItem[];
  crossReferences?: IfrsNoteStructure["crossReferences"];
}): IfrsNoteStructure {
  const itemsBySection = new Map<string, IfrsNoteItem[]>();
  for (const item of input.items) {
    const list = itemsBySection.get(item.sectionId) ?? [];
    list.push(item);
    itemsBySection.set(item.sectionId, list);
  }

  const sections = [...input.sections]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((section) => ({
      ...section,
      items: [...(itemsBySection.get(section.id) ?? [])].sort((a, b) => a.sortOrder - b.sortOrder),
    }));

  return {
    sections,
    crossReferences: input.crossReferences ?? [],
  };
}

export function materializeDraftSections(
  drafts: BuiltNoteDraft[],
  idFactory: () => string,
): { sections: IfrsNoteSection[]; items: IfrsNoteItem[] } {
  const now = new Date().toISOString();
  const sections: IfrsNoteSection[] = [];
  const items: IfrsNoteItem[] = [];
  for (const draft of drafts) {
    const sectionId = idFactory();
    sections.push({
      ...draft.section,
      id: sectionId,
      createdAt: now,
      updatedAt: now,
      version: 1,
    });
    for (const item of draft.items) {
      items.push({
        ...item,
        id: idFactory(),
        sectionId,
        createdAt: now,
        updatedAt: now,
        version: 1,
      });
    }
  }
  return { sections, items };
}
