import type { LocaleConfig } from "./types";

/**
 * Supported locales for the platform.
 * Azerbaijani is the default locale.
 */
export const locales: readonly LocaleConfig[] = [
  { code: "az", label: "Azərbaycan", direction: "ltr" },
  { code: "en", label: "English", direction: "ltr" },
  { code: "ru", label: "Русский", direction: "ltr" },
  { code: "tr", label: "Türkçe", direction: "ltr" },
] as const;
