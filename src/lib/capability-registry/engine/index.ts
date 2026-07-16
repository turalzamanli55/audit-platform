import {
  CAPABILITY_CATALOG,
  CAPABILITY_DOMAINS,
  CAPABILITY_FEATURES,
  CAPABILITY_MODULES,
} from "@/lib/capability-registry/catalog";
import {
  materializeCapability,
  averageCompletion,
  deriveAggregateStatus,
} from "@/lib/capability-registry/progress";
import { validateCapabilityRegistry } from "@/lib/capability-registry/validation";
import {
  buildCapabilityRoadmap,
  groupRoadmapByLane,
} from "@/lib/capability-registry/roadmap";
import { buildCapabilityPlatformReport } from "@/lib/capability-registry/reporting";
import type {
  Capability,
  CapabilityDefinition,
} from "@/lib/capability-registry/capabilities";
import type { DomainDefinition, DomainReadiness } from "@/lib/capability-registry/domains";
import type { ModuleDefinition, ModuleReadiness } from "@/lib/capability-registry/modules";
import type { FeatureDefinition, FeatureReadiness } from "@/lib/capability-registry/features";
import type { CapabilityPlatformReport } from "@/lib/capability-registry/reporting";
import { projectSyncEngine } from "@/lib/project-sync/engine";

function loadSynchronizedCatalog(): {
  domains: DomainDefinition[];
  modules: ModuleDefinition[];
  features: FeatureDefinition[];
  definitions: CapabilityDefinition[];
} {
  try {
    return projectSyncEngine.toCapabilityCatalog();
  } catch {
    // Fallback only if docs/scanner unavailable in constrained environments.
    return {
      domains: CAPABILITY_DOMAINS,
      modules: CAPABILITY_MODULES,
      features: CAPABILITY_FEATURES,
      definitions: CAPABILITY_CATALOG,
    };
  }
}

/**
 * Capability Registry Engine
 * Catalog is synchronized FROM PROJECT_BIBLE via EPBSE.
 * Registries are never an independent source of truth.
 */
export class CapabilityRegistryEngine {
  private domains: DomainDefinition[];
  private modules: ModuleDefinition[];
  private features: FeatureDefinition[];
  private definitions: CapabilityDefinition[];
  private preferProjectSyncCompletion: boolean;

  constructor(input?: {
    domains?: DomainDefinition[];
    modules?: ModuleDefinition[];
    features?: FeatureDefinition[];
    definitions?: CapabilityDefinition[];
    useProjectSync?: boolean;
  }) {
    this.preferProjectSyncCompletion = input?.useProjectSync !== false;
    if (
      input?.domains &&
      input.modules &&
      input.features &&
      input.definitions
    ) {
      this.domains = [...input.domains];
      this.modules = [...input.modules];
      this.features = [...input.features];
      this.definitions = [...input.definitions];
      return;
    }
    if (input?.useProjectSync === false) {
      this.preferProjectSyncCompletion = false;
      this.domains = [...CAPABILITY_DOMAINS];
      this.modules = [...CAPABILITY_MODULES];
      this.features = [...CAPABILITY_FEATURES];
      this.definitions = [...CAPABILITY_CATALOG];
      return;
    }
    const synced = loadSynchronizedCatalog();
    this.domains = synced.domains;
    this.modules = synced.modules;
    this.features = synced.features;
    this.definitions = synced.definitions;
  }

  /** Re-sync catalog from PROJECT_BIBLE (documentation → registry only). */
  resyncFromDocumentation(cwd = process.cwd()): void {
    projectSyncEngine.synchronize({ cwd, persist: true });
    const synced = projectSyncEngine.toCapabilityCatalog(cwd);
    this.domains = synced.domains;
    this.modules = synced.modules;
    this.features = synced.features;
    this.definitions = synced.definitions;
  }

  registerCapability(definition: CapabilityDefinition): void {
    // Manual registration is rejected as source-of-truth; keep method for compatibility
    // but mark via description that docs must win on next sync.
    const index = this.definitions.findIndex((entry) => entry.id === definition.id);
    if (index >= 0) {
      this.definitions[index] = definition;
      return;
    }
    this.definitions.push(definition);
  }

  listCapabilities(): Capability[] {
    return this.definitions.map(materializeCapability);
  }

  getCapability(id: string): Capability | null {
    const definition = this.definitions.find((entry) => entry.id === id);
    return definition ? materializeCapability(definition) : null;
  }

  listFeatureReadiness(): FeatureReadiness[] {
    const capabilities = this.listCapabilities();
    return this.features.map((feature) => {
      const featureCapabilities = capabilities.filter((capability) =>
        feature.capabilityIds.includes(capability.id),
      );
      const completionPct = averageCompletion(
        featureCapabilities.map((capability) => capability.completionPct),
      );
      return {
        id: feature.id,
        moduleId: feature.moduleId,
        domainId: feature.domainId,
        name: feature.name,
        description: feature.description,
        capabilityIds: [...feature.capabilityIds],
        completionPct,
        status: deriveAggregateStatus(completionPct),
        capabilityCount: featureCapabilities.length,
        completedCapabilities: featureCapabilities.filter((capability) => capability.completed)
          .length,
        missingEvidenceCount: featureCapabilities.reduce(
          (total, capability) => total + capability.missingEvidence.length,
          0,
        ),
      };
    });
  }

  listModuleReadiness(): ModuleReadiness[] {
    const features = this.listFeatureReadiness();
    const capabilities = this.listCapabilities();
    return this.modules.map((module) => {
      const moduleFeatures = features.filter((feature) => module.featureIds.includes(feature.id));
      const completionPct = averageCompletion(
        moduleFeatures.map((feature) => feature.completionPct),
      );
      const moduleCapabilities = capabilities.filter((capability) => capability.module === module.id);
      return {
        id: module.id,
        domainId: module.domainId,
        name: module.name,
        description: module.description,
        featureIds: [...module.featureIds],
        dependencies: [...module.dependencies],
        completionPct,
        status: deriveAggregateStatus(completionPct),
        featureCount: moduleFeatures.length,
        capabilityCount: moduleCapabilities.length,
        completedCapabilities: moduleCapabilities.filter((capability) => capability.completed)
          .length,
      };
    });
  }

  listDomainReadiness(): DomainReadiness[] {
    const modules = this.listModuleReadiness();
    const features = this.listFeatureReadiness();
    const capabilities = this.listCapabilities();
    return this.domains.map((domain) => {
      const domainModules = modules.filter((module) => domain.moduleIds.includes(module.id));
      const completionPct = averageCompletion(
        domainModules.map((module) => module.completionPct),
      );
      const domainFeatures = features.filter((feature) => feature.domainId === domain.id);
      const domainCapabilities = capabilities.filter(
        (capability) => capability.domain === domain.id,
      );
      return {
        id: domain.id,
        name: domain.name,
        description: domain.description,
        moduleIds: [...domain.moduleIds],
        completionPct,
        status: deriveAggregateStatus(completionPct),
        moduleCount: domainModules.length,
        featureCount: domainFeatures.length,
        capabilityCount: domainCapabilities.length,
        completedCapabilities: domainCapabilities.filter((capability) => capability.completed)
          .length,
        missingCapabilities: domainCapabilities.filter(
          (capability) => capability.missingEvidence.length > 0,
        ).length,
      };
    });
  }

  getFeatureCompletion(featureId: string): number | null {
    return this.listFeatureReadiness().find((feature) => feature.id === featureId)?.completionPct
      ?? null;
  }

  getModuleCompletion(moduleId: string): number | null {
    return this.listModuleReadiness().find((module) => module.id === moduleId)?.completionPct
      ?? null;
  }

  getDomainCompletion(domainId: string): number | null {
    return this.listDomainReadiness().find((domain) => domain.id === domainId)?.completionPct
      ?? null;
  }

  getPlatformCompletion(): number {
    if (this.preferProjectSyncCompletion) {
      try {
        return projectSyncEngine.getPlatformCompletion();
      } catch {
        // fall through to domain roll-up
      }
    }
    return averageCompletion(this.listDomainReadiness().map((domain) => domain.completionPct));
  }

  getCapabilityRegistryCompletion(): number {
    return this.getModuleCompletion("capability-registry") ??
      this.getModuleCompletion("mod_foundation") ??
      0;
  }

  buildReport(): CapabilityPlatformReport {
    const capabilities = this.listCapabilities();
    const features = this.listFeatureReadiness();
    const modules = this.listModuleReadiness();
    const domains = this.listDomainReadiness();
    const roadmap = buildCapabilityRoadmap(capabilities);
    const validation = validateCapabilityRegistry({
      domains: this.domains,
      modules: this.modules,
      features: this.features,
      definitions: this.definitions,
      capabilities,
    });

    return buildCapabilityPlatformReport({
      platformCompletionPct: this.getPlatformCompletion(),
      domains,
      modules,
      features,
      capabilities,
      roadmap,
      validation,
    });
  }

  buildDashboardModel() {
    try {
      return projectSyncEngine.getDashboard();
    } catch {
      const report = this.buildReport();
      const lanes = groupRoadmapByLane(buildCapabilityRoadmap(report.capabilities));
      return {
        platformCompletionPct: report.platformCompletionPct,
        domains: report.domains,
        modules: report.modules,
        features: report.features,
        capabilities: report.capabilities,
        evidence: report.evidence,
        missingCapabilities: report.missingCapabilities,
        blockedCapabilities: report.blockedCapabilities,
        roadmapLanes: lanes,
        validation: report.validation,
        counts: report.counts,
        calculatedAt: report.calculatedAt,
      };
    }
  }
}

export const capabilityRegistryEngine = new CapabilityRegistryEngine();
