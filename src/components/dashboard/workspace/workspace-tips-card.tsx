import type { DashboardWorkspaceLabels } from "@/i18n/dashboard-workspace-types";
import { WorkspacePanel } from "./workspace-section";

type WorkspaceTipsCardProps = {
  labels: DashboardWorkspaceLabels["tips"];
};

export function WorkspaceTipsCard({ labels }: WorkspaceTipsCardProps) {
  return (
    <WorkspacePanel variant="soft">
      <h3 className="mb-4 text-sm font-semibold tracking-tight">{labels.title}</h3>
      <ul className="space-y-3">
        {labels.items.map((tip) => (
          <li key={tip} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70" aria-hidden />
            {tip}
          </li>
        ))}
      </ul>
    </WorkspacePanel>
  );
}
