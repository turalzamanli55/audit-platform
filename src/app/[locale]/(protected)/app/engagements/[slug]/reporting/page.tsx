import { ReportingOverviewExperience } from "@/components/reporting";
import { getDictionary, type Locale } from "@/i18n";
import { generateReportingWorkspaceMetadata } from "@/lib/reporting/reporting-workspace-page";
import { REPORTING_PERMISSIONS } from "@/constants/reporting";
import { getCurrentUser } from "@/lib/auth/server";
import { authorizePermissionCodes } from "@/lib/auth/permissions";
import { loadReportingCommandCenter } from "@/lib/reporting/load-reporting-command-center";
import { loadReportingWorkspaceCached } from "@/lib/reporting/load-reporting-workspace";

type PageProps = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { locale: localeParam, slug } = await params;
  return generateReportingWorkspaceMetadata(slug, localeParam as Locale);
}

export default async function Page({ params }: PageProps) {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);
  const user = await getCurrentUser();
  const reportingResult = await loadReportingWorkspaceCached(slug);

  const canCreate = user
    ? authorizePermissionCodes(user.permissionCodes, REPORTING_PERMISSIONS.CREATE)
    : false;
  const canSubmit = user
    ? authorizePermissionCodes(user.permissionCodes, REPORTING_PERMISSIONS.UPDATE)
    : false;
  const canReview = user
    ? authorizePermissionCodes(user.permissionCodes, REPORTING_PERMISSIONS.REVIEW)
    : false;
  const canApprove = user
    ? authorizePermissionCodes(user.permissionCodes, REPORTING_PERMISSIONS.APPROVE)
    : false;

  const prerequisitesMet = reportingResult.ok ? reportingResult.prerequisitesMet : false;
  const completionApproved = reportingResult.ok ? reportingResult.completionApproved : false;
  const reporting = reportingResult.ok ? reportingResult.reporting : null;

  const commandCenter = reporting
    ? loadReportingCommandCenter({
        locale,
        reporting,
        labels: dictionary.reporting.workspace.commandCenter,
        statusLabels: dictionary.reporting.statuses,
        sectionTypeLabels: dictionary.reporting.sectionTypes,
        sectionStatusLabels: dictionary.reporting.sectionStatuses,
        commentTypeLabels: dictionary.reporting.commentTypes,
      })
    : null;

  return (
    <ReportingOverviewExperience
      locale={locale}
      slug={slug}
      canCreate={canCreate}
      canSubmit={canSubmit}
      canReview={canReview}
      canApprove={canApprove}
      fieldworkStarted={prerequisitesMet}
      fieldworkSubstantiallyComplete={completionApproved}
      hasReporting={Boolean(reporting)}
      commandCenter={commandCenter}
      labels={dictionary.reporting.workspace}
      commandCenterLabels={dictionary.reporting.workspace.commandCenter}
      statusLabels={dictionary.reporting.statuses}
      workflowLabels={dictionary.reporting.workflow}
      emptyLabels={dictionary.reporting.empty}
    />
  );
}
