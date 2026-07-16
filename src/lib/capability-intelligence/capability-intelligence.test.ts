import { describe, expect, it } from "vitest";
import { classifyCapability, primaryClass } from "./classification";
import { assignImplementationPhase } from "./phases";
import { defineRequiredEvidence } from "./requirements";
import { scoreRequiredCompletion, countsTowardCompletion } from "./scoring";
import type { ParsedCapability } from "./types";

function sample(overrides: Partial<ParsedCapability> = {}): ParsedCapability {
  return {
    id: "cap_test",
    name: "Test Capability",
    description: "A required platform capability",
    purpose: "testing",
    moduleId: "mod_foundation",
    domainId: "platform",
    featureId: "feat_test",
    dependencies: [],
    sourceSection: "13",
    priority: "high",
    category: "13.6",
    ...overrides,
  };
}

describe("ECIE classification", () => {
  it("marks security capabilities as required+security", () => {
    const classes = classifyCapability(
      sample({ name: "Auth Permissions", description: "RBAC permission enforcement" }),
    );
    expect(classes.includes("security")).toBe(true);
    expect(classes.includes("required")).toBe(true);
    expect(primaryClass(classes)).toBe("required");
  });

  it("marks future low-priority AI as future phase", () => {
    const capability = sample({
      name: "Experimental AI Helper",
      description: "future experimental ai prompt spike",
      priority: "low",
    });
    const classes = classifyCapability(capability);
    const phase = assignImplementationPhase(capability, classes);
    expect(phase).toBe("future");
    expect(
      countsTowardCompletion({ classes, phase, blocked: false }),
    ).toBe(false);
  });
});

describe("ECIE required evidence", () => {
  it("does not require UI evidence for pure database capabilities", () => {
    const capability = sample({
      name: "Schema Migration Health",
      description: "database migration schema governance",
    });
    const classes = classifyCapability(capability);
    const phase = assignImplementationPhase(capability, classes);
    const required = defineRequiredEvidence(capability, classes, phase);
    expect(required.some((r) => r.kind === "migration")).toBe(true);
    expect(required.some((r) => r.kind === "component")).toBe(false);
  });

  it("scores only required verified evidence", () => {
    expect(
      scoreRequiredCompletion([
        {
          kind: "migration",
          required: true,
          present: true,
          verified: true,
          confidencePct: 100,
          paths: [],
          reason: "ok",
        },
        {
          kind: "component",
          required: false,
          present: false,
          verified: false,
          confidencePct: 0,
          paths: [],
          reason: "n/a",
        },
      ]),
    ).toBe(100);
  });
});
