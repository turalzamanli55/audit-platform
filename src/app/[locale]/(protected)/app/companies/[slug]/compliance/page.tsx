import { CompanyWorkspaceComplianceSection } from "@/components/company/workspace";
import { getDictionary, type Locale } from "@/i18n";
import { requireCompanyWorkspace } from "@/lib/company/company-workspace-page";
import { generateCompanyWorkspaceMetadata } from "@/lib/company/company-workspace-metadata";

type CompanyWorkspaceCompliancePageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: CompanyWorkspaceCompliancePageProps) {
  const { locale: localeParam, slug } = await params;
  return generateCompanyWorkspaceMetadata(slug, localeParam as Locale);
}

export default async function CompanyWorkspaceCompliancePage({
  params,
}: CompanyWorkspaceCompliancePageProps) {
  const { locale: localeParam, slug } = await params;
  await requireCompanyWorkspace(slug);
  const dictionary = await getDictionary(localeParam as Locale);

  return <CompanyWorkspaceComplianceSection labels={dictionary.companies.workspace} />;
}
