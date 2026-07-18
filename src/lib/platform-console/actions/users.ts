"use server";

import { createPlatformAction, type PlatformActionContext } from "../platform-action";
import { recordPlatformEvent } from "../events";
import { ValidationError, NotFoundError } from "@/lib/errors";
import { isValidEmail, isValidPassword } from "@/utils/auth-validation";
import {
  PLATFORM_OWNER_METADATA_KEY,
  PLATFORM_OWNER_METADATA_VALUE,
} from "@/lib/platform-bootstrap";

function resolveSiteOrigin(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) return configured.replace(/\/$/, "");
  return "http://localhost:3000";
}

async function assertNotPlatformOwner(ctx: PlatformActionContext, userId: string): Promise<void> {
  const { data } = await ctx.service.auth.admin.getUserById(userId);
  const metadata = data.user?.app_metadata as Record<string, unknown> | undefined;
  if (metadata?.[PLATFORM_OWNER_METADATA_KEY] === PLATFORM_OWNER_METADATA_VALUE) {
    throw new ValidationError("The Platform Owner cannot be modified or deleted");
  }
}

// ---------------------------------------------------------------------------
// Invitations
// ---------------------------------------------------------------------------

export type SendInvitationInput = {
  email: string;
  organizationId: string;
  roleSlug: string;
  expiresInDays?: number;
};

export const sendInvitationAction = createPlatformAction<SendInvitationInput, { id: string }>(
  { module: "platform.users.invite" },
  async (input, ctx) => {
    const email = input.email.trim().toLowerCase();
    if (!isValidEmail(email)) throw new ValidationError("Enter a valid email address");
    if (!input.organizationId) throw new ValidationError("Select an organization");
    if (!input.roleSlug.trim()) throw new ValidationError("Select a role");

    const org = await ctx.service
      .from("organizations")
      .select("id")
      .eq("id", input.organizationId)
      .is("deleted_at", null)
      .maybeSingle();
    if (!org.data) throw new NotFoundError("Organization not found");

    const days = Math.min(Math.max(input.expiresInDays ?? 14, 1), 90);
    const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();

    const { data, error } = await ctx.service
      .from("user_provisioning_invitations")
      .insert({
        organization_id: input.organizationId,
        email,
        role_slug: input.roleSlug.trim(),
        invitation_token: crypto.randomUUID(),
        invitation_status: "pending",
        invited_by: ctx.ownerUserId,
        expires_at: expiresAt,
        created_by: ctx.ownerUserId,
        updated_by: ctx.ownerUserId,
      })
      .select("id")
      .single();

    if (error || !data) throw new ValidationError(error?.message ?? "Failed to send invitation");

    await recordPlatformEvent(ctx.service, {
      eventCode: "user.invited",
      actorUserId: ctx.ownerUserId,
      organizationId: input.organizationId,
      details: { email, roleSlug: input.roleSlug },
    });

    return { id: data.id };
  },
);

export const resendInvitationAction = createPlatformAction<{ id: string }, { id: string }>(
  { module: "platform.users.invite.resend" },
  async (input, ctx) => {
    const expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
    const { data, error } = await ctx.service
      .from("user_provisioning_invitations")
      .update({
        invitation_token: crypto.randomUUID(),
        invitation_status: "pending",
        expires_at: expiresAt,
        updated_by: ctx.ownerUserId,
      })
      .eq("id", input.id)
      .is("deleted_at", null)
      .select("id")
      .maybeSingle();

    if (error) throw new ValidationError(error.message);
    if (!data) throw new NotFoundError("Invitation not found");

    await recordPlatformEvent(ctx.service, {
      eventCode: "user.invitation.resent",
      actorUserId: ctx.ownerUserId,
    });

    return { id: input.id };
  },
);

export const revokeInvitationAction = createPlatformAction<{ id: string }, { id: string }>(
  { module: "platform.users.invite.revoke" },
  async (input, ctx) => {
    const { data, error } = await ctx.service
      .from("user_provisioning_invitations")
      .update({ invitation_status: "revoked", updated_by: ctx.ownerUserId })
      .eq("id", input.id)
      .is("deleted_at", null)
      .select("id")
      .maybeSingle();

    if (error) throw new ValidationError(error.message);
    if (!data) throw new NotFoundError("Invitation not found");

    await recordPlatformEvent(ctx.service, {
      eventCode: "user.invitation.revoked",
      actorUserId: ctx.ownerUserId,
      severity: "warning",
    });

    return { id: input.id };
  },
);

// ---------------------------------------------------------------------------
// User lifecycle
// ---------------------------------------------------------------------------

export type CreateUserInput = {
  email: string;
  password: string;
  fullName?: string;
  organizationId?: string;
  roleSlug?: string;
};

export const createUserAction = createPlatformAction<CreateUserInput, { userId: string }>(
  { module: "platform.users.create" },
  async (input, ctx) => {
    const email = input.email.trim().toLowerCase();
    if (!isValidEmail(email)) throw new ValidationError("Enter a valid email address");
    if (!isValidPassword(input.password)) throw new ValidationError("Password does not meet policy");

    const { data, error } = await ctx.service.auth.admin.createUser({
      email,
      password: input.password,
      email_confirm: true,
      user_metadata: input.fullName ? { full_name: input.fullName.trim() } : {},
    });

    if (error || !data.user) throw new ValidationError(error?.message ?? "Failed to create user");
    const userId = data.user.id;

    // Optional tenant assignment: organization + role membership.
    if (input.organizationId && input.roleSlug) {
      const role = await ctx.service
        .from("roles")
        .select("id")
        .eq("slug", input.roleSlug)
        .is("organization_id", null)
        .maybeSingle();

      if (!role.data) {
        throw new ValidationError(`Unknown role: ${input.roleSlug}`);
      }

      const membership = await ctx.service.from("memberships").insert({
        user_id: userId,
        organization_id: input.organizationId,
        role_id: role.data.id,
        membership_scope: "organization",
        created_by: ctx.ownerUserId,
        updated_by: ctx.ownerUserId,
      });

      if (membership.error) {
        throw new ValidationError(`User created, but membership failed: ${membership.error.message}`);
      }
    }

    await recordPlatformEvent(ctx.service, {
      eventCode: "user.created",
      actorUserId: ctx.ownerUserId,
      organizationId: input.organizationId ?? null,
      details: { email },
    });

    return { userId };
  },
);

function lifecycleAction(
  module: string,
  eventCode: string,
  apply: (ctx: PlatformActionContext, userId: string) => Promise<void>,
  severity: "info" | "warning" = "info",
) {
  return createPlatformAction<{ userId: string }, { userId: string }>(
    { module },
    async (input, ctx) => {
      if (!input.userId) throw new ValidationError("Missing user id");
      await assertNotPlatformOwner(ctx, input.userId);
      await apply(ctx, input.userId);
      await recordPlatformEvent(ctx.service, {
        eventCode,
        actorUserId: ctx.ownerUserId,
        details: { targetUserId: input.userId },
        severity,
      });
      return { userId: input.userId };
    },
  );
}

export const suspendUserAction = lifecycleAction(
  "platform.users.suspend",
  "user.suspended",
  async (ctx, userId) => {
    const { error } = await ctx.service.auth.admin.updateUserById(userId, { ban_duration: "876000h" });
    if (error) throw new ValidationError(error.message);
  },
  "warning",
);

export const activateUserAction = lifecycleAction(
  "platform.users.activate",
  "user.activated",
  async (ctx, userId) => {
    const { error } = await ctx.service.auth.admin.updateUserById(userId, { ban_duration: "none" });
    if (error) throw new ValidationError(error.message);
  },
);

export const deleteUserAction = lifecycleAction(
  "platform.users.delete",
  "user.deleted",
  async (ctx, userId) => {
    const { error } = await ctx.service.auth.admin.deleteUser(userId);
    if (error) throw new ValidationError(error.message);
  },
  "warning",
);

export const resetPasswordAction = createPlatformAction<{ email: string }, { email: string }>(
  { module: "platform.users.reset-password" },
  async (input, ctx) => {
    const email = input.email.trim().toLowerCase();
    if (!isValidEmail(email)) throw new ValidationError("Enter a valid email address");

    const { error } = await ctx.service.auth.resetPasswordForEmail(email, {
      redirectTo: `${resolveSiteOrigin()}/reset-password`,
    });
    if (error) throw new ValidationError(error.message);

    await recordPlatformEvent(ctx.service, {
      eventCode: "user.password.reset_sent",
      actorUserId: ctx.ownerUserId,
      details: { email },
    });

    return { email };
  },
);
