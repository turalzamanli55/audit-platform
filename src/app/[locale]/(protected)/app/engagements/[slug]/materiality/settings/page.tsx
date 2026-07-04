import { MaterialitySettingsExperience } from "@/components/materiality";
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
  const canArchive = user
    ? authorizePermissionCodes(user.permissionCodes, MATERIALITY_PERMISSIONS.ARCHIVE)
    : false;
  const planningApproved = materialityResult.ok ? materialityResult.planningApproved : false;

  return (
    <MaterialitySettingsExperience
      canCreate={canCreate}
      canArchive={canArchive}
      planningApproved={planningApproved}
      emptyLabels={dictionary.materiality.empty}
      workspaceLabels={dictionary.materiality.workspace}
      workflowLabels={dictionary.materiality.workflow}
      archivedReadOnlyLabel={dictionary.materiality.workspace.archivedDescription}
      labels={{
        title: dictionary.materiality.settings.title,
        description: dictionary.materiality.settings.description,
        emptyTitle: dictionary.materiality.settings.title,
        emptyDescription: dictionary.materiality.settings.description,
      }}
      settingsLabels={dictionary.materiality.settings}
    />
  );
}
