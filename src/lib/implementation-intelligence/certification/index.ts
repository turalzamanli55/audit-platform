/**
 * Implementation certification — certified ONLY when full contract satisfied.
 */
import type {
  ImplementationCertification,
  ImplementationContract,
} from "@/lib/implementation-intelligence/types";
import { scoreCertificationCoverage } from "@/lib/implementation-intelligence/scoring";

export function certifyImplementations(
  contracts: ImplementationContract[],
): ImplementationCertification {
  const stats = scoreCertificationCoverage(contracts);
  let level: ImplementationCertification["level"] = "prototype";
  if (stats.coveragePct >= 95) level = "enterprise_certified";
  else if (stats.coveragePct >= 85) level = "production_ready";
  else if (stats.coveragePct >= 70) level = "release_candidate";
  else if (stats.coveragePct >= 50) level = "beta";
  else if (stats.coveragePct >= 25) level = "alpha";

  return {
    level,
    enterpriseCertified: level === "enterprise_certified",
    contractsTotal: stats.total,
    contractsSatisfied: stats.satisfied,
    contractsCertified: stats.certified,
    coveragePct: stats.coveragePct,
    explainability: [
      "A capability is certified ONLY when its complete implementation contract is satisfied",
      "Partial implementation is never certified",
      `Certified contracts=${stats.certified}/${stats.total}`,
      `Satisfied contracts=${stats.satisfied}/${stats.total}`,
    ],
  };
}
