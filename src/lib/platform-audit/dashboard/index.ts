/**
 * EPAC dashboard model builder.
 */
import type { PlatformAuditDashboardModel, PlatformAuditReport } from "@/lib/platform-audit/types";

export function buildPlatformAuditDashboard(
  report: PlatformAuditReport,
  source: "live" | "snapshot" = "live",
): PlatformAuditDashboardModel {
  return {
    generatedAt: report.generatedAt,
    source,
    report,
  };
}
