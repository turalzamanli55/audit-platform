import { MaterialityOverviewExperience } from "@/components/materiality";
import { getDictionary, type Locale } from "@/i18n";
import { generateMaterialityWorkspaceMetadata } from "@/lib/materiality/materiality-workspace-page";
import { MATERIALITY_PERMISSIONS } from "@/constants/materiality";
import { getCurrentUser } from "@/lib/auth/server";
import { authorizePermissionCodes } from "@/lib/auth/permissions";
import { loadMaterialityCommandCenter } from "@/lib/materiality/load-materiality-command-center";
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
  const materiality = materialityResult.ok ? materialityResult.materiality : null;

  const commandCenter = materiality
    ? loadMaterialityCommandCenter({
        locale,
        materiality,
        labels: dictionary.materiality.workspace.commandCenter,
        materialityLabels: dictionary.materiality,
      })
    : null;

  return (
    <MaterialityOverviewExperience
      locale={locale}
      slug={slug}
      canCreate={canCreate}
      canSubmit={canSubmit}
      canReview={canReview}
      canApprove={canApprove}
      planningApproved={planningApproved}
      hasMateriality={Boolean(materiality)}
      commandCenter={commandCenter}
      labels={dictionary.materiality.workspace}
      materialityLabels={dictionary.materiality}
    />
  );
}
