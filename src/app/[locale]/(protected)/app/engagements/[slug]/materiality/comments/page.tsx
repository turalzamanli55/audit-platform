import { MaterialityCommentsExperience } from "@/components/materiality";
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
  const canUpdate = user
    ? authorizePermissionCodes(user.permissionCodes, MATERIALITY_PERMISSIONS.COMMENT)
    : false;
  const planningApproved = materialityResult.ok ? materialityResult.planningApproved : false;

  return (
    <MaterialityCommentsExperience
      locale={locale}
      canCreate={canCreate}
      canUpdate={canUpdate}
      planningApproved={planningApproved}
      emptyLabels={dictionary.materiality.empty}
      workspaceLabels={dictionary.materiality.workspace}
      workflowLabels={dictionary.materiality.workflow}
      archivedReadOnlyLabel={dictionary.materiality.workspace.archivedDescription}
      labels={dictionary.materiality.comments}
      commentTypeLabels={dictionary.materiality.commentTypes}
      noteLabels={{
        bodyPlaceholder: dictionary.materiality.comments.bodyPlaceholder ?? "",
        addAction: dictionary.materiality.comments.addAction ?? "",
      }}
    />
  );
}
