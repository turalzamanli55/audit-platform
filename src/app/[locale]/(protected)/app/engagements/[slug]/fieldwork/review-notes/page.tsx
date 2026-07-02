import { FieldworkReviewNotesExperience } from "@/components/fieldwork";
import { getDictionary, type Locale } from "@/i18n";
import { generateFieldworkWorkspaceMetadata } from "@/lib/fieldwork/fieldwork-workspace-page";


type PageProps = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { locale: localeParam, slug } = await params;
  return generateFieldworkWorkspaceMetadata(slug, localeParam as Locale);
}

export default async function Page({ params }: PageProps) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);
  
  
  return (
    <FieldworkReviewNotesExperience
      locale={locale}
      labels={dictionary.fieldwork.reviewNotes}
      emptyLabels={dictionary.fieldwork.empty}
      fieldworkLabels={dictionary.fieldwork}
    />
  );
}
