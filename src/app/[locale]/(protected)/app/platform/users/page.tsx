import { loadPlatformInvitations } from "@/lib/platform-console/data";
import { DataTable, PlatformPageHeader, StatusPill, PlatformSection } from "@/components/platform-console/platform-primitives";

export const dynamic = "force-dynamic";

function invitationTone(status: string): "ok" | "warn" | "down" | "neutral" {
  if (status === "accepted") return "ok";
  if (status === "pending") return "warn";
  if (status === "revoked" || status === "expired") return "down";
  return "neutral";
}

export default async function PlatformUsersPage() {
  const invitations = await loadPlatformInvitations();

  return (
    <div className="space-y-8">
      <PlatformPageHeader
        title="Users"
        description="User access is invitation-only. Platform Owner invites tenant admins; tenant admins invite their users."
      />
      <PlatformSection title="Provisioning Invitations">
        <DataTable
          columns={["Email", "Role", "Status", "Expires"]}
          empty="No invitations issued yet."
          rows={invitations.map((invite) => [
            <span key="e" className="font-medium text-foreground">
              {invite.email}
            </span>,
            invite.roleSlug,
            <StatusPill key="s" label={invite.invitationStatus} tone={invitationTone(invite.invitationStatus)} />,
            new Date(invite.expiresAt).toLocaleDateString(),
          ])}
        />
      </PlatformSection>
    </div>
  );
}
