import { PlanningIntegrationPlaceholder } from "@/components/planning";
import { PLANNING_PERMISSIONS } from "@/constants/planning";
import { getCurrentUser } from "@/lib/auth/server";
import { authorizePermissionCodes } from "@/lib/auth/permissions";
import { getDictionary, type Locale } from "@/i18n";
import { generatePlanningWorkspaceMetadata } from "@/lib/planning/planning-workspace-page";

type PlanningSectionPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: PlanningSectionPageProps) {
  const { locale: localeParam, slug } = await params;
  return generatePlanningWorkspaceMetadata(slug, localeParam as Locale);
}

export default async function PlanningRiskPage({ params }: PlanningSectionPageProps) {
  const { locale: localeParam } = await params;
  const dictionary = await getDictionary(localeParam as Locale);
  const user = await getCurrentUser();
  const canCreate = user
    ? authorizePermissionCodes(user.permissionCodes, PLANNING_PERMISSIONS.CREATE)
    : false;

  return (
    <PlanningIntegrationPlaceholder
      module="risk"
      canCreate={canCreate}
      labels={dictionary.planning.integration}
      emptyLabels={dictionary.planning.empty}
    />
  );
}
