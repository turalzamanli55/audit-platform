import { ValidationError } from "@/lib/errors";

export type RoleAndPermissionManagementInput = {
  organizationId: string;
  summary?: string;
};

export function assertRoleAndPermissionBundle(input: RoleAndPermissionManagementInput): void {
  if (!input.organizationId?.trim()) {
    throw new ValidationError("Organization is required for role-and-permission-management");
  }
}

export class RoleAndPermissionManagementEngine {
  assert(input: RoleAndPermissionManagementInput): void {
    assertRoleAndPermissionBundle(input);
  }
}
