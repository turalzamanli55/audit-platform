"use server";

import { createAuthenticatedAction } from "@/lib/actions/authenticated-action";
import { createPublicAction } from "@/lib/actions/public-action";
import {
  assertUserProvisioningInvitation,
  createInvitationToken,
} from "@/lib/user-provisioning/user-provisioning";
import { acceptUserProvisioningInvitation } from "@/lib/user-provisioning/accept-invitation";
import { createServerClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { UserProvisioningRepository } from "@/repositories/user-provisioning/user-provisioning-repository";
import type { TenantType } from "@/constants/saas";
import type { RepositoryContext } from "@/types/context";

export type InviteUserProvisioningInput = {
  organizationId: string;
  workspaceId?: string | null;
  email: string;
  roleSlug: string;
  tenantType: TenantType;
  seatLimit: number;
  seatsUsed: number;
  expiresInHours?: number;
};

export type InviteUserProvisioningResult = {
  invitationId: string;
  invitationToken: string;
  email: string;
};

function repoContext(userId: string, organizationId: string): RepositoryContext {
  return {
    userId,
    tenant: {
      organization: { organizationId, isResolved: true },
      workspace: { workspaceId: null, isResolved: false },
      company: { companyId: null, isResolved: false },
      permissions: { permissions: [], isResolved: false },
      roles: { roles: [], isResolved: false },
    },
  };
}

export const inviteUserProvisioningAction = createAuthenticatedAction<
  InviteUserProvisioningInput,
  InviteUserProvisioningResult
>({ module: "saas.user-provisioning.invite" }, async (input, context) => {
  assertUserProvisioningInvitation(input);

  const token = createInvitationToken();
  const expiresAt = new Date(
    Date.now() + (input.expiresInHours ?? 72) * 60 * 60 * 1000,
  ).toISOString();

  const supabase = await createServerClient();
  const repository = new UserProvisioningRepository(
    supabase,
    repoContext(context.userId, input.organizationId),
  );

  const invitation = await repository.create({
    organization_id: input.organizationId,
    workspace_id: input.workspaceId ?? null,
    email: input.email.trim().toLowerCase(),
    role_slug: input.roleSlug.trim(),
    invitation_token: token,
    invitation_status: "pending",
    invited_by: context.userId,
    expires_at: expiresAt,
  });

  return {
    invitationId: invitation.id,
    invitationToken: invitation.invitation_token,
    email: invitation.email,
  };
});

export type AcceptUserProvisioningInput = {
  invitationToken: string;
  password: string;
};

export const acceptUserProvisioningInvitationAction = createPublicAction<
  AcceptUserProvisioningInput,
  { invitationToken: string; accepted: true; userId: string; organizationId: string }
>({ module: "saas.user-provisioning.accept" }, async (input) => {
  const service = createServiceClient();
  const result = await acceptUserProvisioningInvitation(service, {
    invitationToken: input.invitationToken,
    password: input.password,
  });
  return {
    invitationToken: input.invitationToken,
    accepted: true as const,
    userId: result.userId,
    organizationId: result.organizationId,
  };
});
