import { OpinionOverviewExperience } from "@/components/opinion";
import { getDictionary, type Locale } from "@/i18n";
import { generateOpinionWorkspaceMetadata } from "@/lib/opinion/opinion-workspace-page";
import { OPINION_PERMISSIONS } from "@/constants/opinion";
import { getCurrentUser } from "@/lib/auth/server";
import { authorizePermissionCodes } from "@/lib/auth/permissions";
import { loadOpinionCommandCenter } from "@/lib/opinion/load-opinion-command-center";
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
  const reportingResult = await loadOpinionWorkspaceCached(slug);

  const canCreate = user
    ? authorizePermissionCodes(user.permissionCodes, OPINION_PERMISSIONS.CREATE)
    : false;
  const canSubmit = user
    ? authorizePermissionCodes(user.permissionCodes, OPINION_PERMISSIONS.UPDATE)
    : false;
  const canReview = user
    ? authorizePermissionCodes(user.permissionCodes, OPINION_PERMISSIONS.REVIEW)
    : false;
  const canApprove = user
    ? authorizePermissionCodes(user.permissionCodes, OPINION_PERMISSIONS.APPROVE)
    : false;

  const prerequisitesMet = reportingResult.ok ? reportingResult.prerequisitesMet : false;
  const reportingApproved = reportingResult.ok ? reportingResult.reportingApproved : false;
  const opinion = reportingResult.ok ? reportingResult.opinion : null;

  const commandCenter = opinion
    ? loadOpinionCommandCenter({
        locale,
        opinion,
        labels: dictionary.opinion.workspace.commandCenter,
        statusLabels: dictionary.opinion.statuses,
        sectionTypeLabels: dictionary.opinion.sectionTypes,
        sectionStatusLabels: dictionary.opinion.sectionStatuses,
        commentTypeLabels: dictionary.opinion.commentTypes,
      })
    : null;

  return (
    <OpinionOverviewExperience
      locale={locale}
      slug={slug}
      canCreate={canCreate}
      canSubmit={canSubmit}
      canReview={canReview}
      canApprove={canApprove}
      fieldworkStarted={prerequisitesMet}
      fieldworkSubstantiallyComplete={reportingApproved}
      hasOpinion={Boolean(opinion)}
      commandCenter={commandCenter}
      labels={dictionary.opinion.workspace}
      commandCenterLabels={dictionary.opinion.workspace.commandCenter}
      statusLabels={dictionary.opinion.statuses}
      workflowLabels={dictionary.opinion.workflow}
      emptyLabels={dictionary.opinion.empty}
    />
  );
}
