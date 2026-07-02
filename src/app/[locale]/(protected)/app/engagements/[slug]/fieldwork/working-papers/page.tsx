import { FieldworkWorkingPapersExperience } from "@/components/fieldwork";
import { FIELDWORK_PERMISSIONS } from "@/constants/fieldwork";
import { getCurrentUser } from "@/lib/auth/server";
import { authorizePermissionCodes } from "@/lib/auth/permissions";
import { getDictionary, type Locale } from "@/i18n";
import { generateFieldworkWorkspaceMetadata } from "@/lib/fieldwork/fieldwork-workspace-page";

type PageProps = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { locale: localeParam, slug } = await params;
  return generateFieldworkWorkspaceMetadata(slug, localeParam as Locale);
}

export default async function Page({ params }: PageProps) {
  const { locale: localeParam } = await params;
  const dictionary = await getDictionary(localeParam as Locale);
  const user = await getCurrentUser();
  const canAssign = user ? authorizePermissionCodes(user.permissionCodes, FIELDWORK_PERMISSIONS.ASSIGN) : false;

  return (
    <FieldworkWorkingPapersExperience
      labels={dictionary.fieldwork.workingPapers}
      emptyLabels={dictionary.fieldwork.empty}
      fieldworkLabels={dictionary.fieldwork}
      canAssign={canAssign}
    />
  );
}
