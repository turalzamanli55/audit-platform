import type { ImplementationIntelligenceReport } from "@/lib/implementation-intelligence/types";

export type ImplementationIntelligenceDashboardModel = {
  generatedAt: string;
  source: "live" | "snapshot";
  report: ImplementationIntelligenceReport;
};

export function buildImplementationDashboard(
  report: ImplementationIntelligenceReport,
  source: "live" | "snapshot" = "live",
): ImplementationIntelligenceDashboardModel {
  return { generatedAt: report.generatedAt, source, report };
}
