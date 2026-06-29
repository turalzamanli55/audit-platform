import type { Locale } from "./types";

export type Dictionary = {
  common: {
    appName: string;
    loading: string;
    error: string;
    empty: string;
    retry: string;
  };
  shell: {
    header: string;
    footer: string;
    navigation: string;
    foundation: string;
  };
  auth: {
    signIn: string;
    signOut: string;
  };
};

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  az: () => import("./messages/az.json").then((m) => m.default as Dictionary),
  en: () => import("./messages/en.json").then((m) => m.default as Dictionary),
  ru: () => import("./messages/ru.json").then((m) => m.default as Dictionary),
  tr: () => import("./messages/tr.json").then((m) => m.default as Dictionary),
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  const loader = dictionaries[locale] ?? dictionaries.az;
  return loader();
}
