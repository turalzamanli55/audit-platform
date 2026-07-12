/**
 * Null / none provider — foundation default with no LLM connectivity.
 */

import {
  createCapabilityMatrix,
  type LlmChatRequest,
  type LlmChatResult,
  type LlmStreamChunk,
  type LlmStreamRequest,
} from "@/lib/ai/providers/provider";
import { UnconfiguredLlmAdapter } from "@/lib/ai/providers/adapters/base-adapter";
import type { LlmModelRegistry } from "@/lib/ai/providers/provider-models";
import type {
  AiProvider,
  AiProviderCapability,
  AiProviderCompletionRequest,
  AiProviderCompletionResult,
} from "@/lib/ai/types/provider";

export class NullLlmProvider extends UnconfiguredLlmAdapter {
  constructor(modelRegistry?: LlmModelRegistry) {
    super({
      id: "none",
      label: "No provider configured",
      modelRegistry,
      capabilities: createCapabilityMatrix({
        chat: true,
        stream: true,
        health: true,
        models: true,
        pricing: true,
      }),
    });
  }

  override async chat(_request: LlmChatRequest): Promise<LlmChatResult> {
    return {
      providerId: "none",
      modelId: "platform.none",
      text: "LLM Platform Layer is online without a configured model provider.",
      finishReason: "not_configured",
    };
  }

  override async *stream(_request: LlmStreamRequest): AsyncIterable<LlmStreamChunk> {
    yield {
      type: "delta",
      text: "LLM Platform Layer is online without a configured model provider.",
    };
    yield { type: "done", finishReason: "not_configured" };
  }

  override async healthCheck() {
    return {
      providerId: this.id as "none",
      status: "disabled" as const,
      checkedAt: new Date().toISOString(),
      message: "Null provider — intentional non-connectivity.",
    };
  }
}

/**
 * Legacy foundation bridge used by AiCopilotCore until full platform migration.
 * No network I/O.
 */
export class NullAiProvider implements AiProvider {
  private readonly llm = new NullLlmProvider();

  getCapability(): AiProviderCapability {
    return {
      id: "none",
      label: this.llm.label,
      supportsStreaming: false,
      configured: false,
    };
  }

  async complete(_request: AiProviderCompletionRequest): Promise<AiProviderCompletionResult> {
    const result = await this.llm.chat({
      modelId: "platform.none",
      messages: [{ role: "user", content: "" }],
      prompt: _request.prompt,
    });
    return {
      text: result.text,
      citations: [],
      providerId: "none",
    };
  }
}
