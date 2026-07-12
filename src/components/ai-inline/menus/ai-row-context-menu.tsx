"use client";

import {
  ContextMenuItem,
  useContextMenu,
} from "@/components/ui/context-menu";
import {
  useAiEverywhereOptional,
  type AiEverywhereSelection,
} from "@/components/ai-inline/provider/ai-everywhere-provider";
import { AI_EVERYWHERE_LABELS_EN } from "@/components/ai-inline/shared/labels";
import { aiInlineTokens } from "@/components/ai-inline/shared/tokens";

export function AiRowContextMenuContent({
  selection,
}: {
  selection: AiEverywhereSelection;
}) {
  const host = useAiEverywhereOptional();
  const labels = host?.labels ?? AI_EVERYWHERE_LABELS_EN;

  return (
    <div className="min-w-[11rem]" role="group" aria-label={labels.rowMenuTitle}>
      <p className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        {labels.rowMenuTitle}
      </p>
      <ContextMenuItem onSelect={() => host?.openAsk(selection)}>{labels.ask}</ContextMenuItem>
      <ContextMenuItem onSelect={() => host?.openExplain(selection)}>
        {labels.explain}
      </ContextMenuItem>
      <ContextMenuItem onSelect={() => host?.openAnalyze(selection)}>
        {labels.analyze}
      </ContextMenuItem>
      <ContextMenuItem onSelect={() => host?.openSummarize(selection)}>
        {labels.summarize}
      </ContextMenuItem>
    </div>
  );
}

export function useAiRowContextMenu() {
  const menu = useContextMenu();
  const host = useAiEverywhereOptional();

  return {
    openAiMenu: (event: React.MouseEvent, selection: AiEverywhereSelection) => {
      if (!host) return;
      menu.open(event, <AiRowContextMenuContent selection={selection} />);
    },
  };
}

export function AiRowMenuButton({
  selection,
  className,
}: {
  selection: AiEverywhereSelection;
  className?: string;
}) {
  const host = useAiEverywhereOptional();
  const labels = host?.labels ?? AI_EVERYWHERE_LABELS_EN;
  return (
    <button
      type="button"
      className={className ?? aiInlineTokens.button}
      onClick={() => host?.openAsk(selection)}
      disabled={!host}
    >
      {labels.ask}
    </button>
  );
}
