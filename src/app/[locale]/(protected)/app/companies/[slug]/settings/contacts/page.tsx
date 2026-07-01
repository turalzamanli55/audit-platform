import { CompanySettingsContactsSection } from "@/components/company/settings";
import { getDictionary, type Locale } from "@/i18n";
import { generateCompanyWorkspaceMetadata } from "@/lib/company/company-workspace-metadata";

type CompanySettingsContactsPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: CompanySettingsContactsPageProps) {
  const { locale: localeParam, slug } = await params;
  return generateCompanyWorkspaceMetadata(slug, localeParam as Locale);
}

export default async function CompanySettingsContactsPage({
  params,
}: CompanySettingsContactsPageProps) {
  const { locale: localeParam } = await params;
  const dictionary = await getDictionary(localeParam as Locale);

  return (
    <CompanySettingsContactsSection
      labels={dictionary.companies.settings}
      createLabels={dictionary.companies.create}
    />
  );
}
