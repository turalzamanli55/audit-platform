import type { MaterialityCalculationType } from "@/types/materiality";

function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}

export function calculateOverallMateriality(
  benchmarkAmount: number,
  percentage: number,
): number {
  if (benchmarkAmount < 0) {
    throw new RangeError("Benchmark amount must be non-negative");
  }
  if (percentage <= 0 || percentage > 100) {
    throw new RangeError("Percentage must be between 0 and 100");
  }
  return roundCurrency((benchmarkAmount * percentage) / 100);
}

export function calculatePerformanceMateriality(
  overallMateriality: number,
  performancePct: number,
): number {
  if (overallMateriality < 0) {
    throw new RangeError("Overall materiality must be non-negative");
  }
  if (performancePct <= 0 || performancePct > 100) {
    throw new RangeError("Performance percentage must be between 0 and 100");
  }
  return roundCurrency((overallMateriality * performancePct) / 100);
}

export function calculateTrivialThreshold(
  overallMateriality: number,
  trivialPct: number,
): number {
  if (overallMateriality < 0) {
    throw new RangeError("Overall materiality must be non-negative");
  }
  if (trivialPct <= 0 || trivialPct > 100) {
    throw new RangeError("Trivial threshold percentage must be between 0 and 100");
  }
  return roundCurrency((overallMateriality * trivialPct) / 100);
}

export type BuildCalculationExplanationInput = {
  calculationType: MaterialityCalculationType;
  inputAmount: number;
  percentage: number;
  resultAmount: number;
  benchmarkLabel?: string | null;
  currencyCode?: string;
};

export function buildCalculationExplanation(
  input: BuildCalculationExplanationInput,
): string {
  const currency = input.currencyCode ?? "AZN";
  const formattedInput = formatAmount(input.inputAmount, currency);
  const formattedResult = formatAmount(input.resultAmount, currency);

  switch (input.calculationType) {
    case "overall": {
      const label = input.benchmarkLabel ? `${input.benchmarkLabel} benchmark` : "Benchmark";
      return `${label}: ${formattedInput} × ${input.percentage}% = ${formattedResult} overall materiality (ISA 320).`;
    }
    case "performance":
      return `Performance materiality: ${formattedInput} × ${input.percentage}% = ${formattedResult}.`;
    case "trivial":
      return `Clearly trivial threshold: ${formattedInput} × ${input.percentage}% = ${formattedResult}.`;
    case "specific":
      return `Specific materiality: ${formattedInput} × ${input.percentage}% = ${formattedResult}.`;
    default:
      return `${formattedInput} × ${input.percentage}% = ${formattedResult}.`;
  }
}

function formatAmount(amount: number, currency: string): string {
  return `${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`;
}
