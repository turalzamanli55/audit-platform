import { notFound } from "next/navigation";
import { getDictionary, isValidLocale, type Locale } from "@/i18n";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { AuthLayout } from "@/components/auth/auth-layout";
import { GuestShell } from "@/components/auth/guest-shell";

type ForgotPasswordPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ForgotPasswordPage({ params }: ForgotPasswordPageProps) {
  const { locale: localeParam } = await params;

  if (!isValidLocale(localeParam)) {
    notFound();
  }

  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);

  return (
    <GuestShell locale={locale}>
      <AuthLayout>
        <ForgotPasswordForm
          locale={locale}
          experience={dictionary.authExperience}
          labels={{
            title: dictionary.auth.forgotPasswordTitle,
            subtitle: dictionary.auth.forgotPasswordSubtitle,
            email: dictionary.auth.email,
            submit: dictionary.auth.sendResetLink,
            success: dictionary.auth.resetLinkSent,
            backToLogin: dictionary.auth.backToLogin,
            error: dictionary.common.error,
          }}
        />
      </AuthLayout>
    </GuestShell>
  );
}
