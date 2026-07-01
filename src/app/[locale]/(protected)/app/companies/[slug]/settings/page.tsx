import { CompanyWorkspaceSettingsSection } from "@/components/company/workspace";
import { getDictionary, type Locale } from "@/i18n";
import { requireCompanyWorkspace } from "@/lib/company/company-workspace-page";
import { generateCompanyWorkspaceMetadata } from "@/lib/company/company-workspace-metadata";

type CompanyWorkspaceSettingsPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: CompanyWorkspaceSettingsPageProps) {
  const { locale: localeParam, slug } = await params;
  return generateCompanyWorkspaceMetadata(slug, localeParam as Locale);
}

export default async function CompanyWorkspaceSettingsPage({
  params,
}: CompanyWorkspaceSettingsPageProps) {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);
  const company = await requireCompanyWorkspace(slug);

  return (
    <CompanyWorkspaceSettingsSection
      company={company}
      locale={locale}
      labels={dictionary.companies.workspace}
      companiesLabels={dictionary.companies}
    />
  );
}
