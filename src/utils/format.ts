import type { Locale } from "@/i18n";

const LOCALE_NUMBER_MAP: Record<Locale, string> = {
  az: "az-AZ",
  en: "en-US",
  ru: "ru-RU",
  tr: "tr-TR",
};

export function formatNumber(
  value: number,
  locale: Locale,
  options?: Intl.NumberFormatOptions,
): string {
  return new Intl.NumberFormat(LOCALE_NUMBER_MAP[locale], options).format(value);
}

export function formatCurrency(
  value: number,
  locale: Locale,
  currency: string,
  options?: Intl.NumberFormatOptions,
): string {
  return new Intl.NumberFormat(LOCALE_NUMBER_MAP[locale], {
    style: "currency",
    currency,
    ...options,
  }).format(value);
}

export function formatPercent(
  value: number,
  locale: Locale,
  options?: Intl.NumberFormatOptions,
): string {
  return new Intl.NumberFormat(LOCALE_NUMBER_MAP[locale], {
    style: "percent",
    maximumFractionDigits: 2,
    ...options,
  }).format(value);
}

export function formatCompactNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(LOCALE_NUMBER_MAP[locale], {
    notation: "compact",
    compactDisplay: "short",
  }).format(value);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1)}…`;
}
