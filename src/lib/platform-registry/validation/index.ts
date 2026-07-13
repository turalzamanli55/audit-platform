import {
  detectDependencyCycles,
  listMissingDependencies,
} from "@/lib/platform-registry/dependencies";
import type { PlatformModule, PlatformModuleDefinition } from "@/lib/platform-registry/modules";
import { PLATFORM_COMPLETION_DIMENSIONS } from "@/lib/platform-registry/modules";

export type PlatformRegistryValidation = {
  ok: boolean;
  errors: string[];
  warnings: string[];
};

/**
 * Registry validation — integrity of registrations and dependency graph.
 */
export function validatePlatformRegistry(
  definitions: PlatformModuleDefinition[],
  modules: PlatformModule[],
): PlatformRegistryValidation {
  const errors: string[] = [];
  const warnings: string[] = [];
  const ids = new Set<string>();

  for (const definition of definitions) {
    if (!definition.id.trim()) errors.push("Module definition missing id.");
    if (ids.has(definition.id)) errors.push(`Duplicate module id: ${definition.id}`);
    ids.add(definition.id);

    if (!definition.name.trim()) errors.push(`Module ${definition.id} missing name.`);
    if (!definition.domain.trim()) errors.push(`Module ${definition.id} missing domain.`);

    for (const dimension of PLATFORM_COMPLETION_DIMENSIONS) {
      if (typeof definition.evidence[dimension] !== "boolean") {
        errors.push(`Module ${definition.id} missing evidence for ${dimension}.`);
      }
    }

    if (definition.parent && definition.parent === definition.id) {
      errors.push(`Module ${definition.id} cannot be its own parent.`);
    }
  }

  const missingDeps = definitions.flatMap((definition) =>
    listMissingDependencies(definition, ids).map(
      (dependency) => `Module ${definition.id} depends on missing module ${dependency}.`,
    ),
  );
  errors.push(...missingDeps);

  const cycles = detectDependencyCycles(modules);
  for (const node of cycles) {
    errors.push(`Dependency cycle detected at module ${node}.`);
  }

  for (const module of modules) {
    if (module.parent && !ids.has(module.parent)) {
      warnings.push(`Module ${module.id} parent ${module.parent} is not registered.`);
    }
    for (const child of module.children) {
      if (!ids.has(child)) {
        warnings.push(`Module ${module.id} child ${child} is not registered.`);
      }
    }
  }

  return { ok: errors.length === 0, errors, warnings };
}
