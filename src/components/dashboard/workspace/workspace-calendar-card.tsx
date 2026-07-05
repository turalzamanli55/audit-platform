import Link from "next/link";
import { IconCalendar } from "@/components/ui/icons";
import {
  WorkspaceEmpty,
  WorkspaceList,
  WorkspaceListItem,
  WorkspacePanel,
  WorkspaceStatusBadge,
  workspaceTokens,
} from "@/components/workspace";
import type { DashboardWorkspaceLabels } from "@/i18n/dashboard-workspace-types";
import { CommandCard } from "../command-center/command-center-primitives";

type WorkspaceCalendarCardProps = {
  labels: DashboardWorkspaceLabels["calendar"];
  items: DashboardWorkspaceLabels["calendar"]["items"];
  embedded?: boolean;
};

export function WorkspaceCalendarCard({ labels, items, embedded = false }: WorkspaceCalendarCardProps) {
  const inner =
    items.length === 0 ? (
      <WorkspaceEmpty title={labels.emptyTitle} description={labels.description} />
    ) : (
      <div className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {labels.upcoming}
        </p>
        <WorkspaceList>
          {items.map((item) => (
            <WorkspaceListItem key={item.id}>
              {item.href ? (
                <Link href={item.href} className={workspaceTokens.calendarRow}>
                  <span className="text-sm font-medium text-foreground">{item.title}</span>
                  <WorkspaceStatusBadge
                    label={item.date}
                    variant={item.tone === "warning" ? "warning" : "secondary"}
                  />
                </Link>
              ) : (
                <div className={workspaceTokens.calendarRow}>
                  <span className="text-sm font-medium text-foreground">{item.title}</span>
                  <WorkspaceStatusBadge
                    label={item.date}
                    variant={item.tone === "warning" ? "warning" : "secondary"}
                  />
                </div>
              )}
            </WorkspaceListItem>
          ))}
        </WorkspaceList>
      </div>
    );

  if (embedded) {
    return (
      <CommandCard title={labels.title} description={labels.description}>
        {inner}
      </CommandCard>
    );
  }

  return (
    <WorkspacePanel>
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <IconCalendar />
        </span>
        <div>
          <h3 className="font-semibold tracking-tight">{labels.title}</h3>
          <p className="text-sm text-muted-foreground">{labels.description}</p>
        </div>
      </div>
      {inner}
    </WorkspacePanel>
  );
}
