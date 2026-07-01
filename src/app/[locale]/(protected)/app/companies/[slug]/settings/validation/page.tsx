import { CompanySettingsValidationSection } from "@/components/company/settings";
import { getDictionary, type Locale } from "@/i18n";
import { generateCompanyWorkspaceMetadata } from "@/lib/company/company-workspace-metadata";

type CompanySettingsValidationPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: CompanySettingsValidationPageProps) {
  const { locale: localeParam, slug } = await params;
  return generateCompanyWorkspaceMetadata(slug, localeParam as Locale);
}

export default async function CompanySettingsValidationPage({
  params,
}: CompanySettingsValidationPageProps) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);

  return (
    <CompanySettingsValidationSection
      locale={locale}
      labels={dictionary.companies.settings}
      workspaceLabels={dictionary.companies.workspace}
    />
  );
}
