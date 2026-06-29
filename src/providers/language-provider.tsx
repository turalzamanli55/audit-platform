"use client";

import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { Locale } from "@/i18n";
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

  const setLocale = useCallback(
    (next: Locale) => {
      if (next === locale) return;

      document.cookie = `${siteConfig.localeCookieName}=${next};path=/;max-age=31536000;SameSite=Lax`;

      const segments = pathname.split("/").filter(Boolean);
      const hasLocale = ["az", "en", "ru", "tr"].includes(segments[0] ?? "");
      const rest = hasLocale ? segments.slice(1) : segments;
      const nextPath = `/${next}${rest.length ? `/${rest.join("/")}` : ""}`;
      router.push(nextPath);
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
