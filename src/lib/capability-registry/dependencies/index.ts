import type { Capability, CapabilityDefinition } from "@/lib/capability-registry/capabilities";

/**
 * Dependency graph helpers for capabilities.
 */
export function listMissingCapabilityDependencies(
  definition: CapabilityDefinition,
  registeredIds: Set<string>,
): string[] {
  return definition.dependencies.filter((dependencyId) => !registeredIds.has(dependencyId));
}

export function detectCapabilityCycles(capabilities: Capability[]): string[] {
  const graph = new Map<string, string[]>();
  for (const capability of capabilities) {
    graph.set(capability.id, [...capability.dependencies]);
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

export function listBlockedCapabilities(capabilities: Capability[]): Capability[] {
  const byId = new Map(capabilities.map((capability) => [capability.id, capability]));
  return capabilities.filter((capability) => {
    if (capability.deprecated || capability.completed) return false;
    return capability.dependencies.some((dependencyId) => {
      const dependency = byId.get(dependencyId);
      if (!dependency) return true;
      return dependency.status === "planned" || dependency.deprecated;
    });
  });
}
