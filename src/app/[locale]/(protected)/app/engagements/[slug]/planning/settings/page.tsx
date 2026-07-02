import { PlanningSettingsExperience } from "@/components/planning";
import { PLANNING_PERMISSIONS } from "@/constants/planning";
import { getCurrentUser } from "@/lib/auth/server";
import { authorizePermissionCodes } from "@/lib/auth/permissions";
import { getDictionary, type Locale } from "@/i18n";
import { generatePlanningWorkspaceMetadata } from "@/lib/planning/planning-workspace-page";

type PlanningSettingsPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: PlanningSettingsPageProps) {
  const { locale: localeParam, slug } = await params;
  return generatePlanningWorkspaceMetadata(slug, localeParam as Locale);
}

export default async function PlanningSettingsPage({ params }: PlanningSettingsPageProps) {
  const { locale: localeParam } = await params;
  const dictionary = await getDictionary(localeParam as Locale);
  const user = await getCurrentUser();
  const canCreate = user
    ? authorizePermissionCodes(user.permissionCodes, PLANNING_PERMISSIONS.CREATE)
    : false;
  const canArchive = user
    ? authorizePermissionCodes(user.permissionCodes, PLANNING_PERMISSIONS.ARCHIVE)
    : false;

  return (
    <PlanningSettingsExperience
      canCreate={canCreate}
      canArchive={canArchive}
      labels={dictionary.planning.settings}
      emptyLabels={dictionary.planning.empty}
    />
  );
}
