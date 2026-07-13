import { capabilityRegistryEngine } from "@/lib/capability-registry/engine";

export type PlatformReadinessDashboardModel = ReturnType<
  typeof capabilityRegistryEngine.buildDashboardModel
>;

export function loadPlatformReadinessDashboard(): PlatformReadinessDashboardModel {
  return capabilityRegistryEngine.buildDashboardModel();
}
