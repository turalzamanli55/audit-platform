"use client";

import { Button } from "@/components/ui/button";
import type { AiActionDefinition } from "@/lib/ai/types/actions";
import type { AiPermissionDecision } from "@/lib/ai/types/permissions";
import type { AiWorkspaceLabels } from "@/components/ai/types";
import { AiEmptyState } from "@/components/ai/empty/empty-states";
import { AiPanelSection } from "@/components/ai/shared/panel-section";
import { workspaceTokens } from "@/components/workspace/workspace-tokens";
import { cn } from "@/lib/ui/cn";

export type AiActionCardItem = {
  definition: AiActionDefinition;
  permission: AiPermissionDecision;
  estimatedResult: string;
};

export function AiActionCards({
  labels,
  items,
}: {
  labels: AiWorkspaceLabels;
  items: AiActionCardItem[];
}) {
  return (
    <AiPanelSection title={labels.actions.title}>
      <p className="text-xs text-muted-foreground">{labels.actions.neverExecute}</p>
      {items.length === 0 ? (
        <AiEmptyState title={labels.actions.empty} className="mt-3 py-6" />
      ) : (
        <ul className="mt-3 space-y-2">
          {items.map((item) => {
            const available = item.permission.allowed;
            return (
              <li key={item.definition.id} className={cn(workspaceTokens.card, "space-y-2 p-3")}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">{item.definition.label}</p>
                    <p className="text-sm text-muted-foreground">{item.definition.description}</p>
                  </div>
                  <span className="shrink-0 rounded-lg border border-border/50 px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                    {available ? labels.actions.available : labels.actions.unavailable}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {labels.actions.permission}:{" "}
                  {item.permission.allowed
                    ? "OK"
                    : item.permission.message ?? item.permission.reason}
                </p>
                <p className="text-xs text-muted-foreground">
                  {labels.actions.estimated}: {item.estimatedResult}
                </p>
                <Button type="button" size="sm" variant="secondary" disabled aria-disabled="true">
                  {labels.actions.preview}
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </AiPanelSection>
  );
}
