import type { ParsedDocument } from "@/lib/project-sync/parser";
import { findHeading, sectionBody } from "@/lib/project-sync/markdown";

export type DesignNotes = {
  tokens: string[];
  components: string[];
  sourceSection: string | null;
};

/**
 * Design metadata from DESIGN_SYSTEM.md — enrichment only.
 */
export function extractDesignNotes(parsedDocs: ParsedDocument[]): DesignNotes {
  const design = parsedDocs.find((entry) => entry.document.id === "DESIGN_SYSTEM");
  if (!design) return { tokens: [], components: [], sourceSection: null };
  const heading = findHeading(design.headings, (title) => /token|component|pattern|typography/i.test(title));
  if (!heading) return { tokens: [], components: [], sourceSection: null };
  const body = sectionBody(design.document.content, heading);
  const bullets = body
    .split(/\r?\n/)
    .filter((line) => /^\s*[-*]\s+/.test(line))
    .map((line) => line.replace(/^\s*[-*]\s+/, "").trim())
    .filter(Boolean);
  return {
    tokens: bullets.filter((line) => /color|space|type|radius|token/i.test(line)).slice(0, 40),
    components: bullets.filter((line) => /button|input|card|nav|component/i.test(line)).slice(0, 40),
    sourceSection: heading.title,
  };
}
