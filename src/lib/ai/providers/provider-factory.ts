/**
 * Provider factory — constructs adapters by id without vendor SDKs.
 */

import { AzureOpenAiProviderAdapter } from "@/lib/ai/providers/adapters/azure-openai-adapter";
import { ClaudeProviderAdapter } from "@/lib/ai/providers/adapters/claude-adapter";
import { GeminiProviderAdapter } from "@/lib/ai/providers/adapters/gemini-adapter";
import { LmStudioProviderAdapter } from "@/lib/ai/providers/adapters/lm-studio-adapter";
import { LocalLlmProviderAdapter } from "@/lib/ai/providers/adapters/local-llm-adapter";
import { OllamaProviderAdapter } from "@/lib/ai/providers/adapters/ollama-adapter";
import { OpenAiProviderAdapter } from "@/lib/ai/providers/adapters/openai-adapter";
import { OpenRouterProviderAdapter } from "@/lib/ai/providers/adapters/openrouter-adapter";
import { VllmProviderAdapter } from "@/lib/ai/providers/adapters/vllm-adapter";
import { NullLlmProvider } from "@/lib/ai/providers/null-provider";
import type { LlmProvider, LlmProviderId } from "@/lib/ai/providers/provider";
import { LlmPlatformError } from "@/lib/ai/providers/provider-errors";
import type { LlmModelRegistry } from "@/lib/ai/providers/provider-models";

export type LlmProviderFactoryOptions = {
  modelRegistry?: LlmModelRegistry;
};

export class LlmProviderFactory {
  create(providerId: LlmProviderId, options: LlmProviderFactoryOptions = {}): LlmProvider {
    const registry = options.modelRegistry;
    switch (providerId) {
      case "none":
        return new NullLlmProvider(registry);
      case "openai":
        return new OpenAiProviderAdapter(registry);
      case "claude":
        return new ClaudeProviderAdapter(registry);
      case "gemini":
        return new GeminiProviderAdapter(registry);
      case "azure-openai":
        return new AzureOpenAiProviderAdapter(registry);
      case "openrouter":
        return new OpenRouterProviderAdapter(registry);
      case "ollama":
        return new OllamaProviderAdapter(registry);
      case "lm-studio":
        return new LmStudioProviderAdapter(registry);
      case "local-llm":
        return new LocalLlmProviderAdapter(registry);
      case "vllm":
        return new VllmProviderAdapter(registry);
      default: {
        const _exhaustive: never = providerId;
        throw new LlmPlatformError("provider_not_registered", `Unknown provider id: ${String(_exhaustive)}`);
      }
    }
  }

  createAll(options: LlmProviderFactoryOptions = {}): LlmProvider[] {
    const ids: LlmProviderId[] = [
      "none",
      "openai",
      "claude",
      "gemini",
      "azure-openai",
      "openrouter",
      "ollama",
      "lm-studio",
      "local-llm",
      "vllm",
    ];
    return ids.map((id) => this.create(id, options));
  }
}
