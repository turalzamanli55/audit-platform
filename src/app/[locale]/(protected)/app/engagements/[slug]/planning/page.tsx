import { PlanningOverviewExperience } from "@/components/planning";
import { PLANNING_PERMISSIONS } from "@/constants/planning";
import { getCurrentUser } from "@/lib/auth/server";
import { authorizePermissionCodes } from "@/lib/auth/permissions";
import { getDictionary, type Locale } from "@/i18n";
import { loadEngagementWorkspacePage } from "@/lib/engagement/engagement-workspace-page";
import { loadPlanningActivityCached } from "@/lib/planning/load-planning-activity";
import { loadPlanningCommentsCached } from "@/lib/planning/load-planning-comments";
import { loadPlanningCommandCenter } from "@/lib/planning/load-planning-command-center";
import { loadPlanningWorkspacePage } from "@/lib/planning/planning-workspace-page";
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
  const [engagementResult, planningResult, commentsResult, activityResult] = await Promise.all([
    loadEngagementWorkspacePage(slug),
    loadPlanningWorkspacePage(slug),
    loadPlanningCommentsCached(slug),
    loadPlanningActivityCached(slug),
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
  const plan = planningResult.ok ? planningResult.plan : null;
  const engagement = engagementResult.ok ? engagementResult.engagement : null;
  const activity = activityResult.ok ? activityResult.activity : { entries: [], summary: { total: 0, created: 0, updated: 0, archived: 0, restored: 0 } };

  const commandCenter =
    plan && engagement
      ? await loadPlanningCommandCenter({
          locale,
          plan,
          engagement,
          comments,
          activity,
          labels: dictionary.planning.workspace.commandCenter,
          planningLabels: dictionary.planning,
        })
      : null;

  return (
    <PlanningOverviewExperience
      locale={locale}
      slug={slug}
      canCreate={canCreate}
      canSubmit={canSubmit}
      canReview={canReview}
      canApprove={canApprove}
      canComment={canComment}
      hasPlan={Boolean(plan)}
      commandCenter={commandCenter}
      comments={comments}
      engagementReportingFramework={engagement?.reportingFramework ?? null}
      labels={dictionary.planning.workspace}
      planningLabels={dictionary.planning}
    />
  );
}
