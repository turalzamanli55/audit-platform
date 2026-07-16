import type { SynchronizationResult } from "@/lib/project-sync/sync";
import { buildProjectSyncReports } from "@/lib/project-sync/reporting";

export type PlatformGovernanceDashboardModel = ReturnType<typeof buildGovernanceDashboardModel>;

export function buildGovernanceDashboardModel(result: SynchronizationResult) {
  const reports = buildProjectSyncReports(result);
  const missingCapabilities = result.snapshot.capabilities
    .filter((capability) => capability.completionPct < 100)
    .map((capability) => ({
      id: capability.id,
      name: capability.name,
      moduleId: capability.moduleId,
      completionPct: capability.completionPct,
      missingEvidence: Object.entries(capability.evidence)
        .filter(([, value]) => !value)
        .map(([key]) => key),
    }))
    .sort((a, b) => a.completionPct - b.completionPct);

  return {
    calculatedAt: result.snapshot.timestamp,
    source: "project-sync" as const,
    authority: "PROJECT_BIBLE" as const,
    platformReadiness: result.snapshot.platformCompletionPct,
    architectureReadiness: result.snapshot.architectureHealthPct,
    implementationReadiness: result.snapshot.implementationHealthPct,
    documentationCoverage: result.snapshot.documentationCoveragePct,
    testingCoverage: result.snapshot.testingCoveragePct,
    localizationCoverage: result.snapshot.localizationCoveragePct,
    securityCoverage: result.snapshot.securityCoveragePct,
    performanceCoverage: result.snapshot.performanceCoveragePct,
    integrationCoverage: result.snapshot.integrationCoveragePct,
    technicalDebt: result.snapshot.technicalDebtScore,
    counts: {
      domains: result.snapshot.domains.length,
      modules: result.snapshot.modules.length,
      features: result.snapshot.features.length,
      capabilities: result.snapshot.capabilities.length,
    },
    domains: result.snapshot.domains.map((domain) => {
      const caps = result.snapshot.capabilities.filter(
        (capability) => capability.domainId === domain.id,
      );
      const completionPct =
        caps.length === 0
          ? 0
          : Number(
              (
                caps.reduce((sum, capability) => sum + capability.completionPct, 0) / caps.length
              ).toFixed(2),
            );
      return { ...domain, completionPct, capabilityCount: caps.length };
    }),
    modules: result.snapshot.modules.map((module) => {
      const caps = result.snapshot.capabilities.filter(
        (capability) => capability.moduleId === module.id,
      );
      const completionPct =
        caps.length === 0
          ? 0
          : Number(
              (
                caps.reduce((sum, capability) => sum + capability.completionPct, 0) / caps.length
              ).toFixed(2),
            );
      return { ...module, completionPct, capabilityCount: caps.length };
    }),
    missingCapabilities: missingCapabilities.slice(0, 100),
    missingEvidence: missingCapabilities.slice(0, 100),
    roadmapProgress: reports.synchronization.roadmap,
    criticalPath: result.roadmap.criticalPath.slice(0, 20),
    nextSprint: result.roadmap.nextSprint,
    suggestedBuildOrder: result.roadmap.suggestedBuildOrder.slice(0, 20),
    validation: result.report.validation,
    diffCounts: {
      added: result.report.counts.added,
      removed: result.report.counts.removed,
      modified: result.report.counts.modified,
      renamed: result.report.counts.renamed,
    },
  };
}
