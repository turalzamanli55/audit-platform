/**
 * Fast dashboard loader for Platform Certification UI.
 */
import {
  loadLatestAuditReport,
  platformAuditEngine,
} from "@/lib/platform-audit/engine";
import { buildPlatformAuditDashboard } from "@/lib/platform-audit/dashboard";
import type { PlatformAuditDashboardModel } from "@/lib/platform-audit/types";

export function loadPlatformAuditDashboard(cwd = process.cwd()): PlatformAuditDashboardModel {
  const existing = loadLatestAuditReport(cwd);
  if (existing) {
    return buildPlatformAuditDashboard(existing, "snapshot");
  }
  return platformAuditEngine.getDashboard({ cwd, preferSnapshot: false, persist: true });
}
