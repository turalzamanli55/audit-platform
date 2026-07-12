"use client";

import { useAiEverywhere } from "@/components/ai-inline/provider/ai-everywhere-provider";
import type { AiEverywhereSelection } from "@/components/ai-inline/provider/ai-everywhere-provider";
import { aiInlineTokens } from "@/components/ai-inline/shared/tokens";

export function AiInlineAnalysisTrigger({
  selection,
  label,
}: {
  selection: AiEverywhereSelection;
  label?: string;
}) {
  const host = useAiEverywhere();
  return (
    <button
      type="button"
      className={aiInlineTokens.button}
      onClick={() => host.openAnalyze(selection)}
    >
      {label ?? host.labels.analyze}
    </button>
  );
}
