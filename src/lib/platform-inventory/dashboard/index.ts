/**
 * EPIRE dashboard model.
 */
import type { PlatformInventoryDashboardModel } from "@/lib/platform-inventory/types";
import type { PlatformInventoryReport } from "@/lib/platform-inventory/types";

export function buildPlatformInventoryDashboard(
  report: PlatformInventoryReport,
  source: "live" | "snapshot",
): PlatformInventoryDashboardModel {
  return {
    generatedAt: report.generatedAt,
    source,
    report,
  };
}

export type { PlatformInventoryDashboardModel };
