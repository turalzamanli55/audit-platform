import type { ParsedDocument } from "@/lib/project-sync/parser";
import type { ExtractedDomain } from "@/lib/project-sync/types";
import { stableId } from "@/lib/project-sync/utils";
import { tablesUnderHeading } from "@/lib/project-sync/parser";

/**
 * Domain Extractor — PROJECT_BIBLE §11 Business Domains wins.
 */
export function extractDomains(parsedDocs: ParsedDocument[]): ExtractedDomain[] {
  const bible = parsedDocs.find((entry) => entry.document.id === "PROJECT_BIBLE");
  if (!bible) return [];

  const overview = tablesUnderHeading(bible, "11.1").find((table) =>
    table.headers.some((header) => /domain/i.test(header)),
  );
  if (!overview) {
    // Fallback: first Domain/Definition table near Business Domains
    const fallback = bible.tables.find(
      (table) =>
        table.sectionTitle.toLowerCase().includes("domain") &&
        table.headers[0]?.toLowerCase().includes("domain"),
    );
    return mapDomainTable(fallback);
  }
  return mapDomainTable(overview);
}

function mapDomainTable(
  table: { rows: string[][]; sectionTitle: string } | undefined,
): ExtractedDomain[] {
  if (!table) return [];
  return table.rows
    .filter((row) => row[0] && row[1])
    .map((row) => ({
      id: stableId("dom", row[0]!),
      name: row[0]!,
      description: row[1]!,
      sourceDocument: "PROJECT_BIBLE" as const,
      sourceSection: table.sectionTitle,
    }));
}
