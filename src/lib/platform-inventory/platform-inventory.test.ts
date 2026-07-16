import { describe, expect, it } from "vitest";
import { deriveReadinessLevel, DIMENSION_TO_CLAUSES } from "./types";
import { scoreFeatureBuckets, scoreCapabilityBuckets } from "./scoring";
import type { CapabilityInventoryItem, FeatureInventoryItem } from "./types";

describe("EPIRE readiness", () => {
  it("derives readiness levels from verified completion only", () => {
    expect(deriveReadinessLevel(10, false)).toBe("prototype");
    expect(deriveReadinessLevel(30, false)).toBe("alpha");
    expect(deriveReadinessLevel(55, false)).toBe("beta");
    expect(deriveReadinessLevel(75, false)).toBe("release_candidate");
    expect(deriveReadinessLevel(90, false)).toBe("production_ready");
    expect(deriveReadinessLevel(96, true)).toBe("enterprise_certified");
  });

  it("maps module dimensions to EIIE clauses", () => {
    expect(DIMENSION_TO_CLAUSES.repositories).toContain("repository");
    expect(DIMENSION_TO_CLAUSES.serverActions).toContain("serverAction");
    expect(DIMENSION_TO_CLAUSES.database).toEqual(
      expect.arrayContaining(["migration", "database"]),
    );
  });

  it("buckets features and capabilities without inventing percentages", () => {
    const features: FeatureInventoryItem[] = [
      {
        id: "f1",
        name: "A",
        moduleId: "m",
        domainId: "d",
        capabilityIds: [],
        status: "implemented",
        completionPct: 100,
        certifiedCount: 1,
        remainingCount: 0,
      },
      {
        id: "f2",
        name: "B",
        moduleId: "m",
        domainId: "d",
        capabilityIds: [],
        status: "partial",
        completionPct: 40,
        certifiedCount: 0,
        remainingCount: 2,
      },
    ];
    expect(scoreFeatureBuckets(features).featuresImplemented).toBe(1);
    expect(scoreFeatureBuckets(features).featuresPartial).toBe(1);

    const caps: CapabilityInventoryItem[] = [
      {
        id: "c1",
        name: "C",
        moduleId: "m",
        domainId: "d",
        featureId: "f",
        required: true,
        implemented: true,
        certified: true,
        remaining: [],
        blocked: false,
        blockedBy: [],
        lifecycle: "certified",
        completionPct: 100,
        weight: "high",
        bibleSection: "13",
      },
    ];
    expect(scoreCapabilityBuckets(caps).capabilitiesCertified).toBe(1);
  });
});
