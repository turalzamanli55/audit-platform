/**
 * EPAC Engine v2 — orchestrates audits with Intelligent Evidence Engine.
 */
import { auditDocumentation } from "@/lib/platform-audit/documents/audit";
import { auditArchitecture } from "@/lib/platform-audit/architecture";
import { auditDatabase } from "@/lib/platform-audit/database";
import { auditBackend } from "@/lib/platform-audit/backend";
import { auditFrontend } from "@/lib/platform-audit/frontend";
import { auditLocalization } from "@/lib/platform-audit/localization";
import { auditAiFromEvidence } from "@/lib/platform-audit/ai";
import { auditDevops } from "@/lib/platform-audit/devops";
import { auditSecurity } from "@/lib/platform-audit/security";
import { auditTesting } from "@/lib/platform-audit/testing";
import { auditModulesFromEvidence } from "@/lib/platform-audit/modules";
import { auditCapabilitiesFromEvidence } from "@/lib/platform-audit/capabilities";
import { auditTechnicalDebtFromEvidence } from "@/lib/platform-audit/technical-debt";
import { buildRoadmap } from "@/lib/platform-audit/roadmap";
import { certifyPlatform, summarizeRemainingWork } from "@/lib/platform-audit/certification";
import { auditPerformance } from "@/lib/platform-audit/performance";
import { buildPlatformAuditDashboard } from "@/lib/platform-audit/dashboard";
import { buildAllReports } from "@/lib/platform-audit/reporting";
import { runEvidenceEngine } from "@/lib/platform-audit/evidence-engine/engine";
import type { PlatformAuditReport } from "@/lib/platform-audit/types";
import { averagePct } from "@/lib/platform-audit/types";
import { mkdirSync, writeFileSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export type RunPlatformAuditOptions = {
  cwd?: string;
  persist?: boolean;
};

export function runPlatformAudit(options: RunPlatformAuditOptions = {}): PlatformAuditReport {
  const cwd = options.cwd ?? process.cwd();

  const documentation = auditDocumentation(cwd);
  const evidence = runEvidenceEngine({ extraction: documentation.extraction, cwd });

  const architecture = auditArchitecture(cwd);
  const database = auditDatabase(cwd);
  const backend = auditBackend(cwd);
  const frontend = auditFrontend(cwd);
  const localization = auditLocalization(cwd);
  const ai = auditAiFromEvidence(evidence);
  const devops = auditDevops(cwd);
  const security = auditSecurity(cwd);
  const testing = auditTesting(cwd);
  const modules = auditModulesFromEvidence(evidence);
  const domainByModule = new Map(
    documentation.extraction.modules.map((m) => [m.id, m.domainId] as const),
  );
  for (const module of modules.modules) {
    module.domainId = domainByModule.get(module.id) ?? module.domainId;
  }
  const capabilities = auditCapabilitiesFromEvidence(evidence);
  const capDomain = new Map(
    documentation.extraction.capabilities.map((c) => [c.id, c.moduleId] as const),
  );
  void capDomain;
  const performance = auditPerformance(cwd);
  const debt = auditTechnicalDebtFromEvidence(evidence);
  const roadmap = buildRoadmap(modules.modules, capabilities.capabilities);

  const earlyPhases = [
    documentation.phase,
    architecture,
    database,
    backend,
    frontend,
    localization,
    ai,
    devops,
    security,
    testing,
    modules.phase,
    capabilities.phase,
    debt.phase,
    roadmap.phase,
    performance,
  ];

  const verifiedCompletionPct = evidence.averages.verifiedCompletionPct;
  const evidenceConfidencePct = averagePct([
    evidence.averages.moduleConfidencePct,
    evidence.averages.capabilityConfidencePct,
  ]);

  // Overall completion = verified evidence only (no weak/indirect inflation)
  const overallCompletionPct = averagePct([
    modules.phase.scorePct,
    capabilities.phase.scorePct,
    documentation.phase.scorePct,
    architecture.scorePct,
    database.scorePct,
    backend.scorePct,
    frontend.scorePct,
    localization.scorePct,
    ai.scorePct,
    devops.scorePct,
    security.scorePct,
    testing.scorePct,
    verifiedCompletionPct,
  ]);

  const allFindings = earlyPhases.flatMap((phase) => phase.findings);
  const blockerCount = allFindings.filter((finding) => finding.severity === "blocker").length;
  const certification = certifyPlatform({
    overallCompletionPct,
    verifiedCompletionPct,
    evidenceConfidencePct,
    phases: earlyPhases,
    blockerCount,
  });

  const phases = [...earlyPhases, certification.phase];
  const findings = [...allFindings, ...certification.findings];

  const report: PlatformAuditReport = {
    generatedAt: new Date().toISOString(),
    overallCompletionPct,
    verifiedCompletionPct,
    evidenceConfidencePct,
    certification: certification.certification,
    enterpriseCertified: certification.enterpriseCertified,
    phases,
    documentation: documentation.extraction,
    modules: modules.modules,
    capabilities: capabilities.capabilities,
    technicalDebt: debt.items,
    falsePositives: evidence.falsePositives,
    evidenceResolution: {
      symbolsScanned: evidence.symbolsScanned,
      filesScanned: evidence.filesScanned,
      importEdges: evidence.importEdges,
      moduleConfidencePct: evidence.averages.moduleConfidencePct,
      capabilityConfidencePct: evidence.averages.capabilityConfidencePct,
      verifiedCompletionPct: evidence.averages.verifiedCompletionPct,
      evidenceCoveragePct: evidence.averages.evidenceCoveragePct,
      falsePositiveCount: evidence.averages.falsePositiveCount,
      aiAreasPresent: evidence.aiAreas.filter((a) => a.present).length,
      aiAreasExpected: evidence.aiAreas.length,
      graphNodes: evidence.graph.nodes.length,
      graphEdges: evidence.graph.edges.length,
    },
    roadmap: roadmap.roadmap,
    findings,
    remainingWork: [],
    health: {
      overall: overallCompletionPct,
      architecture: architecture.scorePct,
      database: database.scorePct,
      backend: backend.scorePct,
      frontend: frontend.scorePct,
      ai: ai.scorePct,
      localization: localization.scorePct,
      security: security.scorePct,
      testing: testing.scorePct,
      devops: devops.scorePct,
      technicalDebt: debt.phase.scorePct,
      moduleReadiness: modules.phase.scorePct,
      capabilityCoverage: capabilities.phase.scorePct,
      documentationCoverage: documentation.phase.scorePct,
      evidenceConfidence: evidenceConfidencePct,
      verifiedCompletion: verifiedCompletionPct,
    },
  };

  report.remainingWork = summarizeRemainingWork(report);

  if (options.persist !== false) {
    persistAuditReport(report, cwd, evidence);
  }

  return report;
}

export function persistAuditReport(
  report: PlatformAuditReport,
  cwd = process.cwd(),
  evidence?: ReturnType<typeof runEvidenceEngine>,
) {
  const root = join(cwd, "src", "lib", "platform-audit", "data");
  const snapshots = join(root, "snapshots");
  const reports = join(root, "reports");
  mkdirSync(snapshots, { recursive: true });
  mkdirSync(reports, { recursive: true });

  writeFileSync(join(snapshots, "latest.json"), JSON.stringify(report, null, 2), "utf8");
  writeFileSync(
    join(snapshots, `epac_${Date.now()}.json`),
    JSON.stringify(
      {
        generatedAt: report.generatedAt,
        overallCompletionPct: report.overallCompletionPct,
        verifiedCompletionPct: report.verifiedCompletionPct,
        evidenceConfidencePct: report.evidenceConfidencePct,
        certification: report.certification,
        enterpriseCertified: report.enterpriseCertified,
        health: report.health,
        evidenceResolution: report.evidenceResolution,
      },
      null,
      2,
    ),
    "utf8",
  );

  if (evidence) {
    writeFileSync(join(snapshots, "evidence-latest.json"), JSON.stringify(evidence, null, 2), "utf8");
  }

  const formatted = buildAllReports(report);
  writeFileSync(join(reports, "platform-audit.md"), formatted.platformAudit, "utf8");
  writeFileSync(join(reports, "module-readiness.md"), formatted.moduleReadiness, "utf8");
  writeFileSync(join(reports, "capability-coverage.md"), formatted.capabilityCoverage, "utf8");
  writeFileSync(join(reports, "architecture.md"), formatted.architecture, "utf8");
  writeFileSync(join(reports, "database.md"), formatted.database, "utf8");
  writeFileSync(join(reports, "ai.md"), formatted.ai, "utf8");
  writeFileSync(join(reports, "security.md"), formatted.security, "utf8");
  writeFileSync(join(reports, "localization.md"), formatted.localization, "utf8");
  writeFileSync(join(reports, "technical-debt.md"), formatted.technicalDebt, "utf8");
  writeFileSync(join(reports, "evidence-resolution.md"), formatted.evidenceResolution, "utf8");
  writeFileSync(join(reports, "false-positives.md"), formatted.falsePositives, "utf8");
  writeFileSync(join(reports, "confidence.md"), formatted.confidence, "utf8");
  writeFileSync(join(reports, "certification.md"), formatted.certification, "utf8");
  writeFileSync(join(reports, "module-resolution.md"), formatted.moduleResolution, "utf8");
  writeFileSync(join(reports, "capability-resolution.md"), formatted.capabilityResolution, "utf8");
  writeFileSync(join(reports, "ai-resolution.md"), formatted.aiResolution, "utf8");
}

export function loadLatestAuditReport(cwd = process.cwd()): PlatformAuditReport | null {
  const path = join(cwd, "src", "lib", "platform-audit", "data", "snapshots", "latest.json");
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, "utf8")) as PlatformAuditReport;
}

export class PlatformAuditEngine {
  run(options: RunPlatformAuditOptions = {}) {
    return runPlatformAudit(options);
  }

  getDashboard(options: RunPlatformAuditOptions & { preferSnapshot?: boolean } = {}) {
    const cwd = options.cwd ?? process.cwd();
    if (options.preferSnapshot !== false) {
      const existing = loadLatestAuditReport(cwd);
      if (existing) {
        return buildPlatformAuditDashboard(existing, "snapshot");
      }
    }
    const report = this.run({ ...options, persist: options.persist ?? true });
    return buildPlatformAuditDashboard(report, "live");
  }
}

export const platformAuditEngine = new PlatformAuditEngine();
