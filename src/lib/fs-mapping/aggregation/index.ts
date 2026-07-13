import type { FsAggregationMethod, FsAggregatedLine } from "@/types/fs-mapping";

export type AggregationInput = {
  lineCode: string;
  lineLabel: string;
  section: FsAggregatedLine["section"];
  classification: FsAggregatedLine["classification"];
  method: FsAggregationMethod;
  amounts: number[];
  previousAmounts?: Array<number | null>;
  weights?: number[];
  sourceAccountCodes: string[];
  formulaResult?: number | null;
  isCalculated?: boolean;
};

/**
 * Line Aggregation — sum / subtract / average / ratio / running total / weighted / formula.
 */
export function aggregateLine(input: AggregationInput): FsAggregatedLine {
  const amount = computeAmount(input.method, input.amounts, input.weights, input.formulaResult);
  const previousYearAmount = computePrevious(input.method, input.previousAmounts, input.weights);

  return {
    lineCode: input.lineCode,
    lineLabel: input.lineLabel,
    section: input.section,
    classification: input.classification,
    method: input.method,
    amount: round2(amount),
    previousYearAmount: previousYearAmount == null ? null : round2(previousYearAmount),
    sourceAccountCodes: [...input.sourceAccountCodes],
    isCalculated: input.isCalculated ?? (input.method === "formula" || input.method === "ratio"),
  };
}

export function aggregateMany(inputs: AggregationInput[]): FsAggregatedLine[] {
  let running = 0;
  return inputs.map((input) => {
    if (input.method === "running_total") {
      const step = input.amounts.reduce((sum, value) => sum + value, 0);
      running += step;
      return {
        lineCode: input.lineCode,
        lineLabel: input.lineLabel,
        section: input.section,
        classification: input.classification,
        method: input.method,
        amount: round2(running),
        previousYearAmount: null,
        sourceAccountCodes: [...input.sourceAccountCodes],
        isCalculated: true,
      };
    }
    return aggregateLine(input);
  });
}

function computeAmount(
  method: FsAggregationMethod,
  amounts: number[],
  weights?: number[],
  formulaResult?: number | null,
): number {
  switch (method) {
    case "sum":
      return amounts.reduce((sum, value) => sum + value, 0);
    case "subtract":
      if (amounts.length === 0) return 0;
      return amounts.slice(1).reduce((acc, value) => acc - value, amounts[0]!);
    case "average":
      return amounts.length === 0 ? 0 : amounts.reduce((sum, value) => sum + value, 0) / amounts.length;
    case "ratio":
      if (amounts.length < 2 || amounts[1] === 0) return 0;
      return amounts[0]! / amounts[1]!;
    case "weighted": {
      if (!weights || weights.length !== amounts.length) {
        return amounts.reduce((sum, value) => sum + value, 0);
      }
      const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
      if (totalWeight === 0) return 0;
      return amounts.reduce((sum, value, index) => sum + value * (weights[index] ?? 0), 0) / totalWeight;
    }
    case "formula":
      return formulaResult ?? 0;
    case "running_total":
      return amounts.reduce((sum, value) => sum + value, 0);
    default:
      return amounts.reduce((sum, value) => sum + value, 0);
  }
}

function computePrevious(
  method: FsAggregationMethod,
  previousAmounts?: Array<number | null>,
  weights?: number[],
): number | null {
  if (!previousAmounts || previousAmounts.every((value) => value == null)) return null;
  const amounts = previousAmounts.map((value) => value ?? 0);
  return computeAmount(method, amounts, weights);
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
