import { devopsEngine } from "@/lib/devops/engine";
import { loadLatestSnapshot } from "@/lib/devops/history";
import { buildHealthMonitoringReport } from "@/lib/devops/history";
import { ciCdBlueprintStatus } from "@/lib/devops/ci/generators";
import type { DevOpsDashboardModel } from "@/lib/devops/types";
import type {
  HealthMonitoringReport,
  PersistedDevOpsSnapshot,
} from "@/lib/devops/history/types";

export type DevOpsUiDashboardModel = {
  generatedAt: string;
  source: "snapshot" | "live";
  ok: boolean;
  dashboard: DevOpsDashboardModel;
  sqlFoundationCoveragePct: number;
  sqlFoundationOk: boolean;
  ciStatus: ReturnType<typeof ciCdBlueprintStatus>;
  cdReady: boolean;
  monitoring: HealthMonitoringReport;
  snapshot: PersistedDevOpsSnapshot | null;
};

/**
 * Load dashboard for UI — prefer persisted snapshot for fast page loads.
 * Falls back to live lightweight validation (no build/tests) when no snapshot.
 */
export function loadDevOpsDashboard(cwd = process.cwd()): DevOpsUiDashboardModel {
  const snapshot = loadLatestSnapshot(cwd);
  const sql = devopsEngine.getSqlFoundationHealth(cwd);
  const ciStatus = ciCdBlueprintStatus(cwd);
  const monitoring = buildHealthMonitoringReport(cwd);

  if (snapshot) {
    return {
      generatedAt: snapshot.generatedAt,
      source: "snapshot",
      ok: snapshot.ok,
      dashboard: snapshot.dashboard,
      sqlFoundationCoveragePct: sql.coverage.coveragePct,
      sqlFoundationOk: sql.dryRunOk,
      ciStatus,
      cdReady: ciStatus.every((entry) => entry.present),
      monitoring,
      snapshot,
    };
  }

  const { ok, dashboard } = devopsEngine.validateRelease({
    cwd,
    persist: true,
    runBuild: false,
    runUnitTests: false,
    runIntegrationTests: false,
  });

  return {
    generatedAt: dashboard.generatedAt,
    source: "live",
    ok,
    dashboard,
    sqlFoundationCoveragePct: sql.coverage.coveragePct,
    sqlFoundationOk: sql.dryRunOk,
    ciStatus,
    cdReady: ciStatus.every((entry) => entry.present),
    monitoring: buildHealthMonitoringReport(cwd),
    snapshot: loadLatestSnapshot(cwd),
  };
}
