import { CompletionOverviewExperience } from "@/components/completion";
import { getDictionary, type Locale } from "@/i18n";
import { generateCompletionWorkspaceMetadata } from "@/lib/completion/completion-workspace-page";
import { COMPLETION_PERMISSIONS } from "@/constants/completion";
import { getCurrentUser } from "@/lib/auth/server";
import { authorizePermissionCodes } from "@/lib/auth/permissions";
import { loadCompletionCommandCenter } from "@/lib/completion/load-completion-command-center";
import { loadCompletionWorkspaceCached } from "@/lib/completion/load-completion-workspace";

type PageProps = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { locale: localeParam, slug } = await params;
  return generateCompletionWorkspaceMetadata(slug, localeParam as Locale);
}

export default async function Page({ params }: PageProps) {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);
  const user = await getCurrentUser();
  const completionResult = await loadCompletionWorkspaceCached(slug);

  const canCreate = user
    ? authorizePermissionCodes(user.permissionCodes, COMPLETION_PERMISSIONS.CREATE)
    : false;
  const canSubmit = user
    ? authorizePermissionCodes(user.permissionCodes, COMPLETION_PERMISSIONS.UPDATE)
    : false;
  const canReview = user
    ? authorizePermissionCodes(user.permissionCodes, COMPLETION_PERMISSIONS.REVIEW)
    : false;
  const canApprove = user
    ? authorizePermissionCodes(user.permissionCodes, COMPLETION_PERMISSIONS.APPROVE)
    : false;

  const prerequisitesMet = completionResult.ok ? completionResult.prerequisitesMet : false;
  const reviewApproved = completionResult.ok ? completionResult.reviewApproved : false;
  const completion = completionResult.ok ? completionResult.completion : null;

  const commandCenter = completion
    ? loadCompletionCommandCenter({
        locale,
        completion,
        labels: dictionary.completion.workspace.commandCenter,
        statusLabels: dictionary.completion.statuses,
        itemTypeLabels: dictionary.completion.itemTypes,
        itemStatusLabels: dictionary.completion.itemStatuses,
        commentTypeLabels: dictionary.completion.commentTypes,
      })
    : null;

  return (
    <CompletionOverviewExperience
      locale={locale}
      slug={slug}
      canCreate={canCreate}
      canSubmit={canSubmit}
      canReview={canReview}
      canApprove={canApprove}
      fieldworkStarted={prerequisitesMet}
      fieldworkSubstantiallyComplete={reviewApproved}
      hasCompletion={Boolean(completion)}
      commandCenter={commandCenter}
      labels={dictionary.completion.workspace}
      commandCenterLabels={dictionary.completion.workspace.commandCenter}
      statusLabels={dictionary.completion.statuses}
      workflowLabels={dictionary.completion.workflow}
      emptyLabels={dictionary.completion.empty}
    />
  );
}
