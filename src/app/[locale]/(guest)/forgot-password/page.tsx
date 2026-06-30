import { getDictionary, type Locale } from "@/i18n";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { AuthLayout } from "@/components/auth/auth-layout";

type ForgotPasswordPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ForgotPasswordPage({ params }: ForgotPasswordPageProps) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);

  return (
    <AuthLayout>
      <ForgotPasswordForm
        locale={locale}
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
  );
}
