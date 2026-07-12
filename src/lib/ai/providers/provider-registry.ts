/**
 * Provider registry — register, remove, default, list.
 */

import type { LlmProvider, LlmProviderId } from "@/lib/ai/providers/provider";
import {
  LlmProviderNotRegisteredError,
  LlmPlatformError,
} from "@/lib/ai/providers/provider-errors";

export class LlmProviderRegistry {
  private readonly providers = new Map<LlmProviderId, LlmProvider>();
  private defaultProviderId: LlmProviderId | null = null;

  registerProvider(provider: LlmProvider): void {
    this.providers.set(provider.id, provider);
    if (this.defaultProviderId === null) {
      this.defaultProviderId = provider.id;
    }
  }

  removeProvider(providerId: LlmProviderId): boolean {
    const removed = this.providers.delete(providerId);
    if (removed && this.defaultProviderId === providerId) {
      this.defaultProviderId = this.providers.keys().next().value ?? null;
    }
    return removed;
  }

  defaultProvider(): LlmProvider {
    if (!this.defaultProviderId) {
      throw new LlmPlatformError("provider_not_registered", "No default LLM provider is set.");
    }
    return this.require(this.defaultProviderId);
  }

  setDefaultProvider(providerId: LlmProviderId): void {
    this.require(providerId);
    this.defaultProviderId = providerId;
  }

  getDefaultProviderId(): LlmProviderId | null {
    return this.defaultProviderId;
  }

  get(providerId: LlmProviderId): LlmProvider | undefined {
    return this.providers.get(providerId);
  }

  require(providerId: LlmProviderId): LlmProvider {
    const provider = this.providers.get(providerId);
    if (!provider) {
      throw new LlmProviderNotRegisteredError(providerId);
    }
    return provider;
  }

  listProviders(): LlmProvider[] {
    return [...this.providers.values()];
  }

  listProviderIds(): LlmProviderId[] {
    return [...this.providers.keys()];
  }

  has(providerId: LlmProviderId): boolean {
    return this.providers.has(providerId);
  }
}
