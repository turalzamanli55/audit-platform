import Link from "next/link";
import { getDictionary, type Locale } from "@/i18n";
import { AuthLayout } from "@/components/auth/auth-layout";
import { AUTH_ROUTES } from "@/config/auth";
import { Alert } from "@/components/ui";

type VerifyEmailPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ email?: string }>;
};

export default async function VerifyEmailPage({ params, searchParams }: VerifyEmailPageProps) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);
  const { email } = await searchParams;

  return (
    <AuthLayout>
      <div className="space-y-5">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">{dictionary.auth.verifyEmailTitle}</h1>
          <p className="text-sm text-muted-foreground">{dictionary.auth.verifyEmailSubtitle}</p>
        </div>

        <Alert variant="info">
          {email
            ? dictionary.auth.verifyEmailSent.replace("{email}", email)
            : dictionary.auth.verifyEmailGeneric}
        </Alert>

        <Link href={`/${locale}${AUTH_ROUTES.login}`} className="block text-center text-sm text-primary hover:underline">
          {dictionary.auth.backToLogin}
        </Link>
      </div>
    </AuthLayout>
  );
}
