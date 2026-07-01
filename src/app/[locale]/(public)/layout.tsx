import type { ReactNode } from "react";
import { headers } from "next/headers";
import { PublicShell } from "@/components/public";
import { getDictionary, isValidLocale, type Locale } from "@/i18n";
import { defaultLocale } from "@/i18n/config";

type PublicLayoutProps = {
  children: ReactNode;
};

export default async function PublicLayout({ children }: PublicLayoutProps) {
  const headerStore = await headers();
  const localeHeader = headerStore.get("x-locale");
  const locale = (localeHeader && isValidLocale(localeHeader) ? localeHeader : defaultLocale) as Locale;
  const dictionary = await getDictionary(locale);

  return (
    <PublicShell
      locale={locale}
      navLabels={dictionary.marketing.nav}
      footerLabels={dictionary.marketing.footer}
    >
      {children}
    </PublicShell>
  );
}
