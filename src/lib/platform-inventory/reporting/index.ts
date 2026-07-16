/**
 * EPIRE reporting — executive markdown reports from aggregated inventory.
 */
import type { PlatformInventoryReport } from "@/lib/platform-inventory/types";

export function buildAllInventoryReports(report: PlatformInventoryReport) {
  return {
    platformInventory: buildPlatformInventoryReport(report),
    domainReadiness: buildDomainReadinessReport(report),
    moduleReadiness: buildModuleReadinessReport(report),
    capabilityInventory: buildCapabilityInventoryReport(report),
    criticalPath: buildCriticalPathReport(report),
    enterpriseReadiness: buildEnterpriseReadinessReport(report),
    ai: buildAiReport(report),
    database: buildDatabaseReport(report),
    security: buildSecurityReport(report),
    devops: buildDevopsReport(report),
    testing: buildTestingReport(report),
    localization: buildLocalizationReport(report),
    releaseReadiness: buildReleaseReadinessReport(report),
  };
}

export function buildPlatformInventoryReport(report: PlatformInventoryReport): string {
  const i = report.inventory;
  const lines = [
    "# Platform Inventory Report",
    "",
    `Generated: ${report.generatedAt}`,
    `Sources: EPBSE=${report.sources.epbse} EPAC=${report.sources.epac} ECIE=${report.sources.ecie} EIIE=${report.sources.eiie}`,
    `Overall Platform Readiness (verified implementation): ${report.overallPlatformReadinessPct}%`,
    `Readiness: ${report.overallReadiness}`,
    `Certification: ${report.overallCertification}`,
    "",
    "## Counts",
    `- Domains: ${i.domains}`,
    `- Modules: ${i.modules}`,
    `- Features: ${i.features}`,
    `- Capabilities: ${i.capabilities}`,
    `- Migrations: ${i.migrations}`,
    `- Repositories: ${i.repositories}`,
    `- Server Actions: ${i.serverActions}`,
    `- Routes: ${i.routes}`,
    `- Components: ${i.components}`,
    `- Permissions: ${i.permissions}`,
    `- Tests: ${i.tests}`,
    `- Locales: ${i.locales}`,
    "",
  ];
  return lines.join("\n");
}

export function buildDomainReadinessReport(report: PlatformInventoryReport): string {
  const lines = [
    "# Domain Readiness Report",
    "",
    `Domains: ${report.domains.length}`,
    "",
  ];
  for (const d of report.domains) {
    lines.push(
      `- ${d.name} (${d.id}): ${d.completionPct}% · ${d.readiness} · modules=${d.moduleIds.length} caps=${d.capabilityCount}`,
    );
  }
  return lines.join("\n");
}

export function buildModuleReadinessReport(report: PlatformInventoryReport): string {
  const lines = [
    "# Module Readiness Report",
    "",
    `Modules: ${report.modules.length}`,
    "",
  ];
  for (const m of report.modules.slice().sort((a, b) => a.completionPct - b.completionPct)) {
    lines.push(`## ${m.name} (${m.id})`);
    lines.push(`- Completion: ${m.completionPct}%`);
    lines.push(`- Readiness: ${m.readiness}`);
    lines.push(`- Certified caps: ${m.certifiedCapabilityIds.length}/${m.capabilityIds.length}`);
    lines.push(`- Implemented dimensions: ${m.implemented.join(", ") || "none"}`);
    lines.push(`- Remaining: ${m.remaining.join("; ") || "none"}`);
    lines.push(
      `- Next required work: ${m.nextRequiredWork.join(", ") || "none"}`,
    );
    lines.push("");
  }
  return lines.join("\n");
}

export function buildCapabilityInventoryReport(report: PlatformInventoryReport): string {
  const lines = [
    "# Capability Inventory Report",
    "",
    `Capabilities: ${report.capabilities.length}`,
    `Required: ${report.metrics.capabilitiesRequired}`,
    `Certified: ${report.metrics.capabilitiesCertified}`,
    `Blocked: ${report.metrics.capabilitiesBlocked}`,
    "",
  ];
  for (const c of report.capabilities) {
    lines.push(
      `- [${c.certified ? "CERT" : c.blocked ? "BLOCK" : c.required ? "REQ" : "OPT"}] ${c.name} (${c.id}) ${c.completionPct}% remaining=[${c.remaining.join(",")}]`,
    );
  }
  return lines.join("\n");
}

export function buildCriticalPathReport(report: PlatformInventoryReport): string {
  const lines = [
    "# Critical Path Report",
    "",
    `Length: ${report.dependency.criticalPath.length}`,
    "",
    "## Critical path",
  ];
  for (const step of report.dependency.criticalPath) {
    lines.push(`- ${step}`);
  }
  lines.push("");
  lines.push("## Modules blocking release (lowest readiness)");
  for (const m of report.modules
    .slice()
    .sort((a, b) => a.completionPct - b.completionPct)
    .slice(0, 15)) {
    lines.push(`- ${m.id}: ${m.completionPct}% (${m.readiness})`);
  }
  return lines.join("\n");
}

export function buildEnterpriseReadinessReport(report: PlatformInventoryReport): string {
  return [
    "# Enterprise Readiness Report",
    "",
    `Overall Platform Readiness: ${report.overallPlatformReadinessPct}%`,
    `Overall Readiness Level: ${report.overallReadiness}`,
    `Certification: ${report.overallCertification}`,
    `Enterprise Certified: ${report.enterpriseCertified ? "YES" : "NO"}`,
    "",
    "## Module readiness distribution",
    `- Prototype: ${report.metrics.modulesPrototype}`,
    `- Alpha: ${report.metrics.modulesAlpha}`,
    `- Beta: ${report.metrics.modulesBeta}`,
    `- Release Candidate: ${report.metrics.modulesReleaseCandidate}`,
    `- Production Ready: ${report.metrics.modulesProductionReady}`,
    `- Enterprise Certified: ${report.metrics.modulesEnterpriseCertified}`,
    "",
    "## Health (EPAC)",
    `- Overall: ${report.health.overall}`,
    `- Architecture: ${report.health.architecture}`,
    `- Database: ${report.health.database}`,
    `- Backend: ${report.health.backend}`,
    `- Frontend: ${report.health.frontend}`,
    `- AI: ${report.health.ai}`,
    `- Security: ${report.health.security}`,
    `- Testing: ${report.health.testing}`,
    `- Localization: ${report.health.localization}`,
    `- DevOps: ${report.health.devops}`,
    `- Documentation: ${report.health.documentation}`,
    "",
    "## Explainability",
    "- Overall readiness % comes only from EIIE verified implementation contracts",
    "- Module/capability readiness consumed from ECIE",
    "- Health consumed from EPAC",
    "- Entity inventory consumed from EPBSE (PROJECT_BIBLE)",
  ].join("\n");
}

function buildAiReport(report: PlatformInventoryReport): string {
  const aiCaps = report.capabilities.filter(
    (c) => c.id.includes("ai") || c.name.toLowerCase().includes("ai"),
  );
  return [
    "# AI Report",
    "",
    `AI-related capabilities: ${aiCaps.length}`,
    `Certified: ${aiCaps.filter((c) => c.certified).length}`,
    `Blocked: ${aiCaps.filter((c) => c.blocked).length}`,
    `Health (EPAC AI): ${report.health.ai}`,
    "",
    ...aiCaps.map(
      (c) => `- ${c.id}: ${c.completionPct}% certified=${c.certified} blocked=${c.blocked}`,
    ),
  ].join("\n");
}

function buildDatabaseReport(report: PlatformInventoryReport): string {
  return [
    "# Database Report",
    "",
    `Migrations inventoried: ${report.inventory.migrations}`,
    `Health (EPAC database): ${report.health.database}`,
    "",
    "## Modules with database dimension gaps",
    ...report.modules
      .filter((m) => {
        const d = m.dimensions.find((x) => x.dimension === "database");
        return d && d.required > 0 && d.completionPct < 100;
      })
      .map((m) => {
        const d = m.dimensions.find((x) => x.dimension === "database")!;
        return `- ${m.id}: ${d.verified}/${d.required} (${d.completionPct}%)`;
      }),
  ].join("\n");
}

function buildSecurityReport(report: PlatformInventoryReport): string {
  return [
    "# Security Report",
    "",
    `Permissions inventoried: ${report.inventory.permissions}`,
    `Health (EPAC security): ${report.health.security}`,
    `Security-dimension gaps: ${
      report.modules.filter((m) => {
        const d = m.dimensions.find((x) => x.dimension === "security");
        return d && d.required > 0 && d.completionPct < 100;
      }).length
    }`,
  ].join("\n");
}

function buildDevopsReport(report: PlatformInventoryReport): string {
  return [
    "# DevOps Report",
    "",
    `Health (EPAC devops): ${report.health.devops}`,
    `DevOps artifacts signal: ${report.inventory.devopsArtifacts}`,
  ].join("\n");
}

function buildTestingReport(report: PlatformInventoryReport): string {
  return [
    "# Testing Report",
    "",
    `Tests inventoried: ${report.inventory.tests}`,
    `Health (EPAC testing): ${report.health.testing}`,
    "",
    "## Modules with test gaps",
    ...report.modules
      .filter((m) => {
        const d = m.dimensions.find((x) => x.dimension === "tests");
        return d && d.required > 0 && d.completionPct < 100;
      })
      .slice(0, 25)
      .map((m) => {
        const d = m.dimensions.find((x) => x.dimension === "tests")!;
        return `- ${m.id}: ${d.verified}/${d.required}`;
      }),
  ].join("\n");
}

function buildLocalizationReport(report: PlatformInventoryReport): string {
  return [
    "# Localization Report",
    "",
    `Locales inventoried: ${report.inventory.locales}`,
    `Health (EPAC localization): ${report.health.localization}`,
  ].join("\n");
}

function buildReleaseReadinessReport(report: PlatformInventoryReport): string {
  return [
    "# Release Readiness Report",
    "",
    `Overall: ${report.overallPlatformReadinessPct}% (${report.overallReadiness})`,
    `Enterprise Certified: ${report.enterpriseCertified ? "YES" : "NO"}`,
    `Critical path length: ${report.metrics.criticalPathLength}`,
    "",
    "## Remaining work (top 20)",
    ...report.remainingWork.slice(0, 20).map((w, i) => `${i + 1}. ${w}`),
  ].join("\n");
}
