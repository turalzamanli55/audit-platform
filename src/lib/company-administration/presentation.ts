/**
 * Presentation-only helpers for Company Administration polish.
 * Pure functions over already-loaded data — no server/business changes.
 */

import type { CompanyAdministrationData } from "@/lib/company-administration/load-company-administration";

export type HealthScoreResult = {
  score: number;
  level: "healthy" | "attention" | "critical";
  deductions: Array<{ points: number; reason: string }>;
};

/** Computes a 0–100 health score from existing dashboard data only. */
export function computeCompanyHealthScore(data: CompanyAdministrationData): HealthScoreResult {
  let score = 100;
  const deductions: Array<{ points: number; reason: string }> = [];

  const deduct = (points: number, reason: string) => {
    score -= points;
    deductions.push({ points, reason });
  };

  if (!data.license) {
    deduct(25, "No active plan is attached");
  } else {
    const status = data.license.status;
    if (status === "expired" || status === "suspended" || status === "cancelled") {
      deduct(35, "Plan is not active");
    } else if (data.license.endsAt) {
      const days =
        (new Date(data.license.endsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
      if (days < 0) deduct(35, "Plan has expired");
      else if (days <= 14) deduct(18, `Plan expires in ${Math.ceil(days)} days`);
      else if (days <= 30) deduct(10, `Plan expires in ${Math.ceil(days)} days`);
    }
  }

  if (data.seats.subscriptionId) {
    if (data.seats.seatsAvailable <= 0) {
      deduct(20, "No seats remaining");
    } else if (data.seats.seatLimit > 0) {
      const ratio = data.seats.seatsUsed / data.seats.seatLimit;
      if (ratio >= 0.95) deduct(15, "Seats almost full");
      else if (ratio >= 0.85) deduct(8, "Seat usage is high");
    }
  }

  if (data.companyAdministrators.length === 0) {
    deduct(15, "No company administrator assigned");
  }

  if (data.activeUserCount === 0) {
    deduct(10, "No active users");
  }

  if (data.workspaceCount === 0) {
    deduct(8, "No workspaces configured");
  }

  if (data.failedLoginCount >= 5) {
    deduct(12, `${data.failedLoginCount} failed login attempts detected`);
  } else if (data.failedLoginCount > 0) {
    deduct(5, `${data.failedLoginCount} failed login attempt(s)`);
  }

  const critical = data.securityEvents.filter((e) => e.severity === "critical").length;
  const warnings = data.securityEvents.filter((e) => e.severity === "warning").length;
  if (critical > 0) deduct(20, `${critical} critical security alert(s)`);
  else if (warnings > 0) deduct(8, `${warnings} security warning(s)`);

  if (data.activity.length === 0) {
    deduct(4, "No recent company activity");
  }

  score = Math.max(0, Math.min(100, score));
  const level: HealthScoreResult["level"] =
    score >= 85 ? "healthy" : score >= 60 ? "attention" : "critical";

  return { score, level, deductions };
}

export type SecurityIssue = {
  severity: "ok" | "minor" | "critical";
  title: string;
  detail: string;
};

export function buildSecurityIssues(data: CompanyAdministrationData): {
  level: "ok" | "minor" | "critical";
  label: string;
  issues: SecurityIssue[];
} {
  const issues: SecurityIssue[] = [];

  if (data.failedLoginCount > 0) {
    issues.push({
      severity: data.failedLoginCount >= 5 ? "critical" : "minor",
      title: "Failed logins",
      detail: `${data.failedLoginCount} failed login attempt(s) in recent history`,
    });
  }

  if (data.passwordResetCount > 0) {
    issues.push({
      severity: "minor",
      title: "Password resets",
      detail: `${data.passwordResetCount} password reset event(s) recorded`,
    });
  }

  const criticalEvents = data.securityEvents.filter((e) => e.severity === "critical");
  if (criticalEvents.length > 0) {
    issues.push({
      severity: "critical",
      title: "Critical alerts",
      detail: `${criticalEvents.length} critical security alert(s) need review`,
    });
  }

  const warningEvents = data.securityEvents.filter((e) => e.severity === "warning");
  if (warningEvents.length > 0) {
    issues.push({
      severity: "minor",
      title: "Security warnings",
      detail: `${warningEvents.length} warning-level event(s)`,
    });
  }

  if (data.license?.endsAt) {
    const days =
      (new Date(data.license.endsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    if (days >= 0 && days <= 30) {
      issues.push({
        severity: days <= 14 ? "critical" : "minor",
        title: "Plan expiration",
        detail: `Plan expires in ${Math.ceil(days)} days`,
      });
    }
  }

  if (data.disabledUserCount > 0) {
    issues.push({
      severity: "minor",
      title: "Disabled users",
      detail: `${data.disabledUserCount} disabled account(s) still occupy seats until removed`,
    });
  }

  const level = issues.some((i) => i.severity === "critical")
    ? "critical"
    : issues.some((i) => i.severity === "minor")
      ? "minor"
      : "ok";

  return {
    level,
    label: level === "ok" ? "No Alerts" : level === "minor" ? "Minor Issues" : "Critical Issues",
    issues,
  };
}

export function seatUsagePercent(used: number, limit: number): number {
  if (limit <= 0) return 0;
  return Math.min(100, Math.round((used / limit) * 100));
}

export function relativeTime(value: string | null, now = Date.now()): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const diffMs = now - date.getTime();
  const abs = Math.abs(diffMs);
  const minutes = Math.floor(abs / 60000);
  const hours = Math.floor(abs / 3600000);
  const days = Math.floor(abs / 86400000);

  if (abs < 60000) return "Just now";
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  if (days === 1) {
    return `Yesterday ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  }
  if (days < 7) {
    return date.toLocaleDateString([], { weekday: "long" });
  }
  return date.toLocaleDateString();
}

export function activityDayGroup(value: string, now = Date.now()): "today" | "yesterday" | "week" | "earlier" {
  const date = new Date(value);
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);
  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfWeek.getDate() - 7);

  if (date >= startOfToday) return "today";
  if (date >= startOfYesterday) return "yesterday";
  if (date >= startOfWeek) return "week";
  return "earlier";
}

export function avatarInitials(name: string, email: string): string {
  const source = (name || email || "?").trim();
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0]![0]! + parts[1]![0]!).toUpperCase();
  return source.slice(0, 2).toUpperCase();
}

/** Softens technical validation messages for administrators. */
export function friendlyErrorMessage(raw: string): string {
  const lower = raw.toLowerCase();
  if (lower.includes("seat")) {
    return "No seats available. Free a seat by removing an unused user, or ask your provider to increase the plan.";
  }
  if (lower.includes("password")) {
    return "The password does not meet security requirements. Use at least 12 characters with mixed complexity.";
  }
  if (lower.includes("email") && lower.includes("valid")) {
    return "Enter a valid work email address to continue.";
  }
  if (lower.includes("permission") || lower.includes("forbidden") || lower.includes("authorization")) {
    return "You do not have permission for this action. Ask a company administrator for help.";
  }
  if (lower.includes("not found")) {
    return "That record is no longer available. Refresh the page and try again.";
  }
  if (lower.includes("privilege") || lower.includes("escalation") || lower.includes("cannot be modified")) {
    return "This account cannot be changed from Company Administration.";
  }
  if (lower.includes("own account")) {
    return "You cannot perform this action on your own account.";
  }
  if (lower.includes("solo")) {
    return "This plan does not allow additional users.";
  }
  return raw.replace(/\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi, "").trim() ||
    "Something went wrong. Please try again.";
}

export function highlightMatch(text: string, query: string): Array<{ text: string; match: boolean }> {
  const q = query.trim();
  if (!q) return [{ text, match: false }];
  const lower = text.toLowerCase();
  const index = lower.indexOf(q.toLowerCase());
  if (index < 0) return [{ text, match: false }];
  return [
    { text: text.slice(0, index), match: false },
    { text: text.slice(index, index + q.length), match: true },
    { text: text.slice(index + q.length), match: false },
  ].filter((part) => part.text.length > 0);
}

export function countTodayActivity(data: CompanyAdministrationData, now = Date.now()): number {
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  return data.activity.filter((row) => new Date(row.createdAt) >= start).length;
}

export function recentJoiners(data: CompanyAdministrationData, days = 14, now = Date.now()) {
  const cutoff = now - days * 86400000;
  return data.users
    .filter((u) => new Date(u.createdAt).getTime() >= cutoff)
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, 5);
}
