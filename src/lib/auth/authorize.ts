import "server-only";

import type { SessionUser } from "@/types/auth";
import { AuthorizationError } from "@/lib/errors";
import { authorizePermissionCodes, hasRoleSlug } from "./permissions";

export function requireAuthenticatedUser(user: SessionUser | null): asserts user is SessionUser {
  if (!user) {
    throw new AuthorizationError("Authentication required");
  }
}

export function requirePermissionCodes(
  user: SessionUser,
  permissionCodes: string | string[],
  message = "Permission denied",
): void {
  if (!authorizePermissionCodes(user.permissionCodes, permissionCodes)) {
    throw new AuthorizationError(message, { permissionCodes });
  }
}

export function requireRoleSlugs(
  user: SessionUser,
  roleSlugs: string | string[],
  message = "Role required",
): void {
  if (!hasRoleSlug(user.roleSlugs, roleSlugs)) {
    throw new AuthorizationError(message, { roleSlugs });
  }
}

export function requireOrganization(user: SessionUser): string {
  if (!user.hasOrganization || !user.organizationId) {
    throw new AuthorizationError("Organization context is required");
  }
  return user.organizationId;
}

export function requireWorkspace(user: SessionUser): string {
  if (!user.workspaceId) {
    throw new AuthorizationError("Workspace context is required");
  }
  return user.workspaceId;
}
