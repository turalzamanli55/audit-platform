import type { ParsedDocument } from "@/lib/project-sync/parser";
import type {
  ExtractedCapability,
  ExtractedFeature,
  ExtractedModule,
} from "@/lib/project-sync/types";
import { includesAny, stableId } from "@/lib/project-sync/utils";
import { tablesUnderHeading } from "@/lib/project-sync/parser";

const CATEGORY_MODULE_HINTS: Array<{ categoryIncludes: string; moduleHints: string[] }> = [
  { categoryIncludes: "13.1", moduleHints: ["trial balance", "financial data import", "general ledger", "ifrs classification"] },
  { categoryIncludes: "13.2", moduleHints: ["audit engine", "audit planning", "working papers", "audit opinion"] },
  { categoryIncludes: "13.3", moduleHints: ["ai auditor", "rag", "knowledge base"] },
  { categoryIncludes: "13.4", moduleHints: ["governance", "control framework"] },
  { categoryIncludes: "13.5", moduleHints: ["financial statements", "reporting", "ifrs notes"] },
  { categoryIncludes: "13.6", moduleHints: ["organizations", "enterprise", "users", "authentication"] },
  { categoryIncludes: "13.7", moduleHints: ["authentication", "foundation"] },
];

/**
 * Capability Extractor — PROJECT_BIBLE §13 Functional Scope wins.
 */
export function extractCapabilities(
  parsedDocs: ParsedDocument[],
  modules: ExtractedModule[],
): ExtractedCapability[] {
  const bible = parsedDocs.find((entry) => entry.document.id === "PROJECT_BIBLE");
  if (!bible) return [];

  const capabilities: ExtractedCapability[] = [];
  const categories = ["13.1", "13.2", "13.3", "13.4", "13.5", "13.6", "13.7"];
  for (const category of categories) {
    const tables = tablesUnderHeading(bible, category).filter((table) =>
      table.headers.some((header) => /capability/i.test(header)),
    );
    for (const table of tables) {
      for (const row of table.rows) {
        const name = row[0];
        const description = row[1];
        if (!name || !description) continue;
        const module = resolveModule(category, name, modules);
        const featureId = stableId("feat", `${module.name}-${category}`);
        capabilities.push({
          id: stableId("cap", name),
          name,
          description,
          moduleId: module.id,
          domainId: module.domainId,
          featureId,
          category: table.sectionTitle,
          priority: inferPriority(name, category),
          sourceDocument: "PROJECT_BIBLE",
          sourceSection: table.sectionTitle,
          dependencies: [],
          parent: null,
          children: [],
        });
      }
    }
  }
  return capabilities;
}

/**
 * Feature Extractor — group capabilities by bible category × module.
 */
export function extractFeatures(
  capabilities: ExtractedCapability[],
  modules: ExtractedModule[],
): ExtractedFeature[] {
  const byFeature = new Map<string, ExtractedCapability[]>();
  for (const capability of capabilities) {
    const list = byFeature.get(capability.featureId) ?? [];
    list.push(capability);
    byFeature.set(capability.featureId, list);
  }

  const moduleById = new Map(modules.map((module) => [module.id, module]));
  return [...byFeature.entries()].map(([featureId, caps]) => {
    const first = caps[0]!;
    const module = moduleById.get(first.moduleId);
    return {
      id: featureId,
      name: `${module?.name ?? first.moduleId} · ${first.category}`,
      description: `Capabilities synchronized from ${first.sourceSection}`,
      moduleId: first.moduleId,
      domainId: first.domainId,
      sourceDocument: "PROJECT_BIBLE" as const,
      sourceSection: first.sourceSection,
      capabilityIds: caps.map((capability) => capability.id),
    };
  });
}

function resolveModule(
  category: string,
  capabilityName: string,
  modules: ExtractedModule[],
): ExtractedModule {
  const hint = CATEGORY_MODULE_HINTS.find((entry) => category.includes(entry.categoryIncludes));
  const byHint = hint
    ? modules.find((module) => includesAny(module.name, hint.moduleHints))
    : undefined;
  if (byHint && capabilityMatchesModule(capabilityName, byHint.name)) return byHint;

  const byName = modules.find((module) =>
    capabilityMatchesModule(capabilityName, module.name),
  );
  if (byName) return byName;
  if (byHint) return byHint;
  return modules[0] ?? {
    id: stableId("mod", "foundation"),
    name: "Foundation",
    description: "Fallback foundation module",
    domainId: stableId("dom", "enterprise-administration"),
    group: "fallback",
    sourceDocument: "PROJECT_BIBLE",
    sourceSection: "fallback",
    dependencies: [],
  };
}

function capabilityMatchesModule(capabilityName: string, moduleName: string): boolean {
  const cap = capabilityName.toLowerCase();
  const mod = moduleName.toLowerCase();
  if (cap.includes(mod) || mod.includes(cap.split(" ")[0]!)) return true;
  if (includesAny(cap, ["trial balance"]) && includesAny(mod, ["trial balance"])) return true;
  if (includesAny(cap, ["working paper"]) && includesAny(mod, ["working paper"])) return true;
  if (includesAny(cap, ["opinion"]) && includesAny(mod, ["opinion"])) return true;
  if (includesAny(cap, ["planning", "risk assessment", "materiality"]) && includesAny(mod, ["planning"])) return true;
  if (includesAny(cap, ["organization"]) && includesAny(mod, ["organization"])) return true;
  if (includesAny(cap, ["workspace"]) && includesAny(mod, ["enterprise"])) return true;
  if (includesAny(cap, ["ai", "anomaly", "rag"]) && includesAny(mod, ["ai", "rag"])) return true;
  if (includesAny(cap, ["financial statement"]) && includesAny(mod, ["financial statement"])) return true;
  if (includesAny(cap, ["ifrs"]) && includesAny(mod, ["ifrs"])) return true;
  if (includesAny(cap, ["authentication", "encryption", "tenant", "rbac", "session"]) && includesAny(mod, ["authentication", "foundation"])) return true;
  return false;
}

function inferPriority(
  name: string,
  category: string,
): "critical" | "high" | "medium" | "low" {
  if (includesAny(name, ["authentication", "tenant", "isolation", "trial balance", "engagement lifecycle"])) {
    return "critical";
  }
  if (category.includes("13.7") || category.includes("13.2")) return "high";
  if (category.includes("13.3")) return "high";
  return "medium";
}
