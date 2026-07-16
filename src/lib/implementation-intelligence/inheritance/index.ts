/**
 * Module inheritance of contract satisfaction.
 */
import type { ImplementationContract } from "@/lib/implementation-intelligence/types";
import { weightedAverage } from "@/lib/implementation-intelligence/types";

export function moduleContractCoverage(
  moduleId: string,
  contracts: ImplementationContract[],
): number {
  const moduleContracts = contracts.filter((c) => c.moduleId === moduleId);
  if (moduleContracts.length === 0) return 0;
  const weightMap = { critical: 5, high: 4, medium: 3, low: 2, informational: 1 };
  return weightedAverage(
    moduleContracts.map((c) => ({
      value: c.coveragePct,
      weight: weightMap[c.weight],
    })),
  );
}
