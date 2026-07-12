"use client";

import type { LlmHealthStatus, LlmProviderCapabilities } from "@/lib/ai/providers/provider";
import type { AiWorkspaceLabels } from "@/components/ai/types";
import { AiContextRow, AiPanelSection, AiStatusDot } from "@/components/ai/shared/panel-section";

export function AiProviderStatusPanel({
  labels,
  providerLabel,
  modelId,
  capabilities,
  health,
  latencyMs,
  tokenUsageLabel,
  estimatedCostLabel,
  configured,
}: {
  labels: AiWorkspaceLabels;
  providerLabel: string;
  modelId: string;
  capabilities: LlmProviderCapabilities;
  health: LlmHealthStatus;
  latencyMs?: number | null;
  tokenUsageLabel?: string;
  estimatedCostLabel?: string;
  configured?: boolean;
}) {
  const healthTone =
    health === "healthy"
      ? "success"
      : health === "rate_limited" ||
          health === "unknown" ||
          health === "timeout" ||
          health === "quota_exceeded"
        ? "warning"
        : "danger";

  return (
    <AiPanelSection title={labels.provider.title}>
      <p className="mb-3 text-xs text-muted-foreground">
        {configured ? labels.provider.live : labels.provider.readOnly}
      </p>
      <dl className="space-y-2">
        <AiContextRow label={labels.provider.configured} value={providerLabel} />
        <AiContextRow label={labels.provider.model} value={modelId} />
        <AiContextRow
          label={labels.provider.streaming}
          value={capabilities.stream ? labels.context.yes : labels.context.no}
        />
        <AiContextRow
          label={labels.provider.vision}
          value={capabilities.vision ? labels.context.yes : labels.context.no}
        />
        <AiContextRow
          label={labels.provider.embeddings}
          value={capabilities.embeddings ? labels.context.yes : labels.context.no}
        />
        <AiContextRow
          label={labels.provider.structuredOutput}
          value={capabilities.structuredOutput ? labels.context.yes : labels.context.no}
        />
        <AiContextRow
          label={labels.provider.latency}
          value={latencyMs != null ? `${Math.round(latencyMs)} ms` : labels.header.none}
        />
        <AiContextRow
          label={labels.provider.tokenUsage}
          value={tokenUsageLabel ?? labels.header.none}
        />
        <AiContextRow
          label={labels.provider.estimatedCost}
          value={estimatedCostLabel ?? labels.header.none}
        />
      </dl>
      <div className="mt-3">
        <AiStatusDot tone={healthTone} label={`${labels.provider.health}: ${health}`} />
      </div>
    </AiPanelSection>
  );
}
