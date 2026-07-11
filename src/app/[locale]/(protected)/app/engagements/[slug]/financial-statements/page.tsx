import { FinancialStatementsOverviewExperience } from "@/components/financial-statements";
import { getDictionary, type Locale } from "@/i18n";
import { generateFinancialStatementsWorkspaceMetadata } from "@/lib/financial-statements/financial-statements-workspace-page";
import { FINANCIAL_STATEMENTS_PERMISSIONS } from "@/constants/financial-statements";
import { getCurrentUser } from "@/lib/auth/server";
import { authorizePermissionCodes } from "@/lib/auth/permissions";
import { loadFinancialStatementsCommandCenter } from "@/lib/financial-statements/load-financial-statements-command-center";
import { loadFinancialStatementsWorkspaceCached } from "@/lib/financial-statements/load-financial-statements-workspace";

type PageProps = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { locale: localeParam, slug } = await params;
  return generateFinancialStatementsWorkspaceMetadata(slug, localeParam as Locale);
}

export default async function Page({ params }: PageProps) {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);
  const user = await getCurrentUser();
  const reportingResult = await loadFinancialStatementsWorkspaceCached(slug);

  const canCreate = user
    ? authorizePermissionCodes(user.permissionCodes, FINANCIAL_STATEMENTS_PERMISSIONS.CREATE)
    : false;
  const canSubmit = user
    ? authorizePermissionCodes(user.permissionCodes, FINANCIAL_STATEMENTS_PERMISSIONS.UPDATE)
    : false;
  const canReview = user
    ? authorizePermissionCodes(user.permissionCodes, FINANCIAL_STATEMENTS_PERMISSIONS.REVIEW)
    : false;
  const canApprove = user
    ? authorizePermissionCodes(user.permissionCodes, FINANCIAL_STATEMENTS_PERMISSIONS.APPROVE)
    : false;

  const prerequisitesMet = reportingResult.ok ? reportingResult.prerequisitesMet : false;
  const opinionApproved = reportingResult.ok ? reportingResult.opinionApproved : false;
  const financialStatements = reportingResult.ok ? reportingResult.financialStatements : null;

  const commandCenter = financialStatements
    ? loadFinancialStatementsCommandCenter({
        locale,
        financialStatements,
        labels: dictionary.financialStatements.workspace.commandCenter,
        statusLabels: dictionary.financialStatements.statuses,
        sectionTypeLabels: dictionary.financialStatements.sectionTypes,
        sectionStatusLabels: dictionary.financialStatements.sectionStatuses,
        commentTypeLabels: dictionary.financialStatements.commentTypes,
      })
    : null;

  return (
    <FinancialStatementsOverviewExperience
      locale={locale}
      slug={slug}
      canCreate={canCreate}
      canSubmit={canSubmit}
      canReview={canReview}
      canApprove={canApprove}
      fieldworkStarted={prerequisitesMet}
      fieldworkSubstantiallyComplete={opinionApproved}
      hasFinancialStatements={Boolean(financialStatements)}
      commandCenter={commandCenter}
      labels={dictionary.financialStatements.workspace}
      commandCenterLabels={dictionary.financialStatements.workspace.commandCenter}
      statusLabels={dictionary.financialStatements.statuses}
      workflowLabels={dictionary.financialStatements.workflow}
      emptyLabels={dictionary.financialStatements.empty}
    />
  );
}
