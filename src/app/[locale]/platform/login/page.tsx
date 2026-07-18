import { notFound } from "next/navigation";
import { getDictionary, isValidLocale, type Locale } from "@/i18n";
import { GuestShell } from "@/components/auth/guest-shell";
import { PlatformLoginForm } from "@/components/auth/platform-login-form";

type PlatformLoginPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function PlatformLoginPage({ params }: PlatformLoginPageProps) {
  const { locale: localeParam } = await params;

  if (!isValidLocale(localeParam)) {
    notFound();
  }

  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);
  const chromeLabels = {
    language: dictionary.marketing.nav.language,
    theme: dictionary.marketing.nav.theme,
    themeLight: dictionary.marketing.nav.themeLight,
    themeDark: dictionary.marketing.nav.themeDark,
  };

  return (
    <GuestShell locale={locale} chromeLabels={chromeLabels}>
      <PlatformLoginForm locale={locale} />
    </GuestShell>
  );
}
