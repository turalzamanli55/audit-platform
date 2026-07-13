import {
  detectCapabilityCycles,
  listMissingCapabilityDependencies,
} from "@/lib/capability-registry/dependencies";
import type { Capability, CapabilityDefinition } from "@/lib/capability-registry/capabilities";
import type { DomainDefinition } from "@/lib/capability-registry/domains";
import type { ModuleDefinition } from "@/lib/capability-registry/modules";
import type { FeatureDefinition } from "@/lib/capability-registry/features";
import { CAPABILITY_EVIDENCE_DIMENSIONS } from "@/lib/capability-registry/capabilities";

export type CapabilityRegistryValidation = {
  ok: boolean;
  errors: string[];
  warnings: string[];
};

/**
 * Registry validation — missing modules/features/evidence, orphans, duplicates, cycles.
 */
export function validateCapabilityRegistry(input: {
  domains: DomainDefinition[];
  modules: ModuleDefinition[];
  features: FeatureDefinition[];
  definitions: CapabilityDefinition[];
  capabilities: Capability[];
}): CapabilityRegistryValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  const domainIds = new Set(input.domains.map((domain) => domain.id));
  const moduleIds = new Set(input.modules.map((module) => module.id));
  const featureIds = new Set(input.features.map((feature) => feature.id));
  const capabilityIds = new Set<string>();

  for (const domain of input.domains) {
    for (const moduleId of domain.moduleIds) {
      if (!moduleIds.has(moduleId)) {
        errors.push(`Domain ${domain.id} references missing module ${moduleId}.`);
      }
    }
  }

  for (const module of input.modules) {
    if (!domainIds.has(module.domainId)) {
      errors.push(`Module ${module.id} references missing domain ${module.domainId}.`);
    }
    for (const featureId of module.featureIds) {
      if (!featureIds.has(featureId)) {
        errors.push(`Module ${module.id} references missing feature ${featureId}.`);
      }
    }
    for (const dependency of module.dependencies) {
      if (!moduleIds.has(dependency)) {
        errors.push(`Module ${module.id} depends on missing module ${dependency}.`);
      }
    }
  }

  for (const feature of input.features) {
    if (!moduleIds.has(feature.moduleId)) {
      errors.push(`Feature ${feature.id} references missing module ${feature.moduleId}.`);
    }
    if (!domainIds.has(feature.domainId)) {
      errors.push(`Feature ${feature.id} references missing domain ${feature.domainId}.`);
    }
    for (const capabilityId of feature.capabilityIds) {
      if (!input.definitions.some((definition) => definition.id === capabilityId)) {
        errors.push(`Feature ${feature.id} references missing capability ${capabilityId}.`);
      }
    }
  }

  for (const definition of input.definitions) {
    if (!definition.id.trim()) errors.push("Capability definition missing id.");
    if (capabilityIds.has(definition.id)) {
      errors.push(`Duplicate capability registration: ${definition.id}`);
    }
    capabilityIds.add(definition.id);

    if (!domainIds.has(definition.domain)) {
      errors.push(`Capability ${definition.id} references missing domain ${definition.domain}.`);
    }
    if (!moduleIds.has(definition.module)) {
      errors.push(`Capability ${definition.id} references missing module ${definition.module}.`);
    }
    if (!featureIds.has(definition.feature)) {
      errors.push(`Capability ${definition.id} references missing feature ${definition.feature}.`);
    }

    for (const dimension of CAPABILITY_EVIDENCE_DIMENSIONS) {
      if (typeof definition.evidence[dimension] !== "boolean") {
        errors.push(`Capability ${definition.id} missing evidence for ${dimension}.`);
      }
    }

    for (const missing of listMissingCapabilityDependencies(definition, capabilityIds)) {
      // Dependencies may appear later in the list; check full set after loop.
      void missing;
    }
  }

  for (const definition of input.definitions) {
    for (const missing of listMissingCapabilityDependencies(definition, capabilityIds)) {
      errors.push(`Capability ${definition.id} depends on missing capability ${missing}.`);
    }
  }

  for (const feature of input.features) {
    for (const capabilityId of feature.capabilityIds) {
      const capability = input.definitions.find((entry) => entry.id === capabilityId);
      if (!capability) continue;
      if (capability.feature !== feature.id) {
        warnings.push(
          `Capability ${capabilityId} feature field ${capability.feature} does not match feature ${feature.id}.`,
        );
      }
    }
  }

  const referencedCapabilityIds = new Set(
    input.features.flatMap((feature) => feature.capabilityIds),
  );
  for (const definition of input.definitions) {
    if (!referencedCapabilityIds.has(definition.id)) {
      warnings.push(`Orphan capability ${definition.id} is not linked from any feature.`);
    }
  }

  for (const cycle of detectCapabilityCycles(input.capabilities)) {
    errors.push(`Circular capability dependency detected at ${cycle}.`);
  }

  return { ok: errors.length === 0, errors, warnings };
}
