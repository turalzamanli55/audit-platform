import { PlanningOverviewExperience } from "@/components/planning";
import { PLANNING_PERMISSIONS } from "@/constants/planning";
import { getCurrentUser } from "@/lib/auth/server";
import { authorizePermissionCodes } from "@/lib/auth/permissions";
import { getDictionary, type Locale } from "@/i18n";
import { loadEngagementWorkspacePage } from "@/lib/engagement/engagement-workspace-page";
import { loadPlanningCommentsCached } from "@/lib/planning/load-planning-comments";
import { generatePlanningWorkspaceMetadata } from "@/lib/planning/planning-workspace-page";

type PlanningOverviewPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: PlanningOverviewPageProps) {
  const { locale: localeParam, slug } = await params;
  return generatePlanningWorkspaceMetadata(slug, localeParam as Locale);
}

export default async function PlanningOverviewPage({ params }: PlanningOverviewPageProps) {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);
  const user = await getCurrentUser();
  const [engagementResult, commentsResult] = await Promise.all([
    loadEngagementWorkspacePage(slug),
    loadPlanningCommentsCached(slug),
  ]);

  const canCreate = user
    ? authorizePermissionCodes(user.permissionCodes, PLANNING_PERMISSIONS.CREATE)
    : false;
  const canSubmit = user
    ? authorizePermissionCodes(user.permissionCodes, PLANNING_PERMISSIONS.SUBMIT)
    : false;
  const canReview = user
    ? authorizePermissionCodes(user.permissionCodes, PLANNING_PERMISSIONS.REVIEW)
    : false;
  const canApprove = user
    ? authorizePermissionCodes(user.permissionCodes, PLANNING_PERMISSIONS.APPROVE)
    : false;
  const canComment = user
    ? authorizePermissionCodes(user.permissionCodes, PLANNING_PERMISSIONS.COMMENT)
    : false;

  const comments = commentsResult.ok ? commentsResult.comments : [];

  return (
    <PlanningOverviewExperience
      locale={locale}
      canCreate={canCreate}
      canSubmit={canSubmit}
      canReview={canReview}
      canApprove={canApprove}
      canComment={canComment}
      comments={comments}
      engagementReportingFramework={
        engagementResult.ok ? engagementResult.engagement.reportingFramework : null
      }
      labels={dictionary.planning.workspace}
      planningLabels={dictionary.planning}
    />
  );
}
