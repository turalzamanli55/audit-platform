"use client";

import { useLanguage } from "@/providers";
import { getPlatformLabels, type PlatformLabels } from "@/i18n/platform-labels";

/**
 * Client hook returning Platform Console interface strings for the CURRENT URL
 * locale. Backed by the shared application dictionaries — no platform-specific
 * locale state or cookie.
 */
export function usePlatformLabels(): PlatformLabels {
  const { locale } = useLanguage();
  return getPlatformLabels(locale);
}
