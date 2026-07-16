import { describe, expect, it } from "vitest";
import {
  devopsEngine,
  evaluateReleaseChecklist,
  formatDashboardSummary,
  formatPipelineReport,
  buildCiBlueprint,
  buildRollbackPlan,
  runEnterprisePipeline,
  ensureCiCdBlueprints,
  loadDevOpsDashboard,
  runOperationalRelease,
  formatOperationalReport,
} from "@/lib/devops";
import { existsSync } from "node:fs";

describe("Enterprise DevOps & Release Platform (EDRP)", () => {
  it("runs the full validation pipeline", { timeout: 120000 }, () => {
    const pipeline = runEnterprisePipeline();
    expect(pipeline.stages.length).toBeGreaterThanOrEqual(15);
    expect(pipeline.stages.map((s) => s.id)).toContain("migration_validation");
    expect(pipeline.stages.map((s) => s.id)).toContain("sql_foundation_validation");
    expect(pipeline.stages.map((s) => s.id)).toContain("release_validation");
    expect(formatPipelineReport(pipeline)).toContain("Enterprise DevOps Pipeline Report");
  });

  it("blocks release when checklist fails and accepts when pipeline passes", {
    timeout: 120000,
  }, () => {
    const { ok, dashboard } = devopsEngine.validateRelease({ persist: true });
    const checklist = evaluateReleaseChecklist(dashboard.pipeline);
    expect(checklist.items.length).toBe(12);
    expect(dashboard.artifacts.length).toBeGreaterThanOrEqual(8);
    expect(dashboard.versions.migrationCount).toBeGreaterThan(40);
    expect(formatDashboardSummary(dashboard)).toContain("Enterprise DevOps Dashboard");
    if (dashboard.pipeline.ok && checklist.ok) {
      expect(ok).toBe(true);
      expect(dashboard.release.status).toBe("validated");
    } else {
      expect(ok).toBe(false);
      expect(dashboard.release.status).not.toBe("validated");
    }
    expect(devopsEngine.getLatestSnapshot()).not.toBeNull();
  });

  it("exposes vendor-neutral CI/CD blueprints and rollback plan", () => {
    for (const provider of [
      "github_actions",
      "azure_devops",
      "gitlab_ci",
      "self_hosted",
    ] as const) {
      const blueprint = buildCiBlueprint(provider);
      expect(blueprint.stages.length).toBeGreaterThan(10);
      expect(blueprint.commands.length).toBeGreaterThan(3);
    }
    const paths = ensureCiCdBlueprints();
    expect(paths.length).toBe(4);
    for (const path of paths) {
      expect(existsSync(path)).toBe(true);
    }
    const rollback = buildRollbackPlan();
    expect(rollback.database).toBe("forward_compensating_migration");
  });

  it("reports platform completion from existing registries only", { timeout: 60000 }, () => {
    const completion = devopsEngine.getPlatformCompletion();
    expect(typeof completion).toBe("number");
    expect(completion).toBeGreaterThanOrEqual(0);
    expect(completion).toBeLessThanOrEqual(100);
  });

  it("runs operational release with skip-reset and persists history", {
    timeout: 300000,
  }, () => {
    const report = runOperationalRelease({
      skipReset: true,
      runBuild: false,
      runUnitTests: false,
      runIntegrationTests: false,
      persist: true,
    });
    expect(formatOperationalReport(report)).toContain("EDRP Operational Release Report");
    expect(report.lifecycle.steps.length).toBeGreaterThanOrEqual(5);
    expect(report.persistedPaths.length).toBeGreaterThan(0);
    expect(report.healthTrends.successRate).toBeGreaterThanOrEqual(0);
    const ui = loadDevOpsDashboard();
    expect(ui.dashboard.pipeline.stages.length).toBeGreaterThan(10);
    expect(ui.ciStatus.length).toBe(4);
  });
});
