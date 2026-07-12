"use client";

import { IconSparkles } from "@/components/ui/icons";
import type { DashboardWorkspaceLabels } from "@/i18n/dashboard-workspace-types";
import { WorkspacePanel } from "./workspace-section";
import { useAiEverywhereOptional } from "@/components/ai-inline";
import { cn } from "@/lib/ui/cn";

type WorkspaceAiCardProps = {
  labels: DashboardWorkspaceLabels["ai"];
};

/**
 * Dashboard AI entry — opens Workspace AI Drawer in-place (AI Everywhere).
 * Full AI Workspace remains available via navigation for deep sessions.
 */
export function WorkspaceAiCard({ labels }: WorkspaceAiCardProps) {
  const ai = useAiEverywhereOptional();

  return (
    <WorkspacePanel
      variant="elevated"
      className="relative overflow-hidden bg-gradient-to-br from-card via-card to-primary/5"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/10 blur-2xl"
      />
      <div className="relative space-y-6">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/12 text-primary">
            <IconSparkles width={22} height={22} />
          </span>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold tracking-tight">{labels.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{labels.description}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => ai?.openAsk()}
          disabled={!ai}
          className={cn(
            "inline-flex h-10 w-full items-center justify-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 sm:w-auto",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            !ai && "opacity-60",
          )}
        >
          {labels.askButton}
        </button>
      </div>
    </WorkspacePanel>
  );
}
