"use server";

import "server-only";

import { EMPTY_LLM_CAPABILITIES, type LlmHealthStatus } from "@/lib/ai/providers/provider";
import { bootstrapIntegratedLlmPlatformReady } from "@/lib/ai/providers/integration/bootstrap-live";
import { llmObservability } from "@/lib/ai/providers/integration/observability";
import type { LlmProviderStatusSnapshot } from "@/lib/ai/providers/integration/status";
import { bootstrapAiToolRuntime } from "@/lib/ai/tools";
import { isLlmPlatformError } from "@/lib/ai/providers/provider-errors";

let cachedBoot: Awaited<ReturnType<typeof bootstrapIntegratedLlmPlatformReady>> | null = null;

async function getIntegratedPlatform() {
  if (!cachedBoot) {
    cachedBoot = await bootstrapIntegratedLlmPlatformReady({
      toolRuntime: bootstrapAiToolRuntime(),
    });
  }
  return cachedBoot;
}

export async function getLlmProviderStatusAction(): Promise<LlmProviderStatusSnapshot> {
  try {
    const boot = await getIntegratedPlatform();
    const platform = boot.platform;
    const defaultProvider = platform.defaultProvider();
    const health = platform.health.get(defaultProvider.id);
    const obs = llmObservability.snapshot();

    let modelId = "platform.small";
    let modelLabel = "Platform Small";
    try {
      const route = platform.route({
        task: "general_chat",
        preferLatency: "low",
        allowedProviderIds:
          boot.configuredProviderIds.length > 0
            ? boot.configuredProviderIds
            : undefined,
      });
      modelId = route.model.id;
      modelLabel = route.model.displayName;
    } catch {
      // keep defaults
    }

    const estimate = platform.estimateCost(
      {
        modelId,
        inputTokens: obs.totalInputTokens || 0,
        outputTokens: obs.totalOutputTokens || 0,
      },
      defaultProvider.id === "none" ? undefined : defaultProvider.id,
    );

    return {
      defaultProviderId: defaultProvider.id,
      defaultProviderLabel: defaultProvider.label,
      configured: boot.configuredProviderIds.length > 0,
      configuredProviderIds: boot.configuredProviderIds,
      modelId,
      modelLabel,
      health: (health?.status ??
        (boot.configuredProviderIds.includes(defaultProvider.id)
          ? "unknown"
          : "disabled")) as LlmHealthStatus,
      latencyMs: health?.latencyMs ?? null,
      capabilities: defaultProvider.getCapabilities(),
      tokenUsage: {
        inputTokens: obs.totalInputTokens,
        outputTokens: obs.totalOutputTokens,
        totalTokens: obs.totalInputTokens + obs.totalOutputTokens,
      },
      estimatedCostUsd: estimate.estimatedCostUsd || obs.totalEstimatedCostUsd,
      averageLatencyMs: obs.averageLatencyMs || health?.latencyMs || 0,
      providers: platform.listProviders().map((provider) => {
        const record = platform.health.get(provider.id);
        return {
          id: provider.id,
          label: provider.label,
          configured: boot.configuredProviderIds.includes(provider.id) || provider.id === "none",
          health: (record?.status ??
            (provider.id === "none" || !boot.configuredProviderIds.includes(provider.id)
              ? "disabled"
              : "unknown")) as LlmHealthStatus,
          latencyMs: record?.latencyMs ?? null,
        };
      }),
    };
  } catch {
    return {
      defaultProviderId: "none",
      defaultProviderLabel: "None",
      configured: false,
      configuredProviderIds: [],
      modelId: "platform.small",
      modelLabel: "Platform Small",
      health: "disabled",
      latencyMs: null,
      capabilities: EMPTY_LLM_CAPABILITIES,
      tokenUsage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
      estimatedCostUsd: 0,
      averageLatencyMs: 0,
      providers: [],
    };
  }
}

export type LlmChatActionInput = {
  utterance: string;
  modelId?: string;
  messages?: Array<{ role: "system" | "user" | "assistant"; content: string }>;
};

export type LlmChatActionResult =
  | {
      ok: true;
      providerId: string;
      modelId: string;
      text: string;
      usage?: { inputTokens: number; outputTokens: number; totalTokens: number };
      estimatedCostUsd: number;
      latencyMs: number;
    }
  | { ok: false; code: string; message: string };

export async function llmChatAction(input: LlmChatActionInput): Promise<LlmChatActionResult> {
  const started = Date.now();
  try {
    const boot = await getIntegratedPlatform();
    const platform = boot.platform;
    if (boot.configuredProviderIds.length === 0) {
      return {
        ok: false,
        code: "provider_not_configured",
        message: "No LLM provider credentials are configured.",
      };
    }

    const route = platform.route({
      task: "general_chat",
      preferLatency: "low",
      allowedProviderIds: boot.configuredProviderIds,
    });
    const modelId = input.modelId ?? route.model.id;
    const messages =
      input.messages ??
      ([{ role: "user" as const, content: input.utterance }]);

    const result = await platform.chat(
      { modelId, messages },
      route.providerId,
    );
    const estimate = platform.estimateCost(
      {
        modelId,
        inputTokens: result.usage?.inputTokens ?? 0,
        outputTokens: result.usage?.outputTokens ?? 0,
      },
      route.providerId,
    );

    return {
      ok: true,
      providerId: result.providerId,
      modelId: result.modelId,
      text: result.text,
      usage: result.usage,
      estimatedCostUsd: estimate.estimatedCostUsd,
      latencyMs: Date.now() - started,
    };
  } catch (error) {
    if (isLlmPlatformError(error)) {
      return { ok: false, code: error.code, message: error.message };
    }
    return {
      ok: false,
      code: "provider_offline",
      message: "LLM request failed.",
    };
  }
}

export async function refreshLlmProviderHealthAction(): Promise<LlmProviderStatusSnapshot> {
  cachedBoot = null;
  return getLlmProviderStatusAction();
}
