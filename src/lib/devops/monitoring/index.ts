import type { MonitoringSnapshot, PipelineRunReport } from "@/lib/devops/types";
import { calculateDevOpsHealth } from "@/lib/devops/health";

/**
 * Monitoring — post-pipeline health snapshot and alert surface.
 */
export function buildMonitoringSnapshot(
  pipeline: PipelineRunReport,
  cwd = process.cwd(),
): MonitoringSnapshot {
  const health = calculateDevOpsHealth(pipeline, cwd);
  const alerts: string[] = [];

  if (!pipeline.ok) alerts.push("Pipeline failed — release blocked");
  if (!health.schemaDriftOk) alerts.push("Schema drift detected");
  if (health.migrationHealth < 95) alerts.push("Migration health below 95");
  if (health.dependencyHealth < 100) alerts.push("Dependency health below 100");
  if (!health.localizationOk) alerts.push("Localization validation failed");
  if (!health.aiOk) alerts.push("AI platform validation failed");

  return {
    pipelineLastOk: pipeline.ok,
    migrationHealth: health.migrationHealth,
    dependencyHealth: health.dependencyHealth,
    schemaDriftOk: health.schemaDriftOk,
    releaseReadiness: health.releaseReadiness,
    alerts,
  };
}
