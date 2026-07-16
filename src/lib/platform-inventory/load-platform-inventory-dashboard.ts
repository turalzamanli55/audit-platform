import "server-only";

import {
  loadLatestPlatformInventoryReport,
  platformInventoryEngine,
} from "@/lib/platform-inventory/engine";
import { buildPlatformInventoryDashboard } from "@/lib/platform-inventory/dashboard";

export function loadPlatformInventoryDashboard() {
  const cwd = process.cwd();
  const existing = loadLatestPlatformInventoryReport(cwd);
  if (existing) {
    return buildPlatformInventoryDashboard(existing, "snapshot");
  }
  const report = platformInventoryEngine.run({
    cwd,
    preferSnapshot: true,
    persist: true,
  });
  return buildPlatformInventoryDashboard(report, "live");
}
