import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { IconCheck } from "@/components/ui/icons";
import type { DashboardWorkspaceLabels } from "@/i18n/dashboard-workspace-types";
import { WorkspacePanel, WorkspaceSection } from "./workspace-section";

type WorkspaceTasksProps = {
  labels: DashboardWorkspaceLabels["tasks"];
  items: DashboardWorkspaceLabels["tasks"]["items"];
};

export function WorkspaceTasks({ labels, items }: WorkspaceTasksProps) {
  return (
    <WorkspaceSection title={labels.title} description={labels.description}>
      {items.length === 0 ? (
        <EmptyState title={labels.emptyTitle} description={labels.emptyDescription} icon={<IconCheck />} />
      ) : (
        <WorkspacePanel className="space-y-3 p-0">
          <ul className="divide-y divide-border/50">
            {items.map((task) => {
              const row = (
                <>
                  <div className="min-w-0 space-y-1">
                    <p className="font-medium text-foreground">{task.title}</p>
                    {task.module ? (
                      <p className="text-sm text-muted-foreground">{task.module}</p>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={task.priorityVariant}>{task.priority}</Badge>
                    <Badge variant={task.statusVariant}>{task.status}</Badge>
                  </div>
                </>
              );

              return (
                <li key={task.id}>
                  {task.href ? (
                    <Link
                      href={task.href}
                      className="flex flex-col gap-3 p-5 transition-colors hover:bg-muted/20 sm:flex-row sm:items-center sm:justify-between sm:p-6"
                    >
                      {row}
                    </Link>
                  ) : (
                    <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                      {row}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </WorkspacePanel>
      )}
    </WorkspaceSection>
  );
}
