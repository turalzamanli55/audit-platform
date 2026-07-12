/**
 * Enterprise LLM Platform Layer.
 * Single facade for registry, routing, capabilities, and engines.
 * Business modules depend on this layer — never on vendor adapters.
 */

import { LlmCapabilityResolver } from "@/lib/ai/providers/provider-capabilities";
import { LlmEmbeddingLayer } from "@/lib/ai/providers/embeddings";
import { LlmProviderFactory } from "@/lib/ai/providers/provider-factory";
import { LlmProviderHealthTracker } from "@/lib/ai/providers/provider-health";
import {
  LLM_PLATFORM_MODEL_CATALOG,
  LlmModelRegistry,
} from "@/lib/ai/providers/provider-models";
import { LlmCostEngine } from "@/lib/ai/providers/provider-pricing";
import { LlmProviderRegistry } from "@/lib/ai/providers/provider-registry";
import { LlmModelRouter, type LlmRouteDecision, type LlmRouteRequest } from "@/lib/ai/providers/provider-router";
import { LlmStreamingEngine } from "@/lib/ai/providers/streaming";
import { LlmStructuredOutputEngine } from "@/lib/ai/providers/structured-output";
import { LlmToolCallingEngine } from "@/lib/ai/providers/tool-calling";
import { LlmVisionLayer } from "@/lib/ai/providers/vision";
import type {
  LlmChatRequest,
  LlmChatResult,
  LlmCostEstimate,
  LlmCostEstimateInput,
  LlmProvider,
  LlmProviderId,
} from "@/lib/ai/providers/provider";

export const LLM_PLATFORM_VERSION = "1.0.0" as const;

export type LlmPlatformBootstrap = {
  version: typeof LLM_PLATFORM_VERSION;
  providerCount: number;
  modelCount: number;
  defaultProviderId: LlmProviderId | null;
  platform: LlmPlatform;
};

export type LlmPlatformOptions = {
  registerAllAdapters?: boolean;
  seedModels?: boolean;
};

export class LlmPlatform {
  readonly version = LLM_PLATFORM_VERSION;
  readonly providers: LlmProviderRegistry;
  readonly models: LlmModelRegistry;
  readonly factory: LlmProviderFactory;
  readonly health: LlmProviderHealthTracker;
  readonly router: LlmModelRouter;
  readonly capabilities: LlmCapabilityResolver;
  readonly streaming: LlmStreamingEngine;
  readonly tools: LlmToolCallingEngine;
  readonly vision: LlmVisionLayer;
  readonly embeddings: LlmEmbeddingLayer;
  readonly structuredOutput: LlmStructuredOutputEngine;
  readonly cost: LlmCostEngine;

  constructor(options: LlmPlatformOptions = {}) {
    this.providers = new LlmProviderRegistry();
    this.models = new LlmModelRegistry(options.seedModels === false ? [] : LLM_PLATFORM_MODEL_CATALOG);
    this.factory = new LlmProviderFactory();
    this.health = new LlmProviderHealthTracker();
    this.router = new LlmModelRouter(this.models, this.providers, this.health);
    this.capabilities = new LlmCapabilityResolver();
    this.streaming = new LlmStreamingEngine();
    this.tools = new LlmToolCallingEngine();
    this.vision = new LlmVisionLayer();
    this.embeddings = new LlmEmbeddingLayer();
    this.structuredOutput = new LlmStructuredOutputEngine();
    this.cost = new LlmCostEngine();

    if (options.registerAllAdapters !== false) {
      for (const provider of this.factory.createAll({ modelRegistry: this.models })) {
        this.providers.registerProvider(provider);
      }
      this.providers.setDefaultProvider("none");
    }
  }

  registerProvider(provider: LlmProvider): void {
    this.providers.registerProvider(provider);
  }

  removeProvider(providerId: LlmProviderId): boolean {
    return this.providers.removeProvider(providerId);
  }

  defaultProvider(): LlmProvider {
    return this.providers.defaultProvider();
  }

  listProviders(): LlmProvider[] {
    return this.providers.listProviders();
  }

  route(request: LlmRouteRequest): LlmRouteDecision {
    return this.router.route(request);
  }

  async chat(request: LlmChatRequest, providerId?: LlmProviderId): Promise<LlmChatResult> {
    const provider = providerId ? this.providers.require(providerId) : this.defaultProvider();
    this.capabilities.assert(provider, "chat");
    return provider.chat(request);
  }

  estimateCost(input: LlmCostEstimateInput, providerId?: LlmProviderId): LlmCostEstimate {
    const provider = providerId ? this.providers.require(providerId) : this.defaultProvider();
    const model = this.models.get(input.modelId);
    return this.cost.estimate(provider.id, model, input);
  }

  async refreshHealth(providerId?: LlmProviderId): Promise<void> {
    const targets = providerId
      ? [this.providers.require(providerId)]
      : this.providers.listProviders();
    for (const provider of targets) {
      const result = await provider.healthCheck();
      this.health.record(result);
    }
  }
}

export function bootstrapLlmPlatform(options?: LlmPlatformOptions): LlmPlatformBootstrap {
  const platform = new LlmPlatform(options);
  return {
    version: LLM_PLATFORM_VERSION,
    providerCount: platform.listProviders().length,
    modelCount: platform.models.list().length,
    defaultProviderId: platform.providers.getDefaultProviderId(),
    platform,
  };
}
