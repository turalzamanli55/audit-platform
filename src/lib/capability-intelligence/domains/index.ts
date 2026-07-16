/**
 * Domain intelligence.
 */
import type {
  IntelligentDomain,
  IntelligentModule,
} from "@/lib/capability-intelligence/types";
import { averageWeighted } from "@/lib/capability-intelligence/types";

export function buildIntelligentDomains(
  domainCatalog: Array<{ id: string; name: string }>,
  modules: IntelligentModule[],
): IntelligentDomain[] {
  return domainCatalog.map((domain) => {
    const domainModules = modules.filter((module) => module.domainId === domain.id);
    const completionPct =
      domainModules.length === 0
        ? 0
        : averageWeighted(
            domainModules.map((module) => ({
              value: module.completionPct,
              weight: Math.max(1, module.requiredCapabilityIds.length),
            })),
          );
    return {
      id: domain.id,
      name: domain.name,
      moduleIds: domainModules.map((module) => module.id),
      completionPct,
    };
  });
}
