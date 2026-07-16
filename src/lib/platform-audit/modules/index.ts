/**
 * EPAC Phase 11 — Module Readiness (v2 semantic evidence).
 */
import type { EvidenceEngineReport } from "@/lib/platform-audit/evidence-engine/types";
import { isTrusted } from "@/lib/platform-audit/evidence-engine/scoring";
import type {
  AuditFinding,
  EpacEvidence,
  EvidencePathMap,
  ModuleReadiness,
  PhaseHealth,
} from "@/lib/platform-audit/types";
import {
  deriveCompletionStatus,
  emptyEpacEvidence,
  averagePct,
  type EpacEvidenceDimension,
} from "@/lib/platform-audit/types";

const KIND_TO_EPAC: Record<string, EpacEvidenceDimension | null> = {
  database: "database",
  migration: "migration",
  repository: "repository",
  serverAction: "serverAction",
  route: "route",
  workspace: "workspace",
  component: "component",
  localization: "localization",
  test: "tests",
  permission: "permissions",
  workflow: "workflow",
  documentation: "documentation",
};

export function auditModulesFromEvidence(report: EvidenceEngineReport): {
  phase: PhaseHealth;
  modules: ModuleReadiness[];
} {
  const started = Date.now();
  const findings: AuditFinding[] = [];
  const modules: ModuleReadiness[] = report.modules.map((module) => {
    const evidence = emptyEpacEvidence();
    const evidencePaths: EvidencePathMap = {};

    for (const dim of module.dimensions) {
      const epacKey = KIND_TO_EPAC[dim.dimension];
      if (!epacKey) continue;
      const trusted = dim.present && isTrusted(dim.confidence);
      evidence[epacKey] = trusted;
      evidencePaths[epacKey] = dim.items.map((item) => item.path).slice(0, 20);
    }

    const completionPct = module.verifiedCompletionPct;
    const status = deriveCompletionStatus(completionPct);
    const remainingWork = module.dimensions
      .filter((d) => !d.present || !isTrusted(d.confidence))
      .map((d) => `${module.moduleId}: missing trusted ${d.dimension}`);

    if (module.matchedRoots.length === 0 && completionPct === 0) {
      findings.push({
        phase: "modules",
        code: "module_unresolved",
        severity: "error",
        message: `Module ${module.moduleId} has no semantic implementation roots`,
        rootCause: "Alias resolution found no lib/repository/component evidence",
        entityId: module.moduleId,
      });
    }

    return {
      id: module.moduleId,
      name: module.name,
      domainId: "",
      dimensions: module.dimensions.map((d) => ({
        dimension: d.dimension,
        present: d.present && isTrusted(d.confidence),
        paths: d.items.map((i) => i.path),
      })),
      evidence,
      evidencePaths,
      completionPct,
      confidencePct: module.confidencePct,
      verifiedCompletionPct: module.verifiedCompletionPct,
      aliases: module.aliases,
      matchedRoots: module.matchedRoots,
      status,
      remainingWork,
      findings: [],
    };
  });

  // Restore domain ids from module id map if present on evidence report — filled by engine caller
  const scorePct = averagePct(modules.map((m) => m.verifiedCompletionPct));

  return {
    modules,
    phase: {
      phase: "modules",
      label: "Module Readiness Audit",
      ok: modules.length > 0,
      scorePct,
      findings,
      metrics: {
        modulesAudited: modules.length,
        complete: modules.filter((m) => m.status === "complete").length,
        partial: modules.filter((m) => m.status === "partial").length,
        missing: modules.filter((m) => m.status === "missing").length,
        avgConfidence: averagePct(modules.map((m) => m.confidencePct)),
        resolvedRoots: modules.filter((m) => m.matchedRoots.length > 0).length,
      },
      durationMs: Date.now() - started,
    },
  };
}

/** @deprecated use auditModulesFromEvidence */
export function auditModules(
  _extraction: unknown,
  _cwd?: string,
): { phase: PhaseHealth; modules: ModuleReadiness[] } {
  throw new Error("auditModules requires Evidence Engine v2 — call auditModulesFromEvidence");
}
