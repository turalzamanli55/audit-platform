/**
 * EPAC reporting — markdown report formatters from audit evidence.
 */
import type { PlatformAuditReport } from "@/lib/platform-audit/types";

function section(title: string, lines: string[]): string {
  return [`## ${title}`, "", ...lines, ""].join("\n");
}

export function formatPlatformAuditReport(report: PlatformAuditReport): string {
  return [
    "# Platform Audit Report",
    "",
    `Generated: ${report.generatedAt}`,
    `Overall Completion (verified evidence): ${report.overallCompletionPct}%`,
    `Verified Completion: ${report.verifiedCompletionPct}%`,
    `Evidence Confidence: ${report.evidenceConfidencePct}%`,
    `Certification: ${report.certification}`,
    `Enterprise Certified: ${report.enterpriseCertified ? "YES" : "NO"}`,
    "",
    section(
      "Health",
      Object.entries(report.health).map(([key, value]) => `- ${key}: ${value}%`),
    ),
    section(
      "Evidence Resolution",
      Object.entries(report.evidenceResolution).map(
        ([key, value]) => `- ${key}: ${String(value)}`,
      ),
    ),
    section(
      "Phases",
      report.phases.map(
        (phase) =>
          `- ${phase.label}: ${phase.ok ? "OK" : "FAIL"} · ${phase.scorePct}% · findings=${phase.findings.length}`,
      ),
    ),
    section(
      "Major Gap Root Causes",
      report.findings
        .filter((finding) => finding.severity === "blocker" || finding.severity === "error")
        .slice(0, 40)
        .map((finding) => `- [${finding.severity}] ${finding.code}: ${finding.rootCause}`),
    ),
    section(
      "Remaining Work (first 50)",
      report.remainingWork.slice(0, 50).map((item) => `- ${item}`),
    ),
  ].join("\n");
}

export function formatModuleReadinessReport(report: PlatformAuditReport): string {
  return [
    "# Module Readiness Report",
    "",
    `Modules: ${report.modules.length}`,
    "",
    ...report.modules.map((module) =>
      [
        `## ${module.name} (${module.id})`,
        `- Verified completion: ${module.verifiedCompletionPct}% (${module.status})`,
        `- Confidence: ${module.confidencePct}%`,
        `- Roots: ${module.matchedRoots.join(", ") || "none"}`,
        `- Aliases: ${module.aliases.slice(0, 12).join(", ")}`,
        `- Domain: ${module.domainId}`,
        `- Present trusted dimensions: ${module.dimensions.filter((d) => d.present).map((d) => d.dimension).join(", ") || "none"}`,
        `- Remaining: ${module.remainingWork.slice(0, 10).join("; ") || "none"}`,
        "",
      ].join("\n"),
    ),
  ].join("\n");
}

export function formatCapabilityCoverageReport(report: PlatformAuditReport): string {
  const complete = report.capabilities.filter((c) => c.status === "complete").length;
  const partial = report.capabilities.filter((c) => c.status === "partial").length;
  const missing = report.capabilities.filter((c) => c.status === "missing").length;
  return [
    "# Capability Coverage Report",
    "",
    `Total: ${report.capabilities.length}`,
    `Complete: ${complete}`,
    `Partial: ${partial}`,
    `Missing (0%): ${missing}`,
    `Coverage score: ${report.health.capabilityCoverage}%`,
    "",
    ...report.capabilities
      .slice()
      .sort((a, b) => a.verifiedCompletionPct - b.verifiedCompletionPct)
      .map(
        (capability) =>
          `- ${capability.id}: verified=${capability.verifiedCompletionPct}% confidence=${capability.confidencePct}% (${capability.status})` +
          (capability.rootCause ? ` · rootCause=${capability.rootCause}` : ""),
      ),
  ].join("\n");
}

export function formatEvidenceResolutionReport(report: PlatformAuditReport): string {
  return [
    "# Evidence Resolution Report",
    "",
    ...Object.entries(report.evidenceResolution).map(
      ([key, value]) => `- ${key}: ${String(value)}`,
    ),
    "",
    "## False positives corrected",
    `Count: ${report.falsePositives.length}`,
  ].join("\n");
}

export function formatFalsePositiveReport(report: PlatformAuditReport): string {
  return [
    "# False Positive Report",
    "",
    `Count: ${report.falsePositives.length}`,
    "",
    ...report.falsePositives
      .slice(0, 100)
      .map(
        (item) =>
          `- [${item.severity}] ${item.code}: ${item.rootCause}` +
          (item.correctedBy ? ` · correctedBy=${item.correctedBy}` : ""),
      ),
  ].join("\n");
}

export function formatCapabilityResolutionReport(report: PlatformAuditReport): string {
  return [
    "# Capability Resolution Report",
    "",
    `Capabilities: ${report.capabilities.length}`,
    `Avg verified: ${report.health.verifiedCompletion}%`,
    `Avg confidence: ${report.health.capabilityCoverage}% (phase) / ${report.evidenceResolution.capabilityConfidencePct}% (engine)`,
    "",
    ...report.capabilities
      .slice()
      .sort((a, b) => a.verifiedCompletionPct - b.verifiedCompletionPct)
      .map(
        (c) =>
          `- ${c.id} module=${c.module} verified=${c.verifiedCompletionPct}% confidence=${c.confidencePct}% missing=[${c.missingEvidence.join(", ")}]`,
      ),
  ].join("\n");
}

export function formatModuleResolutionReport(report: PlatformAuditReport): string {
  return [
    "# Module Resolution Report",
    "",
    ...report.modules.map(
      (m) =>
        `- ${m.id} → roots=[${m.matchedRoots.join(", ") || "NONE"}] verified=${m.verifiedCompletionPct}% confidence=${m.confidencePct}%`,
    ),
  ].join("\n");
}

export function formatAiResolutionReport(report: PlatformAuditReport): string {
  const phase = report.phases.find((item) => item.phase === "ai");
  return [
    "# AI Resolution Report",
    "",
    `Score: ${phase?.scorePct ?? 0}%`,
    "Resolved via semantic aliases + AST exports/imports (not exact folder names).",
    "",
    "## Metrics",
    ...Object.entries(phase?.metrics ?? {}).map(([key, value]) => `- ${key}: ${String(value)}`),
    "",
    "## Findings",
    ...(phase?.findings.map((f) => `- [${f.severity}] ${f.code}: ${f.rootCause}`) ?? ["- none"]),
  ].join("\n");
}

export function formatConfidenceReport(report: PlatformAuditReport): string {
  return [
    "# Confidence Report",
    "",
    `- Evidence confidence: ${report.evidenceConfidencePct}%`,
    `- Module confidence: ${report.evidenceResolution.moduleConfidencePct}%`,
    `- Capability confidence: ${report.evidenceResolution.capabilityConfidencePct}%`,
    `- Verified completion: ${report.verifiedCompletionPct}%`,
    "",
    "## Module confidence (lowest first)",
    ...report.modules
      .slice()
      .sort((a, b) => a.confidencePct - b.confidencePct)
      .slice(0, 40)
      .map((m) => `- ${m.id}: ${m.confidencePct}%`),
    "",
    "## Capability confidence (lowest first)",
    ...report.capabilities
      .slice()
      .sort((a, b) => a.confidencePct - b.confidencePct)
      .slice(0, 40)
      .map((c) => `- ${c.id}: ${c.confidencePct}%`),
  ].join("\n");
}

export function formatCertificationReport(report: PlatformAuditReport): string {
  const phase = report.phases.find((item) => item.phase === "production_readiness");
  return [
    "# Certification Report",
    "",
    `Level: ${report.certification}`,
    `Enterprise Certified: ${report.enterpriseCertified ? "YES" : "NO"}`,
    `Overall (composite): ${report.overallCompletionPct}%`,
    `Verified evidence: ${report.verifiedCompletionPct}%`,
    `Evidence confidence: ${report.evidenceConfidencePct}%`,
    "",
    "## Metrics",
    ...Object.entries(phase?.metrics ?? {}).map(([key, value]) => `- ${key}: ${String(value)}`),
    "",
    "## Findings",
    ...(phase?.findings.map((f) => `- [${f.severity}] ${f.code}: ${f.rootCause}`) ?? ["- none"]),
  ].join("\n");
}

export function buildAllReports(report: PlatformAuditReport) {
  return {
    platformAudit: formatPlatformAuditReport(report),
    moduleReadiness: formatModuleReadinessReport(report),
    capabilityCoverage: formatCapabilityCoverageReport(report),
    architecture: formatArchitectureReport(report),
    database: formatDatabaseReport(report),
    ai: formatAiReport(report),
    security: formatSecurityReport(report),
    localization: formatLocalizationReport(report),
    technicalDebt: formatTechnicalDebtReport(report),
    evidenceResolution: formatEvidenceResolutionReport(report),
    falsePositives: formatFalsePositiveReport(report),
    capabilityResolution: formatCapabilityResolutionReport(report),
    moduleResolution: formatModuleResolutionReport(report),
    aiResolution: formatAiResolutionReport(report),
    confidence: formatConfidenceReport(report),
    certification: formatCertificationReport(report),
  };
}

export function formatArchitectureReport(report: PlatformAuditReport): string {
  const phase = report.phases.find((item) => item.phase === "architecture");
  return [
    "# Architecture Report",
    "",
    `Score: ${phase?.scorePct ?? 0}%`,
    `OK: ${phase?.ok ?? false}`,
    "",
    "## Metrics",
    ...Object.entries(phase?.metrics ?? {}).map(([key, value]) => `- ${key}: ${String(value)}`),
    "",
    "## Findings",
    ...(phase?.findings.map((finding) => `- [${finding.severity}] ${finding.code}: ${finding.rootCause}`) ??
      ["- none"]),
  ].join("\n");
}

export function formatDatabaseReport(report: PlatformAuditReport): string {
  const phase = report.phases.find((item) => item.phase === "database");
  return [
    "# Database Report",
    "",
    `Score: ${phase?.scorePct ?? 0}%`,
    `OK: ${phase?.ok ?? false}`,
    "",
    "## Metrics",
    ...Object.entries(phase?.metrics ?? {}).map(([key, value]) => `- ${key}: ${String(value)}`),
    "",
    "## Findings",
    ...(phase?.findings.map((finding) => `- [${finding.severity}] ${finding.code}: ${finding.rootCause}`) ??
      ["- none"]),
  ].join("\n");
}

export function formatAiReport(report: PlatformAuditReport): string {
  const phase = report.phases.find((item) => item.phase === "ai");
  return [
    "# AI Report",
    "",
    `Score: ${phase?.scorePct ?? 0}%`,
    "Note: EPAC audits AI module presence only; it does not implement AI.",
    "",
    "## Metrics",
    ...Object.entries(phase?.metrics ?? {}).map(([key, value]) => `- ${key}: ${String(value)}`),
    "",
    "## Findings",
    ...(phase?.findings.map((finding) => `- [${finding.severity}] ${finding.code}: ${finding.rootCause}`) ??
      ["- none"]),
  ].join("\n");
}

export function formatSecurityReport(report: PlatformAuditReport): string {
  const phase = report.phases.find((item) => item.phase === "security");
  return [
    "# Security Report",
    "",
    `Score: ${phase?.scorePct ?? 0}%`,
    "",
    "## Metrics",
    ...Object.entries(phase?.metrics ?? {}).map(([key, value]) => `- ${key}: ${String(value)}`),
    "",
    "## Findings",
    ...(phase?.findings.map((finding) => `- [${finding.severity}] ${finding.code}: ${finding.rootCause}`) ??
      ["- none"]),
  ].join("\n");
}

export function formatLocalizationReport(report: PlatformAuditReport): string {
  const phase = report.phases.find((item) => item.phase === "localization");
  return [
    "# Localization Report",
    "",
    `Score: ${phase?.scorePct ?? 0}%`,
    "",
    "## Metrics",
    ...Object.entries(phase?.metrics ?? {}).map(([key, value]) => `- ${key}: ${String(value)}`),
    "",
    "## Findings",
    ...(phase?.findings.map((finding) => `- [${finding.severity}] ${finding.code}: ${finding.rootCause}`) ??
      ["- none"]),
  ].join("\n");
}

export function formatTechnicalDebtReport(report: PlatformAuditReport): string {
  return [
    "# Technical Debt Report",
    "",
    `Debt health: ${report.health.technicalDebt}%`,
    `Items: ${report.technicalDebt.length}`,
    "",
    ...report.technicalDebt
      .slice(0, 100)
      .map(
        (item) =>
          `- [${item.debtSeverity ?? item.severity}] ${item.code} (${item.kind}): ${item.rootCause}`,
      ),
  ].join("\n");
}
