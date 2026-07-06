import type { Locale } from "@/i18n";
import type { Dictionary } from "@/i18n/get-dictionary";
import { COMPLETION_PERMISSIONS } from "@/constants/completion";
import { authorizePermissionCodes } from "@/lib/auth/permissions";
import type { getCurrentUser } from "@/lib/auth/server";

type CurrentUser = Awaited<ReturnType<typeof getCurrentUser>>;

export function buildCompletionSectionPageProps(
  dictionary: Dictionary,
  user: CurrentUser,
  locale: Locale,
  reviewResult: {
    ok: boolean;
    fieldworkStarted?: boolean;
    fieldworkSubstantiallyComplete?: boolean;
  },
) {
  const review = dictionary.completion;

  return {
    locale,
    canCreate: user
      ? authorizePermissionCodes(user.permissionCodes, COMPLETION_PERMISSIONS.CREATE)
      : false,
    canReview: user
      ? authorizePermissionCodes(user.permissionCodes, COMPLETION_PERMISSIONS.REVIEW)
      : false,
    canComment: user
      ? authorizePermissionCodes(user.permissionCodes, COMPLETION_PERMISSIONS.COMMENT)
      : false,
    canArchive: user
      ? authorizePermissionCodes(user.permissionCodes, COMPLETION_PERMISSIONS.ARCHIVE)
      : false,
    fieldworkStarted: reviewResult.ok ? (reviewResult.fieldworkStarted ?? false) : false,
    fieldworkSubstantiallyComplete: reviewResult.ok
      ? (reviewResult.fieldworkSubstantiallyComplete ?? false)
      : false,
    emptyLabels: review.empty,
    workspaceLabels: {
      fieldworkGateDescription: review.workspace.fieldworkGateDescription,
      fieldworkSubstantiallyCompleteDescription:
        review.workspace.fieldworkSubstantiallyCompleteDescription,
      archivedDescription: review.workspace.archivedDescription,
    },
    archivedReadOnlyLabel: review.workspace.archivedDescription,
    workflowLabels: review.workflow,
    commentTypeLabels: review.commentTypes,
    itemLabels: {
      ...review.itemActions,
      itemTypes: review.itemTypes,
    },
    noteLabels: review.noteActions,
    versionLabels: review.versionActions,
    historyLabels: {
      versionLabel: review.history.versionLabel,
      updatedLabel: review.history.updatedLabel,
      actions: review.history.actions,
      filterActor: review.history.filterActor,
      filterModule: review.history.filterModule,
      filterAction: review.history.filterAction,
      filterDate: review.history.filterDate,
      all: review.history.all,
    },
    settingsLabels: review.settings,
  };
}
