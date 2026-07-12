"use client";

import type { AiWorkspaceLabels } from "@/components/ai/types";
import { AiStatusDot } from "@/components/ai/shared/panel-section";
import { aiWorkspaceTokens } from "@/components/ai/shared/ai-tokens";

export function AiWorkspaceHeader({
  labels,
  conversationName,
  moduleLabel,
  companyLabel,
  engagementLabel,
  modelLabel,
  providerConfigured,
  providerLabel,
}: {
  labels: AiWorkspaceLabels;
  conversationName: string;
  moduleLabel: string;
  companyLabel: string;
  engagementLabel: string;
  modelLabel: string;
  providerConfigured: boolean;
  providerLabel: string;
}) {
  return (
    <header className={aiWorkspaceTokens.header} aria-label={labels.header.title}>
      <div className="min-w-0 flex-1 space-y-1">
        <h1 className="truncate text-base font-semibold tracking-tight text-foreground sm:text-lg">
          {labels.header.title}
        </h1>
        <p className="truncate text-sm text-muted-foreground">
          {labels.header.conversation}: {conversationName || labels.header.none}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className={aiWorkspaceTokens.chip}>
          <span className={aiWorkspaceTokens.chipMuted}>{labels.header.module}</span>
          <span>{moduleLabel || labels.header.none}</span>
        </span>
        <span className={aiWorkspaceTokens.chip}>
          <span className={aiWorkspaceTokens.chipMuted}>{labels.header.company}</span>
          <span>{companyLabel || labels.header.none}</span>
        </span>
        <span className={aiWorkspaceTokens.chip}>
          <span className={aiWorkspaceTokens.chipMuted}>{labels.header.engagement}</span>
          <span>{engagementLabel || labels.header.none}</span>
        </span>
        <span className={aiWorkspaceTokens.chip}>
          <span className={aiWorkspaceTokens.chipMuted}>{labels.header.model}</span>
          <span>{modelLabel || labels.header.unconfigured}</span>
        </span>
        <AiStatusDot
          tone={providerConfigured ? "success" : "warning"}
          label={`${labels.header.provider}: ${providerLabel}`}
        />
      </div>
    </header>
  );
}
