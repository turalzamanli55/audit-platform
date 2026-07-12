/**
 * Sanitized LLM provider status for AI Workspace — never includes secrets.
 */

import type { LlmHealthStatus, LlmProviderCapabilities, LlmProviderId } from "@/lib/ai/providers/provider";

export type LlmProviderStatusSnapshot = {
  defaultProviderId: LlmProviderId | null;
  defaultProviderLabel: string;
  configured: boolean;
  configuredProviderIds: LlmProviderId[];
  modelId: string;
  modelLabel: string;
  health: LlmHealthStatus;
  latencyMs: number | null;
  capabilities: LlmProviderCapabilities;
  tokenUsage: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
  };
  estimatedCostUsd: number;
  averageLatencyMs: number;
  providers: Array<{
    id: LlmProviderId;
    label: string;
    configured: boolean;
    health: LlmHealthStatus;
    latencyMs: number | null;
  }>;
};
