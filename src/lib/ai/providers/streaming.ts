/**
 * Provider-independent streaming engine.
 * Never exposes vendor stream implementations.
 */

import type { LlmProvider, LlmStreamChunk, LlmStreamRequest } from "@/lib/ai/providers/provider";
import { LlmCapabilityResolver } from "@/lib/ai/providers/provider-capabilities";
import { LlmPlatformError } from "@/lib/ai/providers/provider-errors";

export type LlmNormalizedStreamEvent =
  | { kind: "text"; text: string }
  | { kind: "usage"; inputTokens: number; outputTokens: number; totalTokens: number }
  | { kind: "tool_delta"; toolCallId: string; name?: string; argumentsDelta?: string }
  | { kind: "error"; message: string; code?: string }
  | { kind: "done"; finishReason: string };

export class LlmStreamingEngine {
  private readonly capabilities = new LlmCapabilityResolver();

  async *stream(
    provider: LlmProvider,
    request: LlmStreamRequest,
  ): AsyncGenerator<LlmNormalizedStreamEvent, void, undefined> {
    this.capabilities.assert(provider, "stream");

    try {
      for await (const chunk of provider.stream(request)) {
        yield this.normalize(chunk);
      }
    } catch (error) {
      if (request.abortSignal?.aborted) {
        throw new LlmPlatformError("stream_aborted", "LLM stream was aborted.", {
          providerId: provider.id,
          cause: error,
        });
      }
      throw error;
    }
  }

  private normalize(chunk: LlmStreamChunk): LlmNormalizedStreamEvent {
    switch (chunk.type) {
      case "delta":
        return { kind: "text", text: chunk.text };
      case "usage":
        return {
          kind: "usage",
          inputTokens: chunk.usage.inputTokens,
          outputTokens: chunk.usage.outputTokens,
          totalTokens: chunk.usage.totalTokens,
        };
      case "tool_call_delta":
        return {
          kind: "tool_delta",
          toolCallId: chunk.toolCallId,
          name: chunk.name,
          argumentsDelta: chunk.argumentsDelta,
        };
      case "error":
        return { kind: "error", message: chunk.message, code: chunk.code };
      case "done":
        return { kind: "done", finishReason: chunk.finishReason };
      default: {
        const _exhaustive: never = chunk;
        return _exhaustive;
      }
    }
  }
}
