import { supportedLocales, defaultLocale } from "./config";
import type { Locale } from "./types";

/**
 * Match Accept-Language header to supported locale.
 */
export function match(acceptLanguage: string): Locale {
  const preferences = acceptLanguage
    .split(",")
    .map((part) => {
      const [lang, qPart] = part.trim().split(";q=");
      const q = qPart ? parseFloat(qPart) : 1;
      return { lang: lang.toLowerCase().split("-")[0], q };
    })
    .sort((a, b) => b.q - a.q);

  for (const { lang } of preferences) {
    const found = supportedLocales.find((l) => l === lang || l.startsWith(lang));
    if (found) return found;
  }

  return defaultLocale;
}
