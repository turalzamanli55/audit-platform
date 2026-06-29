import { match } from "@/i18n/match-locale";
import { defaultLocale, supportedLocales } from "./config";
import type { Locale } from "./types";

export function isValidLocale(value: string): value is Locale {
  return (supportedLocales as readonly string[]).includes(value);
}

export function resolveLocale(
  pathnameLocale: string | undefined,
  cookieLocale: string | undefined,
  acceptLanguage: string | null,
): Locale {
  if (pathnameLocale && isValidLocale(pathnameLocale)) {
    return pathnameLocale;
  }

  if (cookieLocale && isValidLocale(cookieLocale)) {
    return cookieLocale;
  }

  if (acceptLanguage) {
    return match(acceptLanguage);
  }

  return defaultLocale;
}
