import { describe, expect, it } from "vitest";
import {
  averageCompletion,
  calculateCapabilityCompletionPct,
  CapabilityRegistryEngine,
  CAPABILITY_EVIDENCE_DIMENSIONS,
  emptyCapabilityEvidence,
  materializeCapability,
} from "@/lib/capability-registry";
import { projectSyncEngine } from "@/lib/project-sync";
import { platformRegistryEngine } from "@/lib/platform-registry";

describe("Capability Registry progress (static catalog mode)", () => {
  it("calculates capability completion only from evidence flags", () => {
    expect(calculateCapabilityCompletionPct(emptyCapabilityEvidence())).toBe(0);
    const allTrue = Object.fromEntries(
      CAPABILITY_EVIDENCE_DIMENSIONS.map((dimension) => [dimension, true]),
    ) as ReturnType<typeof emptyCapabilityEvidence>;
    expect(calculateCapabilityCompletionPct(allTrue)).toBe(100);
  });

  it("materializes milestones without hardcoded caller percentages", () => {
    const capability = materializeCapability({
      id: "demo",
      domain: "platform",
      module: "capability-registry",
      feature: "capreg-model",
      name: "Demo",
      description: "Demo",
      priority: "medium",
      dependencies: [],
      parent: null,
      children: [],
      evidence: emptyCapabilityEvidence({ database: true, backend: true }),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    expect(capability.foundation).toBe(true);
    expect(capability.completed).toBe(false);
  });

  it("can operate on explicit catalog without inventing percentages", () => {
    const engine = new CapabilityRegistryEngine({ useProjectSync: false });
    const report = engine.buildReport();
    expect(report.source).toBe("capability-registry");
    expect(report.platformCompletionPct).toBe(
      averageCompletion(report.domains.map((domain) => domain.completionPct)),
    );
  });
});

describe("Registries synchronize from EPBSE", () => {
  it("platform completion matches PROJECT_BIBLE synchronized completion", () => {
    const synced = projectSyncEngine.getPlatformCompletion();
    expect(platformRegistryEngine.getPlatformCompletion()).toBe(synced);
  });
});
