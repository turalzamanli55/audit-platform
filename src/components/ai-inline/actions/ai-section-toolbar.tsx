"use client";

import { AiInlineActionGroup } from "@/components/ai-inline/buttons/ai-inline-actions";
import type { AiEverywhereSelection } from "@/components/ai-inline/provider/ai-everywhere-provider";

/** Section toolbar slot — Ask / Explain / Analyze without leaving the page. */
export function AiSectionToolbar({
  selection,
  className,
}: {
  selection?: AiEverywhereSelection | null;
  className?: string;
}) {
  return <AiInlineActionGroup selection={selection} className={className} showSummarize />;
}
