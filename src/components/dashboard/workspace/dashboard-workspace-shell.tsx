"use client";

import { DashboardCommandCenter } from "../command-center/dashboard-command-center";
import type { DashboardWorkspaceViewModel } from "@/lib/dashboard/load-dashboard-workspace";

type DashboardWorkspaceShellProps = {
  model: DashboardWorkspaceViewModel;
};

export function DashboardWorkspaceShell({ model }: DashboardWorkspaceShellProps) {
  return <DashboardCommandCenter model={model} />;
}
