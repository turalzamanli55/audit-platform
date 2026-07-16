/**
 * Implementation gap analysis — Expected / Implemented / Missing / Deprecated / Blocked.
 */
import type {
  ImplementationContract,
  ImplementationGap,
} from "@/lib/implementation-intelligence/types";

export function analyzeImplementationGaps(
  contracts: ImplementationContract[],
): ImplementationGap[] {
  const gaps: ImplementationGap[] = [];

  for (const contract of contracts) {
    for (const clause of contract.clauses) {
      if (!clause.required) continue;
      if (clause.verified && clause.status === "verified") continue;

      const severity =
        contract.weight === "critical"
          ? "critical"
          : contract.weight === "high"
            ? "high"
            : contract.weight === "medium"
              ? "medium"
              : "low";

      gaps.push({
        capabilityId: contract.capabilityId,
        moduleId: contract.moduleId,
        clause: clause.id,
        expected: clause.reason,
        implemented: clause.implemented,
        missing: clause.missing,
        status: clause.status,
        severity,
        bibleTrace: clause.bibleTrace,
      });
    }
  }

  return gaps.sort((a, b) => {
    const order = { critical: 0, high: 1, medium: 2, low: 3 };
    return order[a.severity] - order[b.severity];
  });
}
