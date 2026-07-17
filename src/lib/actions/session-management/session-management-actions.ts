"use server";

import { createAuthenticatedAction } from "@/lib/actions/authenticated-action";
import { assertSessionManagementPolicy } from "@/lib/session-management/session-management";
import { ValidationError } from "@/lib/errors";

export type SessionManagementActionInput = {
  organizationId: string;
  summary?: string;
};

export const upsertSessionManagementPolicyAction = createAuthenticatedAction<
  SessionManagementActionInput,
  { organizationId: string; capability: string }
>({ module: "saas.session-management.upsert" }, async (input) => {
  if (!input.organizationId) throw new ValidationError("Organization is required");
  assertSessionManagementPolicy(input);
  return { organizationId: input.organizationId, capability: "session-management" };
});
