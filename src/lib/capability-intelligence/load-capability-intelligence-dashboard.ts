import {
  capabilityIntelligenceEngine,
  loadLatestIntelligenceReport,
} from "@/lib/capability-intelligence/engine";
import { buildCapabilityIntelligenceDashboard } from "@/lib/capability-intelligence/dashboard";
import type { CapabilityIntelligenceDashboardModel } from "@/lib/capability-intelligence/dashboard";

export function loadCapabilityIntelligenceDashboard(
  cwd = process.cwd(),
): CapabilityIntelligenceDashboardModel {
  const existing = loadLatestIntelligenceReport(cwd);
  if (existing) {
    return buildCapabilityIntelligenceDashboard(existing, "snapshot");
  }
  return capabilityIntelligenceEngine.getDashboard({
    cwd,
    preferSnapshot: false,
    persist: true,
  });
}
