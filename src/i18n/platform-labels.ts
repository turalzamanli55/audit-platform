import type { Locale } from "@/i18n";
import en from "@/i18n/messages/en.json";
import az from "@/i18n/messages/az.json";
import ru from "@/i18n/messages/ru.json";
import tr from "@/i18n/messages/tr.json";

/**
 * Platform Console interface strings, sourced from the SAME per-locale
 * dictionaries as the rest of the application. There is no separate locale
 * state: the active language is always the current URL locale.
 */
export type PlatformLabels = (typeof en)["platform"];

/** Navigation keys (excludes the "heading" label). */
export type PlatformNavKey = Exclude<keyof PlatformLabels["nav"], "heading">;

const byLocale: Record<Locale, PlatformLabels> = {
  en: en.platform,
  az: az.platform,
  ru: ru.platform,
  tr: tr.platform,
};

/** Server-safe accessor: resolve platform labels for a locale (English fallback). */
export function getPlatformLabels(locale: string): PlatformLabels {
  return byLocale[locale as Locale] ?? byLocale.en;
}

/** Replaces `{token}` placeholders in a dictionary string. */
export function fillPlatform(template: string, vars: Record<string, string | number>): string {
  let out = template;
  for (const [key, value] of Object.entries(vars)) {
    out = out.replaceAll(`{${key}}`, String(value));
  }
  return out;
}
