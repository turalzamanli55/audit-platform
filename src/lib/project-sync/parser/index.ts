import type { LoadedDocument } from "@/lib/project-sync/documents";
import {
  extractHeadings,
  parseMarkdownTables,
  sectionBody,
  type MarkdownHeading,
  type MarkdownTable,
} from "@/lib/project-sync/markdown";

export type ParsedDocument = {
  document: LoadedDocument;
  headings: MarkdownHeading[];
  tables: MarkdownTable[];
};

/**
 * Parser Engine — structural markdown parse only.
 * Does not invent product meaning; extractors interpret sections.
 */
export function parseDocument(document: LoadedDocument): ParsedDocument {
  const headings = extractHeadings(document.content);
  const tables: MarkdownTable[] = [];
  for (const heading of headings) {
    const body = sectionBody(document.content, heading);
    tables.push(...parseMarkdownTables(body, heading.title));
  }
  return { document, headings, tables };
}

export function parseDocuments(documents: LoadedDocument[]): ParsedDocument[] {
  return documents.map(parseDocument);
}

export function tablesUnderHeading(
  parsed: ParsedDocument,
  titleIncludes: string,
): MarkdownTable[] {
  const needle = titleIncludes.toLowerCase();
  return parsed.tables.filter((table) => table.sectionTitle.toLowerCase().includes(needle));
}
