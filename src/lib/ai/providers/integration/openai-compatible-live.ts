/**
 * Shared OpenAI-compatible live adapter (OpenAI / Azure / OpenRouter).
 * Server-side only — credentials injected by integration bootstrap.
 */

import OpenAI from "openai";
import { UnconfiguredLlmAdapter } from "@/lib/ai/providers/adapters/base-adapter";
import {
  createCapabilityMatrix,
  type LlmChatRequest,
  type LlmChatResult,
  type LlmEmbeddingRequest,
  type LlmEmbeddingResult,
  type LlmHealthCheckResult,
  type LlmProviderCapabilities,
  type LlmProviderId,
  type LlmStreamChunk,
  type LlmStreamRequest,
  type LlmStructuredOutputRequest,
  type LlmStructuredOutputResult,
  type LlmToolCallRequest,
  type LlmToolCallResult,
  type LlmVisionRequest,
  type LlmVisionResult,
} from "@/lib/ai/providers/provider";
import { LlmProviderNotConfiguredError } from "@/lib/ai/providers/provider-errors";
import type { LlmModelRegistry } from "@/lib/ai/providers/provider-models";
import { mapProviderError, healthStatusFromError } from "@/lib/ai/providers/integration/error-map";
import {
  mapFinishReason,
  normalizeUsage,
  toOpenAiCompatibleMessages,
} from "@/lib/ai/providers/integration/messages";
import { withLlmRetry } from "@/lib/ai/providers/integration/retry";
import { llmObservability } from "@/lib/ai/providers/integration/observability";
import { toVendorModelApiId } from "@/lib/ai/providers/catalog/vendor-models";
import { LlmStructuredOutputEngine } from "@/lib/ai/providers/structured-output";

export type OpenAiCompatibleLiveOptions = {
  id: LlmProviderId;
  label: string;
  apiKey: string;
  baseURL?: string;
  defaultHeaders?: Record<string, string>;
  defaultQuery?: Record<string, string>;
  /** When set, chat/completions use this deployment name instead of request.modelId. */
  forceDeployment?: string;
  modelRegistry?: LlmModelRegistry;
  capabilities?: LlmProviderCapabilities;
};

export class OpenAiCompatibleLiveAdapter extends UnconfiguredLlmAdapter {
  private readonly client: OpenAI;
  private readonly forceDeployment?: string;
  private readonly configured = true;
  private readonly structuredEngine = new LlmStructuredOutputEngine();

  constructor(options: OpenAiCompatibleLiveOptions) {
    super({
      id: options.id,
      label: options.label,
      modelRegistry: options.modelRegistry,
      capabilities:
        options.capabilities ??
        createCapabilityMatrix({
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
    this.forceDeployment = options.forceDeployment;
    this.client = new OpenAI({
      apiKey: options.apiKey,
      baseURL: options.baseURL,
      defaultHeaders: options.defaultHeaders,
      defaultQuery: options.defaultQuery,
    });
    this.initialized = true;
  }

  isConfigured(): boolean {
    return this.configured;
  }

  private resolveModel(modelId: string): string {
    if (this.forceDeployment) return this.forceDeployment;
    return toVendorModelApiId(modelId, this.id);
  }

  private observe(
    operation: "chat" | "stream" | "vision" | "embeddings" | "toolCall" | "structuredOutput" | "health",
    modelId: string,
    startedMs: number,
    success: boolean,
    retries: number,
    usage?: LlmChatResult["usage"],
    errorCode?: string,
    streamingDurationMs?: number,
  ): void {
    llmObservability.record({
      providerId: this.id,
      modelId,
      operation,
      success,
      latencyMs: Date.now() - startedMs,
      streamingDurationMs,
      usage,
      retries,
      errorCode,
    });
  }

  override async chat(request: LlmChatRequest): Promise<LlmChatResult> {
    const started = Date.now();
    let retries = 0;
    try {
      const { value, attempts } = await withLlmRetry(
        async () => {
          const completion = await this.client.chat.completions.create(
            {
              model: this.resolveModel(request.modelId),
              messages: toOpenAiCompatibleMessages(request.messages) as OpenAI.Chat.ChatCompletionMessageParam[],
              max_tokens: request.maxOutputTokens,
              temperature: request.temperature,
            },
            { signal: request.abortSignal },
          );
          return completion;
        },
        { signal: request.abortSignal },
      );
      retries = attempts - 1;
      const choice = value.choices[0];
      const result: LlmChatResult = {
        providerId: this.id,
        modelId: request.modelId,
        text: choice?.message?.content ?? "",
        finishReason: mapFinishReason(choice?.finish_reason),
        usage: normalizeUsage(value.usage),
      };
      this.observe("chat", request.modelId, started, true, retries, result.usage);
      return result;
    } catch (error) {
      const mapped = mapProviderError(this.id, error);
      this.observe("chat", request.modelId, started, false, retries, undefined, mapped.code);
      throw mapped;
    }
  }

  override async *stream(request: LlmStreamRequest): AsyncIterable<LlmStreamChunk> {
    const started = Date.now();
    let retries = 0;
    try {
      const stream = await this.client.chat.completions.create(
        {
          model: this.resolveModel(request.modelId),
          messages: toOpenAiCompatibleMessages(request.messages) as OpenAI.Chat.ChatCompletionMessageParam[],
          max_tokens: request.maxOutputTokens,
          temperature: request.temperature,
          stream: true,
          stream_options: { include_usage: true },
        },
        { signal: request.abortSignal },
      );

      let finishReason: LlmChatResult["finishReason"] = "stop";
      let usage: LlmChatResult["usage"];

      for await (const chunk of stream) {
        const choice = chunk.choices[0];
        const delta = choice?.delta;
        if (delta?.content) {
          yield { type: "delta", text: delta.content };
        }
        if (delta?.tool_calls) {
          for (const toolCall of delta.tool_calls) {
            yield {
              type: "tool_call_delta",
              toolCallId: toolCall.id ?? `tool_${toolCall.index}`,
              name: toolCall.function?.name,
              argumentsDelta: toolCall.function?.arguments,
            };
          }
        }
        if (choice?.finish_reason) {
          finishReason = mapFinishReason(choice.finish_reason);
        }
        if (chunk.usage) {
          usage = normalizeUsage(chunk.usage);
          if (usage) {
            yield { type: "usage", usage };
          }
        }
      }

      yield { type: "done", finishReason };
      this.observe("stream", request.modelId, started, true, retries, usage, undefined, Date.now() - started);
    } catch (error) {
      const mapped = mapProviderError(this.id, error);
      this.observe("stream", request.modelId, started, false, retries, undefined, mapped.code);
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
            ...request.images.map((image) => ({
              type: "image" as const,
              mediaType: image.mediaType,
              dataRef: image.dataRef,
            })),
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

  override async embeddings(request: LlmEmbeddingRequest): Promise<LlmEmbeddingResult> {
    const started = Date.now();
    let retries = 0;
    try {
      const { value, attempts } = await withLlmRetry(
        async () =>
          this.client.embeddings.create(
            {
              model: this.resolveModel(request.modelId),
              input: request.inputs,
            },
            { signal: request.abortSignal },
          ),
        { signal: request.abortSignal },
      );
      retries = attempts - 1;
      const vectors = value.data
        .slice()
        .sort((a, b) => a.index - b.index)
        .map((row) => row.embedding);
      const result: LlmEmbeddingResult = {
        providerId: this.id,
        modelId: request.modelId,
        vectors,
        dimensions: vectors[0]?.length ?? 0,
        usage: normalizeUsage(value.usage),
      };
      this.observe("embeddings", request.modelId, started, true, retries, result.usage);
      return result;
    } catch (error) {
      const mapped = mapProviderError(this.id, error);
      this.observe("embeddings", request.modelId, started, false, retries, undefined, mapped.code);
      throw mapped;
    }
  }

  override async toolCall(request: LlmToolCallRequest): Promise<LlmToolCallResult> {
    const started = Date.now();
    let retries = 0;
    try {
      const { value, attempts } = await withLlmRetry(
        async () =>
          this.client.chat.completions.create(
            {
              model: this.resolveModel(request.modelId),
              messages: toOpenAiCompatibleMessages(request.messages) as OpenAI.Chat.ChatCompletionMessageParam[],
              tools: request.tools.map((tool) => ({
                type: "function" as const,
                function: {
                  name: tool.name,
                  description: tool.description,
                  parameters: tool.parametersSchema,
                },
              })),
            },
            { signal: request.abortSignal },
          ),
        { signal: request.abortSignal },
      );
      retries = attempts - 1;
      const message = value.choices[0]?.message;
      const toolCalls =
        message?.tool_calls
          ?.filter((call): call is OpenAI.Chat.ChatCompletionMessageToolCall & { type?: string } =>
            "function" in call,
          )
          .map((call) => {
            const fn = (call as { id: string; function: { name: string; arguments: string } }).function;
            return {
              id: call.id,
              name: fn.name,
              argumentsJson: fn.arguments,
            };
          }) ?? [];
      const result: LlmToolCallResult = {
        providerId: this.id,
        modelId: request.modelId,
        text: message?.content ?? undefined,
        toolCalls,
        usage: normalizeUsage(value.usage),
      };
      this.observe("toolCall", request.modelId, started, true, retries, result.usage);
      return result;
    } catch (error) {
      const mapped = mapProviderError(this.id, error);
      this.observe("toolCall", request.modelId, started, false, retries, undefined, mapped.code);
      throw mapped;
    }
  }

  override async structuredOutput(
    request: LlmStructuredOutputRequest,
  ): Promise<LlmStructuredOutputResult> {
    const started = Date.now();
    let retries = 0;
    try {
      const { value, attempts } = await withLlmRetry(
        async (attempt) => {
          const completion = await this.client.chat.completions.create(
            {
              model: this.resolveModel(request.modelId),
              messages: toOpenAiCompatibleMessages(request.messages) as OpenAI.Chat.ChatCompletionMessageParam[],
              response_format: {
                type: "json_schema",
                json_schema: {
                  name: request.schemaName ?? "response",
                  schema: request.schema,
                  strict: true,
                },
              },
            },
            { signal: request.abortSignal },
          );
          const rawText = completion.choices[0]?.message?.content ?? "";
          let object: unknown = this.structuredEngine.tryParseJson(rawText);
          let repaired = false;
          if (object === undefined) {
            object = this.structuredEngine.tryRepair(rawText);
            repaired = object !== undefined;
          }
          if (object === undefined && attempt < 3) {
            throw Object.assign(new Error("invalid json"), { status: 400 });
          }
          return { completion, rawText, object, repaired };
        },
        { signal: request.abortSignal, maxAttempts: 3 },
      );
      retries = attempts - 1;
      if (value.object === undefined) {
        throw mapProviderError(this.id, Object.assign(new Error("invalid json"), { status: 400 }));
      }
      const result: LlmStructuredOutputResult = {
        providerId: this.id,
        modelId: request.modelId,
        object: value.object,
        rawText: value.rawText,
        repaired: value.repaired,
        usage: normalizeUsage(value.completion.usage),
      };
      this.observe("structuredOutput", request.modelId, started, true, retries, result.usage);
      return result;
    } catch (error) {
      const mapped = mapProviderError(this.id, error);
      this.observe("structuredOutput", request.modelId, started, false, retries, undefined, mapped.code);
      throw mapped;
    }
  }

  override async healthCheck(): Promise<LlmHealthCheckResult> {
    const started = Date.now();
    try {
      await this.client.models.list();
      const result: LlmHealthCheckResult = {
        providerId: this.id,
        status: "healthy",
        checkedAt: new Date().toISOString(),
        latencyMs: Date.now() - started,
        message: "Provider reachable.",
      };
      this.observe("health", "health", started, true, 0);
      return result;
    } catch (error) {
      const status = healthStatusFromError(error);
      this.observe("health", "health", started, false, 0, undefined, status);
      return {
        providerId: this.id,
        status,
        checkedAt: new Date().toISOString(),
        latencyMs: Date.now() - started,
        message: "Provider health check failed.",
      };
    }
  }
}

/** Guard for accidental use without credentials. */
export function assertLiveConfigured(configured: boolean, providerId: LlmProviderId): void {
  if (!configured) throw new LlmProviderNotConfiguredError(providerId);
}
