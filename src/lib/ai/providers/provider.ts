/**
 * Enterprise LLM Provider Interface.
 * Provider-independent — business modules never import vendor SDKs.
 */

import type { AiPromptObject } from "@/lib/ai/types/prompts";

export const LLM_PROVIDER_IDS = [
  "none",
  "openai",
  "claude",
  "gemini",
  "azure-openai",
  "openrouter",
  "ollama",
  "lm-studio",
  "local-llm",
  "vllm",
] as const;

export type LlmProviderId = (typeof LLM_PROVIDER_IDS)[number];

export const LLM_CAPABILITY_KEYS = [
  "chat",
  "stream",
  "vision",
  "toolCalling",
  "embeddings",
  "structuredOutput",
  "health",
  "models",
  "tokenUsage",
  "pricing",
  "reasoning",
  "largeContext",
] as const;

export type LlmCapabilityKey = (typeof LLM_CAPABILITY_KEYS)[number];

export type LlmProviderCapabilities = Readonly<Record<LlmCapabilityKey, boolean>>;

export type LlmMessageRole = "system" | "user" | "assistant" | "tool";

export type LlmTextPart = { type: "text"; text: string };
export type LlmImagePart = {
  type: "image";
  mediaType: string;
  /** Opaque reference — never raw secrets. Host supplies bytes later. */
  dataRef: string;
};
export type LlmContentPart = LlmTextPart | LlmImagePart;

export type LlmChatMessage = {
  role: LlmMessageRole;
  content: string | LlmContentPart[];
  toolCallId?: string;
  name?: string;
};

export type LlmTokenUsage = {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
};

export type LlmChatRequest = {
  modelId: string;
  messages: LlmChatMessage[];
  /** Optional pre-built enterprise prompt object from Prompt Builder. */
  prompt?: AiPromptObject;
  maxOutputTokens?: number;
  temperature?: number;
  abortSignal?: AbortSignal;
};

export type LlmChatResult = {
  providerId: LlmProviderId;
  modelId: string;
  text: string;
  finishReason: "stop" | "length" | "tool_calls" | "content_filter" | "error" | "not_configured";
  usage?: LlmTokenUsage;
};

export type LlmStreamChunk =
  | { type: "delta"; text: string }
  | { type: "usage"; usage: LlmTokenUsage }
  | { type: "tool_call_delta"; toolCallId: string; name?: string; argumentsDelta?: string }
  | { type: "error"; message: string; code?: string }
  | { type: "done"; finishReason: LlmChatResult["finishReason"] };

export type LlmStreamRequest = LlmChatRequest;

export type LlmVisionRequest = {
  modelId: string;
  prompt: string;
  images: LlmImagePart[];
  abortSignal?: AbortSignal;
};

export type LlmVisionResult = {
  providerId: LlmProviderId;
  modelId: string;
  text: string;
  usage?: LlmTokenUsage;
};

export type LlmEmbeddingRequest = {
  modelId: string;
  inputs: string[];
  abortSignal?: AbortSignal;
};

export type LlmEmbeddingResult = {
  providerId: LlmProviderId;
  modelId: string;
  vectors: number[][];
  dimensions: number;
  usage?: LlmTokenUsage;
};

export type LlmToolDefinition = {
  name: string;
  description: string;
  /** JSON Schema object for parameters — validated by Tool Calling engine. */
  parametersSchema: Record<string, unknown>;
};

export type LlmToolCallRequest = {
  modelId: string;
  messages: LlmChatMessage[];
  tools: LlmToolDefinition[];
  abortSignal?: AbortSignal;
};

export type LlmToolCallInvocation = {
  id: string;
  name: string;
  argumentsJson: string;
};

export type LlmToolCallResult = {
  providerId: LlmProviderId;
  modelId: string;
  text?: string;
  toolCalls: LlmToolCallInvocation[];
  usage?: LlmTokenUsage;
};

export type LlmStructuredOutputRequest = {
  modelId: string;
  messages: LlmChatMessage[];
  /** JSON Schema describing the expected object. */
  schema: Record<string, unknown>;
  schemaName?: string;
  abortSignal?: AbortSignal;
};

export type LlmStructuredOutputResult = {
  providerId: LlmProviderId;
  modelId: string;
  object: unknown;
  rawText: string;
  repaired: boolean;
  usage?: LlmTokenUsage;
};

export type LlmModelDescriptor = {
  id: string;
  providerId: LlmProviderId;
  displayName: string;
  capabilities: LlmProviderCapabilities;
  maxContextTokens: number;
  status: "available" | "deprecated" | "disabled" | "unknown";
};

export type LlmHealthStatus =
  | "healthy"
  | "offline"
  | "rate_limited"
  | "auth_failed"
  | "quota_exceeded"
  | "timeout"
  | "disabled"
  | "unknown";

export type LlmHealthCheckResult = {
  providerId: LlmProviderId;
  status: LlmHealthStatus;
  checkedAt: string;
  message?: string;
  latencyMs?: number;
};

export type LlmCostEstimateInput = {
  modelId: string;
  inputTokens: number;
  outputTokens: number;
};

export type LlmCostEstimate = {
  providerId: LlmProviderId;
  modelId: string;
  inputTokens: number;
  outputTokens: number;
  estimatedCostUsd: number;
  estimatedLatencyMs: number;
  pricingTier: "free" | "standard" | "premium" | "unknown";
  latencyTier: "low" | "medium" | "high" | "unknown";
};

export type LlmProviderInitOptions = {
  /** Configuration handle only — never store API keys in adapters at this layer. */
  configRef?: string;
};

/**
 * Canonical provider contract. Every adapter implements this surface.
 * Live adapters may call vendor networks only when credentials are present (server-side).
 */
export type LlmProvider = {
  readonly id: LlmProviderId;
  readonly label: string;
  getCapabilities(): LlmProviderCapabilities;
  initialize(options?: LlmProviderInitOptions): Promise<void>;
  chat(request: LlmChatRequest): Promise<LlmChatResult>;
  stream(request: LlmStreamRequest): AsyncIterable<LlmStreamChunk>;
  vision(request: LlmVisionRequest): Promise<LlmVisionResult>;
  embeddings(request: LlmEmbeddingRequest): Promise<LlmEmbeddingResult>;
  toolCall(request: LlmToolCallRequest): Promise<LlmToolCallResult>;
  structuredOutput(request: LlmStructuredOutputRequest): Promise<LlmStructuredOutputResult>;
  listModels(): Promise<LlmModelDescriptor[]>;
  healthCheck(): Promise<LlmHealthCheckResult>;
  estimateCost(input: LlmCostEstimateInput): Promise<LlmCostEstimate>;
};

export const EMPTY_LLM_CAPABILITIES: LlmProviderCapabilities = {
  chat: false,
  stream: false,
  vision: false,
  toolCalling: false,
  embeddings: false,
  structuredOutput: false,
  health: true,
  models: true,
  tokenUsage: false,
  pricing: false,
  reasoning: false,
  largeContext: false,
};

export function createCapabilityMatrix(
  overrides: Partial<LlmProviderCapabilities> = {},
): LlmProviderCapabilities {
  return { ...EMPTY_LLM_CAPABILITIES, ...overrides };
}
