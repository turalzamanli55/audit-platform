import { FieldworkOverviewExperience } from "@/components/fieldwork";
import { getDictionary, type Locale } from "@/i18n";
import { generateFieldworkWorkspaceMetadata } from "@/lib/fieldwork/fieldwork-workspace-page";
import { FIELDWORK_PERMISSIONS } from "@/constants/fieldwork";
import { getCurrentUser } from "@/lib/auth/server";
import { authorizePermissionCodes } from "@/lib/auth/permissions";
import { loadFieldworkActivityCached } from "@/lib/fieldwork/load-fieldwork-activity";
import { loadFieldworkCommandCenter } from "@/lib/fieldwork/load-fieldwork-command-center";
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
  const [fieldworkResult, activityResult] = await Promise.all([
    loadFieldworkWorkspaceCached(slug),
    loadFieldworkActivityCached(slug),
  ]);
  const user = await getCurrentUser();
  const canCreate = user
    ? authorizePermissionCodes(user.permissionCodes, FIELDWORK_PERMISSIONS.CREATE)
    : false;
  const planningApproved = fieldworkResult.ok ? fieldworkResult.planningApproved : false;
  const fieldwork = fieldworkResult.ok ? fieldworkResult.fieldwork : null;
  const activity = activityResult.ok ? activityResult.activity : { entries: [] };

  const commandCenter = fieldwork
    ? loadFieldworkCommandCenter({
        locale,
        fieldwork,
        activity,
        labels: dictionary.fieldwork.workspace.commandCenter,
        fieldworkLabels: dictionary.fieldwork,
      })
    : null;

  return (
    <FieldworkOverviewExperience
      locale={locale}
      slug={slug}
      canCreate={canCreate}
      planningApproved={planningApproved}
      hasFieldwork={Boolean(fieldwork)}
      commandCenter={commandCenter}
      labels={dictionary.fieldwork.workspace}
      fieldworkLabels={dictionary.fieldwork}
    />
  );
}
