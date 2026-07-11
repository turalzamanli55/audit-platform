import type { Locale } from "@/i18n";
import type { Dictionary } from "@/i18n/get-dictionary";
import { FINANCIAL_STATEMENTS_PERMISSIONS } from "@/constants/financial-statements";
import { authorizePermissionCodes } from "@/lib/auth/permissions";
import type { getCurrentUser } from "@/lib/auth/server";

type CurrentUser = Awaited<ReturnType<typeof getCurrentUser>>;

export function buildFinancialStatementSectionPageProps(
  dictionary: Dictionary,
  user: CurrentUser,
  locale: Locale,
  reportingResult: {
    ok: boolean;
    prerequisitesMet?: boolean;
    opinionApproved?: boolean;
  },
) {
  const reporting = dictionary.financialStatements;

  return {
    locale,
    canCreate: user
      ? authorizePermissionCodes(user.permissionCodes, FINANCIAL_STATEMENTS_PERMISSIONS.CREATE)
      : false,
    canReview: user
      ? authorizePermissionCodes(user.permissionCodes, FINANCIAL_STATEMENTS_PERMISSIONS.REVIEW)
      : false,
    canComment: user
      ? authorizePermissionCodes(user.permissionCodes, FINANCIAL_STATEMENTS_PERMISSIONS.COMMENT)
      : false,
    canArchive: user
      ? authorizePermissionCodes(user.permissionCodes, FINANCIAL_STATEMENTS_PERMISSIONS.ARCHIVE)
      : false,
    fieldworkStarted: reportingResult.ok ? (reportingResult.prerequisitesMet ?? false) : false,
    fieldworkSubstantiallyComplete: reportingResult.ok
      ? (reportingResult.opinionApproved ?? false)
      : false,
    emptyLabels: reporting.empty,
    workspaceLabels: {
      fieldworkGateDescription: reporting.workspace.fieldworkGateDescription,
      fieldworkSubstantiallyCompleteDescription:
        reporting.workspace.fieldworkSubstantiallyCompleteDescription,
      archivedDescription: reporting.workspace.archivedDescription,
    },
    archivedReadOnlyLabel: reporting.workspace.archivedDescription,
    workflowLabels: reporting.workflow,
    commentTypeLabels: reporting.commentTypes,
    itemLabels: {
      ...reporting.itemActions,
      sectionTypes: reporting.sectionTypes,
    },
    noteLabels: reporting.noteActions,
    versionLabels: reporting.versionActions,
    historyLabels: {
      versionLabel: reporting.history.versionLabel,
      updatedLabel: reporting.history.updatedLabel,
      actions: reporting.history.actions,
      filterActor: reporting.history.filterActor,
      filterModule: reporting.history.filterModule,
      filterAction: reporting.history.filterAction,
      filterDate: reporting.history.filterDate,
      all: reporting.history.all,
    },
    settingsLabels: reporting.settings,
  };
}
