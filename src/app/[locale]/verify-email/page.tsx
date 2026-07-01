import { notFound } from "next/navigation";
import { getDictionary, isValidLocale, type Locale } from "@/i18n";
import { AuthLayout } from "@/components/auth/auth-layout";
import { GuestShell } from "@/components/auth/guest-shell";
import { VerifyEmailExperience } from "@/components/auth/verify-email-experience";

type VerifyEmailPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ email?: string; status?: string }>;
};

export default async function VerifyEmailPage({ params, searchParams }: VerifyEmailPageProps) {
  const { locale: localeParam } = await params;

  if (!isValidLocale(localeParam)) {
    notFound();
  }

  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);
  const { email, status } = await searchParams;
  const chromeLabels = {
    language: dictionary.marketing.nav.language,
    theme: dictionary.marketing.nav.theme,
    themeLight: dictionary.marketing.nav.themeLight,
    themeDark: dictionary.marketing.nav.themeDark,
  };

  return (
    <GuestShell locale={locale} chromeLabels={chromeLabels}>
      <AuthLayout>
        <VerifyEmailExperience
          locale={locale}
          email={email}
          status={status}
          experience={dictionary.authExperience}
          labels={{
            title: dictionary.auth.verifyEmailTitle,
            subtitle: dictionary.auth.verifyEmailSubtitle,
            sent: dictionary.auth.verifyEmailSent,
            generic: dictionary.auth.verifyEmailGeneric,
            backToLogin: dictionary.auth.backToLogin,
          }}
        />
      </AuthLayout>
    </GuestShell>
  );
}
