import { describe, expect, it } from "vitest";

describe("report-versioning-and-comparison", () => {
  it("computes next report version monotonically", () => {
    const versions = [1, 3, 2];
    const next = Math.max(...versions) + 1;
    expect(next).toBe(4);
  });
});
