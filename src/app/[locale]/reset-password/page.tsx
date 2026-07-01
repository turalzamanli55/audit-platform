import { notFound } from "next/navigation";
import { getDictionary, isValidLocale, type Locale } from "@/i18n";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { AuthLayout } from "@/components/auth/auth-layout";
import { GuestShell } from "@/components/auth/guest-shell";

type ResetPasswordPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ResetPasswordPage({ params }: ResetPasswordPageProps) {
  const { locale: localeParam } = await params;

  if (!isValidLocale(localeParam)) {
    notFound();
  }

  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);

  return (
    <GuestShell locale={locale}>
      <AuthLayout>
        <ResetPasswordForm
          locale={locale}
          experience={dictionary.authExperience}
          labels={{
            title: dictionary.auth.resetPasswordTitle,
            subtitle: dictionary.auth.resetPasswordSubtitle,
            password: dictionary.auth.newPassword,
            confirmPassword: dictionary.auth.confirmPassword,
            submit: dictionary.auth.updatePassword,
            success: dictionary.auth.passwordUpdated,
            backToLogin: dictionary.auth.backToLogin,
            error: dictionary.common.error,
          }}
        />
      </AuthLayout>
    </GuestShell>
  );
}
