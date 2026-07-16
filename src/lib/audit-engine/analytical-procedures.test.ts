import { describe, expect, it } from "vitest";
import {
  analyticalVariancePct,
  assertAnalyticalProcedureInput,
  isAnalyticalVarianceSignificant,
} from "./analytical-procedures";

describe("analytical-procedures", () => {
  it("flags significant variances against expectations", () => {
    const result = {
      accountCode: "4000",
      recorded: 120,
      expectation: 100,
      thresholdPct: 10,
    };
    expect(analyticalVariancePct(result)).toBe(20);
    expect(isAnalyticalVarianceSignificant(result)).toBe(true);
    expect(() => assertAnalyticalProcedureInput(result)).not.toThrow();
    expect(() =>
      assertAnalyticalProcedureInput({ ...result, accountCode: "" }),
    ).toThrowError(/Account code/);
  });
});
