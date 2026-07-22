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
import { getSeatUsage } from "@/lib/platform-console/seats";
import { getCurrentUser } from "@/lib/auth/server";
import { requireOrganization, requirePermissionCodes } from "@/lib/auth/authorize";
import { AuthorizationError, ValidationError } from "@/lib/errors";
import { MEMBERSHIP_PERMISSIONS } from "@/constants/membership";
import { assertAssignableCompanyRole } from "@/lib/company-administration/guards";
import type { TenantType } from "@/constants/saas";
import type { RepositoryContext } from "@/types/context";

export type InviteUserProvisioningInput = {
  organizationId: string;
  workspaceId?: string | null;
  email: string;
  roleSlug: string;
  tenantType: TenantType;
  /** @deprecated Ignored — seats are loaded server-side. */
  seatLimit?: number;
  /** @deprecated Ignored — seats are loaded server-side. */
  seatsUsed?: number;
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

/**
 * Tenant-scoped invitation. Organization is always bound to the actor's
 * current company. Seat counts are loaded server-side — client-supplied
 * seatLimit/seatsUsed are ignored.
 */
export const inviteUserProvisioningAction = createAuthenticatedAction<
  InviteUserProvisioningInput,
  InviteUserProvisioningResult
>({ module: "saas.user-provisioning.invite" }, async (input, context) => {
  const user = await getCurrentUser();
  if (!user) throw new AuthorizationError("Authentication required");
  requirePermissionCodes(user, MEMBERSHIP_PERMISSIONS.ADMINISTER);
  const organizationId = requireOrganization(user);

  if (input.organizationId && input.organizationId !== organizationId) {
    throw new AuthorizationError("You can only invite users to your own company");
  }

  assertAssignableCompanyRole(input.roleSlug);

  const service = createServiceClient();
  const seats = await getSeatUsage(service, organizationId);

  const org = await service
    .from("organizations")
    .select("id, tenant_type")
    .eq("id", organizationId)
    .is("deleted_at", null)
    .maybeSingle();
  if (!org.data) throw new ValidationError("Company not found");

  const tenantType = (org.data.tenant_type as TenantType) || "business";

  assertUserProvisioningInvitation({
    organizationId,
    email: input.email,
    roleSlug: input.roleSlug,
    tenantType,
    seatLimit: seats.seatLimit,
    seatsUsed: seats.seatsUsed,
  });

  if (input.workspaceId) {
    const workspace = await service
      .from("workspaces")
      .select("id")
      .eq("id", input.workspaceId)
      .eq("organization_id", organizationId)
      .is("deleted_at", null)
      .maybeSingle();
    if (!workspace.data) {
      throw new ValidationError("Workspace not found in your company");
    }
  }

  const token = createInvitationToken();
  const expiresAt = new Date(
    Date.now() + (input.expiresInHours ?? 72) * 60 * 60 * 1000,
  ).toISOString();

  const supabase = await createServerClient();
  const repository = new UserProvisioningRepository(
    supabase,
    repoContext(context.userId, organizationId),
  );

  const invitation = await repository.create({
    organization_id: organizationId,
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
