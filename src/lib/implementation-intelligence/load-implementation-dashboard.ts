import {
  implementationIntelligenceEngine,
  loadLatestImplementationReport,
} from "@/lib/implementation-intelligence/engine";
import { buildImplementationDashboard } from "@/lib/implementation-intelligence/dashboard";
import type { ImplementationIntelligenceDashboardModel } from "@/lib/implementation-intelligence/dashboard";

export function loadImplementationIntelligenceDashboard(
  cwd = process.cwd(),
): ImplementationIntelligenceDashboardModel {
  const existing = loadLatestImplementationReport(cwd);
  if (existing) return buildImplementationDashboard(existing, "snapshot");
  return implementationIntelligenceEngine.getDashboard({
    cwd,
    preferSnapshot: false,
    persist: true,
  });
}
