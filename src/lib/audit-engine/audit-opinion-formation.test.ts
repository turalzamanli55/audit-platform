import { describe, expect, it } from "vitest";
import {
  assertOpinionTypeConsistency,
  deriveAuditOpinionType,
} from "./audit-opinion-formation";

describe("audit-opinion-formation", () => {
  it("derives ISA-consistent opinion types from facts", () => {
    expect(
      deriveAuditOpinionType({
        misstatementsMaterial: false,
        misstatementsPervasive: false,
        scopeLimitation: false,
        goingConcernMaterialUncertainty: false,
      }),
    ).toBe("unqualified");
    expect(
      deriveAuditOpinionType({
        misstatementsMaterial: true,
        misstatementsPervasive: true,
        scopeLimitation: false,
        goingConcernMaterialUncertainty: false,
      }),
    ).toBe("adverse");
    expect(() =>
      assertOpinionTypeConsistency({
        opinionType: "unqualified",
        misstatementsMaterial: true,
        misstatementsPervasive: false,
        scopeLimitation: false,
        goingConcernMaterialUncertainty: false,
      }),
    ).toThrowError(/inconsistent/i);
  });
});
