import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { IconCheck } from "@/components/ui/icons";
import type { DashboardWorkspaceLabels } from "@/i18n/dashboard-workspace-types";
import { WorkspacePanel, WorkspaceSection } from "./workspace-section";

type WorkspaceTasksProps = {
  labels: DashboardWorkspaceLabels["tasks"];
};

export function WorkspaceTasks({ labels }: WorkspaceTasksProps) {
  const items = labels.items;

  return (
    <WorkspaceSection title={labels.title} description={labels.description}>
      {items.length === 0 ? (
        <EmptyState title={labels.emptyTitle} description={labels.emptyDescription} icon={<IconCheck />} />
      ) : (
        <WorkspacePanel className="space-y-3 p-0">
          <ul className="divide-y divide-border/50">
            {items.map((task) => (
              <li key={task.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div className="min-w-0 space-y-1">
                  <p className="font-medium text-foreground">{task.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {labels.statusOpen}: {task.status}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={task.priorityVariant}>{task.priority}</Badge>
                  <Badge variant={task.statusVariant}>{task.status}</Badge>
                  <span className="text-xs text-muted-foreground">{task.due}</span>
                </div>
              </li>
            ))}
          </ul>
        </WorkspacePanel>
      )}
    </WorkspaceSection>
  );
}
