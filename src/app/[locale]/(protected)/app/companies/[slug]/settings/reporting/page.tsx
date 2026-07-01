import { CompanySettingsReportingSection } from "@/components/company/settings";
import { getDictionary, type Locale } from "@/i18n";
import { generateCompanyWorkspaceMetadata } from "@/lib/company/company-workspace-metadata";

type CompanySettingsReportingPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: CompanySettingsReportingPageProps) {
  const { locale: localeParam, slug } = await params;
  return generateCompanyWorkspaceMetadata(slug, localeParam as Locale);
}

export default async function CompanySettingsReportingPage({
  params,
}: CompanySettingsReportingPageProps) {
  const { locale: localeParam } = await params;
  const dictionary = await getDictionary(localeParam as Locale);

  return (
    <CompanySettingsReportingSection
      labels={dictionary.companies.settings}
      createLabels={dictionary.companies.create}
    />
  );
}
