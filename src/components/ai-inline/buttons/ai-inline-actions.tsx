"use client";

import { IconSparkles } from "@/components/ui/icons";
import { useAiEverywhereOptional } from "@/components/ai-inline/provider/ai-everywhere-provider";
import type { AiEverywhereSelection } from "@/components/ai-inline/provider/ai-everywhere-provider";
import { aiInlineTokens } from "@/components/ai-inline/shared/tokens";
import { AI_EVERYWHERE_LABELS_EN } from "@/components/ai-inline/shared/labels";
import { cn } from "@/lib/ui/cn";

export function AiInlineAskButton({
  selection,
  className,
  variant = "primary",
}: {
  selection?: AiEverywhereSelection | null;
  className?: string;
  variant?: "primary" | "ghost";
}) {
  const host = useAiEverywhereOptional();
  const labels = host?.labels ?? AI_EVERYWHERE_LABELS_EN;
  return (
    <button
      type="button"
      className={cn(variant === "primary" ? aiInlineTokens.buttonPrimary : aiInlineTokens.button, className)}
      onClick={() => host?.openAsk(selection)}
      disabled={!host}
    >
      <IconSparkles width={14} height={14} />
      {labels.ask}
    </button>
  );
}

export function AiInlineExplainButton({
  selection,
  className,
}: {
  selection?: AiEverywhereSelection | null;
  className?: string;
}) {
  const host = useAiEverywhereOptional();
  const labels = host?.labels ?? AI_EVERYWHERE_LABELS_EN;
  return (
    <button
      type="button"
      className={cn(aiInlineTokens.button, className)}
      onClick={() => host?.openExplain(selection)}
      disabled={!host}
    >
      {labels.explain}
    </button>
  );
}

export function AiInlineAnalyzeButton({
  selection,
  className,
}: {
  selection?: AiEverywhereSelection | null;
  className?: string;
}) {
  const host = useAiEverywhereOptional();
  const labels = host?.labels ?? AI_EVERYWHERE_LABELS_EN;
  return (
    <button
      type="button"
      className={cn(aiInlineTokens.button, className)}
      onClick={() => host?.openAnalyze(selection)}
      disabled={!host}
    >
      {labels.analyze}
    </button>
  );
}

export function AiInlineActionGroup({
  selection,
  className,
  showSummarize = false,
}: {
  selection?: AiEverywhereSelection | null;
  className?: string;
  showSummarize?: boolean;
}) {
  const host = useAiEverywhereOptional();
  const labels = host?.labels ?? AI_EVERYWHERE_LABELS_EN;
  return (
    <div className={cn(aiInlineTokens.toolbar, className)} role="group" aria-label={labels.toolbarLabel}>
      <AiInlineAskButton selection={selection} />
      <AiInlineExplainButton selection={selection} />
      <AiInlineAnalyzeButton selection={selection} />
      {showSummarize ? (
        <button
          type="button"
          className={aiInlineTokens.button}
          onClick={() => host?.openSummarize(selection)}
          disabled={!host}
        >
          {labels.summarize}
        </button>
      ) : null}
    </div>
  );
}
