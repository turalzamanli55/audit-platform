import { UnconfiguredLlmAdapter } from "@/lib/ai/providers/adapters/base-adapter";
import { createCapabilityMatrix } from "@/lib/ai/providers/provider";
import type { LlmModelRegistry } from "@/lib/ai/providers/provider-models";

/** Empty Claude adapter — interface only. No SDK. No API keys. No network. */
export class ClaudeProviderAdapter extends UnconfiguredLlmAdapter {
  constructor(modelRegistry?: LlmModelRegistry) {
    super({
      id: "claude",
      label: "Claude",
      modelRegistry,
      capabilities: createCapabilityMatrix({
        chat: true,
        stream: true,
        vision: true,
        toolCalling: true,
        embeddings: false,
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
