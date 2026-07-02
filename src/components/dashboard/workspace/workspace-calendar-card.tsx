import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { IconCalendar } from "@/components/ui/icons";
import type { DashboardWorkspaceLabels } from "@/i18n/dashboard-workspace-types";
import { WorkspacePanel } from "./workspace-section";

type WorkspaceCalendarCardProps = {
  labels: DashboardWorkspaceLabels["calendar"];
  items: DashboardWorkspaceLabels["calendar"]["items"];
};

export function WorkspaceCalendarCard({ labels, items }: WorkspaceCalendarCardProps) {
  return (
    <WorkspacePanel>
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <IconCalendar />
        </span>
        <div>
          <h3 className="font-semibold tracking-tight">{labels.title}</h3>
          <p className="text-sm text-muted-foreground">{labels.description}</p>
        </div>
      </div>

      {items.length === 0 ? (
        <EmptyState title={labels.emptyTitle} className="py-10" />
      ) : (
        <div className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {labels.upcoming}
          </p>
          <ul className="space-y-2">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-2xl border border-border/40 bg-muted/10 px-4 py-3"
              >
                <span className="text-sm font-medium text-foreground">{item.title}</span>
                <Badge variant={item.tone === "warning" ? "warning" : "secondary"}>{item.date}</Badge>
              </li>
            ))}
          </ul>
        </div>
      )}
    </WorkspacePanel>
  );
}
