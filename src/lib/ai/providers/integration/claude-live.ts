/**
 * Anthropic Claude live adapter — official @anthropic-ai/sdk only.
 */

import Anthropic from "@anthropic-ai/sdk";
import { UnconfiguredLlmAdapter } from "@/lib/ai/providers/adapters/base-adapter";
import {
  createCapabilityMatrix,
  type LlmChatMessage,
  type LlmChatRequest,
  type LlmChatResult,
  type LlmHealthCheckResult,
  type LlmStreamChunk,
  type LlmStreamRequest,
  type LlmStructuredOutputRequest,
  type LlmStructuredOutputResult,
  type LlmToolCallRequest,
  type LlmToolCallResult,
  type LlmVisionRequest,
  type LlmVisionResult,
} from "@/lib/ai/providers/provider";
import type { LlmModelRegistry } from "@/lib/ai/providers/provider-models";
import { mapProviderError, healthStatusFromError } from "@/lib/ai/providers/integration/error-map";
import { mapFinishReason } from "@/lib/ai/providers/integration/messages";
import { withLlmRetry } from "@/lib/ai/providers/integration/retry";
import { llmObservability } from "@/lib/ai/providers/integration/observability";
import { toVendorModelApiId } from "@/lib/ai/providers/catalog/vendor-models";
import { LlmStructuredOutputEngine } from "@/lib/ai/providers/structured-output";

function toAnthropicMessages(messages: LlmChatMessage[]): {
  system?: string;
  messages: Anthropic.MessageParam[];
} {
  const systemParts: string[] = [];
  const mapped: Anthropic.MessageParam[] = [];

  for (const message of messages) {
    if (message.role === "system") {
      systemParts.push(typeof message.content === "string" ? message.content : message.content.map((p) => (p.type === "text" ? p.text : "")).join("\n"));
      continue;
    }
    if (message.role === "tool") {
      mapped.push({
        role: "user",
        content: [
          {
            type: "tool_result",
            tool_use_id: message.toolCallId ?? "tool",
            content: typeof message.content === "string" ? message.content : JSON.stringify(message.content),
          },
        ],
      });
      continue;
    }
    if (typeof message.content === "string") {
      mapped.push({
        role: message.role === "assistant" ? "assistant" : "user",
        content: message.content,
      });
      continue;
    }
    const content: Anthropic.ContentBlockParam[] = message.content.map((part) => {
      if (part.type === "text") return { type: "text", text: part.text };
      const media = part.dataRef.startsWith("data:")
        ? part.dataRef.split(",")[1] ?? ""
        : part.dataRef;
      return {
        type: "image",
        source: part.dataRef.startsWith("http")
          ? { type: "url", url: part.dataRef }
          : {
              type: "base64",
              media_type: (part.mediaType as "image/jpeg" | "image/png" | "image/gif" | "image/webp") || "image/png",
              data: media,
            },
      };
    });
    mapped.push({
      role: message.role === "assistant" ? "assistant" : "user",
      content,
    });
  }

  return {
    system: systemParts.length > 0 ? systemParts.join("\n") : undefined,
    messages: mapped,
  };
}

export class ClaudeLiveAdapter extends UnconfiguredLlmAdapter {
  private readonly client: Anthropic;
  private readonly structuredEngine = new LlmStructuredOutputEngine();

  constructor(apiKey: string, modelRegistry?: LlmModelRegistry) {
    super({
      id: "claude",
      label: "Anthropic Claude",
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
    this.client = new Anthropic({ apiKey });
    this.initialized = true;
  }

  private resolveModel(modelId: string): string {
    return toVendorModelApiId(modelId, "claude");
  }

  override async chat(request: LlmChatRequest): Promise<LlmChatResult> {
    const started = Date.now();
    try {
      const { system, messages } = toAnthropicMessages(request.messages);
      const { value, attempts } = await withLlmRetry(
        async () =>
          this.client.messages.create({
            model: this.resolveModel(request.modelId),
            max_tokens: request.maxOutputTokens ?? 4096,
            temperature: request.temperature,
            system,
            messages,
          }),
        { signal: request.abortSignal },
      );
      const text = value.content
        .filter((block): block is Anthropic.TextBlock => block.type === "text")
        .map((block) => block.text)
        .join("\n");
      const usage = {
        inputTokens: value.usage.input_tokens,
        outputTokens: value.usage.output_tokens,
        totalTokens: value.usage.input_tokens + value.usage.output_tokens,
      };
      llmObservability.record({
        providerId: this.id,
        modelId: request.modelId,
        operation: "chat",
        success: true,
        latencyMs: Date.now() - started,
        usage,
        retries: attempts - 1,
      });
      return {
        providerId: this.id,
        modelId: request.modelId,
        text,
        finishReason: mapFinishReason(value.stop_reason),
        usage,
      };
    } catch (error) {
      const mapped = mapProviderError(this.id, error);
      llmObservability.record({
        providerId: this.id,
        modelId: request.modelId,
        operation: "chat",
        success: false,
        latencyMs: Date.now() - started,
        retries: 0,
        errorCode: mapped.code,
      });
      throw mapped;
    }
  }

  override async *stream(request: LlmStreamRequest): AsyncIterable<LlmStreamChunk> {
    const started = Date.now();
    try {
      const { system, messages } = toAnthropicMessages(request.messages);
      const stream = this.client.messages.stream({
        model: this.resolveModel(request.modelId),
        max_tokens: request.maxOutputTokens ?? 4096,
        temperature: request.temperature,
        system,
        messages,
      });

      for await (const event of stream) {
        if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
          yield { type: "delta", text: event.delta.text };
        }
      }
      const final = await stream.finalMessage();
      const usage = {
        inputTokens: final.usage.input_tokens,
        outputTokens: final.usage.output_tokens,
        totalTokens: final.usage.input_tokens + final.usage.output_tokens,
      };
      yield { type: "usage", usage };
      yield { type: "done", finishReason: mapFinishReason(final.stop_reason) };
      llmObservability.record({
        providerId: this.id,
        modelId: request.modelId,
        operation: "stream",
        success: true,
        latencyMs: Date.now() - started,
        streamingDurationMs: Date.now() - started,
        usage,
        retries: 0,
      });
    } catch (error) {
      const mapped = mapProviderError(this.id, error);
      yield { type: "error", message: mapped.message, code: mapped.code };
      yield { type: "done", finishReason: "error" };
    }
  }

  override async vision(request: LlmVisionRequest): Promise<LlmVisionResult> {
    const chat = await this.chat({
      modelId: request.modelId,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: request.prompt },
            ...request.images,
          ],
        },
      ],
      abortSignal: request.abortSignal,
    });
    return {
      providerId: this.id,
      modelId: request.modelId,
      text: chat.text,
      usage: chat.usage,
    };
  }

  override async toolCall(request: LlmToolCallRequest): Promise<LlmToolCallResult> {
    const { system, messages } = toAnthropicMessages(request.messages);
    const value = await this.client.messages.create({
      model: this.resolveModel(request.modelId),
      max_tokens: 4096,
      system,
      messages,
      tools: request.tools.map((tool) => ({
        name: tool.name,
        description: tool.description,
        input_schema: tool.parametersSchema as Anthropic.Tool.InputSchema,
      })),
    });
    const toolCalls = value.content
      .filter((block): block is Anthropic.ToolUseBlock => block.type === "tool_use")
      .map((block) => ({
        id: block.id,
        name: block.name,
        argumentsJson: JSON.stringify(block.input ?? {}),
      }));
    const text = value.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("\n");
    return {
      providerId: this.id,
      modelId: request.modelId,
      text: text || undefined,
      toolCalls,
      usage: {
        inputTokens: value.usage.input_tokens,
        outputTokens: value.usage.output_tokens,
        totalTokens: value.usage.input_tokens + value.usage.output_tokens,
      },
    };
  }

  override async structuredOutput(
    request: LlmStructuredOutputRequest,
  ): Promise<LlmStructuredOutputResult> {
    const schemaHint = JSON.stringify(request.schema);
    const result = await this.chat({
      modelId: request.modelId,
      messages: [
        ...request.messages,
        {
          role: "system",
          content: `Respond with JSON only that matches schema ${request.schemaName ?? "response"}: ${schemaHint}`,
        },
      ],
      abortSignal: request.abortSignal,
    });
    let object = this.structuredEngine.tryParseJson(result.text);
    let repaired = false;
    if (object === undefined) {
      object = this.structuredEngine.tryRepair(result.text);
      repaired = object !== undefined;
    }
    if (object === undefined) {
      throw mapProviderError(this.id, Object.assign(new Error("invalid json"), { status: 400 }));
    }
    return {
      providerId: this.id,
      modelId: request.modelId,
      object,
      rawText: result.text,
      repaired,
      usage: result.usage,
    };
  }

  override async healthCheck(): Promise<LlmHealthCheckResult> {
    const started = Date.now();
    try {
      await this.client.messages.create({
        model: "claude-3-5-haiku-latest",
        max_tokens: 1,
        messages: [{ role: "user", content: "ping" }],
      });
      return {
        providerId: this.id,
        status: "healthy",
        checkedAt: new Date().toISOString(),
        latencyMs: Date.now() - started,
        message: "Provider reachable.",
      };
    } catch (error) {
      return {
        providerId: this.id,
        status: healthStatusFromError(error),
        checkedAt: new Date().toISOString(),
        latencyMs: Date.now() - started,
        message: "Provider health check failed.",
      };
    }
  }
}
