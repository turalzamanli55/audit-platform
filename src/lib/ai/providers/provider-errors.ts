/**
 * Provider-independent LLM platform errors.
 * Never leak vendor SDK error shapes to callers.
 */

import type { LlmProviderId } from "@/lib/ai/providers/provider";

export type LlmErrorCode =
  | "provider_not_configured"
  | "provider_not_registered"
  | "provider_disabled"
  | "provider_offline"
  | "provider_rate_limited"
  | "provider_auth_failed"
  | "provider_quota_exceeded"
  | "provider_timeout"
  | "capability_unsupported"
  | "model_not_found"
  | "routing_failed"
  | "stream_aborted"
  | "structured_output_invalid"
  | "tool_definition_invalid"
  | "health_unknown";

export class LlmPlatformError extends Error {
  readonly code: LlmErrorCode;
  readonly providerId?: LlmProviderId;
  readonly details?: Record<string, unknown>;

  constructor(
    code: LlmErrorCode,
    message: string,
    options?: { providerId?: LlmProviderId; details?: Record<string, unknown>; cause?: unknown },
  ) {
    super(message, options?.cause !== undefined ? { cause: options.cause } : undefined);
    this.name = "LlmPlatformError";
    this.code = code;
    this.providerId = options?.providerId;
    this.details = options?.details;
  }
}

export class LlmProviderNotConfiguredError extends LlmPlatformError {
  constructor(providerId: LlmProviderId) {
    super("provider_not_configured", `LLM provider "${providerId}" is not configured.`, {
      providerId,
    });
    this.name = "LlmProviderNotConfiguredError";
  }
}

export class LlmProviderNotRegisteredError extends LlmPlatformError {
  constructor(providerId: LlmProviderId) {
    super("provider_not_registered", `LLM provider "${providerId}" is not registered.`, {
      providerId,
    });
    this.name = "LlmProviderNotRegisteredError";
  }
}

export class LlmCapabilityUnsupportedError extends LlmPlatformError {
  constructor(providerId: LlmProviderId, capability: string) {
    super(
      "capability_unsupported",
      `Provider "${providerId}" does not support capability "${capability}".`,
      { providerId, details: { capability } },
    );
    this.name = "LlmCapabilityUnsupportedError";
  }
}

export class LlmRoutingFailedError extends LlmPlatformError {
  constructor(reason: string, details?: Record<string, unknown>) {
    super("routing_failed", `Model routing failed: ${reason}`, { details });
    this.name = "LlmRoutingFailedError";
  }
}

export class LlmStructuredOutputInvalidError extends LlmPlatformError {
  constructor(message: string, details?: Record<string, unknown>) {
    super("structured_output_invalid", message, { details });
    this.name = "LlmStructuredOutputInvalidError";
  }
}

export function isLlmPlatformError(error: unknown): error is LlmPlatformError {
  return error instanceof LlmPlatformError;
}
