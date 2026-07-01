"use client";

import { Button } from "@/components/ui/button";
import { IconSparkles } from "@/components/ui/icons";
import type { DashboardWorkspaceLabels } from "@/i18n/dashboard-workspace-types";
import { WorkspacePanel } from "./workspace-section";

type WorkspaceAiCardProps = {
  labels: DashboardWorkspaceLabels["ai"];
};

export function WorkspaceAiCard({ labels }: WorkspaceAiCardProps) {
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

        <div
          aria-hidden
          className="flex h-28 items-center justify-center rounded-2xl border border-dashed border-primary/20 bg-primary/5 text-sm text-muted-foreground"
        >
          {labels.placeholder}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {labels.recentTitle}
            </p>
            <ul className="space-y-2">
              {labels.conversations.map((item) => (
                <li
                  key={item}
                  className="rounded-xl border border-border/40 bg-background/60 px-3 py-2.5 text-sm text-foreground"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {labels.suggestionsTitle}
            </p>
            <ul className="space-y-2">
              {labels.suggestions.map((item) => (
                <li
                  key={item}
                  className="rounded-xl border border-border/40 bg-background/60 px-3 py-2.5 text-sm text-muted-foreground"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Button type="button" className="w-full sm:w-auto" disabled aria-disabled="true">
          {labels.askButton}
        </Button>
      </div>
    </WorkspacePanel>
  );
}
