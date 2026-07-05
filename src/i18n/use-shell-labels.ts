"use client";

import { useLanguage } from "@/providers";
import type { Locale } from "@/i18n";
import en from "@/i18n/messages/en.json";
import az from "@/i18n/messages/az.json";
import ru from "@/i18n/messages/ru.json";
import tr from "@/i18n/messages/tr.json";

type ShellLabels = (typeof en)["shell"];
type UiLabels = (typeof en)["ui"];

const shellByLocale: Record<Locale, ShellLabels> = {
  en: en.shell,
  az: az.shell,
  ru: ru.shell,
  tr: tr.shell,
};

const uiByLocale: Record<Locale, UiLabels> = {
  en: en.ui,
  az: az.ui,
  ru: ru.ui,
  tr: tr.ui,
};

export function useShellLabels(): ShellLabels {
  const { locale } = useLanguage();
  return shellByLocale[locale] ?? shellByLocale.en;
}

export function useUiLabels(): UiLabels {
  const { locale } = useLanguage();
  return uiByLocale[locale] ?? uiByLocale.en;
}
