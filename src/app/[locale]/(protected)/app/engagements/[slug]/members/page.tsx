import { EngagementMembersSection } from "@/components/engagement/members/engagement-members-section";
import { ENGAGEMENT_PERMISSIONS } from "@/constants/engagement";
import { getCurrentUser } from "@/lib/auth/server";
import { authorizePermissionCodes } from "@/lib/auth/permissions";
import { getDictionary, type Locale } from "@/i18n";
import {
  generateEngagementWorkspaceMetadata,
  requireEngagementWorkspace,
} from "@/lib/engagement/engagement-workspace-page";

type EngagementMembersPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: EngagementMembersPageProps) {
  const { locale: localeParam, slug } = await params;
  return generateEngagementWorkspaceMetadata(slug, localeParam as Locale);
}

export default async function EngagementMembersPage({ params }: EngagementMembersPageProps) {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam as Locale;
  const dictionary = await getDictionary(locale);
  const engagement = await requireEngagementWorkspace(slug);
  const user = await getCurrentUser();
  const canRead = user
    ? authorizePermissionCodes(user.permissionCodes, ENGAGEMENT_PERMISSIONS.READ)
    : false;

  return (
    <EngagementMembersSection
      members={engagement.members}
      locale={locale}
      labels={dictionary.engagements.members}
      canRead={canRead}
    />
  );
}
