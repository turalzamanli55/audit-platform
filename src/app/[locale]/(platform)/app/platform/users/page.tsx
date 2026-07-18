import {
  loadPlatformInvitations,
  loadPlatformUsers,
  loadOrganizationOptions,
} from "@/lib/platform-console/data";
import { PlatformPageHeader } from "@/components/platform-console/platform-primitives";
import { UserManager } from "@/components/platform-console/managers/user-manager";

export const dynamic = "force-dynamic";

export default async function PlatformUsersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [users, invitations, organizations] = await Promise.all([
    loadPlatformUsers(),
    loadPlatformInvitations(),
    loadOrganizationOptions(),
  ]);

  return (
    <div className="space-y-8">
      <PlatformPageHeader
        title="Users"
        description="Open any user to inspect their full profile, sessions, permissions, and activity."
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
