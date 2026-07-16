import type { ParsedDocument } from "@/lib/project-sync/parser";
import { extractHeadings } from "@/lib/project-sync/markdown";

/**
 * Section index helper for reporting.
 */
export function listDocumentSections(parsed: ParsedDocument): string[] {
  return extractHeadings(parsed.document.content).map((heading) => heading.title);
}
