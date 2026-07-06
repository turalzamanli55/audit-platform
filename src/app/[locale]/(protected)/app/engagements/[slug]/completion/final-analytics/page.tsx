import { ChecklistExperience } from "@/components/completion";
import { getDictionary, type Locale } from "@/i18n";
import { generateCompletionWorkspaceMetadata } from "@/lib/completion/completion-workspace-page";
import { getCurrentUser } from "@/lib/auth/server";
import { buildCompletionSectionPageProps } from "@/lib/completion/completion-section-page-props";
import { loadCompletionWorkspaceCached } from "@/lib/completion/load-completion-workspace";

type PageProps = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { locale: localeParam, slug } = await params;
  return generateCompletionWorkspaceMetadata(slug, localeParam as Locale);
}

export default async function Page({ params }: PageProps) {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);
  const user = await getCurrentUser();
  const reviewResult = await loadCompletionWorkspaceCached(slug);
  const common = buildCompletionSectionPageProps(dictionary, user, locale, reviewResult);

  return (
    <ChecklistExperience
      {...common}
      labels={dictionary.completion.finalAnalytics}
    />
  );
}
