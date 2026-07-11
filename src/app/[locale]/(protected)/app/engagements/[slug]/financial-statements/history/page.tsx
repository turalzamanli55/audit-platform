import { FinancialStatementsHistoryExperience } from "@/components/financial-statements";
import { getDictionary, type Locale } from "@/i18n";
import { generateFinancialStatementsWorkspaceMetadata } from "@/lib/financial-statements/financial-statements-workspace-page";
import { getCurrentUser } from "@/lib/auth/server";
import { buildFinancialStatementSectionPageProps } from "@/lib/financial-statements/financial-statements-section-page-props";
import { loadFinancialStatementActivityCached } from "@/lib/financial-statements/load-financial-statements-activity";
import { loadFinancialStatementsWorkspaceCached } from "@/lib/financial-statements/load-financial-statements-workspace";

type PageProps = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { locale: localeParam, slug } = await params;
  return generateFinancialStatementsWorkspaceMetadata(slug, localeParam as Locale);
}

export default async function Page({ params }: PageProps) {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);
  const user = await getCurrentUser();
  const reviewResult = await loadFinancialStatementsWorkspaceCached(slug);
  const common = buildFinancialStatementSectionPageProps(dictionary, user, locale, reviewResult);
  const activityResult = await loadFinancialStatementActivityCached(slug);
  const activity = activityResult.ok ? activityResult.activity : { entries: [] };

  return (
    <FinancialStatementsHistoryExperience
      {...common}
      labels={dictionary.financialStatements.history}
      activity={activity}
    />
  );
}
