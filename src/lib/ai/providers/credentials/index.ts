import "server-only";

import {
  getLlmEnvPresence,
  readLlmEnv,
  type LlmEnvPresence,
  type LlmEnvSnapshot,
} from "@/lib/ai/providers/env/llm-env";
import type { LlmProviderId } from "@/lib/ai/providers/provider";

export type LlmProviderCredentials =
  | { providerId: "openai"; apiKey: string }
  | { providerId: "claude"; apiKey: string }
  | { providerId: "gemini"; apiKey: string }
  | { providerId: "openrouter"; apiKey: string }
  | {
      providerId: "azure-openai";
      apiKey: string;
      endpoint: string;
      deployment: string;
    };

/**
 * Resolves provider credentials from environment.
 * Never log or return raw keys outside this module boundary.
 */
export class LlmCredentialResolver {
  constructor(private readonly env: LlmEnvSnapshot = readLlmEnv()) {}

  presence(): LlmEnvPresence {
    return getLlmEnvPresence(this.env);
  }

  resolve(providerId: LlmProviderId): LlmProviderCredentials | null {
    switch (providerId) {
      case "openai":
        return this.env.OPENAI_API_KEY
          ? { providerId: "openai", apiKey: this.env.OPENAI_API_KEY }
          : null;
      case "claude":
        return this.env.ANTHROPIC_API_KEY
          ? { providerId: "claude", apiKey: this.env.ANTHROPIC_API_KEY }
          : null;
      case "gemini":
        return this.env.GEMINI_API_KEY
          ? { providerId: "gemini", apiKey: this.env.GEMINI_API_KEY }
          : null;
      case "openrouter":
        return this.env.OPENROUTER_API_KEY
          ? { providerId: "openrouter", apiKey: this.env.OPENROUTER_API_KEY }
          : null;
      case "azure-openai":
        if (
          this.env.AZURE_OPENAI_KEY &&
          this.env.AZURE_OPENAI_ENDPOINT &&
          this.env.AZURE_OPENAI_DEPLOYMENT
        ) {
          return {
            providerId: "azure-openai",
            apiKey: this.env.AZURE_OPENAI_KEY,
            endpoint: this.env.AZURE_OPENAI_ENDPOINT,
            deployment: this.env.AZURE_OPENAI_DEPLOYMENT,
          };
        }
        return null;
      default:
        return null;
    }
  }

  listConfiguredProviderIds(): LlmProviderId[] {
    const ids: LlmProviderId[] = [
      "openai",
      "claude",
      "gemini",
      "azure-openai",
      "openrouter",
    ];
    return ids.filter((id) => this.resolve(id) !== null);
  }

  preferredDefaultProviderId(): LlmProviderId | null {
    const configured = this.listConfiguredProviderIds();
    if (configured.length === 0) return null;
    const preferred = this.env.LLM_DEFAULT_PROVIDER as LlmProviderId | null;
    if (preferred && configured.includes(preferred)) return preferred;
    return configured[0] ?? null;
  }
}

export function createLlmCredentialResolver(): LlmCredentialResolver {
  return new LlmCredentialResolver();
}
