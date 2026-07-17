"use server";

import { createAuthenticatedAction } from "@/lib/actions/authenticated-action";
import { assertWorkspaceManagementSettings } from "@/lib/workspace-management/workspace-management";
import { ValidationError } from "@/lib/errors";

export type WorkspaceManagementActionInput = {
  organizationId: string;
  summary?: string;
};

export const upsertWorkspaceManagementAction = createAuthenticatedAction<
  WorkspaceManagementActionInput,
  { organizationId: string; capability: string }
>({ module: "saas.workspace-management.upsert" }, async (input) => {
  if (!input.organizationId) throw new ValidationError("Organization is required");
  assertWorkspaceManagementSettings(input);
  return { organizationId: input.organizationId, capability: "workspace-management" };
});
