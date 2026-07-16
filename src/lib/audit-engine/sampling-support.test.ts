import { describe, expect, it } from "vitest";
import { assertSamplingPlan, recommendedSampleSize } from "./sampling-support";

describe("sampling-support", () => {
  it("recommends and validates sample sizes", () => {
    expect(recommendedSampleSize(100, 1)).toBeGreaterThan(0);
    expect(() =>
      assertSamplingPlan({ populationSize: 100, sampleSize: 10, riskFactor: 1 }),
    ).not.toThrow();
    expect(() =>
      assertSamplingPlan({ populationSize: 100, sampleSize: 0, riskFactor: 1 }),
    ).toThrowError(/Sample size/);
  });
});
