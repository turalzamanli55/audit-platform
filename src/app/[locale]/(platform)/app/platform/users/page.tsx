import {
  loadPlatformInvitations,
  loadPlatformUsers,
  loadOrganizationOptions,
} from "@/lib/platform-console/data";
import { PlatformPageHeader } from "@/components/platform-console/platform-primitives";
import { UserManager } from "@/components/platform-console/managers/user-manager";

export const dynamic = "force-dynamic";

export default async function PlatformUsersPage() {
  const [users, invitations, organizations] = await Promise.all([
    loadPlatformUsers(),
    loadPlatformInvitations(),
    loadOrganizationOptions(),
  ]);

  return (
    <div className="space-y-8">
      <PlatformPageHeader
        title="Users"
        description="Create, suspend, activate, delete, and reset users. Invite tenant users and manage invitations."
      />
      <UserManager users={users} invitations={invitations} organizations={organizations} />
    </div>
  );
}
