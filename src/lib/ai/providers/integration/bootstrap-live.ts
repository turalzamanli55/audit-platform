import "server-only";

/**
 * Live multi-provider bootstrap — creates configured adapters from environment.
 * Local providers (Ollama / LM Studio / vLLM / Local) remain disabled until configured.
 */

import { LlmPlatform, type LlmPlatformBootstrap } from "@/lib/ai/providers/llm-platform";
import { LLM_PLATFORM_MODEL_CATALOG } from "@/lib/ai/providers/provider-models";
import { LLM_VENDOR_MODEL_CATALOG } from "@/lib/ai/providers/catalog/vendor-models";
import { createLlmCredentialResolver } from "@/lib/ai/providers/credentials";
import { OpenAiCompatibleLiveAdapter } from "@/lib/ai/providers/integration/openai-compatible-live";
import { ClaudeLiveAdapter } from "@/lib/ai/providers/integration/claude-live";
import { GeminiLiveAdapter } from "@/lib/ai/providers/integration/gemini-live";
import type { LlmProvider, LlmProviderId } from "@/lib/ai/providers/provider";
import { llmObservability } from "@/lib/ai/providers/integration/observability";
import { bindToolRuntimeToLlmPlatform } from "@/lib/ai/providers/integration/tool-runtime-bridge";
import type { AiToolRuntime } from "@/lib/ai/tools";

export type LlmIntegrationBootstrap = LlmPlatformBootstrap & {
  configuredProviderIds: LlmProviderId[];
  observability: typeof llmObservability;
};

function createLiveProvider(
  providerId: LlmProviderId,
  platform: LlmPlatform,
): LlmProvider | null {
  const credentials = createLlmCredentialResolver().resolve(providerId);
  if (!credentials) return null;
  const registry = platform.models;

  switch (credentials.providerId) {
    case "openai":
      return new OpenAiCompatibleLiveAdapter({
        id: "openai",
        label: "OpenAI",
        apiKey: credentials.apiKey,
        modelRegistry: registry,
      });
    case "openrouter":
      return new OpenAiCompatibleLiveAdapter({
        id: "openrouter",
        label: "OpenRouter",
        apiKey: credentials.apiKey,
        baseURL: "https://openrouter.ai/api/v1",
        defaultHeaders: {
          "HTTP-Referer": "https://audit.local",
          "X-Title": "Enterprise Audit Platform",
        },
        modelRegistry: registry,
      });
    case "azure-openai":
      return new OpenAiCompatibleLiveAdapter({
        id: "azure-openai",
        label: "Azure OpenAI",
        apiKey: credentials.apiKey,
        baseURL: `${credentials.endpoint.replace(/\/$/, "")}/openai/deployments/${credentials.deployment}`,
        defaultHeaders: { "api-key": credentials.apiKey },
        defaultQuery: { "api-version": "2024-10-21" },
        forceDeployment: credentials.deployment,
        modelRegistry: registry,
      });
    case "claude":
      return new ClaudeLiveAdapter(credentials.apiKey, registry);
    case "gemini":
      return new GeminiLiveAdapter(credentials.apiKey, registry);
    default:
      return null;
  }
}

/**
 * Bootstraps LLM Platform and replaces stub adapters with live ones when credentials exist.
 */
export function bootstrapIntegratedLlmPlatform(options?: {
  toolRuntime?: AiToolRuntime;
  refreshHealth?: boolean;
}): LlmIntegrationBootstrap {
  const platform = new LlmPlatform({ registerAllAdapters: true, seedModels: true });

  for (const model of LLM_VENDOR_MODEL_CATALOG) {
    platform.models.register(model);
  }

  const resolver = createLlmCredentialResolver();
  const configuredProviderIds = resolver.listConfiguredProviderIds();

  for (const providerId of configuredProviderIds) {
    const live = createLiveProvider(providerId, platform);
    if (!live) continue;
    platform.removeProvider(providerId);
    platform.registerProvider(live);
  }

  const defaultId = resolver.preferredDefaultProviderId();
  if (defaultId) {
    platform.providers.setDefaultProvider(defaultId);
  } else {
    platform.providers.setDefaultProvider("none");
  }

  if (options?.toolRuntime) {
    bindToolRuntimeToLlmPlatform(platform, options.toolRuntime);
  }

  return {
    version: platform.version,
    providerCount: platform.listProviders().length,
    modelCount: platform.models.list().length,
    defaultProviderId: platform.providers.getDefaultProviderId(),
    platform,
    configuredProviderIds,
    observability: llmObservability,
  };
}

export async function bootstrapIntegratedLlmPlatformReady(options?: {
  toolRuntime?: AiToolRuntime;
}): Promise<LlmIntegrationBootstrap> {
  const boot = bootstrapIntegratedLlmPlatform(options);
  if (boot.configuredProviderIds.length > 0) {
    await boot.platform.refreshHealth();
  } else {
    for (const provider of boot.platform.listProviders()) {
      const health = await provider.healthCheck();
      boot.platform.health.record(health);
    }
  }
  return boot;
}

export { LLM_PLATFORM_MODEL_CATALOG, LLM_VENDOR_MODEL_CATALOG };
