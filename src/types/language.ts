import type { Locale } from "@/i18n";

export type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  direction: "ltr" | "rtl";
};
