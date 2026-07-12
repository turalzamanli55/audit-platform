"use client";

import { Button } from "@/components/ui/button";
import type { AiPlannerDecision } from "@/lib/ai/types/planner";
import type { AiWorkspaceLabels } from "@/components/ai/types";
import { AiEmptyState } from "@/components/ai/empty/empty-states";
import { AiPanelLoading } from "@/components/ai/loading/skeletons";
import { AiPanelSection } from "@/components/ai/shared/panel-section";
import { workspaceTokens } from "@/components/workspace/workspace-tokens";
import { cn } from "@/lib/ui/cn";

export type AiSuggestionItem = {
  id: string;
  utterance: string;
  decision: AiPlannerDecision;
};

export function AiSuggestionPanel({
  labels,
  items,
  loading,
  onApply,
}: {
  labels: AiWorkspaceLabels;
  items: AiSuggestionItem[];
  loading?: boolean;
  onApply: (utterance: string) => void;
}) {
  if (loading) return <AiPanelLoading label={labels.loading.suggestions} />;

  return (
    <AiPanelSection title={labels.suggestions.title}>
      {items.length === 0 ? (
        <AiEmptyState title={labels.suggestions.empty} className="py-6" />
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.id} className={cn(workspaceTokens.card, "p-3")}>
              <p className="text-sm font-medium text-foreground">{item.utterance}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {labels.suggestions.intent}: {item.decision.intent}
              </p>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="mt-2"
                onClick={() => onApply(item.utterance)}
              >
                {labels.suggestions.apply}
              </Button>
            </li>
          ))}
        </ul>
      )}
    </AiPanelSection>
  );
}

/** Planner-only suggestion seeds — never LLM-generated. */
export const AI_WORKSPACE_SUGGESTION_SEEDS = [
  "Explain this page",
  "Continue workflow",
  "Open Materiality",
  "Open Risk Assessment",
  "Show pending reviews",
  "Find missing documents",
  "Explain ISA",
  "Explain IFRS",
  "Search Platform",
] as const;
