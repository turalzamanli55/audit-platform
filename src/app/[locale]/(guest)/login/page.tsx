import { getDictionary, type Locale } from "@/i18n";
import { LoginForm } from "@/components/auth/login-form";
import { AuthLayout } from "@/components/auth/auth-layout";

type LoginPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function LoginPage({ params }: LoginPageProps) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);

  return (
    <AuthLayout>
      <LoginForm
        locale={locale}
        labels={{
          title: dictionary.auth.loginTitle,
          subtitle: dictionary.auth.loginSubtitle,
          email: dictionary.auth.email,
          password: dictionary.auth.password,
          rememberMe: dictionary.auth.rememberMe,
          submit: dictionary.auth.signIn,
          forgotPassword: dictionary.auth.forgotPassword,
          registerPrompt: dictionary.auth.registerPrompt,
          registerLink: dictionary.auth.registerLink,
          error: dictionary.common.error,
        }}
      />
    </AuthLayout>
  );
}
