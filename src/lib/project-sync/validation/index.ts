import type {
  ExtractedDomain,
  ExtractedFeature,
  ExtractedModule,
  SynchronizedCapability,
} from "@/lib/project-sync/types";
import { detectDependencyCycles } from "@/lib/project-sync/dependencies";

export type SyncValidationResult = {
  ok: boolean;
  errors: string[];
  warnings: string[];
};

/**
 * Validation Engine — docs/impl consistency and graph integrity.
 */
export function validateSynchronization(input: {
  domains: ExtractedDomain[];
  modules: ExtractedModule[];
  features: ExtractedFeature[];
  capabilities: SynchronizedCapability[];
}): SyncValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const domainIds = new Set(input.domains.map((domain) => domain.id));
  const moduleIds = new Set(input.modules.map((module) => module.id));
  const featureIds = new Set(input.features.map((feature) => feature.id));
  const capabilityIds = new Set(input.capabilities.map((capability) => capability.id));

  if (input.domains.length === 0) errors.push("No domains extracted from PROJECT_BIBLE.");
  if (input.modules.length === 0) errors.push("No modules extracted from PROJECT_BIBLE.");
  if (input.capabilities.length === 0) {
    errors.push("No capabilities extracted from PROJECT_BIBLE functional scope.");
  }

  for (const module of input.modules) {
    if (!domainIds.has(module.domainId)) {
      errors.push(`Module ${module.id} references missing domain ${module.domainId}.`);
    }
  }
  for (const feature of input.features) {
    if (!moduleIds.has(feature.moduleId)) {
      errors.push(`Feature ${feature.id} references missing module ${feature.moduleId}.`);
    }
  }
  for (const capability of input.capabilities) {
    if (!moduleIds.has(capability.moduleId)) {
      errors.push(`Capability ${capability.id} references missing module ${capability.moduleId}.`);
    }
    if (!featureIds.has(capability.featureId)) {
      errors.push(`Capability ${capability.id} references missing feature ${capability.featureId}.`);
    }
    if (!capability.evidence.documentation) {
      warnings.push(`Capability ${capability.id} missing documentation evidence.`);
    }
    const missing = Object.entries(capability.evidence)
      .filter(([, value]) => !value)
      .map(([key]) => key);
    if (missing.length === Object.keys(capability.evidence).length - 1) {
      warnings.push(`Capability ${capability.id} has almost no implementation evidence.`);
    }
  }

  const referencedCaps = new Set(input.features.flatMap((feature) => feature.capabilityIds));
  for (const capability of input.capabilities) {
    if (!referencedCaps.has(capability.id)) {
      warnings.push(`Orphan capability ${capability.id} is not linked from features.`);
    }
  }

  for (const cycle of detectDependencyCycles(input.capabilities)) {
    errors.push(`Circular capability dependency at ${cycle}.`);
  }
  for (const cycle of detectDependencyCycles(input.modules)) {
    errors.push(`Circular module dependency at ${cycle}.`);
  }

  // Duplicate names
  const seenNames = new Set<string>();
  for (const capability of input.capabilities) {
    const key = capability.name.toLowerCase();
    if (seenNames.has(key)) errors.push(`Duplicate capability registration: ${capability.name}`);
    seenNames.add(key);
  }

  // Implementation without documentation is impossible here (docs are source)
  // Documentation without implementation → warning
  for (const capability of input.capabilities) {
    const implemented =
      capability.evidence.database ||
      capability.evidence.repository ||
      capability.evidence.serverAction ||
      capability.evidence.ui;
    if (!implemented) {
      warnings.push(`Documentation without implementation: ${capability.id}`);
    }
  }

  void capabilityIds;
  return { ok: errors.length === 0, errors, warnings };
}
