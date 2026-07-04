"use client";

import { useLanguage } from "@/providers";
import type { Locale } from "@/i18n";
import type { Dictionary } from "@/i18n/get-dictionary";
import en from "@/i18n/messages/en.json";
import az from "@/i18n/messages/az.json";
import ru from "@/i18n/messages/ru.json";
import tr from "@/i18n/messages/tr.json";

const dictionaries: Record<Locale, Dictionary> = {
  en: en as unknown as Dictionary,
  az: az as unknown as Dictionary,
  ru: ru as unknown as Dictionary,
  tr: tr as unknown as Dictionary,
};

export function useClientDictionary(): Dictionary {
  const { locale } = useLanguage();
  return dictionaries[locale] ?? dictionaries.en;
}
