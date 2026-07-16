/**
 * EPAC Phase 7 — AI Audit (v2 semantic resolution).
 */
import type { EvidenceEngineReport } from "@/lib/platform-audit/evidence-engine/types";
import type { AuditFinding, PhaseHealth } from "@/lib/platform-audit/types";
import { averagePct } from "@/lib/platform-audit/types";

export function auditAiFromEvidence(report: EvidenceEngineReport): PhaseHealth {
  const started = Date.now();
  const findings: AuditFinding[] = [];
  const areas = report.aiAreas;

  for (const area of areas) {
    if (!area.present) {
      findings.push({
        phase: "ai",
        code: "ai_area_unresolved",
        severity: "warning",
        message: `AI area unresolved: ${area.areaId}`,
        rootCause: area.reason,
        evidencePaths: area.aliases.map((alias) => `alias:${alias}`),
        entityId: area.areaId,
      });
    }
  }

  const scorePct = averagePct(areas.map((area) => area.confidencePct));

  return {
    phase: "ai",
    label: "AI Audit",
    ok: areas.some((area) => area.present),
    scorePct,
    findings,
    metrics: {
      areasExpected: areas.length,
      areasPresent: areas.filter((area) => area.present).length,
      verifiedAreas: areas.filter((area) => area.confidence === "verified").length,
      strongAreas: areas.filter((area) => area.confidence === "strong").length,
      presentAreas: areas.filter((a) => a.present).map((a) => a.areaId).join(","),
      missingAreas: areas.filter((a) => !a.present).map((a) => a.areaId).join(","),
    },
    durationMs: Date.now() - started,
  };
}

export function auditAi(_cwd?: string): PhaseHealth {
  throw new Error("auditAi requires Evidence Engine v2 — call auditAiFromEvidence");
}
