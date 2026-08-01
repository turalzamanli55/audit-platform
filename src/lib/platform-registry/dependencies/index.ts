import type { PlatformModule, PlatformModuleDefinition } from "@/lib/platform-registry/modules";

/**
 * Dependency graph helpers for registered modules.
 */
export function listMissingDependencies(
  definition: PlatformModuleDefinition,
  registeredIds: Set<string>,
): string[] {
  return definition.dependencies.filter((dependencyId) => !registeredIds.has(dependencyId));
}

export function buildDependencyEdges(modules: PlatformModule[]): Array<{ from: string; to: string }> {
  const edges: Array<{ from: string; to: string }> = [];
  for (const registryModule of modules) {
    for (const dependency of registryModule.dependencies) {
      edges.push({ from: registryModule.id, to: dependency });
    }
  }
  return edges;
}

export function detectDependencyCycles(modules: PlatformModule[]): string[] {
  const graph = new Map<string, string[]>();
  for (const registryModule of modules) {
    graph.set(registryModule.id, [...registryModule.dependencies]);
  }

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
