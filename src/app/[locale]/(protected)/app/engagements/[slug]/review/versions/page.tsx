import { ReviewVersionsExperience } from "@/components/review";
import { getDictionary, type Locale } from "@/i18n";
import { generateReviewWorkspaceMetadata } from "@/lib/review/review-workspace-page";
import { getCurrentUser } from "@/lib/auth/server";
import { buildReviewSectionPageProps } from "@/lib/review/review-section-page-props";
import { loadReviewWorkspaceCached } from "@/lib/review/load-review-workspace";

type PageProps = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { locale: localeParam, slug } = await params;
  return generateReviewWorkspaceMetadata(slug, localeParam as Locale);
}

export default async function Page({ params }: PageProps) {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);
  const user = await getCurrentUser();
  const reviewResult = await loadReviewWorkspaceCached(slug);
  const common = buildReviewSectionPageProps(dictionary, user, locale, reviewResult);

  return (
    <ReviewVersionsExperience
      {...common}
      labels={dictionary.review.versions}
    />
  );
}
