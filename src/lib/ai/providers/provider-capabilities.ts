/**
 * Capability resolver — derives what a provider/model can do.
 */

import type {
  LlmCapabilityKey,
  LlmProvider,
  LlmProviderCapabilities,
} from "@/lib/ai/providers/provider";
import type { LlmModelRecord } from "@/lib/ai/providers/provider-models";
import { LlmCapabilityUnsupportedError } from "@/lib/ai/providers/provider-errors";

export type LlmResolvedCapabilities = {
  canStream: boolean;
  canCallTools: boolean;
  supportsJson: boolean;
  supportsVision: boolean;
  supportsEmbeddings: boolean;
  supportsLargeContext: boolean;
  supportsReasoning: boolean;
  raw: LlmProviderCapabilities;
};

export class LlmCapabilityResolver {
  resolveProvider(provider: LlmProvider): LlmResolvedCapabilities {
    return this.fromMatrix(provider.getCapabilities());
  }

  resolveModel(model: LlmModelRecord): LlmResolvedCapabilities {
    return {
      canStream: model.streaming,
      canCallTools: model.toolCalling,
      supportsJson: model.structuredOutput,
      supportsVision: model.vision,
      supportsEmbeddings: model.embeddings,
      supportsLargeContext: model.maxContextTokens >= 100_000 || model.capabilities.largeContext,
      supportsReasoning: model.reasoning,
      raw: model.capabilities,
    };
  }

  fromMatrix(capabilities: LlmProviderCapabilities): LlmResolvedCapabilities {
    return {
      canStream: capabilities.stream,
      canCallTools: capabilities.toolCalling,
      supportsJson: capabilities.structuredOutput,
      supportsVision: capabilities.vision,
      supportsEmbeddings: capabilities.embeddings,
      supportsLargeContext: capabilities.largeContext,
      supportsReasoning: capabilities.reasoning,
      raw: capabilities,
    };
  }

  assert(
    provider: LlmProvider,
    capability: LlmCapabilityKey,
  ): void {
    const caps = provider.getCapabilities();
    if (!caps[capability]) {
      throw new LlmCapabilityUnsupportedError(provider.id, capability);
    }
  }

  supports(capabilities: LlmProviderCapabilities, capability: LlmCapabilityKey): boolean {
    return capabilities[capability];
  }
}
