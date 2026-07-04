import type { Locale } from "@/i18n";

type RouteParams = { locale?: string; slug?: string };

export async function resolveRouteLocale(
  params?: Promise<RouteParams>,
  fallback: Locale = "en",
): Promise<{ locale: Locale; slug: string }> {
  const resolved = params ? await params : undefined;
  const localeParam = resolved?.locale;
  const locale =
    localeParam === "az" || localeParam === "ru" || localeParam === "tr" || localeParam === "en"
      ? localeParam
      : fallback;
  return { locale, slug: resolved?.slug ?? "" };
}
