import { ValidationError } from "@/lib/errors";

export type RoleBasedAccessControlInput = {
  organizationId: string;
  summary?: string;
};

export function assertRoleBasedAccessAssignment(input: RoleBasedAccessControlInput): void {
  if (!input.organizationId?.trim()) {
    throw new ValidationError("Organization is required for role-based-access-control");
  }
}

export class RoleBasedAccessControlEngine {
  assert(input: RoleBasedAccessControlInput): void {
    assertRoleBasedAccessAssignment(input);
  }
}
