import { describe, expect, it } from "vitest";
import { computeLifecycleProgress } from "@/lib/engagement/engagement-workspace-display";

describe("computeLifecycleProgress", () => {
  it("maps lifecycle stages to monotonic progress values", () => {
    expect(computeLifecycleProgress("draft")).toBe(10);
    expect(computeLifecycleProgress("planning")).toBe(25);
    expect(computeLifecycleProgress("fieldwork")).toBe(50);
    expect(computeLifecycleProgress("review")).toBe(75);
    expect(computeLifecycleProgress("completed")).toBe(90);
    expect(computeLifecycleProgress("closed")).toBe(100);
  });
});
