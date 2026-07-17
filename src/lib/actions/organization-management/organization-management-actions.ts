"use server";

import { createAuthenticatedAction } from "@/lib/actions/authenticated-action";
import { assertOrganizationManagementProfile } from "@/lib/organization-management/organization-management";
import { ValidationError } from "@/lib/errors";

export type OrganizationManagementActionInput = {
  organizationId: string;
  summary?: string;
};

export const upsertOrganizationManagementAction = createAuthenticatedAction<
  OrganizationManagementActionInput,
  { organizationId: string; capability: string }
>({ module: "saas.organization-management.upsert" }, async (input) => {
  if (!input.organizationId) throw new ValidationError("Organization is required");
  assertOrganizationManagementProfile(input);
  return { organizationId: input.organizationId, capability: "organization-management" };
});
