import type { SynchronizedCapability } from "@/lib/project-sync/types";

export type SyncRoadmapLane =
  | "completed"
  | "in_progress"
  | "blocked"
  | "planned"
  | "future";

export type SyncRoadmapEntry = {
  id: string;
  name: string;
  moduleId: string;
  domainId: string;
  completionPct: number;
  priority: SynchronizedCapability["priority"];
  lane: SyncRoadmapLane;
  criticalPath: boolean;
};

/**
 * Roadmap Engine — lanes + suggested build order from dependency graph.
 */
export function buildSyncRoadmap(capabilities: SynchronizedCapability[]): {
  entries: SyncRoadmapEntry[];
  lanes: Record<SyncRoadmapLane, SyncRoadmapEntry[]>;
  suggestedBuildOrder: string[];
  criticalPath: string[];
  nextSprint: string[];
  highestPriority: string[];
  highestImpact: string[];
} {
  const byId = new Map(capabilities.map((capability) => [capability.id, capability]));
  const blocked = new Set(
    capabilities
      .filter((capability) =>
        capability.dependencies.some((dependencyId) => {
          const dependency = byId.get(dependencyId);
          return !dependency || dependency.completionPct < 40;
        }),
      )
      .map((capability) => capability.id),
  );

  const entries: SyncRoadmapEntry[] = capabilities.map((capability) => {
    let lane: SyncRoadmapLane = "planned";
    if (capability.completionPct >= 100) lane = "completed";
    else if (blocked.has(capability.id)) lane = "blocked";
    else if (capability.completionPct > 0) lane = "in_progress";
    else if (capability.priority === "low") lane = "future";
    else lane = "planned";

    return {
      id: capability.id,
      name: capability.name,
      moduleId: capability.moduleId,
      domainId: capability.domainId,
      completionPct: capability.completionPct,
      priority: capability.priority,
      lane,
      criticalPath: capability.priority === "critical",
    };
  });

  const lanes: Record<SyncRoadmapLane, SyncRoadmapEntry[]> = {
    completed: [],
    in_progress: [],
    blocked: [],
    planned: [],
    future: [],
  };
  for (const entry of entries) lanes[entry.lane].push(entry);

  const suggestedBuildOrder = topologicalBuildOrder(capabilities);
  const criticalPath = entries.filter((entry) => entry.criticalPath).map((entry) => entry.id);
  const nextSprint = entries
    .filter((entry) => entry.lane === "planned" || entry.lane === "in_progress")
    .sort((a, b) => priorityWeight(b.priority) - priorityWeight(a.priority))
    .slice(0, 10)
    .map((entry) => entry.id);
  const highestPriority = entries
    .filter((entry) => entry.priority === "critical" && entry.lane !== "completed")
    .map((entry) => entry.id);
  const highestImpact = [...entries]
    .sort((a, b) => b.completionPct - a.completionPct)
    .filter((entry) => entry.lane !== "completed")
    .slice(0, 10)
    .map((entry) => entry.id);

  return {
    entries,
    lanes,
    suggestedBuildOrder,
    criticalPath,
    nextSprint,
    highestPriority,
    highestImpact,
  };
}

function priorityWeight(priority: SynchronizedCapability["priority"]): number {
  switch (priority) {
    case "critical":
      return 4;
    case "high":
      return 3;
    case "medium":
      return 2;
    case "low":
      return 1;
    default:
      return 0;
  }
}

function topologicalBuildOrder(capabilities: SynchronizedCapability[]): string[] {
  const remaining = new Map(capabilities.map((capability) => [capability.id, new Set(capability.dependencies)]));
  const ordered: string[] = [];
  while (remaining.size > 0) {
    const ready = [...remaining.entries()]
      .filter(([, deps]) => deps.size === 0)
      .map(([id]) => id)
      .sort();
    if (ready.length === 0) {
      ordered.push(...[...remaining.keys()]);
      break;
    }
    for (const id of ready) {
      ordered.push(id);
      remaining.delete(id);
      for (const deps of remaining.values()) deps.delete(id);
    }
  }
  return ordered;
}
