/**
 * Legacy Copilot Core provider bridge.
 * Full enterprise LLM contracts live in `@/lib/ai/providers`.
 */

import type { AiPromptObject } from "@/lib/ai/types/prompts";

export type AiProviderId = "none" | "future";

export type AiProviderCapability = {
  id: AiProviderId;
  label: string;
  supportsStreaming: boolean;
  configured: boolean;
};

export type AiProviderCompletionRequest = {
  prompt: AiPromptObject;
};

export type AiProviderCompletionResult = {
  text: string;
  citations: Array<{ sourceId: string; label: string }>;
  providerId: AiProviderId;
};

export type AiProvider = {
  getCapability(): AiProviderCapability;
  /**
   * Must not call external LLMs until a configured adapter is wired.
   * Implementations return a governed refusal by default.
   */
  complete(request: AiProviderCompletionRequest): Promise<AiProviderCompletionResult>;
};
