import type { Capability } from "@/lib/capability-registry/capabilities";
import { listBlockedCapabilities } from "@/lib/capability-registry/dependencies";

export type CapabilityRoadmapLane =
  | "completed"
  | "in_progress"
  | "blocked"
  | "planned"
  | "future";

export type CapabilityRoadmapEntry = {
  id: string;
  name: string;
  domain: string;
  module: string;
  feature: string;
  status: Capability["status"];
  priority: Capability["priority"];
  completionPct: number;
  lane: CapabilityRoadmapLane;
  missingEvidence: string[];
};

/**
 * Roadmap — Completed / In Progress / Blocked / Planned / Future.
 */
export function buildCapabilityRoadmap(capabilities: Capability[]): CapabilityRoadmapEntry[] {
  const blockedIds = new Set(listBlockedCapabilities(capabilities).map((entry) => entry.id));

  return [...capabilities]
    .filter((capability) => !capability.deprecated)
    .map((capability) => {
      const lane = deriveLane(capability, blockedIds.has(capability.id));
      return {
        id: capability.id,
        name: capability.name,
        domain: capability.domain,
        module: capability.module,
        feature: capability.feature,
        status: capability.status,
        priority: capability.priority,
        completionPct: capability.completionPct,
        lane,
        missingEvidence: [...capability.missingEvidence],
      };
    })
    .sort((a, b) => {
      const laneOrder: CapabilityRoadmapLane[] = [
        "blocked",
        "in_progress",
        "planned",
        "future",
        "completed",
      ];
      const laneDiff = laneOrder.indexOf(a.lane) - laneOrder.indexOf(b.lane);
      if (laneDiff !== 0) return laneDiff;
      return a.completionPct - b.completionPct;
    });
}

function deriveLane(capability: Capability, blocked: boolean): CapabilityRoadmapLane {
  if (capability.completed || capability.completionPct >= 100) return "completed";
  if (blocked) return "blocked";
  if (capability.status === "planned" && capability.completionPct === 0) {
    return capability.priority === "low" ? "future" : "planned";
  }
  if (capability.completionPct > 0 && capability.completionPct < 100) return "in_progress";
  return "planned";
}

export function groupRoadmapByLane(entries: CapabilityRoadmapEntry[]) {
  const groups: Record<CapabilityRoadmapLane, CapabilityRoadmapEntry[]> = {
    completed: [],
    in_progress: [],
    blocked: [],
    planned: [],
    future: [],
  };
  for (const entry of entries) {
    groups[entry.lane].push(entry);
  }
  return groups;
}
