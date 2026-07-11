import type { Locale } from "@/i18n";
import type { Dictionary } from "@/i18n/get-dictionary";
import { REPORTING_PERMISSIONS } from "@/constants/reporting";
import { authorizePermissionCodes } from "@/lib/auth/permissions";
import type { getCurrentUser } from "@/lib/auth/server";

type CurrentUser = Awaited<ReturnType<typeof getCurrentUser>>;

export function buildReportingSectionPageProps(
  dictionary: Dictionary,
  user: CurrentUser,
  locale: Locale,
  reportingResult: {
    ok: boolean;
    prerequisitesMet?: boolean;
    completionApproved?: boolean;
  },
) {
  const reporting = dictionary.reporting;

  return {
    locale,
    canCreate: user
      ? authorizePermissionCodes(user.permissionCodes, REPORTING_PERMISSIONS.CREATE)
      : false,
    canReview: user
      ? authorizePermissionCodes(user.permissionCodes, REPORTING_PERMISSIONS.REVIEW)
      : false,
    canComment: user
      ? authorizePermissionCodes(user.permissionCodes, REPORTING_PERMISSIONS.COMMENT)
      : false,
    canArchive: user
      ? authorizePermissionCodes(user.permissionCodes, REPORTING_PERMISSIONS.ARCHIVE)
      : false,
    fieldworkStarted: reportingResult.ok ? (reportingResult.prerequisitesMet ?? false) : false,
    fieldworkSubstantiallyComplete: reportingResult.ok
      ? (reportingResult.completionApproved ?? false)
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
