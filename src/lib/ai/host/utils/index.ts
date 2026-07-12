import { createAiId } from "@/lib/ai/utils/id";
import type { AiHostError, AiHostRiskLevel } from "@/lib/ai/host/types";

export function createHostError(
  code: string,
  message: string,
  details?: Record<string, unknown>,
): AiHostError {
  return { code, message, details };
}

export function createHostPlanId(): string {
  return createAiId("host_plan");
}

export function createHostHistoryId(): string {
  return createAiId("host_hist");
}

export function defaultExpiryIso(risk: AiHostRiskLevel, now = Date.now()): string {
  const hours = risk === "critical" ? 4 : risk === "high" ? 8 : risk === "medium" ? 24 : 48;
  return new Date(now + hours * 60 * 60 * 1000).toISOString();
}

export function isExpired(expiresAt: string | null, now = Date.now()): boolean {
  if (!expiresAt) return false;
  return Date.parse(expiresAt) <= now;
}

export * from "@/lib/ai/host/utils/mutation-suggest";
