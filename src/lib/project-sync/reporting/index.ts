import type { SynchronizationResult } from "@/lib/project-sync/sync";
import type { SyncSnapshot } from "@/lib/project-sync/types";

export type ProjectSyncReports = {
  synchronization: SynchronizationResult["report"];
  coverage: {
    platformCompletionPct: number;
    documentationCoveragePct: number;
    testingCoveragePct: number;
    localizationCoveragePct: number;
    securityCoveragePct: number;
    performanceCoveragePct: number;
    integrationCoveragePct: number;
  };
  architecture: {
    architectureHealthPct: number;
    layers: string[];
    principles: string[];
  };
  implementation: {
    implementationHealthPct: number;
    standards: string[];
    templateRules: string[];
  };
  technicalDebt: SynchronizationResult["report"]["technicalDebt"];
  roadmap: SynchronizationResult["roadmap"];
  health: {
    platformCompletionPct: number;
    architectureHealthPct: number;
    implementationHealthPct: number;
    technicalDebtScore: number;
  };
};

export function buildProjectSyncReports(result: SynchronizationResult): ProjectSyncReports {
  return {
    synchronization: result.report,
    coverage: {
      platformCompletionPct: result.snapshot.platformCompletionPct,
      documentationCoveragePct: result.snapshot.documentationCoveragePct,
      testingCoveragePct: result.snapshot.testingCoveragePct,
      localizationCoveragePct: result.snapshot.localizationCoveragePct,
      securityCoveragePct: result.snapshot.securityCoveragePct,
      performanceCoveragePct: result.snapshot.performanceCoveragePct,
      integrationCoveragePct: result.snapshot.integrationCoveragePct,
    },
    architecture: {
      architectureHealthPct: result.snapshot.architectureHealthPct,
      layers: result.architectureNotes.layers,
      principles: result.architectureNotes.principles,
    },
    implementation: {
      implementationHealthPct: result.snapshot.implementationHealthPct,
      standards: result.implementationNotes.standards,
      templateRules: result.implementationNotes.templateRules,
    },
    technicalDebt: result.report.technicalDebt,
    roadmap: result.roadmap,
    health: {
      platformCompletionPct: result.snapshot.platformCompletionPct,
      architectureHealthPct: result.snapshot.architectureHealthPct,
      implementationHealthPct: result.snapshot.implementationHealthPct,
      technicalDebtScore: result.snapshot.technicalDebtScore,
    },
  };
}

export function snapshotSummary(snapshot: SyncSnapshot) {
  return {
    id: snapshot.id,
    timestamp: snapshot.timestamp,
    domains: snapshot.domains.length,
    modules: snapshot.modules.length,
    features: snapshot.features.length,
    capabilities: snapshot.capabilities.length,
    platformCompletionPct: snapshot.platformCompletionPct,
  };
}
