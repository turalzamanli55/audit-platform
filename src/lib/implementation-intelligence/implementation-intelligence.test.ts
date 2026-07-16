import { describe, expect, it } from "vitest";
import { buildContractExpectations } from "./contracts";
import type { ImplementationIntent } from "./parser";
import { scorePlatformFromContracts } from "./scoring";
import type { ImplementationContract } from "./types";

function intent(overrides: Partial<ImplementationIntent> = {}): ImplementationIntent {
  return {
    id: "cap_test",
    name: "Lead Sheet Composition",
    description: "Compose lead sheets for audit engagements",
    purpose: "lead sheets",
    moduleId: "mod_lead-sheets",
    domainId: "audit",
    featureId: "feat",
    dependencies: [],
    sourceSection: "13.2",
    priority: "high",
    category: "13.2",
    classes: ["required", "workflow"],
    phase: "beta",
    weight: "high",
    ...overrides,
  };
}

describe("EIIE contracts", () => {
  it("requires workflow+serverAction for workflow capabilities", () => {
    const expectations = buildContractExpectations(intent());
    expect(expectations.some((e) => e.id === "workflow")).toBe(true);
    expect(expectations.some((e) => e.id === "serverAction")).toBe(true);
  });

  it("future capabilities only require documentation", () => {
    const expectations = buildContractExpectations(
      intent({ phase: "future", classes: ["future"], weight: "informational" }),
    );
    expect(expectations.every((e) => e.id === "documentation")).toBe(true);
  });
});

describe("EIIE scoring", () => {
  it("never treats partial contracts as 100%", () => {
    const contracts = [
      {
        coveragePct: 50,
        weight: "high",
        blocked: false,
        certified: false,
        contractSatisfied: false,
      },
      {
        coveragePct: 100,
        weight: "high",
        blocked: false,
        certified: true,
        contractSatisfied: true,
      },
    ] as ImplementationContract[];
    const score = scorePlatformFromContracts(contracts);
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThan(100);
  });
});
