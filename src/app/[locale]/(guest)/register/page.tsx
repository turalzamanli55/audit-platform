import { getDictionary, type Locale } from "@/i18n";
import { RegisterForm } from "@/components/auth/register-form";
import { AuthLayout } from "@/components/auth/auth-layout";

type RegisterPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function RegisterPage({ params }: RegisterPageProps) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);

  return (
    <AuthLayout>
      <RegisterForm
        locale={locale}
        labels={{
          title: dictionary.auth.registerTitle,
          subtitle: dictionary.auth.registerSubtitle,
          fullName: dictionary.auth.fullName,
          email: dictionary.auth.email,
          password: dictionary.auth.password,
          submit: dictionary.auth.register,
          loginPrompt: dictionary.auth.loginPrompt,
          loginLink: dictionary.auth.signIn,
          error: dictionary.common.error,
          verification: dictionary.auth.verificationSent,
        }}
      />
    </AuthLayout>
  );
}
