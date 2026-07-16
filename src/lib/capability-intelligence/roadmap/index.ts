/**
 * Roadmap intelligence — generated from evidence, not static files.
 */
import type {
  IntelligentCapability,
  IntelligentModule,
  RoadmapIntelligence,
  DependencyIntelligence,
} from "@/lib/capability-intelligence/types";

export function buildRoadmapIntelligence(
  modules: IntelligentModule[],
  capabilities: IntelligentCapability[],
  dependencies: DependencyIntelligence,
): RoadmapIntelligence {
  const blockedModules = modules
    .filter((module) => module.blockedCapabilityIds.length > 0)
    .map((module) => ({
      id: module.id,
      name: module.name,
      blockedBy: module.blockedCapabilityIds,
    }));

  const futureModules = modules
    .filter(
      (module) =>
        module.futureCapabilityIds.length > 0 &&
        module.requiredCapabilityIds.every((id) =>
          capabilities.find((c) => c.id === id)?.phase === "future",
        ),
    )
    .map((module) => ({ id: module.id, name: module.name }));

  const nextModules = modules
    .filter((module) => module.blockedCapabilityIds.length === 0)
    .filter((module) => module.completionPct < 100)
    .filter((module) => module.readiness !== "enterprise_certified")
    .sort((a, b) => a.completionPct - b.completionPct)
    .slice(0, 10)
    .map((module) => ({
      id: module.id,
      name: module.name,
      reason: `Completion ${module.completionPct}% — unblocked required capabilities remain`,
    }));

  const recommendedSprint = capabilities
    .filter((c) => c.countsTowardCompletion)
    .filter((c) => c.lifecycle !== "blocked")
    .filter((c) => c.requiredCompletionPct < 100)
    .sort((a, b) => b.weightNumeric - a.weightNumeric || a.requiredCompletionPct - b.requiredCompletionPct)
    .slice(0, 15)
    .map((c) => ({
      id: c.id,
      kind: "capability" as const,
      name: c.name,
      weight: c.weight,
      reason: `Required ${c.requiredCompletionPct}% — missing ${c.evidence
        .filter((e) => e.required && !e.verified)
        .map((e) => e.kind)
        .join(", ")}`,
    }));

  return {
    nextModules,
    blockedModules,
    criticalPath: dependencies.criticalPath,
    futureModules,
    recommendedSprint,
  };
}
