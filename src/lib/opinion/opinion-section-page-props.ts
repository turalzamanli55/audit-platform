import type { Locale } from "@/i18n";
import type { Dictionary } from "@/i18n/get-dictionary";
import { OPINION_PERMISSIONS } from "@/constants/opinion";
import { authorizePermissionCodes } from "@/lib/auth/permissions";
import type { getCurrentUser } from "@/lib/auth/server";

type CurrentUser = Awaited<ReturnType<typeof getCurrentUser>>;

export function buildOpinionSectionPageProps(
  dictionary: Dictionary,
  user: CurrentUser,
  locale: Locale,
  reportingResult: {
    ok: boolean;
    prerequisitesMet?: boolean;
    reportingApproved?: boolean;
  },
) {
  const reporting = dictionary.opinion;

  return {
    locale,
    canCreate: user
      ? authorizePermissionCodes(user.permissionCodes, OPINION_PERMISSIONS.CREATE)
      : false,
    canReview: user
      ? authorizePermissionCodes(user.permissionCodes, OPINION_PERMISSIONS.REVIEW)
      : false,
    canComment: user
      ? authorizePermissionCodes(user.permissionCodes, OPINION_PERMISSIONS.COMMENT)
      : false,
    canArchive: user
      ? authorizePermissionCodes(user.permissionCodes, OPINION_PERMISSIONS.ARCHIVE)
      : false,
    fieldworkStarted: reportingResult.ok ? (reportingResult.prerequisitesMet ?? false) : false,
    fieldworkSubstantiallyComplete: reportingResult.ok
      ? (reportingResult.reportingApproved ?? false)
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
