/** Permission definitions for role-and-permission-management. */
export const ROLE_AND_PERMISSION_MANAGEMENT_PERMISSION_CODES = [
  "saas.role.manage",
  "saas.role.read",
  "saas.permission.assign",
] as const;

export function authorizeRoleAndPermissionManagement(
  permissionCodes: string[],
  required: string = "saas.role.manage",
): boolean {
  return permissionCodes.includes(required);
}
