import { IconTrendingUp } from "@/components/ui/icons";
import type { DashboardWorkspaceLabels } from "@/i18n/dashboard-workspace-types";
import { WorkspacePanel } from "./workspace-section";

type WorkspaceInsightsCardProps = {
  labels: DashboardWorkspaceLabels["insights"];
  metrics: DashboardWorkspaceLabels["insights"]["metrics"];
};

export function WorkspaceInsightsCard({ labels, metrics }: WorkspaceInsightsCardProps) {
  return (
    <WorkspacePanel>
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <IconTrendingUp />
        </span>
        <div>
          <h3 className="font-semibold tracking-tight">{labels.title}</h3>
          <p className="text-sm text-muted-foreground">{labels.description}</p>
        </div>
      </div>

      <div
        aria-hidden
        className="mb-5 flex h-36 items-center justify-center rounded-2xl border border-dashed border-border/60 bg-muted/10 text-sm text-muted-foreground"
      >
        {labels.chartPlaceholder}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {metrics.map((metric) => (
          <div
            key={metric.id}
            className="rounded-2xl border border-border/40 bg-background/50 px-4 py-3"
          >
            <p className="text-xs text-muted-foreground">{metric.label}</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight">{metric.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{metric.trend}</p>
          </div>
        ))}
      </div>
    </WorkspacePanel>
  );
}
