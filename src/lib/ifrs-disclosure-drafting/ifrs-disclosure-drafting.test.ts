import { describe, expect, it } from "vitest";
import {
  IfrsDisclosureDraftingWorkflowEngine,
  assertIfrsDisclosureDraftingTransition,
} from "./ifrs-disclosure-drafting";

describe("ifrs-disclosure-drafting", () => {
  it("enforces disclosure drafting workflow transitions", () => {
    const engine = new IfrsDisclosureDraftingWorkflowEngine();
    expect(engine.nextStatuses("draft")).toEqual(["in_review"]);
    expect(() => assertIfrsDisclosureDraftingTransition("draft", "in_review")).not.toThrow();
    expect(() => assertIfrsDisclosureDraftingTransition("published", "draft")).toThrowError(
      /Invalid IFRS disclosure/,
    );
  });
});
