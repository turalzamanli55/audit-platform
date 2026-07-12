export type {
  LlmProviderId,
  LlmCapabilityKey,
  LlmProviderCapabilities,
  LlmMessageRole,
  LlmTextPart,
  LlmImagePart,
  LlmContentPart,
  LlmChatMessage,
  LlmTokenUsage,
  LlmChatRequest,
  LlmChatResult,
  LlmStreamChunk,
  LlmStreamRequest,
  LlmVisionRequest,
  LlmVisionResult,
  LlmEmbeddingRequest,
  LlmEmbeddingResult,
  LlmToolDefinition,
  LlmToolCallRequest,
  LlmToolCallInvocation,
  LlmToolCallResult,
  LlmStructuredOutputRequest,
  LlmStructuredOutputResult,
  LlmModelDescriptor,
  LlmHealthStatus,
  LlmHealthCheckResult,
  LlmCostEstimateInput,
  LlmCostEstimate,
  LlmProviderInitOptions,
  LlmProvider,
} from "@/lib/ai/providers/provider";
export {
  LLM_PROVIDER_IDS,
  LLM_CAPABILITY_KEYS,
  EMPTY_LLM_CAPABILITIES,
  createCapabilityMatrix,
} from "@/lib/ai/providers/provider";

export {
  LlmPlatformError,
  LlmProviderNotConfiguredError,
  LlmProviderNotRegisteredError,
  LlmCapabilityUnsupportedError,
  LlmRoutingFailedError,
  LlmStructuredOutputInvalidError,
  isLlmPlatformError,
  type LlmErrorCode,
} from "@/lib/ai/providers/provider-errors";

export {
  LlmProviderHealthTracker,
  type LlmProviderHealthRecord,
} from "@/lib/ai/providers/provider-health";

export {
  LlmModelRegistry,
  LLM_PLATFORM_MODEL_CATALOG,
  type LlmModelRecord,
  type LlmModelRegistrationInput,
  type LlmPricingTier,
  type LlmLatencyTier,
  type LlmModelStatus,
} from "@/lib/ai/providers/provider-models";

export { LlmCostEngine, type LlmPricingRates } from "@/lib/ai/providers/provider-pricing";

export {
  LlmCapabilityResolver,
  type LlmResolvedCapabilities,
} from "@/lib/ai/providers/provider-capabilities";

export { LlmProviderRegistry } from "@/lib/ai/providers/provider-registry";

export {
  LlmModelRouter,
  LLM_ROUTE_TASKS,
  type LlmRouteTask,
  type LlmRouteRequest,
  type LlmRouteDecision,
} from "@/lib/ai/providers/provider-router";

export { LlmProviderFactory, type LlmProviderFactoryOptions } from "@/lib/ai/providers/provider-factory";

export {
  LlmStreamingEngine,
  type LlmNormalizedStreamEvent,
} from "@/lib/ai/providers/streaming";

export {
  LlmToolCallingEngine,
  type LlmRegisteredTool,
} from "@/lib/ai/providers/tool-calling";

export {
  LlmVisionLayer,
  type LlmVisionAnalysisRequest,
  type LlmVisionAnalysisResult,
} from "@/lib/ai/providers/vision";

export {
  LlmEmbeddingLayer,
  type LlmEmbedRequest,
  type LlmEmbedResult,
} from "@/lib/ai/providers/embeddings";

export {
  LlmStructuredOutputEngine,
  type LlmJsonSchema,
  type LlmStructuredRequest,
  type LlmStructuredResult,
} from "@/lib/ai/providers/structured-output";

export {
  LlmPlatform,
  bootstrapLlmPlatform,
  LLM_PLATFORM_VERSION,
  type LlmPlatformBootstrap,
  type LlmPlatformOptions,
} from "@/lib/ai/providers/llm-platform";

export { NullAiProvider, NullLlmProvider } from "@/lib/ai/providers/null-provider";

export {
  UnconfiguredLlmAdapter,
  OpenAiProviderAdapter,
  ClaudeProviderAdapter,
  GeminiProviderAdapter,
  AzureOpenAiProviderAdapter,
  OpenRouterProviderAdapter,
  OllamaProviderAdapter,
  LmStudioProviderAdapter,
  LocalLlmProviderAdapter,
  VllmProviderAdapter,
} from "@/lib/ai/providers/adapters";

/** Legacy foundation provider types — preserved for Copilot Core bridge. */
export type {
  AiProvider,
  AiProviderCapability,
  AiProviderCompletionRequest,
  AiProviderCompletionResult,
  AiProviderId,
} from "@/lib/ai/types/provider";
