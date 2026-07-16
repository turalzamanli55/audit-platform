import type { ParsedDocument } from "@/lib/project-sync/parser";
import type { ExtractedDomain, ExtractedModule } from "@/lib/project-sync/types";
import { includesAny, stableId } from "@/lib/project-sync/utils";
import { tablesUnderHeading } from "@/lib/project-sync/parser";

const GROUP_DOMAIN_HINTS: Array<{ groupIncludes: string; domainHints: string[] }> = [
  { groupIncludes: "12.1", domainHints: ["enterprise administration", "governance"] },
  { groupIncludes: "12.2", domainHints: ["financial reporting", "ifrs"] },
  { groupIncludes: "12.3", domainHints: ["audit", "isa", "risk management"] },
  { groupIncludes: "12.4", domainHints: ["governance", "internal controls", "financial intelligence", "reporting"] },
  { groupIncludes: "12.5", domainHints: ["ai analysis", "knowledge management"] },
  { groupIncludes: "12.6", domainHints: ["enterprise administration"] },
];

/**
 * Module Extractor — PROJECT_BIBLE §12 Core Modules wins.
 */
export function extractModules(
  parsedDocs: ParsedDocument[],
  domains: ExtractedDomain[],
): ExtractedModule[] {
  const bible = parsedDocs.find((entry) => entry.document.id === "PROJECT_BIBLE");
  if (!bible) return [];

  const modules: ExtractedModule[] = [];
  const groups = ["12.1", "12.2", "12.3", "12.4", "12.5", "12.6"];
  for (const group of groups) {
    const tables = tablesUnderHeading(bible, group).filter((table) =>
      table.headers.some((header) => /module/i.test(header)),
    );
    for (const table of tables) {
      for (const row of table.rows) {
        const name = row[0];
        const description = row[1];
        if (!name || !description) continue;
        modules.push({
          id: stableId("mod", name),
          name,
          description,
          domainId: resolveDomainId(group, domains),
          group: table.sectionTitle,
          sourceDocument: "PROJECT_BIBLE",
          sourceSection: table.sectionTitle,
          dependencies: [],
        });
      }
    }
  }
  return modules;
}

function resolveDomainId(group: string, domains: ExtractedDomain[]): string {
  const hint = GROUP_DOMAIN_HINTS.find((entry) => group.includes(entry.groupIncludes));
  if (!hint) return domains[0]?.id ?? stableId("dom", "enterprise-administration");
  const match = domains.find((domain) =>
    includesAny(domain.name, hint.domainHints),
  );
  return match?.id ?? domains[0]?.id ?? stableId("dom", "enterprise-administration");
}

export function inferModuleDependencies(modules: ExtractedModule[]): ExtractedModule[] {
  const byName = new Map(modules.map((module) => [module.name.toLowerCase(), module.id]));
  return modules.map((module) => {
    const deps: string[] = [];
    if (includesAny(module.name, ["companies", "users", "authentication"])) {
      const org = byName.get("organizations");
      if (org) deps.push(org);
    }
    if (includesAny(module.name, ["trial balance", "ifrs classification", "financial statements"])) {
      const importMod = byName.get("financial data import");
      if (importMod) deps.push(importMod);
    }
    if (includesAny(module.name, ["working papers", "lead sheets", "audit opinion", "audit planning"])) {
      const engine = byName.get("audit engine");
      if (engine) deps.push(engine);
    }
    return { ...module, dependencies: [...new Set(deps)] };
  });
}
