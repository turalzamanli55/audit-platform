/**
 * EPAC Phase 12 — Capability Audit (v2 semantic evidence).
 */
import type { EvidenceEngineReport } from "@/lib/platform-audit/evidence-engine/types";
import { isTrusted } from "@/lib/platform-audit/evidence-engine/scoring";
import type {
  AuditFinding,
  CapabilityCoverage,
  EpacEvidenceDimension,
  EvidencePathMap,
  PhaseHealth,
} from "@/lib/platform-audit/types";
import {
  deriveCompletionStatus,
  emptyEpacEvidence,
  EPAC_EVIDENCE_DIMENSIONS,
  averagePct,
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

export function auditCapabilitiesFromEvidence(report: EvidenceEngineReport): {
  phase: PhaseHealth;
  capabilities: CapabilityCoverage[];
} {
  const started = Date.now();
  const findings: AuditFinding[] = [];

  const capabilities: CapabilityCoverage[] = report.capabilities.map((capability) => {
    const evidence = emptyEpacEvidence();
    const evidencePaths: EvidencePathMap = {};

    for (const dim of capability.dimensions) {
      const epacKey = KIND_TO_EPAC[dim.dimension];
      if (!epacKey) continue;
      const trusted = dim.present && isTrusted(dim.confidence);
      evidence[epacKey] = trusted;
      evidencePaths[epacKey] = dim.items.map((item) => item.path).slice(0, 20);
    }

    const completionPct = capability.verifiedCompletionPct;
    const status = deriveCompletionStatus(completionPct);
    const missingEvidence = EPAC_EVIDENCE_DIMENSIONS.filter((dimension) => !evidence[dimension]);

    if (completionPct === 0) {
      findings.push({
        phase: "capabilities",
        code: "capability_zero_verified_evidence",
        severity: "error",
        message: `Capability ${capability.capabilityId} verified completion=0%`,
        rootCause: capability.rootCause ?? "No verified/strong evidence",
        entityId: capability.capabilityId,
      });
    }

    return {
      id: capability.capabilityId,
      name: capability.name,
      domain: "",
      module: capability.moduleId,
      feature: capability.featureId,
      evidence,
      evidencePaths,
      completionPct,
      confidencePct: capability.confidencePct,
      verifiedCompletionPct: capability.verifiedCompletionPct,
      status,
      missingEvidence,
      rootCause: capability.rootCause,
    };
  });

  return {
    capabilities,
    phase: {
      phase: "capabilities",
      label: "Capability Audit",
      ok: capabilities.length > 0,
      scorePct: averagePct(capabilities.map((c) => c.verifiedCompletionPct)),
      findings: findings.slice(0, 200),
      metrics: {
        capabilitiesAudited: capabilities.length,
        complete: capabilities.filter((c) => c.status === "complete").length,
        partial: capabilities.filter((c) => c.status === "partial").length,
        missing: capabilities.filter((c) => c.status === "missing").length,
        avgConfidence: averagePct(capabilities.map((c) => c.confidencePct)),
        zeroVerified: capabilities.filter((c) => c.verifiedCompletionPct === 0).length,
      },
      durationMs: Date.now() - started,
    },
  };
}

export function auditCapabilities(_cwd?: string): {
  phase: PhaseHealth;
  capabilities: CapabilityCoverage[];
} {
  throw new Error("auditCapabilities requires Evidence Engine v2 — call auditCapabilitiesFromEvidence");
}
