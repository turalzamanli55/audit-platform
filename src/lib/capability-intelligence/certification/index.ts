/**
 * Certification intelligence — required capabilities only.
 */
import type {
  CertificationIntelligence,
  IntelligentCapability,
} from "@/lib/capability-intelligence/types";
import { averageWeighted } from "@/lib/capability-intelligence/types";

export function buildCertificationIntelligence(
  capabilities: IntelligentCapability[],
): CertificationIntelligence {
  const required = capabilities.filter((c) => c.blocksCertification);
  const optionalIgnored = capabilities.filter((c) => c.classes.includes("optional")).length;
  const futureIgnored = capabilities.filter(
    (c) => c.phase === "future" || c.classes.includes("future"),
  ).length;
  const blocked = capabilities.filter((c) => c.lifecycle === "blocked").length;

  const requiredCompletionPct =
    required.length === 0
      ? 100
      : averageWeighted(
          required.map((c) => ({
            value: c.requiredCompletionPct,
            weight: c.weightNumeric,
          })),
        );

  const requiredSatisfiedCount = required.filter((c) => c.requiredCompletionPct >= 100).length;

  let level: CertificationIntelligence["level"] = "prototype";
  if (requiredCompletionPct >= 95 && blocked === 0) level = "enterprise_certified";
  else if (requiredCompletionPct >= 85) level = "production_ready";
  else if (requiredCompletionPct >= 70) level = "release_candidate";
  else if (requiredCompletionPct >= 50) level = "beta";
  else if (requiredCompletionPct >= 25) level = "alpha";

  const enterpriseCertified = level === "enterprise_certified";

  return {
    level,
    enterpriseCertified,
    requiredCompletionPct,
    requiredCapabilityCount: required.length,
    requiredSatisfiedCount,
    optionalIgnoredCount: optionalIgnored,
    futureIgnoredCount: futureIgnored,
    blockedCount: blocked,
    explainability: [
      `Certification uses ${required.length} required capabilities only`,
      `Optional ignored=${optionalIgnored}`,
      `Future ignored=${futureIgnored}`,
      `Blocked (excluded from penalty)=${blocked}`,
      `Required completion=${requiredCompletionPct}%`,
    ],
  };
}
