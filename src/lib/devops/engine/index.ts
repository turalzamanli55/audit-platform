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
import type {
  DevOpsDashboardModel,
  PipelineRunOptions,
  PipelineRunReport,
} from "@/lib/devops/types";
import { platformRegistryEngine } from "@/lib/platform-registry/engine";

/**
 * Enterprise DevOps & Release Platform Engine
 * Single entrypoint that orchestrates existing governance systems.
 */
export class DevOpsEngine {
  runPipeline(options: PipelineRunOptions = {}): PipelineRunReport {
    return runEnterprisePipeline(options);
  }

  /**
   * Full release validation — pipeline + checklist + artifacts + dashboard.
   * Release MUST fail if checklist or pipeline fails.
   */
  validateRelease(options: PipelineRunOptions = {}): {
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

    return {
      ok: pipeline.ok && checklist.ok && release.status === "validated",
      dashboard,
    };
  }

  getDashboard(options: PipelineRunOptions = {}): DevOpsDashboardModel {
    return this.validateRelease(options).dashboard;
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
    const { dashboard, ok } = this.validateRelease();
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
