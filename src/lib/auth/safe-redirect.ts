import { supportedLocales } from "@/i18n";

/**
 * Validates an internal redirect path for auth callbacks.
 * Rejects external URLs, protocol-relative paths, and cross-locale redirects.
 */
export function resolveSafeInternalRedirect(
  nextParam: string | null,
  locale: string,
  origin: string,
): string | null {
  if (!nextParam) return null;

  const trimmed = nextParam.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) {
    return null;
  }

  try {
    const resolved = new URL(trimmed, origin);
    if (resolved.origin !== new URL(origin).origin) {
      return null;
    }
  } catch {
    return null;
  }

  const segments = trimmed.split("/").filter(Boolean);
  const pathLocale = segments[0];

  if (!supportedLocales.includes(pathLocale as (typeof supportedLocales)[number])) {
    return null;
  }

  if (pathLocale !== locale) {
    return null;
  }

  return trimmed;
}
