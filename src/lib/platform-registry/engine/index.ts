import { PLATFORM_MODULE_CATALOG } from "@/lib/platform-registry/catalog";
import { buildPlatformRoadmap } from "@/lib/platform-registry/roadmap";
import {
  calculatePlatformCompletionPct,
  materializeModule,
} from "@/lib/platform-registry/progress";
import { validatePlatformRegistry } from "@/lib/platform-registry/validation";
import type {
  PlatformCompletionReport,
  PlatformModule,
  PlatformModuleDefinition,
  PlatformModuleStatus,
} from "@/lib/platform-registry/modules";
import { PLATFORM_MODULE_STATUSES } from "@/lib/platform-registry/modules";

/**
 * Platform Registry Engine — single source of truth for module registration
 * and automatically calculated completion.
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
    return this.definitions.map(materializeModule);
  }

  getModule(moduleId: string): PlatformModule | null {
    const definition = this.definitions.find((entry) => entry.id === moduleId);
    return definition ? materializeModule(definition) : null;
  }

  getModuleCompletion(moduleId: string): number | null {
    const module = this.getModule(moduleId);
    return module ? module.completionPct : null;
  }

  getPlatformCompletion(): number {
    return calculatePlatformCompletionPct(this.listModules());
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
      platformCompletionPct: calculatePlatformCompletionPct(modules),
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

export const platformRegistryEngine = new PlatformRegistryEngine();
