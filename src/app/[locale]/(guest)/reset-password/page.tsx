import { getDictionary, type Locale } from "@/i18n";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { AuthLayout } from "@/components/auth/auth-layout";

type ResetPasswordPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ResetPasswordPage({ params }: ResetPasswordPageProps) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);

  return (
    <AuthLayout>
      <ResetPasswordForm
        locale={locale}
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
  );
}
