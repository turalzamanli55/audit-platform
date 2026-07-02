import { PlanningTextSectionExperience } from "@/components/planning";
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

export default async function PlanningNotesPage({ params }: PlanningSectionPageProps) {
  const { locale: localeParam } = await params;
  const dictionary = await getDictionary(localeParam as Locale);
  const user = await getCurrentUser();
  const canCreate = user
    ? authorizePermissionCodes(user.permissionCodes, PLANNING_PERMISSIONS.CREATE)
    : false;
  const canUpdate = user
    ? authorizePermissionCodes(user.permissionCodes, PLANNING_PERMISSIONS.UPDATE)
    : false;

  return (
    <PlanningTextSectionExperience
      sectionId="planning-notes"
      title={dictionary.planning.workspace.sections.notes.title}
      description={dictionary.planning.workspace.sections.notes.description}
      fieldKey="planningNotes"
      canCreate={canCreate}
      canUpdate={canUpdate}
      labels={dictionary.planning.editor}
      emptyLabels={dictionary.planning.empty}
    />
  );
}
