import { EngagementSettingsExperience } from "@/components/engagement/settings/engagement-settings-experience";
import { ENGAGEMENT_PERMISSIONS } from "@/constants/engagement";
import { getCurrentUser } from "@/lib/auth/server";
import { authorizePermissionCodes } from "@/lib/auth/permissions";
import { getDictionary, type Locale } from "@/i18n";
import { generateEngagementWorkspaceMetadata } from "@/lib/engagement/engagement-workspace-page";

type EngagementSettingsPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: EngagementSettingsPageProps) {
  const { locale: localeParam, slug } = await params;
  return generateEngagementWorkspaceMetadata(slug, localeParam as Locale);
}

export default async function EngagementSettingsPage({ params }: EngagementSettingsPageProps) {
  const { locale: localeParam } = await params;
  const dictionary = await getDictionary(localeParam as Locale);
  const user = await getCurrentUser();
  const canUpdate = user
    ? authorizePermissionCodes(user.permissionCodes, ENGAGEMENT_PERMISSIONS.UPDATE)
    : false;
  const canArchive = user
    ? authorizePermissionCodes(user.permissionCodes, ENGAGEMENT_PERMISSIONS.ARCHIVE)
    : false;

  return (
    <EngagementSettingsExperience
      canUpdate={canUpdate}
      canArchive={canArchive}
      labels={dictionary.engagements.settings}
      engagementsLabels={dictionary.engagements}
    />
  );
}
