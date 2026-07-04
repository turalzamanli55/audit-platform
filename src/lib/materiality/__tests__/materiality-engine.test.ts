import { describe, expect, it } from "vitest";
import {
  buildCalculationExplanation,
  calculateOverallMateriality,
  calculatePerformanceMateriality,
  calculateTrivialThreshold,
} from "@/lib/materiality/materiality-engine";

describe("materiality engine", () => {
  it("calculates overall materiality from benchmark and percentage", () => {
    expect(calculateOverallMateriality(10_000_000, 1)).toBe(100_000);
    expect(calculateOverallMateriality(2_000_000, 5)).toBe(100_000);
  });

  it("calculates performance materiality from overall and percentage", () => {
    expect(calculatePerformanceMateriality(100_000, 75)).toBe(75_000);
    expect(calculatePerformanceMateriality(100_000, 50)).toBe(50_000);
  });

  it("calculates trivial threshold from overall and percentage", () => {
    expect(calculateTrivialThreshold(100_000, 5)).toBe(5_000);
    expect(calculateTrivialThreshold(100_000, 3)).toBe(3_000);
  });

  it("rounds currency values to two decimal places", () => {
    expect(calculateOverallMateriality(1_000_001, 1)).toBe(10_000.01);
  });

  it("rejects invalid benchmark amounts and percentages", () => {
    expect(() => calculateOverallMateriality(-1, 1)).toThrow(RangeError);
    expect(() => calculateOverallMateriality(100, 0)).toThrow(RangeError);
    expect(() => calculatePerformanceMateriality(100, 101)).toThrow(RangeError);
    expect(() => calculateTrivialThreshold(100, -1)).toThrow(RangeError);
  });

  it("builds ISA 320 calculation explanations", () => {
    const overall = buildCalculationExplanation({
      calculationType: "overall",
      inputAmount: 10_000_000,
      percentage: 1,
      resultAmount: 100_000,
      benchmarkLabel: "Revenue",
      currencyCode: "AZN",
    });
    expect(overall).toContain("Revenue benchmark");
    expect(overall).toContain("ISA 320");

    const performance = buildCalculationExplanation({
      calculationType: "performance",
      inputAmount: 100_000,
      percentage: 75,
      resultAmount: 75_000,
      currencyCode: "AZN",
    });
    expect(performance).toContain("Performance materiality");

    const trivial = buildCalculationExplanation({
      calculationType: "trivial",
      inputAmount: 100_000,
      percentage: 5,
      resultAmount: 5_000,
      currencyCode: "AZN",
    });
    expect(trivial).toContain("Clearly trivial threshold");
  });
});
