"use server";

import { createAuthenticatedAction } from "@/lib/actions/authenticated-action";
import { assertRoleBasedAccessAssignment } from "@/lib/role-based-access-control/role-based-access-control";
import { ValidationError } from "@/lib/errors";

export type RoleBasedAccessControlActionInput = {
  organizationId: string;
  summary?: string;
};

export const assignRoleBasedAccessControlAction = createAuthenticatedAction<
  RoleBasedAccessControlActionInput,
  { organizationId: string; capability: string }
>({ module: "saas.role-based-access-control.assign" }, async (input) => {
  if (!input.organizationId) throw new ValidationError("Organization is required");
  assertRoleBasedAccessAssignment(input);
  return { organizationId: input.organizationId, capability: "role-based-access-control" };
});
