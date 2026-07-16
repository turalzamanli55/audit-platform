/**
 * Dashboard model builder.
 */
import type { CapabilityIntelligenceReport } from "@/lib/capability-intelligence/types";

export type CapabilityIntelligenceDashboardModel = {
  generatedAt: string;
  source: "live" | "snapshot";
  report: CapabilityIntelligenceReport;
};

export function buildCapabilityIntelligenceDashboard(
  report: CapabilityIntelligenceReport,
  source: "live" | "snapshot" = "live",
): CapabilityIntelligenceDashboardModel {
  return {
    generatedAt: report.generatedAt,
    source,
    report,
  };
}
