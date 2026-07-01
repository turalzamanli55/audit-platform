import { CompanyHistoryExperience } from "@/components/company/history";
import { CompanyErrorState } from "@/components/company";
import { getDictionary, type Locale } from "@/i18n";
import { loadCompanyActivity } from "@/lib/company/load-company-activity";
import { requireCompanyWorkspace } from "@/lib/company/company-workspace-page";
import { generateCompanyWorkspaceMetadata } from "@/lib/company/company-workspace-metadata";

type CompanyHistoryPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: CompanyHistoryPageProps) {
  const { locale: localeParam, slug } = await params;
  return generateCompanyWorkspaceMetadata(slug, localeParam as Locale);
}

export default async function CompanyHistoryPage({ params }: CompanyHistoryPageProps) {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);
  const company = await requireCompanyWorkspace(slug);
  const activityResult = await loadCompanyActivity(company.id);

  if (!activityResult.ok) {
    return (
      <CompanyErrorState
        title={dictionary.companies.history.errorTitle}
        description={dictionary.companies.history.errorDescription}
      />
    );
  }

  return (
    <CompanyHistoryExperience
      company={company}
      activity={activityResult.activity}
      locale={locale}
      labels={dictionary.companies.history}
      companiesLabels={dictionary.companies}
    />
  );
}
