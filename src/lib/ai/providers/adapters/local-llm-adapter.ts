import { UnconfiguredLlmAdapter } from "@/lib/ai/providers/adapters/base-adapter";
import { createCapabilityMatrix } from "@/lib/ai/providers/provider";
import type { LlmModelRegistry } from "@/lib/ai/providers/provider-models";

/** Empty Local LLM adapter — interface only. No SDK. No API keys. No network. */
export class LocalLlmProviderAdapter extends UnconfiguredLlmAdapter {
  constructor(modelRegistry?: LlmModelRegistry) {
    super({
      id: "local-llm",
      label: "Local LLM",
      modelRegistry,
      capabilities: createCapabilityMatrix({
        chat: true,
        stream: true,
        vision: false,
        toolCalling: false,
        embeddings: false,
        structuredOutput: false,
        health: true,
        models: true,
        tokenUsage: false,
        pricing: false,
        reasoning: false,
        largeContext: false,
      }),
    });
  }
}
