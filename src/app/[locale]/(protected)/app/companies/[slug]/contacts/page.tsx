import { CompanyWorkspaceContactsSection } from "@/components/company/workspace";
import { getDictionary, type Locale } from "@/i18n";
import { requireCompanyWorkspace } from "@/lib/company/company-workspace-page";
import { generateCompanyWorkspaceMetadata } from "@/lib/company/company-workspace-metadata";

type CompanyWorkspaceContactsPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: CompanyWorkspaceContactsPageProps) {
  const { locale: localeParam, slug } = await params;
  return generateCompanyWorkspaceMetadata(slug, localeParam as Locale);
}

export default async function CompanyWorkspaceContactsPage({
  params,
}: CompanyWorkspaceContactsPageProps) {
  const { locale: localeParam, slug } = await params;
  const dictionary = await getDictionary(localeParam as Locale);
  const company = await requireCompanyWorkspace(slug);

  return (
    <CompanyWorkspaceContactsSection
      company={company}
      labels={dictionary.companies.workspace}
      companiesLabels={dictionary.companies}
    />
  );
}
