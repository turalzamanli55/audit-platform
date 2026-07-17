import { redirect } from "next/navigation";
import { isValidLocale, type Locale } from "@/i18n";
import { AUTH_ROUTES } from "@/config/auth";

type RegisterPageProps = {
  params: Promise<{ locale: string }>;
};

/** Public registration removed — invitation-only SaaS access. */
export default async function RegisterPage({ params }: RegisterPageProps) {
  const { locale: localeParam } = await params;
  const locale = (isValidLocale(localeParam) ? localeParam : "en") as Locale;
  redirect(`/${locale}${AUTH_ROUTES.login}`);
}
