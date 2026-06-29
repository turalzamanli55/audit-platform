import type { Role, Permission, Capability, Scope } from "@/types/auth";

/**
 * Permission resolution helpers — deny by default.
 * Aligns with SYSTEM_ARCHITECTURE §10.3.
 */

export function hasRole(userRoles: Role[], required: Role | Role[]): boolean {
  const requiredRoles = Array.isArray(required) ? required : [required];
  return requiredRoles.some((role) => userRoles.includes(role));
}

export function hasAllRoles(userRoles: Role[], required: Role[]): boolean {
  return required.every((role) => userRoles.includes(role));
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
