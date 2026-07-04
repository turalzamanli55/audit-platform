import { MaterialityOverviewExperience } from "@/components/materiality";
import { getDictionary, type Locale } from "@/i18n";
import { generateMaterialityWorkspaceMetadata } from "@/lib/materiality/materiality-workspace-page";
import { MATERIALITY_PERMISSIONS } from "@/constants/materiality";
import { getCurrentUser } from "@/lib/auth/server";
import { authorizePermissionCodes } from "@/lib/auth/permissions";
import { loadMaterialityWorkspaceCached } from "@/lib/materiality/load-materiality-workspace";

type PageProps = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { locale: localeParam, slug } = await params;
  return generateMaterialityWorkspaceMetadata(slug, localeParam as Locale);
}

export default async function Page({ params }: PageProps) {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);
  const user = await getCurrentUser();
  const materialityResult = await loadMaterialityWorkspaceCached(slug);
  const canCreate = user
    ? authorizePermissionCodes(user.permissionCodes, MATERIALITY_PERMISSIONS.CREATE)
    : false;
  const canSubmit = user
    ? authorizePermissionCodes(user.permissionCodes, MATERIALITY_PERMISSIONS.UPDATE)
    : false;
  const canReview = user
    ? authorizePermissionCodes(user.permissionCodes, MATERIALITY_PERMISSIONS.REVIEW)
    : false;
  const canApprove = user
    ? authorizePermissionCodes(user.permissionCodes, MATERIALITY_PERMISSIONS.APPROVE)
    : false;
  const planningApproved = materialityResult.ok ? materialityResult.planningApproved : false;

  return (
    <MaterialityOverviewExperience
      canCreate={canCreate}
      canSubmit={canSubmit}
      canReview={canReview}
      canApprove={canApprove}
      planningApproved={planningApproved}
      workspaceLabels={dictionary.materiality.workspace}
      createLabels={dictionary.materiality.empty}
      thresholdLabels={dictionary.materiality.thresholds}
      statusLabels={dictionary.materiality.statuses}
      labels={{
        title: dictionary.materiality.workspace.title,
        description: dictionary.materiality.workspace.description,
        statusTitle: dictionary.materiality.workspace.statusTitle,
        statusDescription: dictionary.materiality.workspace.statusDescription,
        progress: dictionary.materiality.workspace.progress,
        workflowTitle: dictionary.materiality.workspace.workflowTitle,
        workflowDescription: dictionary.materiality.workspace.workflowDescription,
        thresholdsPreviewTitle: dictionary.materiality.workspace.thresholdsPreviewTitle,
        thresholdsPreviewDescription: dictionary.materiality.workspace.thresholdsPreviewDescription,
      }}
      workflowLabels={dictionary.materiality.workflow}
    />
  );
}
