import { notFound } from "next/navigation";
import { getDictionary, isValidLocale, type Locale } from "@/i18n";
import { RegisterForm } from "@/components/auth/register-form";
import { AuthLayout } from "@/components/auth/auth-layout";
import { GuestShell } from "@/components/auth/guest-shell";

type RegisterPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function RegisterPage({ params }: RegisterPageProps) {
  const { locale: localeParam } = await params;

  if (!isValidLocale(localeParam)) {
    notFound();
  }

  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);

  return (
    <GuestShell locale={locale}>
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
    </GuestShell>
  );
}
