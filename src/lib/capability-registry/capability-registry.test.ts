import { describe, expect, it } from "vitest";
import {
  averageCompletion,
  calculateCapabilityCompletionPct,
  capabilityRegistryEngine,
  CAPABILITY_EVIDENCE_DIMENSIONS,
  emptyCapabilityEvidence,
  materializeCapability,
} from "@/lib/capability-registry";
import { platformRegistryEngine } from "@/lib/platform-registry";

describe("Capability Registry progress", () => {
  it("calculates capability completion only from evidence flags", () => {
    expect(calculateCapabilityCompletionPct(emptyCapabilityEvidence())).toBe(0);

    const allTrue = Object.fromEntries(
      CAPABILITY_EVIDENCE_DIMENSIONS.map((dimension) => [dimension, true]),
    ) as ReturnType<typeof emptyCapabilityEvidence>;
    expect(calculateCapabilityCompletionPct(allTrue)).toBe(100);

    const three = emptyCapabilityEvidence({
      database: true,
      backend: true,
      repository: true,
    });
    expect(calculateCapabilityCompletionPct(three)).toBe(
      Number(((3 / CAPABILITY_EVIDENCE_DIMENSIONS.length) * 100).toFixed(2)),
    );
  });

  it("rolls up feature → module → domain → platform", () => {
    const report = capabilityRegistryEngine.buildReport();
    expect(report.source).toBe("capability-registry");
    expect(report.validation.ok).toBe(true);
    expect(report.counts.capabilities).toBeGreaterThan(0);
    expect(report.counts.domains).toBeGreaterThan(0);

    const platform = averageCompletion(report.domains.map((domain) => domain.completionPct));
    expect(report.platformCompletionPct).toBe(platform);
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
    expect(capability.missingEvidence.length).toBe(
      CAPABILITY_EVIDENCE_DIMENSIONS.length - 2,
    );
  });

  it("exposes readiness dashboard model", () => {
    const dashboard = capabilityRegistryEngine.buildDashboardModel();
    expect(dashboard.platformCompletionPct).toBe(
      capabilityRegistryEngine.getPlatformCompletion(),
    );
    expect(dashboard.roadmapLanes.completed.length).toBeGreaterThanOrEqual(0);
  });
});

describe("Platform Registry delegates completion to Capability Registry", () => {
  it("uses capability-based platform completion", () => {
    expect(platformRegistryEngine.getPlatformCompletion()).toBe(
      capabilityRegistryEngine.getPlatformCompletion(),
    );
  });
});
