import { synchronizeFromProjectBible, type SynchronizationResult } from "@/lib/project-sync/sync";
import { loadLatestSnapshot } from "@/lib/project-sync/snapshots";
import { buildGovernanceDashboardModel } from "@/lib/project-sync/dashboard";
import { buildProjectSyncReports } from "@/lib/project-sync/reporting";
import type { SyncSnapshot } from "@/lib/project-sync/types";
import type { DomainDefinition } from "@/lib/capability-registry/domains";
import type { ModuleDefinition } from "@/lib/capability-registry/modules";
import type { FeatureDefinition } from "@/lib/capability-registry/features";
import type { CapabilityDefinition } from "@/lib/capability-registry/capabilities";
import { emptyCapabilityEvidence } from "@/lib/capability-registry/capabilities";

/**
 * EPBSE Engine — governance core entrypoint.
 */
export class ProjectSyncEngine {
  private lastResult: SynchronizationResult | null = null;

  synchronize(options?: { cwd?: string; persist?: boolean }): SynchronizationResult {
    this.lastResult = synchronizeFromProjectBible(options);
    return this.lastResult;
  }

  getLatestSnapshot(cwd = process.cwd()): SyncSnapshot | null {
    return this.lastResult?.snapshot ?? loadLatestSnapshot(cwd);
  }

  getPlatformCompletion(cwd = process.cwd()): number {
    const snapshot = this.getLatestSnapshot(cwd);
    if (snapshot) return snapshot.platformCompletionPct;
    return this.synchronize({ cwd, persist: false }).snapshot.platformCompletionPct;
  }

  getDashboard(cwd = process.cwd()) {
    const result =
      this.lastResult ??
      (() => {
        const existing = loadLatestSnapshot(cwd);
        if (existing) {
          // Rehydrate minimal result shape via fresh sync without requiring stale dashboard
          return this.synchronize({ cwd, persist: false });
        }
        return this.synchronize({ cwd, persist: false });
      })();
    return buildGovernanceDashboardModel(result);
  }

  getReports(cwd = process.cwd()) {
    const result = this.lastResult ?? this.synchronize({ cwd, persist: false });
    return buildProjectSyncReports(result);
  }

  /**
   * Produce capability-registry catalog shapes synchronized FROM documentation.
   * Registries must not invent entities independently.
   */
  toCapabilityCatalog(cwd = process.cwd()): {
    domains: DomainDefinition[];
    modules: ModuleDefinition[];
    features: FeatureDefinition[];
    definitions: CapabilityDefinition[];
  } {
    const snapshot = this.getLatestSnapshot(cwd) ?? this.synchronize({ cwd, persist: false }).snapshot;
    return {
      domains: snapshot.domains.map((domain) => ({
        id: domain.id,
        name: domain.name,
        description: domain.description,
        moduleIds: snapshot.modules
          .filter((module) => module.domainId === domain.id)
          .map((module) => module.id),
      })),
      modules: snapshot.modules.map((module) => ({
        id: module.id,
        domainId: module.domainId,
        name: module.name,
        description: module.description,
        featureIds: snapshot.features
          .filter((feature) => feature.moduleId === module.id)
          .map((feature) => feature.id),
        dependencies: module.dependencies,
      })),
      features: snapshot.features.map((feature) => ({
        id: feature.id,
        moduleId: feature.moduleId,
        domainId: feature.domainId,
        name: feature.name,
        description: feature.description,
        capabilityIds: feature.capabilityIds,
      })),
      definitions: snapshot.capabilities.map((capability) => ({
        id: capability.id,
        domain: capability.domainId,
        module: capability.moduleId,
        feature: capability.featureId,
        name: capability.name,
        description: capability.description,
        priority: capability.priority,
        dependencies: capability.dependencies,
        parent: capability.parent,
        children: capability.children,
        createdAt: snapshot.timestamp,
        updatedAt: snapshot.timestamp,
        evidence: emptyCapabilityEvidence({
          database: capability.evidence.database,
          backend: capability.evidence.serverAction || capability.evidence.repository,
          repository: capability.evidence.repository,
          serverActions: capability.evidence.serverAction,
          permissions: capability.evidence.permissions,
          validation: capability.evidence.validation,
          rules: capability.evidence.rules,
          ui: capability.evidence.ui,
          workspace: capability.evidence.workspace,
          tests: capability.evidence.tests,
          localization: capability.evidence.localization,
          documentation: capability.evidence.documentation,
          integration: capability.evidence.integration,
          performance: capability.evidence.performance,
          security: capability.evidence.security,
        }),
      })),
    };
  }
}

export const projectSyncEngine = new ProjectSyncEngine();
