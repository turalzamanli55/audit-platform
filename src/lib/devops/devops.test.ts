import { describe, expect, it } from "vitest";
import {
  devopsEngine,
  evaluateReleaseChecklist,
  formatDashboardSummary,
  formatPipelineReport,
  buildCiBlueprint,
  buildRollbackPlan,
  runEnterprisePipeline,
} from "@/lib/devops";

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
    const { ok, dashboard } = devopsEngine.validateRelease();
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
    const rollback = buildRollbackPlan();
    expect(rollback.database).toBe("forward_compensating_migration");
  });

  it("reports platform completion from existing registries only", { timeout: 60000 }, () => {
    const completion = devopsEngine.getPlatformCompletion();
    expect(typeof completion).toBe("number");
    expect(completion).toBeGreaterThanOrEqual(0);
    expect(completion).toBeLessThanOrEqual(100);
  });
});
