/**
 * Readiness classification — reuses ECIE module readiness; overall from EIIE.
 */
import type { ModuleInventoryItem, ReadinessLevel } from "@/lib/platform-inventory/types";
import { deriveReadinessLevel } from "@/lib/platform-inventory/types";

export function classifyOverallReadiness(
  platformCompletionPct: number,
  enterpriseCertified: boolean,
): ReadinessLevel {
  if (enterpriseCertified) return "enterprise_certified";
  return deriveReadinessLevel(platformCompletionPct, false);
}

export function countModulesByReadiness(modules: ModuleInventoryItem[]) {
  const counts = {
    modulesPrototype: 0,
    modulesAlpha: 0,
    modulesBeta: 0,
    modulesReleaseCandidate: 0,
    modulesProductionReady: 0,
    modulesEnterpriseCertified: 0,
  };
  for (const m of modules) {
    switch (m.readiness) {
      case "prototype":
        counts.modulesPrototype += 1;
        break;
      case "alpha":
        counts.modulesAlpha += 1;
        break;
      case "beta":
        counts.modulesBeta += 1;
        break;
      case "release_candidate":
        counts.modulesReleaseCandidate += 1;
        break;
      case "production_ready":
        counts.modulesProductionReady += 1;
        break;
      case "enterprise_certified":
        counts.modulesEnterpriseCertified += 1;
        break;
    }
  }
  return counts;
}
