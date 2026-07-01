import { CompanySettingsGeneralSection } from "@/components/company/settings";
import { getDictionary, type Locale } from "@/i18n";
import { generateCompanyWorkspaceMetadata } from "@/lib/company/company-workspace-metadata";

type CompanySettingsGeneralPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: CompanySettingsGeneralPageProps) {
  const { locale: localeParam, slug } = await params;
  return generateCompanyWorkspaceMetadata(slug, localeParam as Locale);
}

export default async function CompanySettingsGeneralPage({ params }: CompanySettingsGeneralPageProps) {
  const { locale: localeParam } = await params;
  const dictionary = await getDictionary(localeParam as Locale);

  return (
    <CompanySettingsGeneralSection
      labels={dictionary.companies.settings}
      createLabels={dictionary.companies.create}
    />
  );
}
