import type { DashboardWorkspaceLabels } from "@/i18n/dashboard-workspace-types";
import { WorkspacePanel, WorkspaceSection } from "./workspace-section";

type WorkspaceShortcutsCardProps = {
  labels: DashboardWorkspaceLabels["shortcuts"];
};

export function WorkspaceShortcutsCard({ labels }: WorkspaceShortcutsCardProps) {
  return (
    <WorkspaceSection title={labels.title} description={labels.description}>
      <WorkspacePanel variant="soft" className="space-y-2 p-0">
        <ul className="divide-y divide-border/40">
          {labels.items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6"
            >
              <span className="text-sm font-medium text-foreground">{item.label}</span>
              <kbd className="rounded-lg border border-border/60 bg-background px-2.5 py-1 text-xs text-muted-foreground">
                {item.hint}
              </kbd>
            </li>
          ))}
        </ul>
      </WorkspacePanel>
    </WorkspaceSection>
  );
}
