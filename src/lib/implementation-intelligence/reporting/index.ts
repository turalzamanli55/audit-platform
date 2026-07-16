/**
 * EIIE reporting formatters.
 */
import type { ImplementationIntelligenceReport } from "@/lib/implementation-intelligence/types";

export function formatContractsReport(report: ImplementationIntelligenceReport): string {
  return [
    "# Implementation Contract Report",
    "",
    `Generated: ${report.generatedAt}`,
    `Contracts: ${report.metrics.contracts}`,
    `Satisfied: ${report.metrics.satisfied}`,
    `Certified: ${report.metrics.certified}`,
    `Platform Completion: ${report.platformCompletionPct}%`,
    "",
    ...report.contracts.map((c) =>
      [
        `## ${c.capabilityName} (${c.capabilityId})`,
        `- Module: ${c.moduleId}`,
        `- Coverage: ${c.coveragePct}%`,
        `- Satisfied: ${c.contractSatisfied}`,
        `- Certified: ${c.certified}`,
        `- Weight: ${c.weight}`,
        `- Bible: ${c.bibleSection}`,
        `- Clauses: ${c.clauses
          .filter((cl) => cl.required)
          .map((cl) => `${cl.id}:${cl.status}`)
          .join(", ")}`,
        "",
      ].join("\n"),
    ),
  ].join("\n");
}

export function formatGapsReport(report: ImplementationIntelligenceReport): string {
  return [
    "# Implementation Gap Report",
    "",
    `Gaps: ${report.gaps.length}`,
    "",
    ...report.gaps.slice(0, 150).map(
      (g) =>
        `- [${g.severity}] ${g.capabilityId}.${g.clause} status=${g.status} missing=[${g.missing.join(", ")}] trace=${g.bibleTrace}`,
    ),
  ].join("\n");
}

export function formatRepositoryReport(report: ImplementationIntelligenceReport): string {
  const r = report.repository;
  return [
    "# Repository Intelligence Report",
    "",
    `- files: ${r.files}`,
    `- classes/methods scanned: ${r.classes}/${r.existingMethods.length}`,
    `- missingMethods: ${r.missingMethods.length}`,
    `- deprecatedMethods: ${r.deprecatedMethods.length}`,
    `- unusedMethods: ${r.unusedMethods.length}`,
    "",
    "## Missing",
    ...r.missingMethods.slice(0, 40).map((m) => `- ${m}`),
  ].join("\n");
}

export function formatServerActionReport(report: ImplementationIntelligenceReport): string {
  const s = report.serverActions;
  return [
    "# Server Action Intelligence Report",
    "",
    `- useServerFiles: ${s.useServerFiles}`,
    `- exportedActions: ${s.exportedActions}`,
    `- registryHits: ${s.registryHits}`,
    `- missingActions (capabilities): ${s.missingActions.length}`,
    "",
    ...s.missingActions.slice(0, 40).map((m) => `- ${m}`),
  ].join("\n");
}

export function formatWorkflowReport(report: ImplementationIntelligenceReport): string {
  const w = report.workflow;
  return [
    "# Workflow Intelligence Report",
    "",
    `- engines: ${w.engines}`,
    `- stateSignals: ${w.stateSignals}`,
    `- historySignals: ${w.historySignals}`,
    `- notificationSignals: ${w.notificationSignals}`,
    `- missing workflow capabilities: ${w.missing.length}`,
    "",
    ...w.missing.slice(0, 40).map((m) => `- ${m}`),
  ].join("\n");
}

export function formatPermissionReport(report: ImplementationIntelligenceReport): string {
  const p = report.permissions;
  return [
    "# Permission Intelligence Report",
    "",
    `- definitions: ${p.definitions}`,
    `- roleMappings: ${p.roleMappings}`,
    `- isolationSignals: ${p.isolationSignals}`,
    `- missing: ${p.missing.length}`,
    "",
    ...p.missing.slice(0, 40).map((m) => `- ${m}`),
  ].join("\n");
}

export function formatDatabaseReport(report: ImplementationIntelligenceReport): string {
  const d = report.database;
  return [
    "# Database Intelligence Report",
    "",
    `- migrations: ${d.migrations}`,
    `- tablesReferenced: ${d.tablesReferenced}`,
    `- policySignals: ${d.policySignals}`,
    `- missing: ${d.missing.length}`,
    "",
    ...d.missing.slice(0, 40).map((m) => `- ${m}`),
  ].join("\n");
}

export function formatTestingReport(report: ImplementationIntelligenceReport): string {
  const t = report.testing;
  return [
    "# Testing Intelligence Report",
    "",
    `- unitTests: ${t.unitTests}`,
    `- integrationTests: ${t.integrationTests}`,
    `- repositoryTests: ${t.repositoryTests}`,
    `- workflowTests: ${t.workflowTests}`,
    `- permissionTests: ${t.permissionTests}`,
    `- missing test capabilities: ${t.missing.length}`,
    "",
    ...t.missing.slice(0, 40).map((m) => `- ${m}`),
  ].join("\n");
}

export function formatRepairPlanReport(report: ImplementationIntelligenceReport): string {
  return [
    "# Repair Plan",
    "",
    `Items: ${report.repairPlan.items.length}`,
    "",
    "## Critical path",
    ...report.repairPlan.criticalPath.map((id) => `- ${id}`),
    "",
    "## Ordered repairs",
    ...report.repairPlan.items.slice(0, 80).map(
      (item) =>
        `${item.order}. [${item.businessValue}] ${item.capabilityId}.${item.clause} — ${item.action}`,
    ),
  ].join("\n");
}

export function formatCertificationReport(report: ImplementationIntelligenceReport): string {
  const c = report.certification;
  return [
    "# Implementation Certification Report",
    "",
    `Level: ${c.level}`,
    `Enterprise Certified: ${c.enterpriseCertified ? "YES" : "NO"}`,
    `Certified contracts: ${c.contractsCertified}/${c.contractsTotal}`,
    `Satisfied contracts: ${c.contractsSatisfied}/${c.contractsTotal}`,
    `Coverage: ${c.coveragePct}%`,
    "",
    "## Explainability",
    ...c.explainability.map((line) => `- ${line}`),
  ].join("\n");
}

export function formatAiReadinessReport(report: ImplementationIntelligenceReport): string {
  return [
    "# AI Readiness Report",
    "",
    `Schema: ${report.aiReadiness.schema}`,
    `Contracts packaged: ${report.aiReadiness.contracts.length}`,
    `Repair steps: ${report.aiReadiness.repairPlan.items.length}`,
    "",
    "## Notes",
    ...report.aiReadiness.notes.map((n) => `- ${n}`),
    "",
    "## Sample agent payloads (first 5)",
    ...report.aiReadiness.contracts.slice(0, 5).map(
      (payload) =>
        `- ${payload.capabilityId}: satisfied=[${payload.satisfiedClauses.join(",")}] missing=[${payload.missingClauses.join(",")}] repairs=${payload.repairSteps.length}`,
    ),
  ].join("\n");
}

export function buildAllImplementationReports(report: ImplementationIntelligenceReport) {
  return {
    contracts: formatContractsReport(report),
    gaps: formatGapsReport(report),
    repositories: formatRepositoryReport(report),
    serverActions: formatServerActionReport(report),
    workflows: formatWorkflowReport(report),
    permissions: formatPermissionReport(report),
    database: formatDatabaseReport(report),
    testing: formatTestingReport(report),
    repairPlan: formatRepairPlanReport(report),
    certification: formatCertificationReport(report),
    aiReadiness: formatAiReadinessReport(report),
  };
}
