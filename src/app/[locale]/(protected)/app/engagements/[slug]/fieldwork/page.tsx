import { FieldworkOverviewExperience } from "@/components/fieldwork";
import { getDictionary, type Locale } from "@/i18n";
import { generateFieldworkWorkspaceMetadata } from "@/lib/fieldwork/fieldwork-workspace-page";
import { FIELDWORK_PERMISSIONS } from "@/constants/fieldwork";
import { getCurrentUser } from "@/lib/auth/server";
import { authorizePermissionCodes } from "@/lib/auth/permissions";
import { loadFieldworkWorkspaceCached } from "@/lib/fieldwork/load-fieldwork-workspace";

type PageProps = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { locale: localeParam, slug } = await params;
  return generateFieldworkWorkspaceMetadata(slug, localeParam as Locale);
}

export default async function Page({ params }: PageProps) {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);
  const fieldworkResult = await loadFieldworkWorkspaceCached(slug);
  const user = await getCurrentUser();
  const canCreate = user ? authorizePermissionCodes(user.permissionCodes, FIELDWORK_PERMISSIONS.CREATE) : false;
  const planningApproved = fieldworkResult.ok ? fieldworkResult.planningApproved : false;
  return (
    <FieldworkOverviewExperience
      canCreate={canCreate}
      planningApproved={planningApproved}
      labels={dictionary.fieldwork.workspace}
      fieldworkLabels={dictionary.fieldwork}
    />
  );
}
