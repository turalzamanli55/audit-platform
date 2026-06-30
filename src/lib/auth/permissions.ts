import type { Role, Permission, Capability, Scope } from "@/types/auth";

/**
 * Permission resolution helpers — deny by default.
 * Sprint 2C: database permission codes are authoritative.
 */

export function hasRole(userRoles: Role[] | string[], required: Role | Role[] | string | string[]): boolean {
  const requiredRoles = Array.isArray(required) ? required : [required];
  return requiredRoles.some((role) => userRoles.includes(role as Role));
}

export function hasRoleSlug(roleSlugs: string[], required: string | string[]): boolean {
  const requiredSlugs = Array.isArray(required) ? required : [required];
  return requiredSlugs.some((slug) => roleSlugs.includes(slug));
}

export function hasAllRoles(userRoles: Role[], required: Role[]): boolean {
  return required.every((role) => userRoles.includes(role));
}

export function hasPermissionCode(permissionCodes: string[], required: string | string[]): boolean {
  const requiredCodes = Array.isArray(required) ? required : [required];
  return requiredCodes.some((code) => permissionCodes.includes(code));
}

export function hasAllPermissionCodes(permissionCodes: string[], required: string[]): boolean {
  return required.every((code) => permissionCodes.includes(code));
}

export function hasPermission(
  permissions: Permission[],
  capability: Capability,
  scope: Scope,
  resourceId?: string,
): boolean {
  return permissions.some((p) => {
    if (p.capability !== capability || p.scope !== scope) return false;
    if (resourceId && p.resourceId && p.resourceId !== resourceId) return false;
    return true;
  });
}

export function hasAnyPermission(
  permissions: Permission[],
  checks: Array<{ capability: Capability; scope: Scope; resourceId?: string }>,
): boolean {
  return checks.some((check) =>
    hasPermission(permissions, check.capability, check.scope, check.resourceId),
  );
}

export function canAccessOrganization(
  permissions: Permission[],
  organizationId: string,
): boolean {
  return permissions.some(
    (p) => p.scope === "organization" && (!p.resourceId || p.resourceId === organizationId),
  );
}

export function authorizePermissionCodes(
  permissionCodes: string[],
  required: string | string[],
): boolean {
  return hasPermissionCode(permissionCodes, required);
}
