/**
 * Relative timeline grouping — upgrades existing history display.
 * No separate activity persistence.
 */

export type ActivityGroupKey = "today" | "yesterday" | "lastWeek" | "lastMonth" | "earlier";

export function activityGroupKey(timestamp: string, now = Date.now()): ActivityGroupKey {
  const ms = new Date(timestamp).getTime();
  if (Number.isNaN(ms)) return "earlier";

  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  const startMs = startOfToday.getTime();
  const day = 24 * 60 * 60 * 1000;

  if (ms >= startMs) return "today";
  if (ms >= startMs - day) return "yesterday";
  if (ms >= startMs - 7 * day) return "lastWeek";
  if (ms >= startMs - 30 * day) return "lastMonth";
  return "earlier";
}

export function formatRelativeTime(timestamp: string, locale: string, now = Date.now()): string {
  const ms = new Date(timestamp).getTime();
  if (Number.isNaN(ms)) return "—";

  const diffSec = Math.round((ms - now) / 1000);
  const abs = Math.abs(diffSec);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  if (abs < 60) return rtf.format(diffSec, "second");
  if (abs < 3600) return rtf.format(Math.round(diffSec / 60), "minute");
  if (abs < 86400) return rtf.format(Math.round(diffSec / 3600), "hour");

  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  if (ms >= startOfToday.getTime() - 86400000 && ms < startOfToday.getTime()) {
    return new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit" }).format(ms);
  }

  if (abs < 7 * 86400) {
    return new Intl.DateTimeFormat(locale, { weekday: "long", hour: "2-digit", minute: "2-digit" }).format(
      ms,
    );
  }

  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(ms);
}
