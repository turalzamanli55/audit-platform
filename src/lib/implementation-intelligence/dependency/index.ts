/**
 * Dependency resolution — incomplete dependencies block contracts without penalizing completion math.
 */
import type { ImplementationContract } from "@/lib/implementation-intelligence/types";
import type { ImplementationIntent } from "@/lib/implementation-intelligence/parser";

export function buildBlockedMap(
  intents: ImplementationIntent[],
  contracts: ImplementationContract[],
): Record<string, string[]> {
  const byId = new Map(contracts.map((c) => [c.capabilityId, c]));
  const blocked: Record<string, string[]> = {};

  for (const intent of intents) {
    const reasons: string[] = [];
    for (const depId of intent.dependencies) {
      const dep = byId.get(depId);
      if (!dep) continue;
      if (dep.coveragePct < 60 && !dep.certified) {
        reasons.push(`${depId} contract coverage ${dep.coveragePct}%`);
      }
    }
    if (
      /risk.?library|lead.?sheet|working.?paper|control.?framework/i.test(
        `${intent.name} ${intent.moduleId}`,
      )
    ) {
      const company = contracts.filter((c) => /compan/i.test(c.moduleId));
      if (
        company.length > 0 &&
        company.some((c) => c.coveragePct < 60 && !c.certified)
      ) {
        reasons.push("companies foundation contracts incomplete");
      }
    }
    if (reasons.length > 0) blocked[intent.id] = reasons;
  }

  return blocked;
}
