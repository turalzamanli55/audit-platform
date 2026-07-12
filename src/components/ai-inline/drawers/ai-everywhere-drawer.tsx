"use client";

import { Sheet } from "@/components/ui/sheet";
import { AiMessageList } from "@/components/ai/messages/message-list";
import { AiPromptComposer } from "@/components/ai/composer/prompt-composer";
import { AI_WORKSPACE_LABELS_EN } from "@/components/ai/labels";
import { useAiEverywhere } from "@/components/ai-inline/provider/ai-everywhere-provider";
import { AiInlineContextPanel } from "@/components/ai-inline/panels/ai-inline-panel";
import { AiInlineSuggestions } from "@/components/ai-inline/panels/ai-inline-suggestions";
import {
  AiInlineCapabilityCard,
  AiInlineKnowledgeCard,
} from "@/components/ai-inline/cards/ai-capability-card";
import { AiInlinePreview } from "@/components/ai-inline/preview/ai-inline-preview";
import { cn } from "@/lib/ui/cn";

export function AiEverywhereDrawer() {
  const host = useAiEverywhere();

  return (
    <Sheet
      open={host.open}
      onOpenChange={host.setOpen}
      title={host.labels.drawerTitle}
      description={host.labels.drawerDescription}
      side="right"
    >
      <div className={cn("flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4")}>
        {!host.canUseAi ? (
          <p className="text-sm text-destructive">{host.labels.permissionDenied}</p>
        ) : null}

        <AiInlineContextPanel />
        <AiInlineSuggestions />
        <AiInlineCapabilityCard />
        <AiInlineKnowledgeCard />
        <AiInlinePreview />

        <section className="min-h-[12rem] space-y-2" aria-label={host.labels.conversation}>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {host.labels.conversation}
          </h3>
          {host.messages.length === 0 ? (
            <p className="text-sm text-muted-foreground">{host.labels.emptyConversation}</p>
          ) : (
            <div className="-mx-2">
              <AiMessageList messages={host.messages} labels={AI_WORKSPACE_LABELS_EN} />
            </div>
          )}
        </section>

        <div className="sticky bottom-0 border-t border-border/50 bg-card pt-3">
          <AiPromptComposer
            labels={AI_WORKSPACE_LABELS_EN}
            moduleLabel={host.resolution?.displayName ?? "Module"}
            workspaceLabel="Workspace"
            contextReady={Boolean(host.context)}
            disabled={!host.canUseAi}
            onSubmit={(utterance) => host.submitUtterance(utterance)}
          />
        </div>
      </div>
    </Sheet>
  );
}
