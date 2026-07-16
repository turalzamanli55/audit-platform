import type {
  DevOpsArtifact,
  DevOpsDashboardModel,
  DevOpsHealthReport,
  MonitoringSnapshot,
  PipelineRunReport,
  ReleaseCandidate,
  ReleaseChecklistReport,
  VersionManifest,
} from "@/lib/devops/types";

/**
 * Enterprise DevOps Dashboard model builder.
 */
export function buildDashboardModel(input: {
  pipeline: PipelineRunReport;
  checklist: ReleaseChecklistReport;
  versions: VersionManifest;
  release: ReleaseCandidate;
  artifacts: DevOpsArtifact[];
  health: DevOpsHealthReport;
  monitoring?: MonitoringSnapshot;
}): DevOpsDashboardModel {
  return {
    generatedAt: new Date().toISOString(),
    health: input.health,
    pipeline: input.pipeline,
    checklist: input.checklist,
    versions: input.versions,
    release: input.release,
    artifacts: input.artifacts,
  };
}

export function formatDashboardSummary(model: DevOpsDashboardModel): string {
  const lines = [
    "Enterprise DevOps Dashboard",
    "",
    `Generated: ${model.generatedAt}`,
    "",
    "Platform Health: " + model.health.platformHealth,
    "Release Readiness: " + model.health.releaseReadiness,
    "Migration Health: " + model.health.migrationHealth,
    "Dependency Health: " + model.health.dependencyHealth,
    "Schema Drift: " + (model.health.schemaDriftOk ? "OK" : "DRIFT"),
    "Documentation Coverage: " + model.health.documentationCoverage,
    "Implementation Coverage: " + model.health.implementationCoverage,
    "Build Status: " +
      (model.health.buildOk === null
        ? "deferred"
        : model.health.buildOk
          ? "PASS"
          : "FAIL"),
    "Test Status: " +
      (model.health.testOk === null
        ? "deferred"
        : model.health.testOk
          ? "PASS"
          : "FAIL"),
    "Localization Status: " + (model.health.localizationOk ? "PASS" : "FAIL"),
    "AI Status: " + (model.health.aiOk ? "PASS" : "FAIL"),
    "Platform Completion: " + model.health.platformCompletionPct + "%",
    "",
    `Pipeline: ${model.pipeline.ok ? "PASS" : "FAIL"} (${model.pipeline.stages.length} stages)`,
    `Checklist: ${model.checklist.ok ? "PASS" : "FAIL"}`,
    `Release: ${model.release.id} — ${model.release.status} (readiness ${model.release.readinessScore})`,
    `Artifacts: ${model.artifacts.length}`,
  ];
  return lines.join("\n");
}
