/**
 * Platform Owner tenant lifecycle helpers — pure functions over existing
 * subscription / organization fields. No schema changes.
 */

export type LicenseLifecycleStatus = "active" | "trial" | "expired" | "suspended" | "cancelled" | "none";

export type TenantDisplayStatus = "active" | "suspended" | "expired" | "archived";

export type TenantHealthLevel = "healthy" | "attention" | "critical";

export const LICENSE_DURATION_OPTIONS = [
  { value: "30", days: 30, labelKey: "duration30" },
  { value: "90", days: 90, labelKey: "duration90" },
  { value: "180", days: 180, labelKey: "duration180" },
  { value: "365", days: 365, labelKey: "duration1y" },
  { value: "730", days: 730, labelKey: "duration2y" },
  { value: "1095", days: 1095, labelKey: "duration3y" },
  { value: "1825", days: 1825, labelKey: "duration5y" },
  { value: "3650", days: 3650, labelKey: "duration10y" },
  { value: "custom", days: null, labelKey: "durationCustom" },
] as const;

export function computeEndsAtFromDuration(
  durationValue: string,
  customDate: string | null,
  from: Date = new Date(),
): string | null {
  if (durationValue === "custom") {
    if (!customDate) return null;
    const parsed = new Date(customDate);
    if (Number.isNaN(parsed.getTime())) return null;
    return parsed.toISOString();
  }
  const option = LICENSE_DURATION_OPTIONS.find((o) => o.value === durationValue);
  if (!option?.days) return null;
  const ends = new Date(from.getTime() + option.days * 24 * 60 * 60 * 1000);
  return ends.toISOString();
}

export function daysUntil(endsAt: string | null, now = Date.now()): number | null {
  if (!endsAt) return null;
  const ms = new Date(endsAt).getTime() - now;
  if (Number.isNaN(ms)) return null;
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

export function isLicenseExpired(
  status: string | null | undefined,
  endsAt: string | null | undefined,
  now = Date.now(),
): boolean {
  if (!status && !endsAt) return false;
  if (status === "expired" || status === "cancelled") return true;
  if (endsAt && new Date(endsAt).getTime() < now) return true;
  return false;
}

export function isLicenseAccessAllowed(
  status: string | null | undefined,
  endsAt: string | null | undefined,
  now = Date.now(),
): boolean {
  if (!status) {
    // No subscription yet — do not block (onboarding / pre-license tenants).
    return true;
  }
  if (status === "suspended" || status === "cancelled" || status === "expired") {
    return false;
  }
  if (endsAt && new Date(endsAt).getTime() < now) {
    return false;
  }
  return status === "active" || status === "trial";
}

export function resolveTenantDisplayStatus(input: {
  orgStatus: string;
  licenseStatus: string | null;
  endsAt: string | null;
}): TenantDisplayStatus {
  if (input.orgStatus === "archived") return "archived";
  if (input.orgStatus === "suspended") return "suspended";
  if (isLicenseExpired(input.licenseStatus, input.endsAt)) return "expired";
  return "active";
}

export function resolveTenantHealth(input: {
  displayStatus: TenantDisplayStatus;
  daysRemaining: number | null;
  seatsUsed: number;
  seatLimit: number;
  hasAdministrator: boolean;
}): { level: TenantHealthLevel; reasons: string[] } {
  const reasons: string[] = [];
  let level: TenantHealthLevel = "healthy";

  if (input.displayStatus === "expired") {
    return { level: "critical", reasons: ["License expired"] };
  }
  if (input.displayStatus === "suspended") {
    return { level: "critical", reasons: ["Company suspended"] };
  }
  if (input.displayStatus === "archived") {
    return { level: "attention", reasons: ["Company archived"] };
  }
  if (!input.hasAdministrator) {
    level = "attention";
    reasons.push("No company administrator");
  }
  if (input.daysRemaining !== null) {
    if (input.daysRemaining <= 0) {
      return { level: "critical", reasons: ["License expired"] };
    }
    if (input.daysRemaining <= 7) {
      level = "critical";
      reasons.push(`License expires in ${input.daysRemaining} day(s)`);
    } else if (input.daysRemaining <= 30) {
      level = "attention";
      reasons.push(`License expires in ${input.daysRemaining} day(s)`);
    }
  }
  if (input.seatLimit > 0) {
    const ratio = input.seatsUsed / input.seatLimit;
    if (ratio >= 1) {
      if (level !== "critical") level = "attention";
      reasons.push("No seats available");
    } else if (ratio >= 0.9) {
      if (level !== "critical") level = "attention";
      reasons.push("Near seat limit");
    }
  }
  if (reasons.length === 0) reasons.push("Company looks healthy");
  return { level, reasons };
}

export function expirationWarningKey(daysRemaining: number | null): string | null {
  if (daysRemaining === null) return null;
  if (daysRemaining < 0) return "expired";
  if (daysRemaining === 0) return "expiresToday";
  if (daysRemaining === 1) return "expiresTomorrow";
  if (daysRemaining <= 7) return "expiresIn7";
  if (daysRemaining <= 30) return "expiresIn30";
  return null;
}
