import {
  PLATFORM_DEFAULT_RETENTION_DAYS,
  type RetentionResolution,
} from "./types";

/**
 * Single shared retention resolver.
 * Order: organization-specific policy → platform default (5 years).
 */
export function resolveRetentionDays(organizationRetentionDays: number | null | undefined): {
  retentionDays: number;
  source: "organization" | "platform_default";
} {
  if (
    typeof organizationRetentionDays === "number" &&
    Number.isFinite(organizationRetentionDays) &&
    organizationRetentionDays > 0
  ) {
    return { retentionDays: Math.floor(organizationRetentionDays), source: "organization" };
  }
  return { retentionDays: PLATFORM_DEFAULT_RETENTION_DAYS, source: "platform_default" };
}

export function computeRetention(
  deletedAt: string,
  organizationRetentionDays: number | null | undefined,
  now = Date.now(),
): RetentionResolution {
  const { retentionDays, source } = resolveRetentionDays(organizationRetentionDays);
  const deletedMs = new Date(deletedAt).getTime();
  const untilMs = deletedMs + retentionDays * 24 * 60 * 60 * 1000;
  const remainingMs = untilMs - now;
  const remainingDays = Math.ceil(remainingMs / (1000 * 60 * 60 * 24));
  return {
    retentionDays,
    source,
    deletedAt,
    retentionUntil: new Date(untilMs).toISOString(),
    remainingMs,
    remainingDays,
    eligibleForPermanentDelete: remainingMs <= 0,
  };
}

/** Friendly remaining label parts for i18n fill: years, months, days. */
export function retentionRemainingParts(remainingDays: number): {
  years: number;
  months: number;
  days: number;
  expired: boolean;
} {
  if (remainingDays <= 0) {
    return { years: 0, months: 0, days: 0, expired: true };
  }
  const years = Math.floor(remainingDays / 365);
  const afterYears = remainingDays - years * 365;
  const months = Math.floor(afterYears / 30);
  const days = afterYears - months * 30;
  return { years, months, days, expired: false };
}
