import type { Locale } from "@/i18n";

const LOCALE_DATE_MAP: Record<Locale, string> = {
  az: "az-AZ",
  en: "en-US",
  ru: "ru-RU",
  tr: "tr-TR",
};

export function toLocaleDateString(
  date: Date | string | number,
  locale: Locale,
  options?: Intl.DateTimeFormatOptions,
): string {
  const value = date instanceof Date ? date : new Date(date);
  return new Intl.DateTimeFormat(LOCALE_DATE_MAP[locale], {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options,
  }).format(value);
}

export function toLocaleDateTimeString(
  date: Date | string | number,
  locale: Locale,
  options?: Intl.DateTimeFormatOptions,
): string {
  const value = date instanceof Date ? date : new Date(date);
  return new Intl.DateTimeFormat(LOCALE_DATE_MAP[locale], {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    ...options,
  }).format(value);
}

export function toRelativeTime(
  date: Date | string | number,
  locale: Locale,
  baseDate: Date = new Date(),
): string {
  const value = date instanceof Date ? date : new Date(date);
  const diffMs = value.getTime() - baseDate.getTime();
  const diffSec = Math.round(diffMs / 1000);

  const rtf = new Intl.RelativeTimeFormat(LOCALE_DATE_MAP[locale], { numeric: "auto" });

  if (Math.abs(diffSec) < 60) return rtf.format(diffSec, "second");
  const diffMin = Math.round(diffSec / 60);
  if (Math.abs(diffMin) < 60) return rtf.format(diffMin, "minute");
  const diffHour = Math.round(diffMin / 60);
  if (Math.abs(diffHour) < 24) return rtf.format(diffHour, "hour");
  const diffDay = Math.round(diffHour / 24);
  return rtf.format(diffDay, "day");
}

export function isValidDate(value: unknown): value is Date {
  return value instanceof Date && !Number.isNaN(value.getTime());
}
