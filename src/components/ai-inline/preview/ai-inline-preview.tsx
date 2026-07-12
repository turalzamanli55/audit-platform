"use client";

import { useAiEverywhere } from "@/components/ai-inline/provider/ai-everywhere-provider";
import { aiInlineTokens } from "@/components/ai-inline/shared/tokens";

export function AiInlinePreview() {
  const host = useAiEverywhere();
  const preview = host.lastPreview;
  if (!preview) return null;

  return (
    <section className="space-y-2 rounded-xl border border-border/50 bg-muted/20 p-3">
      <h3 className={aiInlineTokens.sectionTitle}>Orchestrator preview</h3>
      <p className="text-xs text-muted-foreground">
        Strategy: {preview.orchestration?.strategy ?? "n/a"} · Tools:{" "}
        {preview.availableTools?.length ?? 0} · Skill:{" "}
        {preview.skillResolution?.selected?.skill.id ?? "none"}
      </p>
    </section>
  );
}
