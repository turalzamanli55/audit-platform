/**
 * Dependency intelligence — incomplete dependencies block, they do not drag completion.
 */
import type {
  DependencyEdge,
  DependencyIntelligence,
  IntelligentCapability,
  ParsedCapability,
} from "@/lib/capability-intelligence/types";

export function buildDependencyIntelligence(
  parsed: ParsedCapability[],
  scored: IntelligentCapability[],
): DependencyIntelligence {
  const byId = new Map(scored.map((capability) => [capability.id, capability]));
  const byModule = new Map<string, IntelligentCapability[]>();
  for (const capability of scored) {
    const list = byModule.get(capability.moduleId) ?? [];
    list.push(capability);
    byModule.set(capability.moduleId, list);
  }

  const edges: DependencyEdge[] = [];
  const blockedCapabilities: string[] = [];
  const blockingReasons: Record<string, string[]> = {};

  for (const capability of parsed) {
    for (const depId of capability.dependencies) {
      edges.push({ from: capability.id, to: depId, kind: "capability" });
    }
  }

  // Module-level soft dependency: if capability name suggests dependency on companies/auth
  for (const capability of scored) {
    const reasons: string[] = [];
    for (const depId of capability.dependencies) {
      const dep = byId.get(depId);
      if (!dep) {
        reasons.push(`missing dependency capability ${depId}`);
        continue;
      }
      if (dep.lifecycle === "future" || dep.phase === "future") continue;
      if (!dep.countsTowardCompletion) continue;
      if (dep.requiredCompletionPct < 60 && dep.lifecycle !== "certified" && dep.lifecycle !== "verified") {
        reasons.push(`${depId} incomplete (${dep.requiredCompletionPct}%)`);
      }
    }

    // Heuristic: risk library / advanced modules blocked by companies foundation
    if (/risk.?library|lead.?sheet|working.?paper|control.?framework/i.test(capability.name + capability.moduleId)) {
      const companyCaps = scored.filter((c) => /compan/i.test(c.moduleId));
      const companyReady =
        companyCaps.length === 0 ||
        companyCaps.filter((c) => c.countsTowardCompletion).every((c) => c.requiredCompletionPct >= 60);
      if (!companyReady) {
        reasons.push("companies foundation incomplete");
      }
    }

    if (reasons.length > 0 && capability.countsTowardCompletion && capability.requiredCompletionPct < 100) {
      blockedCapabilities.push(capability.id);
      blockingReasons[capability.id] = reasons;
    }
  }

  const criticalPath = scored
    .filter((c) => c.countsTowardCompletion && (c.weight === "critical" || c.weight === "high"))
    .filter((c) => c.requiredCompletionPct < 100)
    .sort((a, b) => b.weightNumeric - a.weightNumeric)
    .map((c) => c.id)
    .slice(0, 40);

  return {
    edges,
    blockedCapabilities: [...new Set(blockedCapabilities)],
    blockingReasons,
    criticalPath,
  };
}
