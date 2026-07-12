/**
 * Structured output engine — JSON Schema, typed objects, validation, repair.
 * Provider-independent; no vendor JSON-mode SDKs.
 */

import type {
  LlmProvider,
  LlmStructuredOutputRequest,
  LlmStructuredOutputResult,
} from "@/lib/ai/providers/provider";
import { LlmCapabilityResolver } from "@/lib/ai/providers/provider-capabilities";
import { LlmStructuredOutputInvalidError } from "@/lib/ai/providers/provider-errors";

export type LlmJsonSchema = Record<string, unknown>;

export type LlmStructuredRequest<T = unknown> = {
  modelId: string;
  messages: LlmStructuredOutputRequest["messages"];
  schema: LlmJsonSchema;
  schemaName?: string;
  abortSignal?: AbortSignal;
  /** Optional runtime type guard after parse/repair. */
  validate?: (value: unknown) => value is T;
  /** Attempt one local repair pass on invalid JSON. */
  autoRepair?: boolean;
};

export type LlmStructuredResult<T = unknown> = {
  providerId: LlmStructuredOutputResult["providerId"];
  modelId: string;
  object: T;
  rawText: string;
  repaired: boolean;
  usage?: LlmStructuredOutputResult["usage"];
};

export class LlmStructuredOutputEngine {
  private readonly capabilities = new LlmCapabilityResolver();

  async generate<T = unknown>(
    provider: LlmProvider,
    request: LlmStructuredRequest<T>,
  ): Promise<LlmStructuredResult<T>> {
    this.capabilities.assert(provider, "structuredOutput");
    this.assertSchema(request.schema);

    const result = await provider.structuredOutput({
      modelId: request.modelId,
      messages: request.messages,
      schema: request.schema,
      schemaName: request.schemaName,
      abortSignal: request.abortSignal,
    });

    let object = result.object;
    let repaired = result.repaired;

    if (!this.isObjectLike(object) && request.autoRepair !== false) {
      const repairedObject = this.tryRepair(result.rawText);
      if (repairedObject !== undefined) {
        object = repairedObject;
        repaired = true;
      }
    }

    if (request.validate && !request.validate(object)) {
      throw new LlmStructuredOutputInvalidError("Structured output failed typed validation.", {
        modelId: request.modelId,
        schemaName: request.schemaName,
      });
    }

    if (!this.isObjectLike(object) && typeof object !== "boolean" && typeof object !== "number") {
      throw new LlmStructuredOutputInvalidError("Structured output is not a valid JSON value.", {
        modelId: request.modelId,
      });
    }

    return {
      providerId: result.providerId,
      modelId: result.modelId,
      object: object as T,
      rawText: result.rawText,
      repaired,
      usage: result.usage,
    };
  }

  tryParseJson(rawText: string): unknown | undefined {
    try {
      return JSON.parse(rawText) as unknown;
    } catch {
      return undefined;
    }
  }

  tryRepair(rawText: string): unknown | undefined {
    const direct = this.tryParseJson(rawText);
    if (direct !== undefined) return direct;

    const fenced = rawText.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fenced?.[1]) {
      const parsed = this.tryParseJson(fenced[1].trim());
      if (parsed !== undefined) return parsed;
    }

    const firstBrace = rawText.indexOf("{");
    const lastBrace = rawText.lastIndexOf("}");
    if (firstBrace >= 0 && lastBrace > firstBrace) {
      return this.tryParseJson(rawText.slice(firstBrace, lastBrace + 1));
    }

    const firstBracket = rawText.indexOf("[");
    const lastBracket = rawText.lastIndexOf("]");
    if (firstBracket >= 0 && lastBracket > firstBracket) {
      return this.tryParseJson(rawText.slice(firstBracket, lastBracket + 1));
    }

    return undefined;
  }

  private assertSchema(schema: LlmJsonSchema): void {
    if (!schema || typeof schema !== "object" || Array.isArray(schema)) {
      throw new LlmStructuredOutputInvalidError("Structured output requires a JSON Schema object.");
    }
  }

  private isObjectLike(value: unknown): boolean {
    return value !== null && (typeof value === "object" || Array.isArray(value));
  }
}
