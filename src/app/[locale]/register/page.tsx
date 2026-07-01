import { notFound } from "next/navigation";
import { getDictionary, isValidLocale, type Locale } from "@/i18n";
import { RegisterForm } from "@/components/auth/register-form";
import { AuthLayout } from "@/components/auth/auth-layout";
import { GuestShell } from "@/components/auth/guest-shell";
import { AuthBenefits, AuthQuote } from "@/components/auth/ui";

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
  const experience = dictionary.authExperience;

  return (
    <GuestShell locale={locale} wide>
      <AuthLayout
        variant="split"
        illustrationLabel={dictionary.auth.registerTitle}
        aside={
          <>
            <AuthBenefits items={experience.register.benefits} />
            <div className="space-y-3">
              {experience.register.trust.map((item) => (
                <p key={item} className="text-sm text-muted-foreground">
                  {item}
                </p>
              ))}
            </div>
            <AuthQuote quote={experience.login.quote} author={experience.login.quoteAuthor} />
          </>
        }
      >
        <RegisterForm
          locale={locale}
          experience={experience}
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
