import { ErrorState } from "@/components/ui/empty-state";
import type { DashboardWorkspaceLabels } from "@/i18n/dashboard-workspace-types";

type DashboardWorkspaceErrorProps = {
  labels: DashboardWorkspaceLabels["error"];
};

export function DashboardWorkspaceError({ labels }: DashboardWorkspaceErrorProps) {
  return (
    <div className="mx-auto w-full max-w-3xl py-10">
      <ErrorState title={labels.title} description={labels.description} />
    </div>
  );
}
