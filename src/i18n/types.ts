/**
 * Internationalization type definitions.
 * Translation implementation is deferred — architecture only.
 */

export type Locale = "az" | "en" | "ru" | "tr";

export type LocaleConfig = {
  code: Locale;
  label: string;
  direction: "ltr" | "rtl";
};
