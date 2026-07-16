import type { ParsedDocument } from "@/lib/project-sync/parser";
import { findHeading, sectionBody } from "@/lib/project-sync/markdown";

export type ArchitectureNotes = {
  layers: string[];
  principles: string[];
  sourceSection: string | null;
};

/**
 * Architecture metadata from SYSTEM_ARCHITECTURE.md — enrichment only.
 */
export function extractArchitectureNotes(parsedDocs: ParsedDocument[]): ArchitectureNotes {
  const arch = parsedDocs.find((entry) => entry.document.id === "SYSTEM_ARCHITECTURE");
  if (!arch) return { layers: [], principles: [], sourceSection: null };
  const heading = findHeading(arch.headings, (title) => /layer|architecture|principle/i.test(title));
  if (!heading) return { layers: [], principles: [], sourceSection: null };
  const body = sectionBody(arch.document.content, heading);
  const bullets = body
    .split(/\r?\n/)
    .filter((line) => /^\s*[-*]\s+/.test(line))
    .map((line) => line.replace(/^\s*[-*]\s+/, "").trim())
    .filter(Boolean);
  return {
    layers: bullets.filter((line) => /layer|route|action|repository/i.test(line)).slice(0, 40),
    principles: bullets.filter((line) => !/layer|route|action|repository/i.test(line)).slice(0, 40),
    sourceSection: heading.title,
  };
}
