import { UnconfiguredLlmAdapter } from "@/lib/ai/providers/adapters/base-adapter";
import { createCapabilityMatrix } from "@/lib/ai/providers/provider";
import type { LlmModelRegistry } from "@/lib/ai/providers/provider-models";

/** Empty OpenAI adapter — interface only. No SDK. No API keys. No network. */
export class OpenAiProviderAdapter extends UnconfiguredLlmAdapter {
  constructor(modelRegistry?: LlmModelRegistry) {
    super({
      id: "openai",
      label: "OpenAI",
      modelRegistry,
      capabilities: createCapabilityMatrix({
        chat: true,
        stream: true,
        vision: true,
        toolCalling: true,
        embeddings: true,
        structuredOutput: true,
        health: true,
        models: true,
        tokenUsage: true,
        pricing: true,
        reasoning: true,
        largeContext: true,
      }),
    });
  }
}
