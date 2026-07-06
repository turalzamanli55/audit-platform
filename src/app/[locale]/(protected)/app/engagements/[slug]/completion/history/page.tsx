import { CompletionHistoryExperience } from "@/components/completion";
import { getDictionary, type Locale } from "@/i18n";
import { generateCompletionWorkspaceMetadata } from "@/lib/completion/completion-workspace-page";
import { getCurrentUser } from "@/lib/auth/server";
import { buildCompletionSectionPageProps } from "@/lib/completion/completion-section-page-props";
import { loadCompletionActivityCached } from "@/lib/completion/load-completion-activity";
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
  const activityResult = await loadCompletionActivityCached(slug);
  const activity = activityResult.ok ? activityResult.activity : { entries: [] };

  return (
    <CompletionHistoryExperience
      {...common}
      labels={dictionary.completion.history}
      activity={activity}
    />
  );
}
