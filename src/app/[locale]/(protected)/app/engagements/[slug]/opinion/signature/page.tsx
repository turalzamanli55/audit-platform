import { SignatureExperience } from "@/components/opinion";
import { getDictionary, type Locale } from "@/i18n";
import { generateOpinionWorkspaceMetadata } from "@/lib/opinion/opinion-workspace-page";
import { getCurrentUser } from "@/lib/auth/server";
import { buildOpinionSectionPageProps } from "@/lib/opinion/opinion-section-page-props";
import { loadOpinionWorkspaceCached } from "@/lib/opinion/load-opinion-workspace";

type PageProps = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { locale: localeParam, slug } = await params;
  return generateOpinionWorkspaceMetadata(slug, localeParam as Locale);
}

export default async function Page({ params }: PageProps) {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);
  const user = await getCurrentUser();
  const reviewResult = await loadOpinionWorkspaceCached(slug);
  const common = buildOpinionSectionPageProps(dictionary, user, locale, reviewResult);

  return (
    <SignatureExperience
      {...common}
      labels={dictionary.opinion.signature}
    />
  );
}
