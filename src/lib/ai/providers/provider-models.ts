/**
 * Enterprise model registry — provider-agnostic model catalog.
 */

import {
  createCapabilityMatrix,
  type LlmModelDescriptor,
  type LlmProviderCapabilities,
  type LlmProviderId,
} from "@/lib/ai/providers/provider";
import { LlmPlatformError } from "@/lib/ai/providers/provider-errors";

export type LlmPricingTier = "free" | "standard" | "premium" | "unknown";
export type LlmLatencyTier = "low" | "medium" | "high" | "unknown";
export type LlmModelStatus = "available" | "deprecated" | "disabled" | "unknown";

export type LlmModelRecord = {
  id: string;
  providerId: LlmProviderId;
  displayName: string;
  capabilities: LlmProviderCapabilities;
  maxContextTokens: number;
  vision: boolean;
  streaming: boolean;
  structuredOutput: boolean;
  embeddings: boolean;
  toolCalling: boolean;
  reasoning: boolean;
  pricingTier: LlmPricingTier;
  latencyTier: LlmLatencyTier;
  status: LlmModelStatus;
};

export type LlmModelRegistrationInput = Omit<LlmModelRecord, "capabilities"> & {
  capabilities?: Partial<LlmProviderCapabilities>;
};

function toCapabilities(input: LlmModelRegistrationInput): LlmProviderCapabilities {
  return createCapabilityMatrix({
    chat: !input.embeddings || Boolean(input.capabilities?.chat),
    stream: input.streaming,
    vision: input.vision,
    toolCalling: input.toolCalling,
    embeddings: input.embeddings,
    structuredOutput: input.structuredOutput,
    health: true,
    models: true,
    tokenUsage: true,
    pricing: input.pricingTier !== "unknown",
    reasoning: input.reasoning,
    largeContext: input.maxContextTokens >= 100_000,
    ...input.capabilities,
  });
}

function toRecord(input: LlmModelRegistrationInput): LlmModelRecord {
  const capabilities = toCapabilities(input);
  return {
    id: input.id,
    providerId: input.providerId,
    displayName: input.displayName,
    capabilities,
    maxContextTokens: input.maxContextTokens,
    vision: input.vision,
    streaming: input.streaming,
    structuredOutput: input.structuredOutput,
    embeddings: input.embeddings,
    toolCalling: input.toolCalling,
    reasoning: input.reasoning,
    pricingTier: input.pricingTier,
    latencyTier: input.latencyTier,
    status: input.status,
  };
}

/** Platform catalog — logical models only. No vendor API wiring. */
export const LLM_PLATFORM_MODEL_CATALOG: LlmModelRegistrationInput[] = [
  {
    id: "platform.small",
    providerId: "none",
    displayName: "Platform Small",
    maxContextTokens: 8_192,
    vision: false,
    streaming: true,
    structuredOutput: true,
    embeddings: false,
    toolCalling: true,
    reasoning: false,
    pricingTier: "standard",
    latencyTier: "low",
    status: "available",
  },
  {
    id: "platform.large-reasoning",
    providerId: "none",
    displayName: "Platform Large Reasoning",
    maxContextTokens: 200_000,
    vision: false,
    streaming: true,
    structuredOutput: true,
    embeddings: false,
    toolCalling: true,
    reasoning: true,
    pricingTier: "premium",
    latencyTier: "high",
    status: "available",
  },
  {
    id: "platform.vision",
    providerId: "none",
    displayName: "Platform Vision",
    maxContextTokens: 32_768,
    vision: true,
    streaming: true,
    structuredOutput: false,
    embeddings: false,
    toolCalling: false,
    reasoning: false,
    pricingTier: "premium",
    latencyTier: "medium",
    status: "available",
  },
  {
    id: "platform.embeddings",
    providerId: "none",
    displayName: "Platform Embeddings",
    maxContextTokens: 8_192,
    vision: false,
    streaming: false,
    structuredOutput: false,
    embeddings: true,
    toolCalling: false,
    reasoning: false,
    pricingTier: "standard",
    latencyTier: "low",
    status: "available",
    capabilities: { chat: false },
  },
];

export class LlmModelRegistry {
  private readonly models = new Map<string, LlmModelRecord>();

  constructor(seed: LlmModelRegistrationInput[] = LLM_PLATFORM_MODEL_CATALOG) {
    for (const entry of seed) {
      this.register(entry);
    }
  }

  register(input: LlmModelRegistrationInput): LlmModelRecord {
    const record = toRecord(input);
    this.models.set(record.id, record);
    return record;
  }

  remove(modelId: string): boolean {
    return this.models.delete(modelId);
  }

  get(modelId: string): LlmModelRecord | undefined {
    return this.models.get(modelId);
  }

  require(modelId: string): LlmModelRecord {
    const model = this.models.get(modelId);
    if (!model) {
      throw new LlmPlatformError("model_not_found", `Model "${modelId}" is not registered.`, {
        details: { modelId },
      });
    }
    return model;
  }

  list(filter?: {
    providerId?: LlmProviderId;
    status?: LlmModelStatus;
    capability?: keyof Pick<
      LlmModelRecord,
      "vision" | "streaming" | "structuredOutput" | "embeddings" | "toolCalling" | "reasoning"
    >;
  }): LlmModelRecord[] {
    return [...this.models.values()].filter((model) => {
      if (filter?.providerId && model.providerId !== filter.providerId) return false;
      if (filter?.status && model.status !== filter.status) return false;
      if (filter?.capability && !model[filter.capability]) return false;
      return true;
    });
  }

  toDescriptors(): LlmModelDescriptor[] {
    return this.list().map((model) => ({
      id: model.id,
      providerId: model.providerId,
      displayName: model.displayName,
      capabilities: model.capabilities,
      maxContextTokens: model.maxContextTokens,
      status: model.status,
    }));
  }
}
