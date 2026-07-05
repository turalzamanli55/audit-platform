import { ReviewOverviewExperience } from "@/components/review";
import { getDictionary, type Locale } from "@/i18n";
import { generateReviewWorkspaceMetadata } from "@/lib/review/review-workspace-page";
import { REVIEW_PERMISSIONS } from "@/constants/review";
import { getCurrentUser } from "@/lib/auth/server";
import { authorizePermissionCodes } from "@/lib/auth/permissions";
import { loadReviewCommandCenter } from "@/lib/review/load-review-command-center";
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
  const canSubmit = user
    ? authorizePermissionCodes(user.permissionCodes, REVIEW_PERMISSIONS.UPDATE)
    : false;
  const canReview = user
    ? authorizePermissionCodes(user.permissionCodes, REVIEW_PERMISSIONS.REVIEW)
    : false;
  const canApprove = user
    ? authorizePermissionCodes(user.permissionCodes, REVIEW_PERMISSIONS.APPROVE)
    : false;

  const fieldworkStarted = reviewResult.ok ? reviewResult.fieldworkStarted : false;
  const fieldworkSubstantiallyComplete = reviewResult.ok
    ? reviewResult.fieldworkSubstantiallyComplete
    : false;
  const review = reviewResult.ok ? reviewResult.review : null;

  const commandCenter = review
    ? loadReviewCommandCenter({
        locale,
        review,
        labels: dictionary.review.workspace.commandCenter,
        statusLabels: dictionary.review.statuses,
        sourceModuleLabels: dictionary.review.sourceModules,
        itemStatusLabels: dictionary.review.itemStatuses,
        commentTypeLabels: dictionary.review.commentTypes,
      })
    : null;

  return (
    <ReviewOverviewExperience
      locale={locale}
      slug={slug}
      canCreate={canCreate}
      canSubmit={canSubmit}
      canReview={canReview}
      canApprove={canApprove}
      fieldworkStarted={fieldworkStarted}
      fieldworkSubstantiallyComplete={fieldworkSubstantiallyComplete}
      hasReview={Boolean(review)}
      commandCenter={commandCenter}
      labels={dictionary.review.workspace}
      commandCenterLabels={dictionary.review.workspace.commandCenter}
      statusLabels={dictionary.review.statuses}
      workflowLabels={dictionary.review.workflow}
      emptyLabels={dictionary.review.empty}
    />
  );
}
