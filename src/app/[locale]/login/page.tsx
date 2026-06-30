import { getDictionary, isValidLocale, type Locale } from "@/i18n";
import { LoginForm } from "@/components/auth/login-form";
import { AuthLayout } from "@/components/auth/auth-layout";
import { GuestShell } from "@/components/auth/guest-shell";
import { notFound } from "next/navigation";

type LoginPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function LoginPage({ params }: LoginPageProps) {
  const { locale: localeParam } = await params;

  if (!isValidLocale(localeParam)) {
    notFound();
  }

  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);

  return (
    <GuestShell>
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
    </GuestShell>
  );
}
