import type { Locale } from "./types";
import { isValidLocale } from "./resolve-locale";
import { supportedLocales } from "./config";

export function replacePathLocale(pathname: string, nextLocale: Locale): string {
  const segments = pathname.split("/").filter(Boolean);
  const hasLocalePrefix = segments.length > 0 && isValidLocale(segments[0]!);
  const rest = hasLocalePrefix ? segments.slice(1) : segments;
  return `/${nextLocale}${rest.length ? `/${rest.join("/")}` : ""}`;
}

export function listAlternateLocalePaths(pathname: string, currentLocale: Locale): string[] {
  return supportedLocales
    .filter((code) => code !== currentLocale)
    .map((code) => replacePathLocale(pathname, code));
}
