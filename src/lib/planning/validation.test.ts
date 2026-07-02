import { describe, expect, it } from "vitest";
import {
  computeChecklistProgress,
  validateCreatePlanningInput,
  validateUpdatePlanningInput,
} from "@/lib/planning/validation";
import { computePlanningProgress } from "@/lib/planning/planning-workspace-display";

describe("planning validation", () => {
  it("requires engagement id for create", () => {
    expect(() => validateCreatePlanningInput({ engagementId: "" })).toThrow();
    const result = validateCreatePlanningInput({ engagementId: "eng-1" });
    expect(result.engagementId).toBe("eng-1");
  });

  it("normalizes optional update fields", () => {
    const result = validateUpdatePlanningInput({
      auditStrategy: "  Strategy  ",
      planningNotes: "",
    });
    expect(result.auditStrategy).toBe("Strategy");
    expect(result.planningNotes).toBeNull();
  });

  it("computes checklist progress", () => {
    expect(
      computeChecklistProgress([
        { id: "1", key: "a", completed: true },
        { id: "2", key: "b", completed: false },
      ]),
    ).toBe(50);
  });
});

describe("computePlanningProgress", () => {
  it("maps planning statuses to progress values", () => {
    expect(computePlanningProgress("not_started")).toBe(0);
    expect(computePlanningProgress("in_progress")).toBe(25);
    expect(computePlanningProgress("pending_review")).toBe(60);
    expect(computePlanningProgress("approved")).toBe(100);
  });
});
