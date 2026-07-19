import {
  loadPlatformInvitations,
  loadPlatformUsers,
  loadOrganizationOptions,
} from "@/lib/platform-console/data";
import { PlatformPageHeader } from "@/components/platform-console/platform-primitives";
import { UserManager } from "@/components/platform-console/managers/user-manager";
import { getPlatformLabels } from "@/i18n/platform-labels";

export const dynamic = "force-dynamic";

export default async function PlatformUsersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = getPlatformLabels(locale);
  const [users, invitations, organizations] = await Promise.all([
    loadPlatformUsers(),
    loadPlatformInvitations(),
    loadOrganizationOptions(),
  ]);

  return (
    <div className="space-y-8">
      <PlatformPageHeader
        eyebrow={t.eyebrow}
        title={t.pages.users.title}
        description={t.pages.users.description}
      />
      <UserManager
        users={users}
        invitations={invitations}
        organizations={organizations}
        detailBasePath={`/${locale}/app/platform`}
      />
    </div>
  );
}
