import type { Locale } from "./types";

/**
 * Default locale for the platform.
 */
export const defaultLocale: Locale = "az";

/**
 * Fallback locale when a translation key is missing.
 */
export const fallbackLocale: Locale = "az";

/**
 * All supported locale codes.
 */
export const supportedLocales: readonly Locale[] = ["az", "en", "ru", "tr"];
