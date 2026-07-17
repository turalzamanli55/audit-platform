"use server";

import { createAuthenticatedAction } from "@/lib/actions/authenticated-action";
import { assertRoleAndPermissionBundle } from "@/lib/role-and-permission-management/role-and-permission-management";
import { ValidationError } from "@/lib/errors";

export type RoleAndPermissionManagementActionInput = {
  organizationId: string;
  summary?: string;
};

export const manageRoleAndPermissionAction = createAuthenticatedAction<
  RoleAndPermissionManagementActionInput,
  { organizationId: string; capability: string }
>({ module: "saas.role-and-permission-management.manage" }, async (input) => {
  if (!input.organizationId) throw new ValidationError("Organization is required");
  assertRoleAndPermissionBundle(input);
  return { organizationId: input.organizationId, capability: "role-and-permission-management" };
});
