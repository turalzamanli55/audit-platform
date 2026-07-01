import { CompanyWorkspaceHistorySection } from "@/components/company/workspace";
import { getDictionary, type Locale } from "@/i18n";
import { requireCompanyWorkspace } from "@/lib/company/company-workspace-page";
import { generateCompanyWorkspaceMetadata } from "@/lib/company/company-workspace-metadata";

type CompanyWorkspaceHistoryPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: CompanyWorkspaceHistoryPageProps) {
  const { locale: localeParam, slug } = await params;
  return generateCompanyWorkspaceMetadata(slug, localeParam as Locale);
}

export default async function CompanyWorkspaceHistoryPage({
  params,
}: CompanyWorkspaceHistoryPageProps) {
  const { locale: localeParam, slug } = await params;
  await requireCompanyWorkspace(slug);
  const dictionary = await getDictionary(localeParam as Locale);

  return <CompanyWorkspaceHistorySection labels={dictionary.companies.workspace} />;
}
