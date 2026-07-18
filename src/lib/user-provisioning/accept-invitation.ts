import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";
import { ValidationError, NotFoundError } from "@/lib/errors";

export type AcceptInvitationInput = {
  invitationToken: string;
  password: string;
  fullName?: string;
};

export type AcceptInvitationResult = {
  userId: string;
  organizationId: string;
  workspaceId: string | null;
  membershipId: string;
  roleSlug: string;
};

async function findAuthUserIdByEmail(
  service: SupabaseClient<Database>,
  email: string,
): Promise<string | null> {
  const target = email.toLowerCase();
  for (let page = 1; page <= 20; page += 1) {
    const { data, error } = await service.auth.admin.listUsers({ page, perPage: 200 });
    if (error) return null;
    const match = data.users.find((u) => (u.email ?? "").toLowerCase() === target);
    if (match) return match.id;
    if (data.users.length < 200) break;
  }
  return null;
}

/**
 * Completes an invitation-only onboarding: verifies the token, provisions (or
 * updates) the Supabase auth account with the chosen password, creates the
 * tenant membership with the invited role, accounts for the licensed seat, and
 * marks the invitation accepted. Runs with the service client because the
 * accepting user is unauthenticated at this point.
 */
export async function acceptUserProvisioningInvitation(
  service: SupabaseClient<Database>,
  input: AcceptInvitationInput,
): Promise<AcceptInvitationResult> {
  const token = input.invitationToken?.trim();
  if (!token) throw new ValidationError("Invitation token is required");
  if (!input.password || input.password.length < 12) {
    throw new ValidationError("Password must be at least 12 characters");
  }

  const { data: invitation, error: invitationError } = await service
    .from("user_provisioning_invitations")
    .select("*")
    .eq("invitation_token", token)
    .is("deleted_at", null)
    .maybeSingle();

  if (invitationError) throw new ValidationError(invitationError.message);
  if (!invitation) throw new NotFoundError("Invitation not found");
  if (invitation.invitation_status !== "pending") {
    throw new ValidationError(`Invitation is ${invitation.invitation_status}`);
  }
  if (new Date(invitation.expires_at).getTime() < Date.now()) {
    await service
      .from("user_provisioning_invitations")
      .update({ invitation_status: "expired", updated_by: invitation.invited_by })
      .eq("id", invitation.id);
    throw new ValidationError("Invitation has expired");
  }

  const email = String(invitation.email).toLowerCase();

  // Provision the auth account (or update the password if it already exists).
  let userId: string;
  const created = await service.auth.admin.createUser({
    email,
    password: input.password,
    email_confirm: true,
    user_metadata: input.fullName ? { full_name: input.fullName.trim() } : {},
  });

  if (created.error || !created.data.user) {
    const existingId = await findAuthUserIdByEmail(service, email);
    if (!existingId) throw new ValidationError(created.error?.message ?? "Failed to create account");
    userId = existingId;
    const updated = await service.auth.admin.updateUserById(userId, {
      password: input.password,
      email_confirm: true,
    });
    if (updated.error) throw new ValidationError(updated.error.message);
  } else {
    userId = created.data.user.id;
  }

  // Resolve the invited platform role.
  const { data: role } = await service
    .from("roles")
    .select("id")
    .eq("slug", invitation.role_slug)
    .is("organization_id", null)
    .is("deleted_at", null)
    .maybeSingle();
  if (!role) throw new ValidationError(`Unknown role: ${invitation.role_slug}`);

  const scope: Database["public"]["Enums"]["membership_scope"] = invitation.workspace_id
    ? "workspace"
    : "organization";

  // Idempotent membership creation.
  let membershipId: string;
  const existingMembership = await service
    .from("memberships")
    .select("id")
    .eq("user_id", userId)
    .eq("organization_id", invitation.organization_id)
    .eq("membership_scope", scope)
    .is("deleted_at", null)
    .maybeSingle();

  if (existingMembership.data) {
    membershipId = existingMembership.data.id;
  } else {
    const membership = await service
      .from("memberships")
      .insert({
        user_id: userId,
        organization_id: invitation.organization_id,
        workspace_id: invitation.workspace_id ?? null,
        role_id: role.id,
        membership_scope: scope,
        created_by: invitation.invited_by,
        updated_by: invitation.invited_by,
      })
      .select("id")
      .single();
    if (membership.error || !membership.data) {
      throw new ValidationError(membership.error?.message ?? "Failed to create membership");
    }
    membershipId = membership.data.id;

    // Account for the licensed seat on the tenant's active subscription.
    const subscription = await service
      .from("subscription_and_licensing_plans")
      .select("id, seat_limit, seats_used")
      .eq("organization_id", invitation.organization_id)
      .eq("subscription_status", "active")
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (subscription.data && subscription.data.seats_used < subscription.data.seat_limit) {
      await service
        .from("subscription_and_licensing_plans")
        .update({ seats_used: subscription.data.seats_used + 1 })
        .eq("id", subscription.data.id);
    }
  }

  await service
    .from("user_provisioning_invitations")
    .update({
      invitation_status: "accepted",
      accepted_by: userId,
      accepted_at: new Date().toISOString(),
      updated_by: invitation.invited_by,
    })
    .eq("id", invitation.id);

  await service.from("security_event_monitoring_events").insert({
    event_code: "user.invitation.accepted",
    severity: "info",
    actor_user_id: userId,
    organization_id: invitation.organization_id,
    details: { email, roleSlug: invitation.role_slug } as never,
  });

  return {
    userId,
    organizationId: invitation.organization_id,
    workspaceId: invitation.workspace_id ?? null,
    membershipId,
    roleSlug: invitation.role_slug,
  };
}
