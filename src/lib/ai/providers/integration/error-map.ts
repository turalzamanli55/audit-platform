/**
 * Maps vendor/SDK errors to enterprise LlmPlatformError codes.
 * Never exposes SDK error objects or messages containing secrets.
 */

import type { LlmProviderId } from "@/lib/ai/providers/provider";
import { LlmPlatformError, type LlmErrorCode } from "@/lib/ai/providers/provider-errors";

function readStatus(error: unknown): number | null {
  if (!error || typeof error !== "object") return null;
  const record = error as { status?: number; statusCode?: number; code?: string | number };
  if (typeof record.status === "number") return record.status;
  if (typeof record.statusCode === "number") return record.statusCode;
  if (typeof record.code === "number") return record.code;
  return null;
}

function readMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Provider request failed.";
}

export function mapProviderError(
  providerId: LlmProviderId,
  error: unknown,
): LlmPlatformError {
  if (error instanceof LlmPlatformError) return error;

  const status = readStatus(error);
  const raw = readMessage(error).toLowerCase();

  let code: LlmErrorCode = "provider_offline";
  let message = `Provider "${providerId}" request failed.`;

  if (status === 401 || status === 403 || raw.includes("invalid api key") || raw.includes("authentication")) {
    code = "provider_auth_failed";
    message = `Provider "${providerId}" authentication failed.`;
  } else if (status === 429 || raw.includes("rate limit") || raw.includes("too many requests")) {
    code = "provider_rate_limited";
    message = `Provider "${providerId}" is rate limited.`;
  } else if (
    status === 402 ||
    raw.includes("quota") ||
    raw.includes("insufficient_quota") ||
    raw.includes("billing")
  ) {
    code = "provider_quota_exceeded";
    message = `Provider "${providerId}" quota exceeded.`;
  } else if (
    status === 408 ||
    raw.includes("timeout") ||
    raw.includes("timed out") ||
    (error as { name?: string })?.name === "TimeoutError"
  ) {
    code = "provider_timeout";
    message = `Provider "${providerId}" request timed out.`;
  } else if (status === 404 || raw.includes("model")) {
    code = "model_not_found";
    message = `Provider "${providerId}" model was not found.`;
  } else if (status === 400 && raw.includes("json")) {
    code = "structured_output_invalid";
    message = `Provider "${providerId}" returned invalid structured output.`;
  }

  return new LlmPlatformError(code, message, {
    providerId,
    details: { status: status ?? undefined },
  });
}

export function healthStatusFromError(error: unknown): import("@/lib/ai/providers/provider").LlmHealthStatus {
  const mapped = mapProviderError("openai", error);
  switch (mapped.code) {
    case "provider_rate_limited":
      return "rate_limited";
    case "provider_auth_failed":
      return "auth_failed";
    case "provider_quota_exceeded":
      return "quota_exceeded";
    case "provider_timeout":
      return "timeout";
    case "provider_not_configured":
    case "provider_disabled":
      return "disabled";
    default:
      return "offline";
  }
}
