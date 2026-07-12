"use client";

import { useAiEverywhere } from "@/components/ai-inline/provider/ai-everywhere-provider";
import { aiInlineTokens } from "@/components/ai-inline/shared/tokens";

export function AiInlineSuggestions() {
  const host = useAiEverywhere();
  const suggestions = host.resolution?.suggestions ?? [];
  if (suggestions.length === 0) return null;

  return (
    <section className="space-y-2" aria-label={host.labels.suggestions}>
      <h3 className={aiInlineTokens.sectionTitle}>{host.labels.suggestions}</h3>
      <ul className="space-y-1.5">
        {suggestions.map((suggestion) => (
          <li key={suggestion}>
            <button
              type="button"
              className="w-full rounded-xl border border-border/50 bg-card px-3 py-2 text-left text-sm transition-colors hover:bg-muted/50"
              onClick={() => host.submitUtterance(suggestion)}
            >
              {suggestion}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
