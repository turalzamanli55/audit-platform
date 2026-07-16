import { describe, expect, it } from "vitest";
import {
  ENGAGEMENT_LIFECYCLE_TRANSITIONS,
  assertEngagementLifecycleReason,
  assertEngagementLifecycleTransition,
  canTransitionEngagementLifecycle,
  isRegressiveEngagementLifecycleTransition,
  isTerminalEngagementLifecycleStatus,
  nextEngagementLifecycleStatuses,
} from "./engagement-lifecycle-management";
import type { EngagementLifecycleStatus } from "@/types/engagement";

const forwardPath: EngagementLifecycleStatus[] = [
  "draft",
  "planning",
  "fieldwork",
  "review",
  "completed",
  "closed",
];

describe("engagement lifecycle management", () => {
  it("allows the full forward path draft → closed", () => {
    for (let i = 0; i < forwardPath.length - 1; i += 1) {
      expect(canTransitionEngagementLifecycle(forwardPath[i]!, forwardPath[i + 1]!)).toBe(true);
    }
  });

  it("rejects skipping lifecycle stages", () => {
    expect(canTransitionEngagementLifecycle("draft", "fieldwork")).toBe(false);
    expect(canTransitionEngagementLifecycle("planning", "review")).toBe(false);
    expect(canTransitionEngagementLifecycle("draft", "closed")).toBe(false);
  });

  it("treats closed as terminal", () => {
    expect(isTerminalEngagementLifecycleStatus("closed")).toBe(true);
    expect(nextEngagementLifecycleStatuses("closed")).toEqual([]);
    expect(() => assertEngagementLifecycleTransition("closed", "review")).toThrowError(
      /terminal/,
    );
  });

  it("rejects no-op transitions", () => {
    expect(() => assertEngagementLifecycleTransition("planning", "planning")).toThrowError(
      /already/,
    );
  });

  it("allows controlled regressions and detects them", () => {
    expect(canTransitionEngagementLifecycle("review", "fieldwork")).toBe(true);
    expect(isRegressiveEngagementLifecycleTransition("review", "fieldwork")).toBe(true);
    expect(isRegressiveEngagementLifecycleTransition("fieldwork", "review")).toBe(false);
  });

  it("requires a documented reason for regressions", () => {
    expect(() => assertEngagementLifecycleReason("review", "fieldwork", "")).toThrowError(
      /reason/,
    );
    expect(() =>
      assertEngagementLifecycleReason("review", "fieldwork", "Additional testing required"),
    ).not.toThrow();
    expect(() => assertEngagementLifecycleReason("planning", "fieldwork", null)).not.toThrow();
  });

  it("covers every lifecycle status in the transition map", () => {
    for (const status of forwardPath) {
      expect(ENGAGEMENT_LIFECYCLE_TRANSITIONS[status]).toBeDefined();
    }
  });
});
