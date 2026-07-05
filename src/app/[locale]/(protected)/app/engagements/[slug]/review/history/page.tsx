import { ReviewHistoryExperience } from "@/components/review";
import { getDictionary, type Locale } from "@/i18n";
import { generateReviewWorkspaceMetadata } from "@/lib/review/review-workspace-page";
import { REVIEW_PERMISSIONS } from "@/constants/review";
import { getCurrentUser } from "@/lib/auth/server";
import { authorizePermissionCodes } from "@/lib/auth/permissions";
import { loadReviewActivityCached } from "@/lib/review/load-review-activity";
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
  const canCreate = user
    ? authorizePermissionCodes(user.permissionCodes, REVIEW_PERMISSIONS.CREATE)
    : false;
  const fieldworkStarted = reviewResult.ok ? reviewResult.fieldworkStarted : false;
  const fieldworkSubstantiallyComplete = reviewResult.ok
    ? reviewResult.fieldworkSubstantiallyComplete
    : false;
  const activityResult = await loadReviewActivityCached(slug);
  const activity = activityResult.ok ? activityResult.activity : { entries: [] };

  return (
    <ReviewHistoryExperience
      locale={locale}
      canCreate={canCreate}
      fieldworkStarted={fieldworkStarted}
      fieldworkSubstantiallyComplete={fieldworkSubstantiallyComplete}
      emptyLabels={dictionary.review.empty}
      workspaceLabels={{
        fieldworkGateDescription: dictionary.review.workspace.fieldworkGateDescription,
        fieldworkSubstantiallyCompleteDescription:
          dictionary.review.workspace.fieldworkSubstantiallyCompleteDescription,
        archivedDescription: dictionary.review.workspace.archivedDescription,
      }}
      archivedReadOnlyLabel={dictionary.review.workspace.archivedDescription}
      labels={dictionary.review.history}
      activity={activity}
      historyLabels={{
        versionLabel: dictionary.review.history.versionLabel,
        updatedLabel: dictionary.review.history.updatedLabel,
        actions: dictionary.review.history.actions,
      }}
    />
  );
}
