/**
 * Cost estimation engine — provider-independent pricing tiers.
 * No live billing APIs.
 */

import type {
  LlmCostEstimate,
  LlmCostEstimateInput,
  LlmProviderId,
} from "@/lib/ai/providers/provider";
import type { LlmModelRecord } from "@/lib/ai/providers/provider-models";

export type LlmPricingRates = {
  inputPerMillionUsd: number;
  outputPerMillionUsd: number;
  estimatedLatencyMsPer1kOutputTokens: number;
};

const TIER_RATES: Record<LlmModelRecord["pricingTier"], LlmPricingRates> = {
  free: { inputPerMillionUsd: 0, outputPerMillionUsd: 0, estimatedLatencyMsPer1kOutputTokens: 800 },
  standard: {
    inputPerMillionUsd: 0.5,
    outputPerMillionUsd: 1.5,
    estimatedLatencyMsPer1kOutputTokens: 600,
  },
  premium: {
    inputPerMillionUsd: 5,
    outputPerMillionUsd: 15,
    estimatedLatencyMsPer1kOutputTokens: 900,
  },
  unknown: {
    inputPerMillionUsd: 0,
    outputPerMillionUsd: 0,
    estimatedLatencyMsPer1kOutputTokens: 1000,
  },
};

const LATENCY_BASE_MS: Record<LlmModelRecord["latencyTier"], number> = {
  low: 400,
  medium: 1200,
  high: 3000,
  unknown: 1500,
};

export class LlmCostEngine {
  estimate(
    providerId: LlmProviderId,
    model: LlmModelRecord | undefined,
    input: LlmCostEstimateInput,
  ): LlmCostEstimate {
    const pricingTier = model?.pricingTier ?? "unknown";
    const latencyTier = model?.latencyTier ?? "unknown";
    const rates = TIER_RATES[pricingTier];
    const estimatedCostUsd =
      (input.inputTokens / 1_000_000) * rates.inputPerMillionUsd +
      (input.outputTokens / 1_000_000) * rates.outputPerMillionUsd;
    const estimatedLatencyMs =
      LATENCY_BASE_MS[latencyTier] +
      Math.ceil(input.outputTokens / 1000) * rates.estimatedLatencyMsPer1kOutputTokens;

    return {
      providerId,
      modelId: input.modelId,
      inputTokens: input.inputTokens,
      outputTokens: input.outputTokens,
      estimatedCostUsd: Number(estimatedCostUsd.toFixed(8)),
      estimatedLatencyMs,
      pricingTier,
      latencyTier,
    };
  }
}
