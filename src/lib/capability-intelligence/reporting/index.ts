/**
 * ECIE reporting formatters.
 */
import type { CapabilityIntelligenceReport } from "@/lib/capability-intelligence/types";

export function formatCapabilityIntelligenceReport(report: CapabilityIntelligenceReport): string {
  return [
    "# Capability Intelligence Report",
    "",
    `Generated: ${report.generatedAt}`,
    `Platform Completion (required verified only): ${report.platformCompletionPct}%`,
    `Certification: ${report.certification.level}`,
    `Enterprise Certified: ${report.certification.enterpriseCertified ? "YES" : "NO"}`,
    "",
    "## Metrics",
    ...Object.entries(report.metrics).map(([key, value]) => `- ${key}: ${value}`),
    "",
    "## False penalties excluded",
    `- count: ${report.falsePenalties.length}`,
    "",
    "## Lowest required capabilities",
    ...report.capabilities
      .filter((c) => c.countsTowardCompletion)
      .sort((a, b) => a.requiredCompletionPct - b.requiredCompletionPct)
      .slice(0, 30)
      .map(
        (c) =>
          `- ${c.id}: ${c.requiredCompletionPct}% (${c.lifecycle}) weight=${c.weight} missing=[${c.evidence
            .filter((e) => e.required && !e.verified)
            .map((e) => e.kind)
            .join(", ")}]`,
      ),
  ].join("\n");
}

export function formatClassificationReport(report: CapabilityIntelligenceReport): string {
  const byClass = new Map<string, number>();
  for (const capability of report.capabilities) {
    for (const cls of capability.classes) {
      byClass.set(cls, (byClass.get(cls) ?? 0) + 1);
    }
  }
  return [
    "# Capability Classification Report",
    "",
    ...[...byClass.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([cls, count]) => `- ${cls}: ${count}`),
    "",
    "## Per capability",
    ...report.capabilities.map(
      (c) =>
        `- ${c.id}: primary=${c.primaryClass} classes=[${c.classes.join(", ")}] phase=${c.phase} weight=${c.weight}`,
    ),
  ].join("\n");
}

export function formatDependencyIntelligenceReport(
  report: CapabilityIntelligenceReport,
): string {
  return [
    "# Dependency Intelligence Report",
    "",
    `Edges: ${report.dependencies.edges.length}`,
    `Blocked capabilities: ${report.dependencies.blockedCapabilities.length}`,
    "",
    "## Blocked",
    ...report.dependencies.blockedCapabilities.map((id) => {
      const reasons = report.dependencies.blockingReasons[id] ?? [];
      return `- ${id}: ${reasons.join("; ")}`;
    }),
    "",
    "## Critical path",
    ...report.dependencies.criticalPath.map((id) => `- ${id}`),
  ].join("\n");
}

export function formatRoadmapIntelligenceReport(report: CapabilityIntelligenceReport): string {
  return [
    "# Roadmap Intelligence Report",
    "",
    "## Next modules",
    ...report.roadmap.nextModules.map((m) => `- ${m.id}: ${m.reason}`),
    "",
    "## Blocked modules",
    ...report.roadmap.blockedModules.map(
      (m) => `- ${m.id}: blockedBy=[${m.blockedBy.join(", ")}]`,
    ),
    "",
    "## Future modules",
    ...report.roadmap.futureModules.map((m) => `- ${m.id}`),
    "",
    "## Recommended sprint",
    ...report.roadmap.recommendedSprint.map(
      (item) => `- [${item.weight}] ${item.id}: ${item.reason}`,
    ),
    "",
    "## Critical path",
    ...report.roadmap.criticalPath.map((id) => `- ${id}`),
  ].join("\n");
}

export function formatCertificationIntelligenceReport(
  report: CapabilityIntelligenceReport,
): string {
  return [
    "# Certification Intelligence Report",
    "",
    `Level: ${report.certification.level}`,
    `Enterprise Certified: ${report.certification.enterpriseCertified ? "YES" : "NO"}`,
    `Required completion: ${report.certification.requiredCompletionPct}%`,
    `Required capabilities: ${report.certification.requiredSatisfiedCount}/${report.certification.requiredCapabilityCount}`,
    `Optional ignored: ${report.certification.optionalIgnoredCount}`,
    `Future ignored: ${report.certification.futureIgnoredCount}`,
    `Blocked (not penalized): ${report.certification.blockedCount}`,
    "",
    "## Explainability",
    ...report.certification.explainability.map((line) => `- ${line}`),
  ].join("\n");
}

export function buildAllIntelligenceReports(report: CapabilityIntelligenceReport) {
  return {
    intelligence: formatCapabilityIntelligenceReport(report),
    classification: formatClassificationReport(report),
    dependencies: formatDependencyIntelligenceReport(report),
    roadmap: formatRoadmapIntelligenceReport(report),
    certification: formatCertificationIntelligenceReport(report),
  };
}
