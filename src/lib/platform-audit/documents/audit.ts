/**
 * EPAC Phase 1 — Documentation Audit.
 */
import { parseDocumentation } from "@/lib/platform-audit/parser";
import { loadEpacDocuments } from "@/lib/platform-audit/documents";
import type { AuditFinding, DocumentExtraction, PhaseHealth } from "@/lib/platform-audit/types";
import { averagePct } from "@/lib/platform-audit/types";

export function auditDocumentation(cwd = process.cwd()): {
  phase: PhaseHealth;
  extraction: DocumentExtraction;
} {
  const started = Date.now();
  const docs = loadEpacDocuments(cwd);
  const extraction = parseDocumentation(cwd);
  const findings: AuditFinding[] = [];

  for (const doc of docs) {
    if (!doc.present) {
      findings.push({
        phase: "documentation",
        code: "missing_governance_document",
        severity: doc.id === "PROJECT_BIBLE" ? "blocker" : "error",
        message: `Missing governance document: ${doc.id}.md`,
        rootCause: `docs/${doc.id}.md does not exist on disk`,
        evidencePaths: [doc.path],
      });
    }
  }

  if (extraction.domains.length === 0) {
    findings.push({
      phase: "documentation",
      code: "no_domains_extracted",
      severity: "blocker",
      message: "No domains extracted from PROJECT_BIBLE",
      rootCause: "EPBSE domain extraction returned empty set",
    });
  }
  if (extraction.modules.length === 0) {
    findings.push({
      phase: "documentation",
      code: "no_modules_extracted",
      severity: "blocker",
      message: "No modules extracted from PROJECT_BIBLE",
      rootCause: "EPBSE module extraction returned empty set",
    });
  }
  if (extraction.capabilities.length === 0) {
    findings.push({
      phase: "documentation",
      code: "no_capabilities_extracted",
      severity: "error",
      message: "No capabilities extracted from PROJECT_BIBLE",
      rootCause: "EPBSE capability extraction returned empty set",
    });
  }

  const presentCount = docs.filter((doc) => doc.present).length;
  const docCoverage = Number(((presentCount / docs.length) * 100).toFixed(2));
  const entityScores = [
    extraction.domains.length > 0 ? 100 : 0,
    extraction.modules.length > 0 ? 100 : 0,
    extraction.features.length > 0 ? 100 : 0,
    extraction.capabilities.length > 0 ? 100 : 0,
  ];
  const scorePct = averagePct([docCoverage, ...entityScores]);

  return {
    extraction,
    phase: {
      phase: "documentation",
      label: "Documentation Audit",
      ok: findings.every((finding) => finding.severity !== "blocker"),
      scorePct,
      findings,
      metrics: {
        documentsPresent: presentCount,
        documentsExpected: docs.length,
        domains: extraction.domains.length,
        modules: extraction.modules.length,
        features: extraction.features.length,
        capabilities: extraction.capabilities.length,
        requirements: extraction.requirements.length,
        businessRules: extraction.businessRules.length,
        architectureRules: extraction.architectureRules.length,
        workflowRules: extraction.workflowRules.length,
        securityRules: extraction.securityRules.length,
        localizationRules: extraction.localizationRules.length,
      },
      durationMs: Date.now() - started,
    },
  };
}
