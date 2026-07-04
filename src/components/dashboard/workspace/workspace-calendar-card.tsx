import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { IconCalendar } from "@/components/ui/icons";
import type { DashboardWorkspaceLabels } from "@/i18n/dashboard-workspace-types";
import { WorkspacePanel } from "./workspace-section";

import { CommandCard, CommandEmpty } from "../command-center/command-center-primitives";

type WorkspaceCalendarCardProps = {
  labels: DashboardWorkspaceLabels["calendar"];
  items: DashboardWorkspaceLabels["calendar"]["items"];
  embedded?: boolean;
};

export function WorkspaceCalendarCard({ labels, items, embedded = false }: WorkspaceCalendarCardProps) {
  const inner =
    items.length === 0 ? (
      <CommandEmpty title={labels.emptyTitle} description={labels.description} />
    ) : (
      <div className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {labels.upcoming}
        </p>
        <ul className="space-y-2">
          {items.map((item) => {
            const row = (
              <>
                <span className="text-sm font-medium text-foreground">{item.title}</span>
                <Badge variant={item.tone === "warning" ? "warning" : "secondary"}>{item.date}</Badge>
              </>
            );

            return (
              <li key={item.id}>
                {item.href ? (
                  <Link
                    href={item.href}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border/40 bg-muted/10 px-4 py-3 transition-colors hover:bg-muted/30"
                  >
                    {row}
                  </Link>
                ) : (
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-border/40 bg-muted/10 px-4 py-3">
                    {row}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
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
      {items.length === 0 ? (
        <EmptyState title={labels.emptyTitle} className="py-10" />
      ) : (
        inner
      )}
    </WorkspacePanel>
  );
}
