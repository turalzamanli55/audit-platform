import { CompanySettingsPreferencesSection } from "@/components/company/settings";
import { getDictionary, type Locale } from "@/i18n";
import { generateCompanyWorkspaceMetadata } from "@/lib/company/company-workspace-metadata";

type CompanySettingsPreferencesPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: CompanySettingsPreferencesPageProps) {
  const { locale: localeParam, slug } = await params;
  return generateCompanyWorkspaceMetadata(slug, localeParam as Locale);
}

export default async function CompanySettingsPreferencesPage({
  params,
}: CompanySettingsPreferencesPageProps) {
  const { locale: localeParam } = await params;
  const dictionary = await getDictionary(localeParam as Locale);

  return (
    <CompanySettingsPreferencesSection
      labels={dictionary.companies.settings}
      createLabels={dictionary.companies.create}
    />
  );
}
