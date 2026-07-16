import type { CodebaseEvidenceIndex, SynchronizedCapability } from "@/lib/project-sync/types";

export type TechnicalDebtReport = {
  todos: number;
  fixmes: number;
  placeholders: number;
  missingTests: number;
  missingLocalization: number;
  missingPermissions: number;
  architectureViolations: number;
  findings: Array<{ code: string; message: string; severity: "low" | "medium" | "high" }>;
};

/**
 * Technical Debt Engine — markers + missing evidence detection.
 */
export function analyzeTechnicalDebt(
  index: CodebaseEvidenceIndex,
  capabilities: SynchronizedCapability[],
): TechnicalDebtReport {
  const todos = index.todoMarkers.filter((marker) => /todo/i.test(marker.marker)).length;
  const fixmes = index.todoMarkers.filter((marker) => /fixme/i.test(marker.marker)).length;
  const placeholders = index.placeholderMarkers.length;
  const missingTests = capabilities.filter((capability) => !capability.evidence.tests).length;
  const missingLocalization = capabilities.filter((capability) => !capability.evidence.localization)
    .length;
  const missingPermissions = capabilities.filter((capability) => !capability.evidence.permissions)
    .length;
  const architectureViolations = capabilities.filter(
    (capability) =>
      capability.evidence.ui && !capability.evidence.serverAction && !capability.evidence.repository,
  ).length;

  const findings: TechnicalDebtReport["findings"] = [];
  if (todos > 0) {
    findings.push({
      code: "todo_markers",
      message: `${todos} TODO markers discovered in source.`,
      severity: "medium",
    });
  }
  if (fixmes > 0) {
    findings.push({
      code: "fixme_markers",
      message: `${fixmes} FIXME markers discovered in source.`,
      severity: "high",
    });
  }
  if (placeholders > 0) {
    findings.push({
      code: "placeholder_markers",
      message: `${placeholders} placeholder/mock markers discovered.`,
      severity: "high",
    });
  }
  if (missingTests > 0) {
    findings.push({
      code: "missing_tests",
      message: `${missingTests} capabilities lack test evidence.`,
      severity: "medium",
    });
  }

  return {
    todos,
    fixmes,
    placeholders,
    missingTests,
    missingLocalization,
    missingPermissions,
    architectureViolations,
    findings,
  };
}
