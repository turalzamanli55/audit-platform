/**
 * DevOps Engine — extend validateRelease with persistence + operational release.
 */
import { runEnterprisePipeline } from "@/lib/devops/pipeline";
import { evaluateReleaseChecklist } from "@/lib/devops/checklists";
import { buildVersionManifest } from "@/lib/devops/versioning";
import { createReleaseCandidate } from "@/lib/devops/release";
import { generateArtifacts } from "@/lib/devops/artifacts";
import { calculateDevOpsHealth } from "@/lib/devops/health";
import { buildMonitoringSnapshot } from "@/lib/devops/monitoring";
import { buildDashboardModel } from "@/lib/devops/dashboard";
import { canDeploy } from "@/lib/devops/deployment";
import { buildCdPromotionPlan } from "@/lib/devops/cd";
import {
  ensureCiCdBlueprints,
  ciCdBlueprintStatus,
} from "@/lib/devops/ci/generators";
import {
  buildHealthMonitoringReport,
  loadLatestSnapshot,
  persistArtifactFiles,
  persistHistoryEntry,
  persistSnapshot,
} from "@/lib/devops/history";
import { runOperationalRelease } from "@/lib/devops/operations";
import { sqlFoundationEngine } from "@/lib/sql-foundation";
import type {
  DevOpsDashboardModel,
  PipelineRunOptions,
  PipelineRunReport,
} from "@/lib/devops/types";
import type {
  HealthMonitoringReport,
  OperationalReleaseReport,
  OperationalRunOptions,
  PersistedDevOpsSnapshot,
} from "@/lib/devops/history/types";
import { platformRegistryEngine } from "@/lib/platform-registry/engine";
import { createHash } from "node:crypto";

export class DevOpsEngine {
  runPipeline(options: PipelineRunOptions = {}): PipelineRunReport {
    return runEnterprisePipeline(options);
  }

  validateRelease(options: PipelineRunOptions & { persist?: boolean } = {}): {
    ok: boolean;
    dashboard: DevOpsDashboardModel;
  } {
    const cwd = options.cwd ?? process.cwd();
    const pipeline = this.runPipeline(options);
    const checklist = evaluateReleaseChecklist(pipeline);
    const versions = buildVersionManifest(cwd);
    const release = createReleaseCandidate({
      pipeline,
      checklist,
      versions,
      cwd,
    });
    const artifacts = generateArtifacts({
      cwd,
      pipeline,
      checklist,
      versions,
      release,
    });
    const health = calculateDevOpsHealth(pipeline, cwd);
    const monitoring = buildMonitoringSnapshot(pipeline, cwd);
    const dashboard = buildDashboardModel({
      pipeline,
      checklist,
      versions,
      release,
      artifacts,
      health,
      monitoring,
    });

    const ok =
      pipeline.ok && checklist.ok && release.status === "validated";

    if (options.persist !== false) {
      const runId = `val_${Date.now()}_${createHash("sha256")
        .update(release.id)
        .digest("hex")
        .slice(0, 8)}`;
      persistSnapshot(
        {
          id: runId,
          generatedAt: new Date().toISOString(),
          ok,
          dashboard,
          monitoring,
          versions,
          release,
          pipeline,
          health,
          artifacts,
        },
        cwd,
      );
      persistArtifactFiles(artifacts, runId, cwd);
      persistHistoryEntry(
        {
          id: `${runId}_validation`,
          kind: "validation",
          ok: pipeline.ok,
          generatedAt: new Date().toISOString(),
          durationMs: pipeline.durationMs,
          summary: `Pipeline ${pipeline.ok ? "PASS" : "FAIL"}`,
          details: {
            platformHealth: health.platformHealth,
            migrationHealth: health.migrationHealth,
            dependencyHealth: health.dependencyHealth,
            releaseReadiness: health.releaseReadiness,
          },
        },
        cwd,
      );
    }

    return { ok, dashboard };
  }

  /**
   * Full operational release — single command acceptance path.
   */
  operate(options: OperationalRunOptions = {}): OperationalReleaseReport {
    ensureCiCdBlueprints(options.cwd ?? process.cwd());
    return runOperationalRelease(options);
  }

  getDashboard(options: PipelineRunOptions = {}): DevOpsDashboardModel {
    return this.validateRelease({ ...options, persist: false }).dashboard;
  }

  getLatestSnapshot(cwd = process.cwd()): PersistedDevOpsSnapshot | null {
    return loadLatestSnapshot(cwd);
  }

  getHealthMonitoring(cwd = process.cwd()): HealthMonitoringReport {
    return buildHealthMonitoringReport(cwd);
  }

  getSqlFoundationHealth(cwd = process.cwd()) {
    return sqlFoundationEngine.audit(cwd);
  }

  getCiCdStatus(cwd = process.cwd()) {
    return ciCdBlueprintStatus(cwd);
  }

  getPlatformCompletion(): number {
    return platformRegistryEngine.getPlatformCompletion();
  }

  getEdRPCompletion(): number | null {
    const report = platformRegistryEngine.buildReport();
    const module = report.modules.find((m) => m.id === "devops");
    return module?.completionPct ?? null;
  }

  canPromote(environment: "development" | "staging" | "production") {
    const { dashboard, ok } = this.validateRelease({ persist: false });
    const deploy = canDeploy({
      pipelineOk: ok,
      checklistOk: dashboard.checklist.ok,
      environment,
    });
    return {
      ok: ok && deploy.ok,
      deploy,
      cd: buildCdPromotionPlan({
        provider: "github_actions",
        pipeline: dashboard.pipeline,
        checklist: dashboard.checklist,
        environment,
      }),
    };
  }
}

export const devopsEngine = new DevOpsEngine();
