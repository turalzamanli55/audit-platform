import { WorkspaceError } from "@/components/workspace";
import type { DashboardWorkspaceLabels } from "@/i18n/dashboard-workspace-types";

type DashboardWorkspaceErrorProps = {
  labels: DashboardWorkspaceLabels["error"];
};

export function DashboardWorkspaceError({ labels }: DashboardWorkspaceErrorProps) {
  return (
    <WorkspaceError title={labels.title} description={labels.description} />
  );
}
