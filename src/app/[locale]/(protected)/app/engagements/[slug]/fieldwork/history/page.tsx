import { FieldworkHistoryExperience } from "@/components/fieldwork";
import { getDictionary, type Locale } from "@/i18n";
import { generateFieldworkWorkspaceMetadata } from "@/lib/fieldwork/fieldwork-workspace-page";
import { loadFieldworkActivityCached } from "@/lib/fieldwork/load-fieldwork-activity";
import { loadFieldworkWorkspaceCached } from "@/lib/fieldwork/load-fieldwork-workspace";

type PageProps = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { locale: localeParam, slug } = await params;
  return generateFieldworkWorkspaceMetadata(slug, localeParam as Locale);
}

export default async function Page({ params }: PageProps) {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);
  const [fieldworkResult, activityResult] = await Promise.all([
    loadFieldworkWorkspaceCached(slug),
    loadFieldworkActivityCached(slug),
  ]);
  const plan = fieldworkResult.ok ? fieldworkResult.fieldwork : null;
  const activity = activityResult.ok ? activityResult.activity : { entries: [] };
  
  return (
    <FieldworkHistoryExperience
      locale={locale} plan={plan} activity={activity}
      labels={dictionary.fieldwork.history}
      emptyLabels={dictionary.fieldwork.empty}
      fieldworkLabels={dictionary.fieldwork}
    />
  );
}
