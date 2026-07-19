import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { supportedLocales, isValidLocale, type Locale } from "@/i18n";
import { AppProviders } from "@/providers";
import { getServerSession } from "@/lib/auth/server";
import { siteConfig } from "@/config/site";
import type { ThemeMode } from "@/types/theme";

function resolveThemeMode(value: string | undefined): ThemeMode | undefined {
  return value === "light" || value === "dark" || value === "system" ? value : undefined;
}

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
  const cookieStore = await cookies();
  const initialThemeMode = resolveThemeMode(cookieStore.get(siteConfig.themeCookieName)?.value);

  return (
    <AppProviders locale={locale} initialSession={session} initialThemeMode={initialThemeMode}>
      {children}
    </AppProviders>
  );
}
