import type {
  DevOpsArtifact,
  DevOpsDashboardModel,
  DevOpsHealthReport,
  PipelineRunReport,
  ReleaseCandidate,
  ReleaseChecklistReport,
  VersionManifest,
} from "@/lib/devops/types";

export function formatDevOpsHealthReport(health: DevOpsHealthReport): string {
  return [
    "DevOps Health Report",
    "",
    `Platform Health: ${health.platformHealth}`,
    `Release Readiness: ${health.releaseReadiness}`,
    `Migration Health: ${health.migrationHealth}`,
    `Dependency Health: ${health.dependencyHealth}`,
    `Schema Drift OK: ${health.schemaDriftOk}`,
    `Documentation Coverage: ${health.documentationCoverage}`,
    `Implementation Coverage: ${health.implementationCoverage}`,
    `Build: ${health.buildOk === null ? "deferred" : health.buildOk ? "PASS" : "FAIL"}`,
    `Tests: ${health.testOk === null ? "deferred" : health.testOk ? "PASS" : "FAIL"}`,
    `Localization: ${health.localizationOk ? "PASS" : "FAIL"}`,
    `AI: ${health.aiOk ? "PASS" : "FAIL"}`,
    `Platform Completion: ${health.platformCompletionPct}%`,
    `Generated: ${health.generatedAt}`,
  ].join("\n");
}

export function formatFullDevOpsReport(model: DevOpsDashboardModel): string {
  return [
    "Enterprise DevOps & Release Platform Report",
    "",
    formatDevOpsHealthReport(model.health),
    "",
    `Pipeline OK: ${model.pipeline.ok}`,
    `Checklist OK: ${model.checklist.ok}`,
    `Release: ${model.release.id} (${model.release.status})`,
    `Artifacts: ${model.artifacts.length}`,
  ].join("\n");
}

export type {
  DevOpsArtifact,
  PipelineRunReport,
  ReleaseCandidate,
  ReleaseChecklistReport,
  VersionManifest,
};
