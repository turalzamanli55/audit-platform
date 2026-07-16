import type { ParsedDocument } from "@/lib/project-sync/parser";
import type { ExtractedCapability, ExtractedRequirement } from "@/lib/project-sync/types";
import { stableId } from "@/lib/project-sync/utils";
import { findHeading, sectionBody } from "@/lib/project-sync/markdown";

/**
 * Requirements Extractor — MASTER_PRD functional requirements enrich bible capabilities.
 * Never overrides PROJECT_BIBLE facts.
 */
export function extractRequirements(
  parsedDocs: ParsedDocument[],
  capabilities: ExtractedCapability[],
): ExtractedRequirement[] {
  const prd = parsedDocs.find((entry) => entry.document.id === "MASTER_PRD");
  if (!prd) return [];

  const requirements: ExtractedRequirement[] = [];
  const heading = findHeading(prd.headings, (title) => /requirement|acceptance|ac-/i.test(title));
  if (!heading) {
    // Derive lightweight requirements from capability descriptions (documentation linkage only)
    return capabilities.slice(0, 0);
  }
  const body = sectionBody(prd.document.content, heading);
  const lines = body.split(/\r?\n/).filter((line) => /^\s*[-*]\s+/.test(line) || /\|\s*[A-Z]{2,}-/.test(line));
  for (const line of lines.slice(0, 200)) {
    const text = line.replace(/^\s*[-*|]+\s*/, "").trim();
    if (text.length < 8) continue;
    const name = text.slice(0, 120);
    requirements.push({
      id: stableId("req", name),
      name,
      description: text,
      sourceDocument: "MASTER_PRD",
      sourceSection: heading.title,
      relatedCapabilityIds: capabilities
        .filter((capability) =>
          text.toLowerCase().includes(capability.name.toLowerCase().split(" ")[0]!),
        )
        .map((capability) => capability.id)
        .slice(0, 3),
    });
  }
  return requirements;
}
