import { PublicAuthShell } from "@/components/public/public-auth-shell";
import { getDictionary, isValidLocale, type Locale } from "@/i18n";
import { notFound } from "next/navigation";
import { InviteAcceptanceForm } from "@/components/auth/invite-acceptance-form";

type InvitePageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string }>;
};

export default async function InvitePage({ params, searchParams }: InvitePageProps) {
  const { locale: localeParam } = await params;
  const { token } = await searchParams;
  if (!isValidLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);

  return (
    <PublicAuthShell
      locale={locale}
      chromeLabels={{
        language: dictionary.marketing.nav.language,
        theme: dictionary.marketing.nav.theme,
        themeLight: dictionary.marketing.nav.themeLight,
        themeDark: dictionary.marketing.nav.themeDark,
      }}
    >
      <InviteAcceptanceForm
        locale={locale}
        invitationToken={token ?? ""}
        labels={{
          title: "Accept invitation",
          subtitle: "Create your password to join your tenant workspace.",
          password: dictionary.auth.password,
          submit: "Accept invitation",
          error: dictionary.common.error,
        }}
      />
    </PublicAuthShell>
  );
}
