import type { ParsedDocument } from "@/lib/project-sync/parser";
import { findHeading, sectionBody } from "@/lib/project-sync/markdown";

export type ImplementationNotes = {
  standards: string[];
  templateRules: string[];
  sourceSections: string[];
};

/**
 * Implementation metadata from IMPLEMENTATION_STANDARD + TEMPLATE — enrichment only.
 */
export function extractImplementationNotes(parsedDocs: ParsedDocument[]): ImplementationNotes {
  const notes: ImplementationNotes = { standards: [], templateRules: [], sourceSections: [] };
  for (const id of ["IMPLEMENTATION_STANDARD", "MASTER_IMPLEMENTATION_TEMPLATE"] as const) {
    const doc = parsedDocs.find((entry) => entry.document.id === id);
    if (!doc) continue;
    const heading = findHeading(doc.headings, (title) => /standard|rule|checklist|must/i.test(title));
    if (!heading) continue;
    notes.sourceSections.push(heading.title);
    const body = sectionBody(doc.document.content, heading);
    const bullets = body
      .split(/\r?\n/)
      .filter((line) => /^\s*[-*]\s+/.test(line) || /\*\*.+\*\*/.test(line))
      .map((line) => line.replace(/^\s*[-*]\s+/, "").trim())
      .filter(Boolean)
      .slice(0, 50);
    if (id === "IMPLEMENTATION_STANDARD") notes.standards.push(...bullets);
    else notes.templateRules.push(...bullets);
  }
  return notes;
}
