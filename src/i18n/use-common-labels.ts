"use client";

import { useLanguage } from "@/providers";
import type { Locale } from "@/i18n";
import en from "@/i18n/messages/en.json";
import az from "@/i18n/messages/az.json";
import ru from "@/i18n/messages/ru.json";
import tr from "@/i18n/messages/tr.json";

type CommonLabels = (typeof en)["common"];

const commonByLocale: Record<Locale, CommonLabels> = {
  en: en.common,
  az: az.common,
  ru: ru.common,
  tr: tr.common,
};

export function useCommonLabels(): CommonLabels {
  const { locale } = useLanguage();
  return commonByLocale[locale] ?? commonByLocale.en;
}
