import { projectSyncEngine } from "@/lib/project-sync/engine";
import type { PlatformGovernanceDashboardModel } from "@/lib/project-sync/dashboard";

export type PlatformReadinessDashboardModel = PlatformGovernanceDashboardModel;

export function loadPlatformReadinessDashboard(): PlatformReadinessDashboardModel {
  return projectSyncEngine.getDashboard();
}
