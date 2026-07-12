/**
 * Embeddings abstraction — no vector database.
 */

import type {
  LlmEmbeddingRequest,
  LlmEmbeddingResult,
  LlmProvider,
} from "@/lib/ai/providers/provider";
import { LlmCapabilityResolver } from "@/lib/ai/providers/provider-capabilities";
import { LlmPlatformError } from "@/lib/ai/providers/provider-errors";

export type LlmEmbedRequest = {
  modelId: string;
  inputs: string[];
  abortSignal?: AbortSignal;
};

export type LlmEmbedResult = LlmEmbeddingResult & {
  inputCount: number;
};

export class LlmEmbeddingLayer {
  private readonly capabilities = new LlmCapabilityResolver();

  async embed(provider: LlmProvider, request: LlmEmbedRequest): Promise<LlmEmbedResult> {
    this.capabilities.assert(provider, "embeddings");
    if (request.inputs.length === 0) {
      throw new LlmPlatformError("capability_unsupported", "Embedding request requires at least one input.", {
        providerId: provider.id,
      });
    }
    for (const input of request.inputs) {
      if (typeof input !== "string") {
        throw new LlmPlatformError("capability_unsupported", "Embedding inputs must be strings.", {
          providerId: provider.id,
        });
      }
    }

    const result = await provider.embeddings(request satisfies LlmEmbeddingRequest);
    if (result.vectors.length !== request.inputs.length) {
      throw new LlmPlatformError(
        "capability_unsupported",
        "Embedding vector count does not match input count.",
        {
          providerId: provider.id,
          details: {
            expected: request.inputs.length,
            actual: result.vectors.length,
          },
        },
      );
    }

    return {
      ...result,
      inputCount: request.inputs.length,
    };
  }
}
