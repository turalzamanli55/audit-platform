"use server";

import { revalidatePath } from "next/cache";
import { createAuthenticatedAction } from "@/lib/actions/authenticated-action";
import { createServerClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { MembershipRepository } from "@/repositories/membership/membership-repository";
import { UserProvisioningRepository } from "@/repositories/user-provisioning/user-provisioning-repository";
import {
  assertUserProvisioningInvitation,
  createInvitationToken,
} from "@/lib/user-provisioning/user-provisioning";
import { getSeatUsage, syncSeatUsage } from "@/lib/platform-console/seats";
import { emitAuditEvent, AUDIT_ACTIONS } from "@/lib/audit";
import { ValidationError, NotFoundError, AuthorizationError } from "@/lib/errors";
import { isValidEmail, isValidPassword } from "@/utils/auth-validation";
import { PLATFORM_ROLE_SLUGS } from "@/types/auth";
import type { RepositoryContext } from "@/types/context";
import type { TenantType } from "@/constants/saas";
import {
  MEMBERSHIP_PERMISSIONS,
} from "@/constants/membership";
import {
  assertAssignableCompanyRole,
  assertNotSelf,
  requireCompanyAdministrator,
} from "@/lib/company-administration/guards";

const FORBIDDEN_TARGET_SLUGS = new Set<string>([
  PLATFORM_ROLE_SLUGS.PLATFORM_OWNER,
  PLATFORM_ROLE_SLUGS.ORGANIZATION_OWNER,
]);

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

function resolveSiteOrigin(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) return configured.replace(/\/$/, "");
  return "http://localhost:3000";
}

function revalidateCompanyAdministration(): void {
  revalidatePath("/[locale]/app/administration", "page");
  revalidatePath("/app/administration");
  revalidatePath("/[locale]/app/administration/users", "page");
}

async function resolveGlobalRoleId(
  service: ReturnType<typeof createServiceClient>,
  slug: string,
): Promise<string> {
  const role = await service
    .from("roles")
    .select("id, slug")
    .eq("slug", slug)
    .is("organization_id", null)
    .is("deleted_at", null)
    .maybeSingle();
  if (!role.data) throw new ValidationError(`Unknown role: ${slug}`);
  return role.data.id;
}

async function assertSeatForCompanyAdmin(
  service: ReturnType<typeof createServiceClient>,
  organizationId: string,
): Promise<void> {
  const usage = await getSeatUsage(service, organizationId);
  if (usage.subscriptionId && usage.seatsAvailable <= 0) {
    throw new ValidationError(
      `No seats available (${usage.seatsUsed} of ${usage.seatLimit} used). Free a seat before adding users, or contact the Platform Owner to increase the seat limit.`,
    );
  }
}

async function loadTargetMembershipInOrg(
  membershipRepo: MembershipRepository,
  membershipId: string,
  organizationId: string,
) {
  const membership = await membershipRepo.findById(membershipId);
  if (!membership || membership.organization_id !== organizationId) {
    throw new NotFoundError("User membership not found in your company");
  }
  return membership;
}

async function loadTargetRoleSlug(
  service: ReturnType<typeof createServiceClient>,
  roleId: string,
): Promise<string> {
  const role = await service
    .from("roles")
    .select("slug")
    .eq("id", roleId)
    .is("deleted_at", null)
    .maybeSingle();
  return role.data?.slug ?? "member";
}

function assertTargetRoleMutable(roleSlug: string): void {
  if (FORBIDDEN_TARGET_SLUGS.has(roleSlug)) {
    throw new AuthorizationError("This account cannot be modified by a Company Administrator");
  }
}

// ---------------------------------------------------------------------------
// Invite user
// ---------------------------------------------------------------------------

export type CompanyInviteUserInput = {
  email: string;
  roleSlug: string;
  workspaceId?: string | null;
  expiresInHours?: number;
};

export const companyInviteUserAction = createAuthenticatedAction<
  CompanyInviteUserInput,
  { invitationId: string; invitationToken: string; email: string }
>({ module: "company.administration.invite" }, async (input) => {
  const actor = await requireCompanyAdministrator();
  const organizationId = actor.organizationId;
  assertAssignableCompanyRole(input.roleSlug);

  const email = input.email.trim().toLowerCase();
  if (!isValidEmail(email)) throw new ValidationError("Enter a valid email address");

  const service = createServiceClient();
  await assertSeatForCompanyAdmin(service, organizationId);

  const org = await service
    .from("organizations")
    .select("id, tenant_type")
    .eq("id", organizationId)
    .is("deleted_at", null)
    .maybeSingle();
  if (!org.data) throw new NotFoundError("Company not found");

  if (input.workspaceId) {
    const workspace = await service
      .from("workspaces")
      .select("id")
      .eq("id", input.workspaceId)
      .eq("organization_id", organizationId)
      .is("deleted_at", null)
      .maybeSingle();
    if (!workspace.data) throw new ValidationError("Workspace not found in your company");
  }

  const seats = await getSeatUsage(service, organizationId);
  assertUserProvisioningInvitation({
    organizationId,
    email,
    roleSlug: input.roleSlug,
    tenantType: (org.data.tenant_type as TenantType) || "business",
    seatLimit: seats.seatLimit,
    seatsUsed: seats.seatsUsed,
  });

  const token = createInvitationToken();
  const expiresAt = new Date(
    Date.now() + (input.expiresInHours ?? 72) * 60 * 60 * 1000,
  ).toISOString();

  const supabase = await createServerClient();
  const inviteRepo = new UserProvisioningRepository(
    supabase,
    repoContext(actor.id, organizationId),
  );

  // Invitations are organization-scoped so seat accounting matches getSeatUsage.
  // Workspace membership is assigned after the user joins.
  const invitation = await inviteRepo.create({
    organization_id: organizationId,
    workspace_id: null,
    email,
    role_slug: input.roleSlug,
    invitation_token: token,
    invitation_status: "pending",
    invited_by: actor.id,
    expires_at: expiresAt,
  });

  await emitAuditEvent({
    action: AUDIT_ACTIONS.MEMBERSHIP_CREATED,
    resourceType: "user_provisioning_invitation",
    resourceId: invitation.id,
    organizationId,
    workspaceId: input.workspaceId ?? null,
    userId: actor.id,
    metadata: {
      email,
      roleSlug: input.roleSlug,
      via: "company_admin_invite",
      pendingWorkspaceId: input.workspaceId ?? null,
    },
  });

  revalidateCompanyAdministration();

  return {
    invitationId: invitation.id,
    invitationToken: invitation.invitation_token,
    email: invitation.email,
  };
});

// ---------------------------------------------------------------------------
// Create user
// ---------------------------------------------------------------------------

export type CompanyCreateUserInput = {
  email: string;
  password: string;
  fullName?: string;
  roleSlug: string;
  workspaceId?: string | null;
};

export const companyCreateUserAction = createAuthenticatedAction<
  CompanyCreateUserInput,
  { userId: string }
>({ module: "company.administration.create-user" }, async (input) => {
  const actor = await requireCompanyAdministrator();
  const organizationId = actor.organizationId;
  assertAssignableCompanyRole(input.roleSlug);

  const email = input.email.trim().toLowerCase();
  if (!isValidEmail(email)) throw new ValidationError("Enter a valid email address");
  if (!isValidPassword(input.password)) throw new ValidationError("Password does not meet policy");

  const service = createServiceClient();
  await assertSeatForCompanyAdmin(service, organizationId);

  if (input.workspaceId) {
    const workspace = await service
      .from("workspaces")
      .select("id")
      .eq("id", input.workspaceId)
      .eq("organization_id", organizationId)
      .is("deleted_at", null)
      .maybeSingle();
    if (!workspace.data) throw new ValidationError("Workspace not found in your company");
  }

  const roleId = await resolveGlobalRoleId(service, input.roleSlug);

  const { data, error } = await service.auth.admin.createUser({
    email,
    password: input.password,
    email_confirm: true,
    user_metadata: input.fullName ? { full_name: input.fullName.trim() } : {},
  });
  if (error || !data.user) throw new ValidationError(error?.message ?? "Failed to create user");

  const userId = data.user.id;

  // Organization membership always consumes the licensed seat.
  const membership = await service.from("memberships").insert({
    user_id: userId,
    organization_id: organizationId,
    workspace_id: null,
    role_id: roleId,
    membership_scope: "organization",
    created_by: actor.id,
    updated_by: actor.id,
  });

  if (membership.error) {
    await service.auth.admin.deleteUser(userId);
    throw new ValidationError(`User created, but membership failed: ${membership.error.message}`);
  }

  if (input.workspaceId) {
    const workspaceMembership = await service.from("memberships").insert({
      user_id: userId,
      organization_id: organizationId,
      workspace_id: input.workspaceId,
      role_id: roleId,
      membership_scope: "workspace",
      created_by: actor.id,
      updated_by: actor.id,
    });
    if (workspaceMembership.error) {
      throw new ValidationError(
        `User created, but workspace assignment failed: ${workspaceMembership.error.message}`,
      );
    }
  }

  await syncSeatUsage(service, organizationId);

  await emitAuditEvent({
    action: AUDIT_ACTIONS.MEMBERSHIP_CREATED,
    resourceType: "membership",
    resourceId: userId,
    organizationId,
    workspaceId: input.workspaceId ?? null,
    userId: actor.id,
    metadata: { email, roleSlug: input.roleSlug, via: "company_admin_create" },
  });

  revalidateCompanyAdministration();
  return { userId };
});

// ---------------------------------------------------------------------------
// Disable / reactivate
// ---------------------------------------------------------------------------

export type CompanyUserLifecycleInput = {
  membershipId: string;
  userId: string;
};

export const companyDisableUserAction = createAuthenticatedAction<
  CompanyUserLifecycleInput,
  { userId: string }
>({ module: "company.administration.disable-user" }, async (input) => {
  const actor = await requireCompanyAdministrator();
  assertNotSelf(actor.id, input.userId);

  const supabase = await createServerClient();
  const service = createServiceClient();
  const membershipRepo = new MembershipRepository(
    supabase,
    repoContext(actor.id, actor.organizationId),
  );
  const membership = await loadTargetMembershipInOrg(
    membershipRepo,
    input.membershipId,
    actor.organizationId,
  );
  if (membership.user_id !== input.userId) {
    throw new ValidationError("Membership does not match the selected user");
  }

  const roleSlug = await loadTargetRoleSlug(service, membership.role_id);
  assertTargetRoleMutable(roleSlug);

  const { error } = await service.auth.admin.updateUserById(input.userId, {
    ban_duration: "876000h",
  });
  if (error) throw new ValidationError(error.message);

  await membershipRepo.update(membership.id, membership.version, { status: "inactive" });

  await emitAuditEvent({
    action: "membership.disabled",
    resourceType: "membership",
    resourceId: membership.id,
    organizationId: actor.organizationId,
    userId: actor.id,
    metadata: { targetUserId: input.userId },
  });

  revalidateCompanyAdministration();
  return { userId: input.userId };
});

export const companyReactivateUserAction = createAuthenticatedAction<
  CompanyUserLifecycleInput,
  { userId: string }
>({ module: "company.administration.reactivate-user" }, async (input) => {
  const actor = await requireCompanyAdministrator();
  assertNotSelf(actor.id, input.userId);

  const supabase = await createServerClient();
  const service = createServiceClient();
  const membershipRepo = new MembershipRepository(
    supabase,
    repoContext(actor.id, actor.organizationId),
  );
  const membership = await loadTargetMembershipInOrg(
    membershipRepo,
    input.membershipId,
    actor.organizationId,
  );
  if (membership.user_id !== input.userId) {
    throw new ValidationError("Membership does not match the selected user");
  }

  const roleSlug = await loadTargetRoleSlug(service, membership.role_id);
  assertTargetRoleMutable(roleSlug);

  const { error } = await service.auth.admin.updateUserById(input.userId, {
    ban_duration: "none",
  });
  if (error) throw new ValidationError(error.message);

  await membershipRepo.update(membership.id, membership.version, { status: "active" });

  await emitAuditEvent({
    action: "membership.reactivated",
    resourceType: "membership",
    resourceId: membership.id,
    organizationId: actor.organizationId,
    userId: actor.id,
    metadata: { targetUserId: input.userId },
  });

  revalidateCompanyAdministration();
  return { userId: input.userId };
});

// ---------------------------------------------------------------------------
// Delete user (remove from company)
// ---------------------------------------------------------------------------

export const companyDeleteUserAction = createAuthenticatedAction<
  CompanyUserLifecycleInput,
  { userId: string }
>({ module: "company.administration.delete-user" }, async (input) => {
  const actor = await requireCompanyAdministrator();
  assertNotSelf(actor.id, input.userId);

  const supabase = await createServerClient();
  const service = createServiceClient();
  const membershipRepo = new MembershipRepository(
    supabase,
    repoContext(actor.id, actor.organizationId),
  );
  const membership = await loadTargetMembershipInOrg(
    membershipRepo,
    input.membershipId,
    actor.organizationId,
  );
  if (membership.user_id !== input.userId) {
    throw new ValidationError("Membership does not match the selected user");
  }

  const roleSlug = await loadTargetRoleSlug(service, membership.role_id);
  assertTargetRoleMutable(roleSlug);

  // Soft-delete every membership for this user inside the company (org + workspace).
  const allInOrg = await membershipRepo.listByOrganization(actor.organizationId);
  const targets = allInOrg.filter((row) => row.user_id === input.userId);
  if (!targets.some((row) => row.id === membership.id)) {
    throw new NotFoundError("User membership not found in your company");
  }
  for (const row of targets) {
    await membershipRepo.softDelete(row.id, row.version);
  }

  await syncSeatUsage(service, actor.organizationId);

  await emitAuditEvent({
    action: "membership.deleted",
    resourceType: "membership",
    resourceId: membership.id,
    organizationId: actor.organizationId,
    userId: actor.id,
    metadata: { targetUserId: input.userId },
  });

  revalidateCompanyAdministration();
  return { userId: input.userId };
});

// ---------------------------------------------------------------------------
// Reset password
// ---------------------------------------------------------------------------

export type CompanyResetPasswordInput = {
  email: string;
  userId: string;
};

export const companyResetPasswordAction = createAuthenticatedAction<
  CompanyResetPasswordInput,
  { email: string }
>({ module: "company.administration.reset-password" }, async (input) => {
  const actor = await requireCompanyAdministrator();
  const email = input.email.trim().toLowerCase();
  if (!isValidEmail(email)) throw new ValidationError("Enter a valid email address");

  const supabase = await createServerClient();
  const membershipRepo = new MembershipRepository(
    supabase,
    repoContext(actor.id, actor.organizationId),
  );
  const memberships = await membershipRepo.listByOrganization(actor.organizationId);
  const inOrg = memberships.some((m) => m.user_id === input.userId);
  if (!inOrg) throw new NotFoundError("User not found in your company");

  const service = createServiceClient();
  const { error } = await service.auth.resetPasswordForEmail(email, {
    redirectTo: `${resolveSiteOrigin()}/reset-password`,
  });
  if (error) throw new ValidationError(error.message);

  await emitAuditEvent({
    action: "membership.password_reset_sent",
    resourceType: "user",
    resourceId: input.userId,
    organizationId: actor.organizationId,
    userId: actor.id,
    metadata: { email },
  });

  revalidateCompanyAdministration();
  return { email };
});

// ---------------------------------------------------------------------------
// Change role
// ---------------------------------------------------------------------------

export type CompanyChangeRoleInput = {
  membershipId: string;
  userId: string;
  roleSlug: string;
};

export const companyChangeRoleAction = createAuthenticatedAction<
  CompanyChangeRoleInput,
  { membershipId: string }
>({ module: "company.administration.change-role" }, async (input) => {
  const actor = await requireCompanyAdministrator();
  assertNotSelf(actor.id, input.userId);
  assertAssignableCompanyRole(input.roleSlug);

  const supabase = await createServerClient();
  const service = createServiceClient();
  const membershipRepo = new MembershipRepository(
    supabase,
    repoContext(actor.id, actor.organizationId),
  );
  const membership = await loadTargetMembershipInOrg(
    membershipRepo,
    input.membershipId,
    actor.organizationId,
  );
  if (membership.user_id !== input.userId) {
    throw new ValidationError("Membership does not match the selected user");
  }

  const currentSlug = await loadTargetRoleSlug(service, membership.role_id);
  assertTargetRoleMutable(currentSlug);

  const roleId = await resolveGlobalRoleId(service, input.roleSlug);
  await membershipRepo.update(membership.id, membership.version, { role_id: roleId });

  await emitAuditEvent({
    action: "membership.role_changed",
    resourceType: "membership",
    resourceId: membership.id,
    organizationId: actor.organizationId,
    userId: actor.id,
    metadata: {
      targetUserId: input.userId,
      fromRole: currentSlug,
      toRole: input.roleSlug,
    },
  });

  revalidateCompanyAdministration();
  return { membershipId: membership.id };
});

// ---------------------------------------------------------------------------
// Assign workspace membership
// ---------------------------------------------------------------------------

export type CompanyAssignWorkspaceInput = {
  userId: string;
  workspaceId: string;
  roleSlug: string;
};

export const companyAssignWorkspaceMembershipAction = createAuthenticatedAction<
  CompanyAssignWorkspaceInput,
  { membershipId: string }
>({ module: "company.administration.assign-workspace" }, async (input) => {
  const actor = await requireCompanyAdministrator();
  assertAssignableCompanyRole(input.roleSlug);

  const supabase = await createServerClient();
  const service = createServiceClient();
  const membershipRepo = new MembershipRepository(
    supabase,
    repoContext(actor.id, actor.organizationId),
  );

  const orgMemberships = await membershipRepo.listByOrganization(actor.organizationId);
  const orgMember = orgMemberships.find(
    (m) => m.user_id === input.userId && m.membership_scope === "organization",
  );
  if (!orgMember) {
    throw new ValidationError("User must belong to your company before workspace assignment");
  }

  const currentSlug = await loadTargetRoleSlug(service, orgMember.role_id);
  assertTargetRoleMutable(currentSlug);

  const workspace = await service
    .from("workspaces")
    .select("id")
    .eq("id", input.workspaceId)
    .eq("organization_id", actor.organizationId)
    .is("deleted_at", null)
    .maybeSingle();
  if (!workspace.data) throw new ValidationError("Workspace not found in your company");

  const existingWorkspace = orgMemberships.find(
    (m) =>
      m.user_id === input.userId &&
      m.membership_scope === "workspace" &&
      m.workspace_id === input.workspaceId,
  );
  if (existingWorkspace) {
    const roleId = await resolveGlobalRoleId(service, input.roleSlug);
    await membershipRepo.update(existingWorkspace.id, existingWorkspace.version, {
      role_id: roleId,
    });
    await emitAuditEvent({
      action: "membership.workspace_updated",
      resourceType: "membership",
      resourceId: existingWorkspace.id,
      organizationId: actor.organizationId,
      workspaceId: input.workspaceId,
      userId: actor.id,
      metadata: { targetUserId: input.userId, roleSlug: input.roleSlug },
    });
    revalidateCompanyAdministration();
    return { membershipId: existingWorkspace.id };
  }

  const roleId = await resolveGlobalRoleId(service, input.roleSlug);
  const created = await membershipRepo.create({
    user_id: input.userId,
    organization_id: actor.organizationId,
    workspace_id: input.workspaceId,
    company_id: null,
    role_id: roleId,
    membership_scope: "workspace",
  });

  await emitAuditEvent({
    action: AUDIT_ACTIONS.MEMBERSHIP_CREATED,
    resourceType: "membership",
    resourceId: created.id,
    organizationId: actor.organizationId,
    workspaceId: input.workspaceId,
    userId: actor.id,
    metadata: {
      targetUserId: input.userId,
      roleSlug: input.roleSlug,
      via: "company_admin_workspace",
    },
  });

  revalidateCompanyAdministration();
  return { membershipId: created.id };
});

// ---------------------------------------------------------------------------
// Remove workspace membership
// ---------------------------------------------------------------------------

export type CompanyRemoveWorkspaceInput = {
  membershipId: string;
  userId: string;
};

export const companyRemoveWorkspaceMembershipAction = createAuthenticatedAction<
  CompanyRemoveWorkspaceInput,
  { membershipId: string }
>({ module: "company.administration.remove-workspace" }, async (input) => {
  const actor = await requireCompanyAdministrator();
  const supabase = await createServerClient();
  const service = createServiceClient();
  const membershipRepo = new MembershipRepository(
    supabase,
    repoContext(actor.id, actor.organizationId),
  );

  const membership = await loadTargetMembershipInOrg(
    membershipRepo,
    input.membershipId,
    actor.organizationId,
  );
  if (membership.user_id !== input.userId) {
    throw new ValidationError("Membership does not match the selected user");
  }
  if (membership.membership_scope !== "workspace") {
    throw new ValidationError("Only workspace memberships can be removed here");
  }

  const roleSlug = await loadTargetRoleSlug(service, membership.role_id);
  assertTargetRoleMutable(roleSlug);

  await membershipRepo.softDelete(membership.id, membership.version);

  await emitAuditEvent({
    action: "membership.workspace_removed",
    resourceType: "membership",
    resourceId: membership.id,
    organizationId: actor.organizationId,
    workspaceId: membership.workspace_id,
    userId: actor.id,
    metadata: { targetUserId: input.userId },
  });

  revalidateCompanyAdministration();
  return { membershipId: membership.id };
});

// ---------------------------------------------------------------------------
// Transfer workspace membership (move user from one workspace to another)
// ---------------------------------------------------------------------------

export type CompanyTransferWorkspaceInput = {
  membershipId: string;
  userId: string;
  toWorkspaceId: string;
  roleSlug: string;
};

export const companyTransferWorkspaceMembershipAction = createAuthenticatedAction<
  CompanyTransferWorkspaceInput,
  { membershipId: string }
>({ module: "company.administration.transfer-workspace" }, async (input) => {
  const actor = await requireCompanyAdministrator();
  assertAssignableCompanyRole(input.roleSlug);

  const supabase = await createServerClient();
  const service = createServiceClient();
  const membershipRepo = new MembershipRepository(
    supabase,
    repoContext(actor.id, actor.organizationId),
  );

  const membership = await loadTargetMembershipInOrg(
    membershipRepo,
    input.membershipId,
    actor.organizationId,
  );
  if (membership.user_id !== input.userId) {
    throw new ValidationError("Membership does not match the selected user");
  }
  if (membership.membership_scope !== "workspace") {
    throw new ValidationError("Only workspace memberships can be transferred");
  }

  const roleSlug = await loadTargetRoleSlug(service, membership.role_id);
  assertTargetRoleMutable(roleSlug);

  const workspace = await service
    .from("workspaces")
    .select("id")
    .eq("id", input.toWorkspaceId)
    .eq("organization_id", actor.organizationId)
    .is("deleted_at", null)
    .maybeSingle();
  if (!workspace.data) throw new ValidationError("Target workspace not found in your company");

  await membershipRepo.softDelete(membership.id, membership.version);

  const roleId = await resolveGlobalRoleId(service, input.roleSlug);
  const created = await membershipRepo.create({
    user_id: input.userId,
    organization_id: actor.organizationId,
    workspace_id: input.toWorkspaceId,
    company_id: null,
    role_id: roleId,
    membership_scope: "workspace",
  });

  await emitAuditEvent({
    action: "membership.workspace_transferred",
    resourceType: "membership",
    resourceId: created.id,
    organizationId: actor.organizationId,
    workspaceId: input.toWorkspaceId,
    userId: actor.id,
    metadata: {
      targetUserId: input.userId,
      fromWorkspaceId: membership.workspace_id,
      toWorkspaceId: input.toWorkspaceId,
      roleSlug: input.roleSlug,
    },
  });

  revalidateCompanyAdministration();
  return { membershipId: created.id };
});

// ---------------------------------------------------------------------------
// Revoke invitation
// ---------------------------------------------------------------------------

export type CompanyRevokeInvitationInput = {
  invitationId: string;
};

export const companyRevokeInvitationAction = createAuthenticatedAction<
  CompanyRevokeInvitationInput,
  { invitationId: string }
>({ module: "company.administration.revoke-invitation" }, async (input) => {
  const actor = await requireCompanyAdministrator();
  const service = createServiceClient();

  const { data, error } = await service
    .from("user_provisioning_invitations")
    .update({ invitation_status: "revoked", updated_by: actor.id })
    .eq("id", input.invitationId)
    .eq("organization_id", actor.organizationId)
    .is("deleted_at", null)
    .select("id")
    .maybeSingle();

  if (error) throw new ValidationError(error.message);
  if (!data) throw new NotFoundError("Invitation not found in your company");

  await emitAuditEvent({
    action: "membership.invitation_revoked",
    resourceType: "user_provisioning_invitation",
    resourceId: input.invitationId,
    organizationId: actor.organizationId,
    userId: actor.id,
  });

  revalidateCompanyAdministration();
  return { invitationId: input.invitationId };
});

/** Permission code used by company administration write paths. */
export const COMPANY_ADMIN_REQUIRED_PERMISSION = MEMBERSHIP_PERMISSIONS.ADMINISTER;
