import { UnconfiguredLlmAdapter } from "@/lib/ai/providers/adapters/base-adapter";
import { createCapabilityMatrix } from "@/lib/ai/providers/provider";
import type { LlmModelRegistry } from "@/lib/ai/providers/provider-models";

/** Empty vLLM adapter — interface only. No SDK. No API keys. No network. */
export class VllmProviderAdapter extends UnconfiguredLlmAdapter {
  constructor(modelRegistry?: LlmModelRegistry) {
    super({
      id: "vllm",
      label: "vLLM",
      modelRegistry,
      capabilities: createCapabilityMatrix({
        chat: true,
        stream: true,
        vision: false,
        toolCalling: true,
        embeddings: true,
        structuredOutput: true,
        health: true,
        models: true,
        tokenUsage: true,
        pricing: false,
        reasoning: false,
        largeContext: true,
      }),
    });
  }
}
