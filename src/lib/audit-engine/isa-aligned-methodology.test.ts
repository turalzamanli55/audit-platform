import { describe, expect, it } from "vitest";
import { assertIsaPhaseOrder, nextIsaPhase } from "./isa-aligned-methodology";

describe("isa-aligned-methodology", () => {
  it("enforces ISA phase sequencing", () => {
    expect(nextIsaPhase([])).toBe("acceptance");
    expect(() => assertIsaPhaseOrder(["acceptance"], "planning")).not.toThrow();
    expect(() => assertIsaPhaseOrder([], "planning")).toThrowError(/acceptance/);
    expect(nextIsaPhase(["acceptance", "planning", "risk_assessment", "response", "conclusion", "reporting"])).toBeNull();
  });
});
