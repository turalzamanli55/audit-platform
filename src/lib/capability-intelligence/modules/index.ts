/**
 * Module intelligence — completion from relevant required capabilities only.
 */
import type {
  IntelligentCapability,
  IntelligentModule,
} from "@/lib/capability-intelligence/types";
import { averageWeighted } from "@/lib/capability-intelligence/types";

export function buildIntelligentModules(
  moduleCatalog: Array<{ id: string; name: string; domainId: string }>,
  capabilities: IntelligentCapability[],
): IntelligentModule[] {
  return moduleCatalog.map((module) => {
    const caps = capabilities.filter((c) => c.moduleId === module.id);
    const required = caps.filter((c) => c.countsTowardCompletion);
    const completionPct =
      required.length === 0
        ? 100
        : averageWeighted(
            required.map((c) => ({
              value: c.requiredCompletionPct,
              weight: c.weightNumeric,
            })),
          );

    const readiness = deriveModuleReadiness(completionPct, required);

    return {
      id: module.id,
      name: module.name,
      domainId: module.domainId,
      capabilityIds: caps.map((c) => c.id),
      requiredCapabilityIds: required.map((c) => c.id),
      completionPct,
      readiness,
      blockedCapabilityIds: caps.filter((c) => c.lifecycle === "blocked").map((c) => c.id),
      futureCapabilityIds: caps.filter((c) => c.phase === "future").map((c) => c.id),
      optionalCapabilityIds: caps
        .filter((c) => c.classes.includes("optional"))
        .map((c) => c.id),
    };
  });
}

function deriveModuleReadiness(
  completionPct: number,
  required: IntelligentCapability[],
): IntelligentModule["readiness"] {
  if (required.length === 0) return "prototype";
  const allCertified = required.every((c) => c.lifecycle === "certified");
  if (allCertified && completionPct >= 95) return "enterprise_certified";
  if (completionPct >= 85) return "production_ready";
  if (completionPct >= 70) return "release_candidate";
  if (completionPct >= 50) return "beta";
  if (completionPct >= 25) return "alpha";
  return "prototype";
}
