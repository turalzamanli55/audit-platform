/**
 * Validation of ECIE report integrity.
 */
import type { CapabilityIntelligenceReport } from "@/lib/capability-intelligence/types";

export function validateIntelligenceReport(report: CapabilityIntelligenceReport): {
  ok: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (report.capabilities.length === 0) {
    errors.push("No capabilities parsed from PROJECT_BIBLE");
  }

  for (const capability of report.capabilities) {
    if (capability.countsTowardCompletion && capability.classes.includes("future")) {
      errors.push(`${capability.id} marked countsTowardCompletion while future`);
    }
    if (capability.blocksCertification && capability.classes.includes("optional")) {
      errors.push(`${capability.id} optional must not block certification`);
    }
    if (capability.falsePenalty && capability.countsTowardCompletion) {
      warnings.push(`${capability.id} false-penalty candidate still counted`);
    }
  }

  if (report.certification.optionalIgnoredCount < 0) {
    errors.push("Invalid optionalIgnoredCount");
  }

  return { ok: errors.length === 0, errors, warnings };
}
