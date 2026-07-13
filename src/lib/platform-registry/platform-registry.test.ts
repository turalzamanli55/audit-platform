import { describe, expect, it } from "vitest";
import {
  calculateModuleCompletionPct,
  calculatePlatformCompletionPct,
  emptyEvidence,
  materializeModule,
  platformRegistryEngine,
  PLATFORM_COMPLETION_DIMENSIONS,
} from "@/lib/platform-registry";

describe("Platform Registry progress engine", () => {
  it("calculates module completion strictly from evidence flags", () => {
    const none = calculateModuleCompletionPct(emptyEvidence());
    expect(none).toBe(0);

    const allTrue = Object.fromEntries(
      PLATFORM_COMPLETION_DIMENSIONS.map((dimension) => [dimension, true]),
    ) as ReturnType<typeof emptyEvidence>;
    expect(calculateModuleCompletionPct(allTrue)).toBe(100);

    const half = emptyEvidence({
      planning: true,
      foundation: true,
      production: true,
      enterprise: true,
      localization: true,
      ui: false,
      workflow: false,
      tests: false,
      permissions: false,
      database: false,
      integration: false,
    });
    const expected = Number(((5 / PLATFORM_COMPLETION_DIMENSIONS.length) * 100).toFixed(2));
    expect(calculateModuleCompletionPct(half)).toBe(expected);
  });

  it("derives status and milestones without hardcoded percentages in callers", () => {
    const module = materializeModule({
      id: "demo",
      name: "Demo",
      domain: "test",
      dependencies: [],
      children: [],
      parent: null,
      owner: "test",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      evidence: emptyEvidence({ planning: true, foundation: true, database: true }),
    });
    expect(module.completionPct).toBe(
      Number(((3 / PLATFORM_COMPLETION_DIMENSIONS.length) * 100).toFixed(2)),
    );
    expect(module.planned).toBe(true);
    expect(module.foundation).toBe(true);
    expect(module.completed).toBe(false);
    expect(module.status).toBe("foundation");
  });

  it("calculates platform completion as the average of active modules", () => {
    const modules = [
      materializeModule({
        id: "a",
        name: "A",
        domain: "t",
        dependencies: [],
        children: [],
        parent: null,
        owner: "t",
        createdAt: "",
        updatedAt: "",
        evidence: emptyEvidence(
          Object.fromEntries(PLATFORM_COMPLETION_DIMENSIONS.map((d) => [d, true])) as never,
        ),
      }),
      materializeModule({
        id: "b",
        name: "B",
        domain: "t",
        dependencies: [],
        children: [],
        parent: null,
        owner: "t",
        createdAt: "",
        updatedAt: "",
        evidence: emptyEvidence(),
      }),
    ];
    expect(calculatePlatformCompletionPct(modules)).toBe(50);
  });

  it("builds a live report from the registered catalog", () => {
    const report = platformRegistryEngine.buildReport();
    expect(report.moduleCount).toBeGreaterThan(0);
    expect(report.validation.ok).toBe(true);
    expect(report.platformCompletionPct).toBe(
      calculatePlatformCompletionPct(report.modules),
    );
    const fsRendering = report.modules.find((module) => module.id === "fs-rendering");
    expect(fsRendering).toBeTruthy();
  });
});
