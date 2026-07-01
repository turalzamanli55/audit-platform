"use client";

import {
  createContext,
  startTransition,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import type { Locale } from "@/i18n";
import { listAlternateLocalePaths, replacePathLocale } from "@/i18n/locale-path";
import { locales } from "@/i18n";
import type { LanguageContextValue } from "@/types/language";
import { siteConfig } from "@/config/site";

const LanguageContext = createContext<LanguageContextValue | null>(null);

type LanguageProviderProps = {
  children: ReactNode;
  locale: Locale;
};

export function LanguageProvider({ children, locale }: LanguageProviderProps) {
  const router = useRouter();
  const pathname = usePathname();

  const direction = useMemo(() => {
    return locales.find((l) => l.code === locale)?.direction ?? "ltr";
  }, [locale]);

  useEffect(() => {
    for (const path of listAlternateLocalePaths(pathname, locale)) {
      router.prefetch(path);
    }
  }, [locale, pathname, router]);

  const setLocale = useCallback(
    (next: Locale) => {
      if (next === locale) return;

      document.cookie = `${siteConfig.localeCookieName}=${next};path=/;max-age=31536000;SameSite=Lax`;

      const nextPath = replacePathLocale(pathname, next);
      startTransition(() => {
        router.replace(nextPath);
      });
    },
    [locale, pathname, router],
  );

  const value = useMemo<LanguageContextValue>(
    () => ({ locale, setLocale, direction }),
    [locale, setLocale, direction],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
