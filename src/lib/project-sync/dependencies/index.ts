import type { ExtractedCapability, ExtractedModule } from "@/lib/project-sync/types";
import { includesAny } from "@/lib/project-sync/utils";

/**
 * Dependency Extractor — link capabilities/modules by documented relationships.
 */
export function extractCapabilityDependencies(
  capabilities: ExtractedCapability[],
  modules: ExtractedModule[],
): ExtractedCapability[] {
  const byName = new Map(capabilities.map((capability) => [capability.name.toLowerCase(), capability.id]));
  const moduleById = new Map(modules.map((module) => [module.id, module]));

  return capabilities.map((capability) => {
    const deps: string[] = [];
    const module = moduleById.get(capability.moduleId);
    for (const moduleDep of module?.dependencies ?? []) {
      const related = capabilities.find((entry) => entry.moduleId === moduleDep);
      if (related) deps.push(related.id);
    }
    if (includesAny(capability.name, ["financial statement", "ifrs note"])) {
      const tb = byName.get("trial balance management");
      if (tb) deps.push(tb);
    }
    if (includesAny(capability.name, ["audit opinion"])) {
      const review = byName.get("review workflow");
      if (review) deps.push(review);
    }
    if (includesAny(capability.name, ["working paper"])) {
      const planning = byName.get("audit planning");
      if (planning) deps.push(planning);
    }
    return {
      ...capability,
      dependencies: [...new Set(deps.filter((id) => id !== capability.id))],
    };
  });
}

export function detectDependencyCycles(
  nodes: Array<{ id: string; dependencies: string[] }>,
): string[] {
  const graph = new Map(nodes.map((node) => [node.id, node.dependencies]));
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const cycles: string[] = [];

  function dfs(node: string): boolean {
    if (visiting.has(node)) {
      cycles.push(node);
      return true;
    }
    if (visited.has(node)) return false;
    visiting.add(node);
    for (const next of graph.get(node) ?? []) {
      if (dfs(next)) return true;
    }
    visiting.delete(node);
    visited.add(node);
    return false;
  }

  for (const id of graph.keys()) dfs(id);
  return [...new Set(cycles)];
}
