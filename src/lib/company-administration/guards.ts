import "server-only";

import { getCurrentUser } from "@/lib/auth/server";
import {
  requireOrganization,
  requirePermissionCodes,
  requireAuthenticatedUser,
} from "@/lib/auth/authorize";
import { AuthorizationError, ValidationError } from "@/lib/errors";
import { PLATFORM_ROLE_SLUGS, type SessionUser } from "@/types/auth";
import {
  COMPANY_ADMIN_ASSIGNABLE_ROLES,
  MEMBERSHIP_PERMISSIONS,
  type CompanyAdminAssignableRole,
} from "@/constants/membership";
import { hasRoleSlug } from "@/lib/auth/permissions";

const FORBIDDEN_TARGET_ROLES = new Set<string>([
  PLATFORM_ROLE_SLUGS.PLATFORM_OWNER,
  PLATFORM_ROLE_SLUGS.ORGANIZATION_OWNER,
]);

const ASSIGNABLE = new Set<string>(COMPANY_ADMIN_ASSIGNABLE_ROLES.map((r) => r.value));

/** Ensures the actor is an authenticated company admin with membership.administer. */
export async function requireCompanyAdministrator(): Promise<SessionUser> {
  const user = await getCurrentUser();
  requireAuthenticatedUser(user);
  requireOrganization(user);
  requirePermissionCodes(user, MEMBERSHIP_PERMISSIONS.ADMINISTER);

  // Platform owners administer tenants from the Platform Console, not here.
  if (hasRoleSlug(user.roleSlugs, PLATFORM_ROLE_SLUGS.PLATFORM_OWNER)) {
    throw new AuthorizationError("Platform owners manage users from the Platform Console");
  }

  return user;
}

/** Read access for company user directory / seats / activity. */
export async function requireCompanyAdministrationReader(): Promise<SessionUser> {
  const user = await getCurrentUser();
  requireAuthenticatedUser(user);
  requireOrganization(user);
  requirePermissionCodes(user, [MEMBERSHIP_PERMISSIONS.READ, MEMBERSHIP_PERMISSIONS.ADMINISTER]);
  return user;
}

export function assertAssignableCompanyRole(roleSlug: string): asserts roleSlug is CompanyAdminAssignableRole {
  if (!ASSIGNABLE.has(roleSlug)) {
    throw new ValidationError("That role cannot be assigned by a Company Administrator");
  }
  if (FORBIDDEN_TARGET_ROLES.has(roleSlug)) {
    throw new ValidationError("Privilege escalation is not allowed");
  }
}

export function assertNotSelf(actorUserId: string, targetUserId: string): void {
  if (actorUserId === targetUserId) {
    throw new ValidationError("You cannot perform this action on your own account");
  }
}
