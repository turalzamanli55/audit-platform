"use server";

import { createAuthenticatedAction } from "@/lib/actions/authenticated-action";
import { assertEntityManagementUnit } from "@/lib/entity-management/entity-management";
import { ValidationError } from "@/lib/errors";

export type EntityManagementActionInput = {
  organizationId: string;
  summary?: string;
};

export const upsertEntityManagementAction = createAuthenticatedAction<
  EntityManagementActionInput,
  { organizationId: string; capability: string }
>({ module: "saas.entity-management.upsert" }, async (input) => {
  if (!input.organizationId) throw new ValidationError("Organization is required");
  assertEntityManagementUnit(input);
  return { organizationId: input.organizationId, capability: "entity-management" };
});
