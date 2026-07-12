import { describe, expect, it } from "vitest";
import {
  bootstrapLlmPlatform,
  LlmProviderNotConfiguredError,
  LlmStructuredOutputEngine,
  OpenAiProviderAdapter,
} from "@/lib/ai/providers";

describe("Enterprise LLM Platform Layer", () => {
  it("bootstraps registry with all adapters and platform models", () => {
    const boot = bootstrapLlmPlatform();
    expect(boot.version).toBe("1.0.0");
    expect(boot.providerCount).toBe(10);
    expect(boot.modelCount).toBeGreaterThanOrEqual(4);
    expect(boot.defaultProviderId).toBe("none");
  });

  it("routes navigation to a small model and audit reasoning to a reasoning model", () => {
    const { platform } = bootstrapLlmPlatform();
    const navigate = platform.route({ task: "navigate", preferLatency: "low" });
    expect(navigate.model.id).toBe("platform.small");

    const reasoning = platform.route({ task: "audit_reasoning", reasoningNeeded: true });
    expect(reasoning.model.reasoning).toBe(true);
    expect(reasoning.model.id).toBe("platform.large-reasoning");

    const vision = platform.route({ task: "vision", visionNeeded: true });
    expect(vision.model.vision).toBe(true);

    const embeddings = platform.route({ task: "embeddings", embeddingsNeeded: true });
    expect(embeddings.model.embeddings).toBe(true);
  });

  it("resolves capabilities without vendor SDKs", () => {
    const { platform } = bootstrapLlmPlatform();
    const openai = platform.providers.require("openai");
    const resolved = platform.capabilities.resolveProvider(openai);
    expect(resolved.canStream).toBe(true);
    expect(resolved.supportsVision).toBe(true);
    expect(resolved.canCallTools).toBe(true);
  });

  it("keeps unconfigured adapters from making network calls", async () => {
    const adapter = new OpenAiProviderAdapter();
    await adapter.initialize();
    await expect(
      adapter.chat({
        modelId: "gpt-placeholder",
        messages: [{ role: "user", content: "hello" }],
      }),
    ).rejects.toBeInstanceOf(LlmProviderNotConfiguredError);

    const health = await adapter.healthCheck();
    expect(health.status).toBe("disabled");
  });

  it("estimates cost from pricing tiers without billing APIs", () => {
    const { platform } = bootstrapLlmPlatform();
    const estimate = platform.estimateCost({
      modelId: "platform.large-reasoning",
      inputTokens: 1_000,
      outputTokens: 500,
    });
    expect(estimate.pricingTier).toBe("premium");
    expect(estimate.estimatedCostUsd).toBeGreaterThan(0);
    expect(estimate.estimatedLatencyMs).toBeGreaterThan(0);
  });

  it("repairs structured JSON locally", () => {
    const engine = new LlmStructuredOutputEngine();
    const repaired = engine.tryRepair('Here is JSON:\n```json\n{"ok":true}\n```');
    expect(repaired).toEqual({ ok: true });
  });

  it("registers tools without executing Action Registry logic", () => {
    const { platform } = bootstrapLlmPlatform();
    platform.tools.registerTool({
      name: "open_module",
      description: "Open a platform module",
      parametersSchema: { type: "object", properties: { moduleId: { type: "string" } } },
      actionId: "platform.open_module",
    });
    const bindings = platform.tools.resolveActionBindings([
      { id: "call_1", name: "open_module", argumentsJson: '{"moduleId":"planning"}' },
    ]);
    expect(bindings[0]?.actionId).toBe("platform.open_module");
  });

  it("uses null provider chat soft-refusal through the platform facade", async () => {
    const { platform } = bootstrapLlmPlatform();
    const result = await platform.chat({
      modelId: "platform.none",
      messages: [{ role: "user", content: "hello" }],
    });
    expect(result.providerId).toBe("none");
    expect(result.finishReason).toBe("not_configured");
  });
});
