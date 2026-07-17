import { describe, expect, it } from "vitest";
import { assertControlDeficiencyEvaluation } from "./control-deficiency-evaluation";

export const CONTROL_DEFICIENCY_EVALUATION_TEST_SUITE = "control-deficiency-evaluation";

describe("control-deficiency-evaluation", () => {
  it("requires remediation for material weaknesses", () => {
    expect(() =>
      assertControlDeficiencyEvaluation({
        controlId: "c-1",
        deficiencyTitle: "Access review gap",
        severity: "deficiency",
        remediationRequired: false,
      }),
    ).not.toThrow();
    expect(() =>
      assertControlDeficiencyEvaluation({
        controlId: "c-1",
        deficiencyTitle: "Pervasive ITGC failure",
        severity: "material_weakness",
        remediationRequired: false,
      }),
    ).toThrowError(/remediation/i);
  });
});
