import { createAiId } from "@/lib/ai/utils/id";
import type { EmeMemoryError, EmeMemoryLevel, EmeMemoryScope } from "@/lib/ai/memory-engine/types";

export function createEmeError(
  code: string,
  message: string,
  details?: Record<string, unknown>,
): EmeMemoryError {
  return { code, message, details };
}

export function createEmeMemoryId(): string {
  return createAiId("eme_mem");
}

export function createEmeCandidateId(): string {
  return createAiId("eme_cand");
}

export function createEmeSummaryId(): string {
  return createAiId("eme_sum");
}

export function utcNow(): string {
  return new Date().toISOString();
}

export function isMemoryExpired(expiresAt: string | null, now = Date.now()): boolean {
  if (!expiresAt) return false;
  return Date.parse(expiresAt) <= now;
}

export function defaultSessionExpiry(now = Date.now()): string {
  return new Date(now + 8 * 60 * 60 * 1000).toISOString();
}

export function defaultTemporaryExpiry(now = Date.now()): string {
  return new Date(now + 7 * 24 * 60 * 60 * 1000).toISOString();
}

export function clamp01(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

export function stringifyMemoryValue(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

export function inferValueType(value: unknown): EmeMemoryRecord["valueType"] {
  if (typeof value === "string") return "string";
  if (typeof value === "number") return "number";
  if (typeof value === "boolean") return "boolean";
  return "json";
}

export function scopeKey(scope: Partial<EmeMemoryScope>): string {
  return [
    scope.organizationId ?? "_",
    scope.workspaceId ?? "_",
    scope.userId ?? "_",
    scope.companyId ?? "_",
    scope.engagementId ?? "_",
  ].join(":");
}

export function levelDurability(level: EmeMemoryLevel): "temporary" | "persistent" {
  if (level === "session" || level === "temporary") return "temporary";
  return "persistent";
}

import type { EmeMemoryRecord } from "@/lib/ai/memory-engine/types";

export function tokenEstimate(text: string): number {
  return Math.ceil(text.length / 4);
}

export function dedupeKey(record: Pick<EmeMemoryRecord, "key" | "level" | "policy">): string {
  return `${record.level}:${record.key}:${scopeKey(record.policy)}`;
}
