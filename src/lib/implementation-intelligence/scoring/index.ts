/**
 * Scoring — platform completion from verified implementation contracts only.
 */
import type { ImplementationContract } from "@/lib/implementation-intelligence/types";
import { weightedAverage } from "@/lib/implementation-intelligence/types";

export function scorePlatformFromContracts(contracts: ImplementationContract[]): number {
  // Future-only documentation contracts with 100% shouldn't dominate — still include
  // but weight by business value. Blocked contracts excluded from penalty (coverage kept but not certified).
  const countable = contracts.filter((c) => !c.blocked);
  if (countable.length === 0) return 0;
  const weightMap = { critical: 5, high: 4, medium: 3, low: 2, informational: 1 };
  return weightedAverage(
    countable.map((c) => ({
      value: c.coveragePct,
      weight: weightMap[c.weight],
    })),
  );
}

export function scoreCertificationCoverage(contracts: ImplementationContract[]): {
  total: number;
  satisfied: number;
  certified: number;
  coveragePct: number;
} {
  const total = contracts.length;
  const satisfied = contracts.filter((c) => c.contractSatisfied).length;
  const certified = contracts.filter((c) => c.certified).length;
  const coveragePct = total === 0 ? 0 : Number(((certified / total) * 100).toFixed(2));
  return { total, satisfied, certified, coveragePct };
}
