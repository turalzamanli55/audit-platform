/**
 * Model router — selects models by task, capabilities, cost, and availability.
 */

import type { LlmProviderId } from "@/lib/ai/providers/provider";
import { LlmRoutingFailedError } from "@/lib/ai/providers/provider-errors";
import type { LlmProviderHealthTracker } from "@/lib/ai/providers/provider-health";
import type { LlmModelRecord, LlmModelRegistry } from "@/lib/ai/providers/provider-models";
import type { LlmProviderRegistry } from "@/lib/ai/providers/provider-registry";

export const LLM_ROUTE_TASKS = [
  "navigate",
  "answer",
  "suggest",
  "search",
  "explain",
  "audit_reasoning",
  "vision",
  "embeddings",
  "tool_calling",
  "structured_output",
  "general_chat",
] as const;

export type LlmRouteTask = (typeof LLM_ROUTE_TASKS)[number];

export type LlmRouteRequest = {
  task: LlmRouteTask;
  estimatedContextTokens?: number;
  visionNeeded?: boolean;
  embeddingsNeeded?: boolean;
  toolCallingNeeded?: boolean;
  structuredOutputNeeded?: boolean;
  reasoningNeeded?: boolean;
  preferLatency?: "low" | "medium" | "high";
  preferCost?: "free" | "standard" | "premium";
  allowedProviderIds?: LlmProviderId[];
};

export type LlmRouteDecision = {
  model: LlmModelRecord;
  providerId: LlmProviderId;
  reason: string;
  score: number;
};

const LATENCY_SCORE: Record<LlmModelRecord["latencyTier"], number> = {
  low: 3,
  medium: 2,
  high: 1,
  unknown: 1,
};

const COST_SCORE: Record<LlmModelRecord["pricingTier"], number> = {
  free: 3,
  standard: 2,
  premium: 1,
  unknown: 1,
};

export class LlmModelRouter {
  constructor(
    private readonly models: LlmModelRegistry,
    private readonly providers: LlmProviderRegistry,
    private readonly health: LlmProviderHealthTracker,
  ) {}

  route(request: LlmRouteRequest): LlmRouteDecision {
    const candidates = this.models
      .list({ status: "available" })
      .filter((model) => this.matchesRequirements(model, request))
      .filter((model) => this.isProviderEligible(model.providerId, request.allowedProviderIds));

    if (candidates.length === 0) {
      throw new LlmRoutingFailedError("No model matched routing requirements.", {
        task: request.task,
      });
    }

    const scored = candidates
      .map((model) => ({
        model,
        score: this.score(model, request),
        reason: this.explain(model, request),
      }))
      .sort((a, b) => b.score - a.score);

    const winner = scored[0];
    return {
      model: winner.model,
      providerId: winner.model.providerId,
      reason: winner.reason,
      score: winner.score,
    };
  }

  private matchesRequirements(model: LlmModelRecord, request: LlmRouteRequest): boolean {
    if (request.embeddingsNeeded || request.task === "embeddings") {
      return model.embeddings;
    }
    if (request.visionNeeded || request.task === "vision") {
      return model.vision;
    }
    if (model.embeddings) {
      return false;
    }
    if (request.estimatedContextTokens && model.maxContextTokens < request.estimatedContextTokens) {
      return false;
    }
    if (request.toolCallingNeeded && !model.toolCalling) return false;
    if (request.structuredOutputNeeded && !model.structuredOutput) return false;
    if (request.reasoningNeeded || request.task === "audit_reasoning") {
      return model.reasoning;
    }
    if (request.task === "navigate" || request.task === "suggest" || request.task === "search") {
      return !model.reasoning && !model.vision && !model.embeddings;
    }
    return !model.embeddings;
  }

  private isProviderEligible(
    providerId: LlmProviderId,
    allowed?: LlmProviderId[],
  ): boolean {
    if (allowed && !allowed.includes(providerId)) return false;
    // Logical platform catalog models use providerId "none" and remain routable
    // without requiring a live vendor connection.
    if (providerId === "none") return true;
    if (!this.providers.has(providerId)) return false;
    return this.health.isRoutable(providerId);
  }

  private score(model: LlmModelRecord, request: LlmRouteRequest): number {
    let score = 0;
    score += LATENCY_SCORE[model.latencyTier];
    score += COST_SCORE[model.pricingTier];

    if (request.preferLatency && model.latencyTier === request.preferLatency) score += 2;
    if (request.preferCost && model.pricingTier === request.preferCost) score += 2;

    if (request.task === "navigate" && model.latencyTier === "low") score += 3;
    if (request.task === "audit_reasoning" && model.reasoning) score += 4;
    if (request.task === "vision" && model.vision) score += 4;
    if (request.task === "embeddings" && model.embeddings) score += 4;

    if (this.providers.getDefaultProviderId() === model.providerId) score += 1;
    return score;
  }

  private explain(model: LlmModelRecord, request: LlmRouteRequest): string {
    if (request.task === "navigate") {
      return `Selected small/low-latency model "${model.id}" for simple navigation.`;
    }
    if (request.task === "audit_reasoning") {
      return `Selected reasoning model "${model.id}" for complex audit reasoning.`;
    }
    if (request.task === "vision") {
      return `Selected vision model "${model.id}" for image analysis.`;
    }
    if (request.task === "embeddings") {
      return `Selected embedding model "${model.id}" for vectorization.`;
    }
    return `Selected model "${model.id}" for task "${request.task}".`;
  }
}
