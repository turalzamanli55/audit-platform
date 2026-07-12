"use client";

import { Button } from "@/components/ui/button";
import type { AiWorkspaceLabels } from "@/components/ai/types";
import { workspaceTokens } from "@/components/workspace/workspace-tokens";
import { cn } from "@/lib/ui/cn";

export function AiWelcomeExperience({
  labels,
  moduleLabel,
  companyLabel,
  engagementLabel,
  workflowLabel,
  permissionCount,
  knowledgeCount,
  actionCount,
  onStart,
  onExamples,
  onDocumentation,
  onHide,
  onNeverAgain,
}: {
  labels: AiWorkspaceLabels;
  moduleLabel: string;
  companyLabel: string;
  engagementLabel: string;
  workflowLabel: string;
  permissionCount: number;
  knowledgeCount: number;
  actionCount: number;
  onStart: () => void;
  onExamples: () => void;
  onDocumentation: () => void;
  onHide: () => void;
  onNeverAgain: () => void;
}) {
  const facts = [
    { label: labels.welcome.module, value: moduleLabel },
    { label: labels.welcome.company, value: companyLabel },
    { label: labels.welcome.engagement, value: engagementLabel },
    { label: labels.welcome.workflow, value: workflowLabel },
    { label: labels.welcome.permissions, value: String(permissionCount) },
    { label: labels.welcome.knowledge, value: String(knowledgeCount) },
    { label: labels.welcome.actions, value: String(actionCount) },
  ];

  return (
    <div
      className={cn(
        workspaceTokens.commandHero,
        "relative m-4 overflow-hidden sm:m-6",
      )}
      role="region"
      aria-label={labels.welcome.title}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/10 blur-3xl"
      />
      <div className="relative space-y-6">
        <div className="space-y-2">
          <p className={workspaceTokens.heroEyebrow}>{labels.header.title}</p>
          <h2 className={workspaceTokens.heroTitle}>{labels.welcome.title}</h2>
          <p className={workspaceTokens.heroSubtitle}>{labels.welcome.subtitle}</p>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            {labels.welcome.understands}
          </p>
          <dl className="grid gap-2 sm:grid-cols-2">
            {facts.map((fact) => (
              <div
                key={fact.label}
                className="rounded-xl border border-border/40 bg-background/60 px-3 py-2.5"
              >
                <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">{fact.label}</dt>
                <dd className="mt-1 truncate text-sm font-medium text-foreground">{fact.value || "—"}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={onStart}>
            {labels.welcome.start}
          </Button>
          <Button type="button" variant="outline" onClick={onExamples}>
            {labels.welcome.examples}
          </Button>
          <Button type="button" variant="ghost" onClick={onDocumentation}>
            {labels.welcome.documentation}
          </Button>
          <Button type="button" variant="ghost" onClick={onHide}>
            {labels.welcome.hide}
          </Button>
          <Button type="button" variant="ghost" onClick={onNeverAgain}>
            {labels.welcome.neverAgain}
          </Button>
        </div>
      </div>
    </div>
  );
}
