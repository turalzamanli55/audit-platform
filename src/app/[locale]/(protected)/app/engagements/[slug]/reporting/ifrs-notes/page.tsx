import { IfrsNotesExperience } from "@/components/reporting";
import { getDictionary, type Locale } from "@/i18n";
import { generateReportingWorkspaceMetadata } from "@/lib/reporting/reporting-workspace-page";
import { getCurrentUser } from "@/lib/auth/server";
import { buildReportingSectionPageProps } from "@/lib/reporting/reporting-section-page-props";
import { loadReportingWorkspaceCached } from "@/lib/reporting/load-reporting-workspace";

type PageProps = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { locale: localeParam, slug } = await params;
  return generateReportingWorkspaceMetadata(slug, localeParam as Locale);
}

export default async function Page({ params }: PageProps) {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);
  const user = await getCurrentUser();
  const reviewResult = await loadReportingWorkspaceCached(slug);
  const common = buildReportingSectionPageProps(dictionary, user, locale, reviewResult);

  return (
    <IfrsNotesExperience
      {...common}
      labels={dictionary.reporting.ifrsNotes}
    />
  );
}
