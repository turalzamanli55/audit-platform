/**
 * Parse capabilities from PROJECT_BIBLE via EPBSE (executable specification).
 */
import { projectSyncEngine } from "@/lib/project-sync/engine";
import type { ParsedCapability, BusinessWeight } from "@/lib/capability-intelligence/types";

function toWeight(priority: string): BusinessWeight {
  if (priority === "critical" || priority === "high" || priority === "medium" || priority === "low") {
    return priority;
  }
  return "medium";
}

export function parseCapabilitiesFromBible(cwd = process.cwd()): {
  capabilities: ParsedCapability[];
  modules: Array<{ id: string; name: string; domainId: string }>;
  domains: Array<{ id: string; name: string }>;
} {
  const sync = projectSyncEngine.synchronize({ cwd, persist: false });

  const capabilities: ParsedCapability[] = sync.snapshot.capabilities.map((capability) => ({
    id: capability.id,
    name: capability.name,
    description: capability.description,
    purpose: capability.description || capability.name,
    moduleId: capability.moduleId,
    domainId: capability.domainId,
    featureId: capability.featureId,
    dependencies: [...capability.dependencies],
    sourceSection: capability.sourceSection,
    priority: toWeight(capability.priority),
    category: capability.category,
  }));

  return {
    capabilities,
    modules: sync.snapshot.modules.map((module) => ({
      id: module.id,
      name: module.name,
      domainId: module.domainId,
    })),
    domains: sync.snapshot.domains.map((domain) => ({
      id: domain.id,
      name: domain.name,
    })),
  };
}
