import { PLATFORM_MODULE_CATALOG } from "@/lib/platform-registry/catalog";
import { buildPlatformRoadmap } from "@/lib/platform-registry/roadmap";
import { materializeModule } from "@/lib/platform-registry/progress";
import { validatePlatformRegistry } from "@/lib/platform-registry/validation";
import type {
  PlatformCompletionReport,
  PlatformModule,
  PlatformModuleDefinition,
  PlatformModuleStatus,
} from "@/lib/platform-registry/modules";
import { PLATFORM_MODULE_STATUSES } from "@/lib/platform-registry/modules";
import { capabilityRegistryEngine } from "@/lib/capability-registry/engine";

/**
 * Platform Registry Engine
 * Module catalog remains for registration metadata.
 * Platform/module completion is delegated to the Capability Registry
 * (capability-based roll-up). Never invents percentages.
 */
export class PlatformRegistryEngine {
  private definitions: PlatformModuleDefinition[];

  constructor(definitions: PlatformModuleDefinition[] = PLATFORM_MODULE_CATALOG) {
    this.definitions = [...definitions];
  }

  register(definition: PlatformModuleDefinition): void {
    const index = this.definitions.findIndex((entry) => entry.id === definition.id);
    if (index >= 0) {
      this.definitions[index] = definition;
      return;
    }
    this.definitions.push(definition);
  }

  updateEvidence(
    moduleId: string,
    evidence: PlatformModuleDefinition["evidence"],
  ): PlatformModuleDefinition | null {
    const index = this.definitions.findIndex((entry) => entry.id === moduleId);
    if (index < 0) return null;
    const current = this.definitions[index]!;
    const next: PlatformModuleDefinition = {
      ...current,
      evidence,
      updatedAt: new Date().toISOString(),
    };
    this.definitions[index] = next;
    return next;
  }

  listDefinitions(): PlatformModuleDefinition[] {
    return [...this.definitions];
  }

  listModules(): PlatformModule[] {
    return this.definitions.map((definition) => {
      const base = materializeModule(definition);
      const capabilityCompletion = capabilityRegistryEngine.getModuleCompletion(definition.id);
      if (capabilityCompletion == null) return base;
      return {
        ...base,
        completionPct: capabilityCompletion,
        status: mapCapabilityCompletionToModuleStatus(capabilityCompletion, base.status),
        completed: capabilityCompletion >= 100,
        enterprise: capabilityCompletion >= 80,
        production: capabilityCompletion >= 60,
        partial: capabilityCompletion >= 36.36,
      };
    });
  }

  getModule(moduleId: string): PlatformModule | null {
    return this.listModules().find((module) => module.id === moduleId) ?? null;
  }

  getModuleCompletion(moduleId: string): number | null {
    const fromCapabilities = capabilityRegistryEngine.getModuleCompletion(moduleId);
    if (fromCapabilities != null) return fromCapabilities;
    const module = this.getModule(moduleId);
    return module ? module.completionPct : null;
  }

  /** Automatically calculated via Capability Registry domain roll-up. */
  getPlatformCompletion(): number {
    return capabilityRegistryEngine.getPlatformCompletion();
  }

  buildReport(): PlatformCompletionReport {
    const modules = this.listModules();
    const validation = validatePlatformRegistry(this.definitions, modules);
    const byStatus = Object.fromEntries(
      PLATFORM_MODULE_STATUSES.map((status) => [status, 0]),
    ) as Record<PlatformModuleStatus, number>;
    for (const module of modules) {
      byStatus[module.status] += 1;
    }

    return {
      calculatedAt: new Date().toISOString(),
      moduleCount: modules.length,
      platformCompletionPct: this.getPlatformCompletion(),
      modules,
      byStatus,
      roadmap: buildPlatformRoadmap(modules).map((entry) => ({
        id: entry.id,
        name: entry.name,
        status: entry.status,
        completionPct: entry.completionPct,
      })),
      validation,
    };
  }
}

function mapCapabilityCompletionToModuleStatus(
  completionPct: number,
  fallback: PlatformModuleStatus,
): PlatformModuleStatus {
  if (fallback === "deprecated") return "deprecated";
  if (completionPct >= 100) return "completed";
  if (completionPct >= 80) return "enterprise";
  if (completionPct >= 60) return "production";
  if (completionPct >= 36.36) return "partial";
  if (completionPct > 0) return "foundation";
  return "planned";
}

export const platformRegistryEngine = new PlatformRegistryEngine();
