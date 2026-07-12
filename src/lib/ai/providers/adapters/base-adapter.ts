/**
 * Shared unconfigured adapter base.
 * Implements the full LlmProvider contract without vendor SDKs or network I/O.
 */

import {
  EMPTY_LLM_CAPABILITIES,
  type LlmChatRequest,
  type LlmChatResult,
  type LlmCostEstimate,
  type LlmCostEstimateInput,
  type LlmEmbeddingRequest,
  type LlmEmbeddingResult,
  type LlmHealthCheckResult,
  type LlmModelDescriptor,
  type LlmProvider,
  type LlmProviderCapabilities,
  type LlmProviderId,
  type LlmProviderInitOptions,
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
import { LlmCostEngine } from "@/lib/ai/providers/provider-pricing";
import type { LlmModelRegistry } from "@/lib/ai/providers/provider-models";

export type UnconfiguredAdapterOptions = {
  id: LlmProviderId;
  label: string;
  capabilities?: LlmProviderCapabilities;
  modelRegistry?: LlmModelRegistry;
};

export abstract class UnconfiguredLlmAdapter implements LlmProvider {
  readonly id: LlmProviderId;
  readonly label: string;
  protected initialized = false;
  protected readonly capabilities: LlmProviderCapabilities;
  protected readonly modelRegistry?: LlmModelRegistry;
  private readonly costEngine = new LlmCostEngine();

  protected constructor(options: UnconfiguredAdapterOptions) {
    this.id = options.id;
    this.label = options.label;
    this.capabilities = options.capabilities ?? { ...EMPTY_LLM_CAPABILITIES, health: true, models: true };
    this.modelRegistry = options.modelRegistry;
  }

  getCapabilities(): LlmProviderCapabilities {
    return this.capabilities;
  }

  async initialize(_options?: LlmProviderInitOptions): Promise<void> {
    this.initialized = true;
  }

  async chat(_request: LlmChatRequest): Promise<LlmChatResult> {
    throw new LlmProviderNotConfiguredError(this.id);
  }

  async *stream(_request: LlmStreamRequest): AsyncIterable<LlmStreamChunk> {
    throw new LlmProviderNotConfiguredError(this.id);
  }

  async vision(_request: LlmVisionRequest): Promise<LlmVisionResult> {
    throw new LlmProviderNotConfiguredError(this.id);
  }

  async embeddings(_request: LlmEmbeddingRequest): Promise<LlmEmbeddingResult> {
    throw new LlmProviderNotConfiguredError(this.id);
  }

  async toolCall(_request: LlmToolCallRequest): Promise<LlmToolCallResult> {
    throw new LlmProviderNotConfiguredError(this.id);
  }

  async structuredOutput(
    _request: LlmStructuredOutputRequest,
  ): Promise<LlmStructuredOutputResult> {
    throw new LlmProviderNotConfiguredError(this.id);
  }

  async listModels(): Promise<LlmModelDescriptor[]> {
    if (!this.modelRegistry) return [];
    return this.modelRegistry
      .list({ providerId: this.id })
      .map((model) => ({
        id: model.id,
        providerId: model.providerId,
        displayName: model.displayName,
        capabilities: model.capabilities,
        maxContextTokens: model.maxContextTokens,
        status: model.status,
      }));
  }

  async healthCheck(): Promise<LlmHealthCheckResult> {
    return {
      providerId: this.id,
      status: "disabled",
      checkedAt: new Date().toISOString(),
      message: "Provider adapter is registered but not configured. No network health probe executed.",
    };
  }

  async estimateCost(input: LlmCostEstimateInput): Promise<LlmCostEstimate> {
    const model = this.modelRegistry?.get(input.modelId);
    return this.costEngine.estimate(this.id, model, input);
  }
}
