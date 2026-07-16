import { describe, expect, it } from "vitest";
import { assertReviewWorkflowTransition } from "./review-workflow";

describe("review-workflow", () => {
  it("enforces preparer → reviewer → clearance workflow", () => {
    expect(() => assertReviewWorkflowTransition("draft", "submitted")).not.toThrow();
    expect(() => assertReviewWorkflowTransition("under_review", "cleared")).not.toThrow();
    expect(() => assertReviewWorkflowTransition("cleared", "draft")).toThrowError(/Invalid review/);
  });
});
