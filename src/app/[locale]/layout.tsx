import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { supportedLocales, isValidLocale, type Locale } from "@/i18n";
import { AppProviders } from "@/providers";
import { getServerSession } from "@/lib/auth/server";

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return supportedLocales.map((locale) => ({ locale }));
}

export const dynamicParams = true;

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale: localeParam } = await params;

  if (!isValidLocale(localeParam)) {
    notFound();
  }

  const locale = localeParam as Locale;
  const session = await getServerSession();

  return (
    <AppProviders locale={locale} initialSession={session}>
      {children}
    </AppProviders>
  );
}
