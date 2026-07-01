import { EmptyState } from "@/components/ui/empty-state";
import { IconClock } from "@/components/ui/icons";
import type { DashboardWorkspaceLabels } from "@/i18n/dashboard-workspace-types";
import { cn } from "@/lib/ui/cn";
import { WorkspacePanel, WorkspaceSection } from "./workspace-section";

type WorkspaceActivityProps = {
  labels: DashboardWorkspaceLabels["activity"];
};

const toneClasses = {
  default: "bg-muted",
  success: "bg-success/15 text-success",
  info: "bg-info/15 text-info",
} as const;

export function WorkspaceActivity({ labels }: WorkspaceActivityProps) {
  const items = labels.items;

  return (
    <WorkspaceSection title={labels.title} description={labels.description}>
      {items.length === 0 ? (
        <EmptyState title={labels.emptyTitle} description={labels.emptyDescription} icon={<IconClock />} />
      ) : (
        <WorkspacePanel className="p-0">
          <ol className="divide-y divide-border/50">
            {items.map((item, index) => (
              <li key={item.id} className="flex gap-4 p-5 sm:p-6">
                <div className="flex flex-col items-center">
                  <span
                    className={cn(
                      "mt-1 flex h-3 w-3 rounded-full",
                      toneClasses[item.tone] ?? toneClasses.default,
                    )}
                    aria-hidden
                  />
                  {index < items.length - 1 ? (
                    <span className="mt-2 w-px flex-1 bg-border/60" aria-hidden />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-medium text-foreground">{item.title}</p>
                    <time className="text-xs text-muted-foreground">{item.time}</time>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </WorkspacePanel>
      )}
    </WorkspaceSection>
  );
}
