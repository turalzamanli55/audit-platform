/**
 * EPAC Phase 15 — Roadmap generation from audit evidence only.
 */
import type {
  CapabilityCoverage,
  ModuleReadiness,
  PhaseHealth,
  RoadmapItem,
  RoadmapItemStatus,
} from "@/lib/platform-audit/types";
import { averagePct } from "@/lib/platform-audit/types";

function statusFromCompletion(completionPct: number, blocked: boolean): RoadmapItemStatus {
  if (blocked) return "blocked";
  if (completionPct >= 100) return "completed";
  if (completionPct >= 50) return "in_progress";
  if (completionPct > 0) return "planned";
  return "future";
}

export function buildRoadmap(
  modules: ModuleReadiness[],
  capabilities: CapabilityCoverage[],
): { phase: PhaseHealth; roadmap: RoadmapItem[] } {
  const started = Date.now();
  const roadmap: RoadmapItem[] = [];

  for (const auditModule of modules) {
    const blocked =
      auditModule.completionPct === 0 && auditModule.remainingWork.length > 0;
    roadmap.push({
      id: `module:${auditModule.id}`,
      kind: "module",
      name: auditModule.name,
      status: statusFromCompletion(auditModule.completionPct, false),
      completionPct: auditModule.completionPct,
      blockedBy: blocked ? auditModule.remainingWork.slice(0, 5) : [],
      evidenceSummary: `${auditModule.dimensions.filter((d) => d.present).length}/${auditModule.dimensions.length} dimensions present`,
    });
  }

  for (const capability of capabilities) {
    roadmap.push({
      id: `capability:${capability.id}`,
      kind: "capability",
      name: capability.name,
      status: statusFromCompletion(capability.completionPct, capability.completionPct === 0),
      completionPct: capability.completionPct,
      blockedBy: capability.missingEvidence,
      evidenceSummary:
        capability.completionPct === 0
          ? "no evidence"
          : `${capability.completionPct}% evidence (${capability.status})`,
    });
  }

  const counts = {
    completed: roadmap.filter((item) => item.status === "completed").length,
    in_progress: roadmap.filter((item) => item.status === "in_progress").length,
    blocked: roadmap.filter((item) => item.status === "blocked").length,
    planned: roadmap.filter((item) => item.status === "planned").length,
    future: roadmap.filter((item) => item.status === "future").length,
  };

  return {
    roadmap,
    phase: {
      phase: "roadmap",
      label: "Roadmap Generation",
      ok: true,
      scorePct: averagePct(roadmap.map((item) => item.completionPct)),
      findings: [],
      metrics: counts,
      durationMs: Date.now() - started,
    },
  };
}
