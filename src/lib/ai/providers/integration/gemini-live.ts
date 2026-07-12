/**
 * Google Gemini live adapter — official @google/genai only.
 */

import { GoogleGenAI } from "@google/genai";
import { UnconfiguredLlmAdapter } from "@/lib/ai/providers/adapters/base-adapter";
import {
  createCapabilityMatrix,
  type LlmChatMessage,
  type LlmChatRequest,
  type LlmChatResult,
  type LlmEmbeddingRequest,
  type LlmEmbeddingResult,
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
import { withLlmRetry } from "@/lib/ai/providers/integration/retry";
import { llmObservability } from "@/lib/ai/providers/integration/observability";
import { toVendorModelApiId } from "@/lib/ai/providers/catalog/vendor-models";
import { LlmStructuredOutputEngine } from "@/lib/ai/providers/structured-output";

function toGeminiContents(messages: LlmChatMessage[]): Array<{ role: string; parts: Array<Record<string, unknown>> }> {
  return messages
    .filter((message) => message.role !== "system" && message.role !== "tool")
    .map((message) => {
      const role = message.role === "assistant" ? "model" : "user";
      if (typeof message.content === "string") {
        return { role, parts: [{ text: message.content }] };
      }
      return {
        role,
        parts: message.content.map((part) => {
          if (part.type === "text") return { text: part.text };
          if (part.dataRef.startsWith("data:")) {
            const [, data = ""] = part.dataRef.split(",");
            return { inlineData: { mimeType: part.mediaType, data } };
          }
          return { text: `[image:${part.dataRef}]` };
        }),
      };
    });
}

function systemInstruction(messages: LlmChatMessage[]): string | undefined {
  const parts = messages
    .filter((message) => message.role === "system")
    .map((message) =>
      typeof message.content === "string"
        ? message.content
        : message.content.map((p) => (p.type === "text" ? p.text : "")).join("\n"),
    );
  return parts.length > 0 ? parts.join("\n") : undefined;
}

export class GeminiLiveAdapter extends UnconfiguredLlmAdapter {
  private readonly client: GoogleGenAI;
  private readonly structuredEngine = new LlmStructuredOutputEngine();

  constructor(apiKey: string, modelRegistry?: LlmModelRegistry) {
    super({
      id: "gemini",
      label: "Google Gemini",
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
    this.client = new GoogleGenAI({ apiKey });
    this.initialized = true;
  }

  private resolveModel(modelId: string): string {
    return toVendorModelApiId(modelId, "gemini");
  }

  override async chat(request: LlmChatRequest): Promise<LlmChatResult> {
    const started = Date.now();
    try {
      const { value, attempts } = await withLlmRetry(async () => {
        return this.client.models.generateContent({
          model: this.resolveModel(request.modelId),
          contents: toGeminiContents(request.messages),
          config: {
            systemInstruction: systemInstruction(request.messages),
            maxOutputTokens: request.maxOutputTokens,
            temperature: request.temperature,
            abortSignal: request.abortSignal,
          },
        });
      }, { signal: request.abortSignal });

      const text = value.text ?? "";
      const usageMeta = value.usageMetadata;
      const usage = usageMeta
        ? {
            inputTokens: usageMeta.promptTokenCount ?? 0,
            outputTokens: usageMeta.candidatesTokenCount ?? 0,
            totalTokens: usageMeta.totalTokenCount ?? 0,
          }
        : undefined;
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
        finishReason: "stop",
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
      const stream = await this.client.models.generateContentStream({
        model: this.resolveModel(request.modelId),
        contents: toGeminiContents(request.messages),
        config: {
          systemInstruction: systemInstruction(request.messages),
          maxOutputTokens: request.maxOutputTokens,
          temperature: request.temperature,
          abortSignal: request.abortSignal,
        },
      });
      for await (const chunk of stream) {
        const text = chunk.text;
        if (text) yield { type: "delta", text };
      }
      yield { type: "done", finishReason: "stop" };
      llmObservability.record({
        providerId: this.id,
        modelId: request.modelId,
        operation: "stream",
        success: true,
        latencyMs: Date.now() - started,
        streamingDurationMs: Date.now() - started,
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
          content: [{ type: "text", text: request.prompt }, ...request.images],
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
    try {
      const vectors: number[][] = [];
      for (const input of request.inputs) {
        const result = await this.client.models.embedContent({
          model: this.resolveModel(request.modelId),
          contents: input,
        });
        const values = result.embeddings?.[0]?.values ?? [];
        vectors.push([...values]);
      }
      const usage = {
        inputTokens: request.inputs.reduce((sum, text) => sum + Math.ceil(text.length / 4), 0),
        outputTokens: 0,
        totalTokens: 0,
      };
      usage.totalTokens = usage.inputTokens;
      llmObservability.record({
        providerId: this.id,
        modelId: request.modelId,
        operation: "embeddings",
        success: true,
        latencyMs: Date.now() - started,
        usage,
        retries: 0,
      });
      return {
        providerId: this.id,
        modelId: request.modelId,
        vectors,
        dimensions: vectors[0]?.length ?? 0,
        usage,
      };
    } catch (error) {
      throw mapProviderError(this.id, error);
    }
  }

  override async toolCall(request: LlmToolCallRequest): Promise<LlmToolCallResult> {
    const value = await this.client.models.generateContent({
      model: this.resolveModel(request.modelId),
      contents: toGeminiContents(request.messages),
      config: {
        tools: [
          {
            functionDeclarations: request.tools.map((tool) => ({
              name: tool.name,
              description: tool.description,
              parametersJsonSchema: tool.parametersSchema,
            })),
          },
        ],
        abortSignal: request.abortSignal,
      },
    });
    const toolCalls =
      value.functionCalls?.map((call, index) => ({
        id: `gemini_tool_${index}`,
        name: call.name ?? "unknown",
        argumentsJson: JSON.stringify(call.args ?? {}),
      })) ?? [];
    return {
      providerId: this.id,
      modelId: request.modelId,
      text: value.text ?? undefined,
      toolCalls,
    };
  }

  override async structuredOutput(
    request: LlmStructuredOutputRequest,
  ): Promise<LlmStructuredOutputResult> {
    const value = await this.client.models.generateContent({
      model: this.resolveModel(request.modelId),
      contents: toGeminiContents(request.messages),
      config: {
        responseMimeType: "application/json",
        responseJsonSchema: request.schema,
        abortSignal: request.abortSignal,
      },
    });
    const rawText = value.text ?? "";
    let object = this.structuredEngine.tryParseJson(rawText);
    let repaired = false;
    if (object === undefined) {
      object = this.structuredEngine.tryRepair(rawText);
      repaired = object !== undefined;
    }
    if (object === undefined) {
      throw mapProviderError(this.id, Object.assign(new Error("invalid json"), { status: 400 }));
    }
    return {
      providerId: this.id,
      modelId: request.modelId,
      object,
      rawText,
      repaired,
    };
  }

  override async healthCheck(): Promise<LlmHealthCheckResult> {
    const started = Date.now();
    try {
      await this.client.models.generateContent({
        model: "gemini-2.0-flash",
        contents: "ping",
        config: { maxOutputTokens: 1 },
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
