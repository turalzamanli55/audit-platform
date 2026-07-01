import { redirect } from "next/navigation";
import type { Locale } from "@/i18n";
import { companySettingsSectionPath } from "@/lib/company/company-settings-display";

type CompanySettingsIndexPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function CompanySettingsIndexPage({
  params,
}: CompanySettingsIndexPageProps) {
  const { locale: localeParam, slug } = await params;
  redirect(companySettingsSectionPath(localeParam as Locale, slug, "general"));
}
