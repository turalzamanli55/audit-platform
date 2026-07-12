import { describe, expect, it } from "vitest";
import {
  bootstrapLlmPlatform,
  getLlmEnvPresence,
  LLM_VENDOR_MODEL_CATALOG,
  mapProviderError,
  withLlmRetry,
  llmObservability,
  bindToolRuntimeToLlmPlatform,
  bootstrapAiToolRuntime,
  OpenAiProviderAdapter,
} from "@/lib/ai";

describe("Enterprise Multi-Provider Integration Layer", () => {
  it("keeps cloud providers disabled without credentials", async () => {
    const adapter = new OpenAiProviderAdapter();
    const health = await adapter.healthCheck();
    expect(health.status).toBe("disabled");
  });

  it("exposes vendor model catalog with capability metadata", () => {
    expect(LLM_VENDOR_MODEL_CATALOG.length).toBeGreaterThan(8);
    const reasoning = LLM_VENDOR_MODEL_CATALOG.find((model) => model.reasoning);
    const vision = LLM_VENDOR_MODEL_CATALOG.find((model) => model.vision);
    const embeddings = LLM_VENDOR_MODEL_CATALOG.find((model) => model.embeddings);
    expect(reasoning?.providerId).toBeTruthy();
    expect(vision?.vision).toBe(true);
    expect(embeddings?.embeddings).toBe(true);
  });

  it("maps vendor errors to enterprise codes without leaking SDK shapes", () => {
    const rate = mapProviderError("openai", { status: 429, message: "rate limit" });
    expect(rate.code).toBe("provider_rate_limited");
    const auth = mapProviderError("claude", { status: 401, message: "invalid api key sk-secret" });
    expect(auth.code).toBe("provider_auth_failed");
    expect(auth.message).not.toMatch(/sk-secret/);
  });

  it("retries with exponential backoff on retryable failures", async () => {
    let attempts = 0;
    const { value, attempts: used } = await withLlmRetry(
      async () => {
        attempts += 1;
        if (attempts < 3) {
          throw Object.assign(new Error("temporary"), { status: 503 });
        }
        return "ok";
      },
      { maxAttempts: 3, baseDelayMs: 1, maxDelayMs: 5 },
    );
    expect(value).toBe("ok");
    expect(used).toBe(3);
  });

  it("records observability without storing prompts or responses", () => {
    llmObservability.reset();
    llmObservability.record({
      providerId: "openai",
      modelId: "openai.gpt-4.1-mini",
      operation: "chat",
      success: true,
      latencyMs: 120,
      usage: { inputTokens: 10, outputTokens: 20, totalTokens: 30 },
      retries: 0,
      estimatedCostUsd: 0.001,
    });
    const snap = llmObservability.snapshot();
    expect(snap.totalOperations).toBe(1);
    expect(snap.totalInputTokens).toBe(10);
    expect(JSON.stringify(snap)).not.toMatch(/prompt|messages|content/i);
  });

  it("binds Tool Runtime definitions into LLM tool engine", () => {
    const { platform } = bootstrapLlmPlatform();
    const count = bindToolRuntimeToLlmPlatform(platform, bootstrapAiToolRuntime());
    expect(count).toBeGreaterThan(40);
    expect(platform.tools.listTools().length).toBe(count);
    expect(JSON.stringify(platform.tools.listTools())).not.toMatch(/Repository\(|supabase/i);
  });

  it("reports env presence without requiring keys", () => {
    const presence = getLlmEnvPresence({
      OPENAI_API_KEY: null,
      ANTHROPIC_API_KEY: null,
      GEMINI_API_KEY: null,
      OPENROUTER_API_KEY: null,
      AZURE_OPENAI_ENDPOINT: null,
      AZURE_OPENAI_KEY: null,
      AZURE_OPENAI_DEPLOYMENT: null,
      LLM_DEFAULT_PROVIDER: null,
    });
    expect(presence.openai).toBe(false);
    expect(presence.anthropic).toBe(false);
  });

  it("seeds vendor models when requested and falls back routing to platform models", () => {
    const { platform } = bootstrapLlmPlatform({ seedVendorModels: true });
    expect(platform.models.list().length).toBeGreaterThan(10);
    // Without live health, default remains none and platform models remain routable.
    const navigate = platform.route({ task: "navigate", preferLatency: "low" });
    expect(navigate.model.providerId).toBe("none");
  });
});
