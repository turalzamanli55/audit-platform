import type { SynchronizedCapability, SyncSnapshot } from "@/lib/project-sync/types";
import { PROJECT_SYNC_EVIDENCE_DIMENSIONS } from "@/lib/project-sync/types";
import { average, round2 } from "@/lib/project-sync/utils";

export type HealthScores = {
  coverage: number;
  implementation: number;
  architecture: number;
  documentation: number;
  testing: number;
  localization: number;
  security: number;
  performance: number;
  integration: number;
  maintainability: number;
  technicalDebt: number;
};

/**
 * Health Engine — scores derived from evidence aggregates only.
 */
export function calculateCapabilityHealth(capability: SynchronizedCapability): number {
  return capability.completionPct;
}

export function calculatePlatformHealth(capabilities: SynchronizedCapability[]): HealthScores {
  const active = capabilities.filter((capability) => capability.status !== "deprecated");
  const ratio = (dimension: (typeof PROJECT_SYNC_EVIDENCE_DIMENSIONS)[number]) => {
    if (active.length === 0) return 0;
    const hit = active.filter((capability) => capability.evidence[dimension]).length;
    return round2((hit / active.length) * 100);
  };

  const documentation = ratio("documentation");
  const testing = ratio("tests");
  const localization = ratio("localization");
  const security = ratio("security");
  const performance = ratio("performance");
  const integration = ratio("integration");
  const implementation = average([
    ratio("database"),
    ratio("repository"),
    ratio("serverAction"),
    ratio("ui"),
    ratio("workspace"),
  ]);
  const architecture = average([ratio("rules"), ratio("validation"), ratio("permissions")]);
  const coverage = average(active.map((capability) => capability.completionPct));
  const maintainability = average([testing, documentation, architecture]);
  const technicalDebt = round2(
    100 - average([testing, localization, security, documentation, architecture]),
  );

  return {
    coverage,
    implementation,
    architecture,
    documentation,
    testing,
    localization,
    security,
    performance,
    integration,
    maintainability,
    technicalDebt,
  };
}

export function applyHealthToSnapshot(
  snapshot: Omit<
    SyncSnapshot,
    | "architectureHealthPct"
    | "implementationHealthPct"
    | "documentationCoveragePct"
    | "testingCoveragePct"
    | "localizationCoveragePct"
    | "securityCoveragePct"
    | "performanceCoveragePct"
    | "integrationCoveragePct"
    | "technicalDebtScore"
    | "platformCompletionPct"
  > & { platformCompletionPct?: number },
  health: HealthScores,
): Pick<
  SyncSnapshot,
  | "architectureHealthPct"
  | "implementationHealthPct"
  | "documentationCoveragePct"
  | "testingCoveragePct"
  | "localizationCoveragePct"
  | "securityCoveragePct"
  | "performanceCoveragePct"
  | "integrationCoveragePct"
  | "technicalDebtScore"
  | "platformCompletionPct"
> {
  return {
    platformCompletionPct: snapshot.platformCompletionPct ?? health.coverage,
    architectureHealthPct: health.architecture,
    implementationHealthPct: health.implementation,
    documentationCoveragePct: health.documentation,
    testingCoveragePct: health.testing,
    localizationCoveragePct: health.localization,
    securityCoveragePct: health.security,
    performanceCoveragePct: health.performance,
    integrationCoveragePct: health.integration,
    technicalDebtScore: health.technicalDebt,
  };
}
