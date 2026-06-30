"use server";

import { createAuthenticatedAction } from "@/lib/actions/authenticated-action";
import { setOrganizationCookie, setWorkspaceCookie } from "@/lib/auth/tenant-cookies";
import { ValidationError } from "@/lib/errors";

export type SwitchOrganizationInput = {
  organizationId: string;
};

export const switchOrganizationAction = createAuthenticatedAction<
  SwitchOrganizationInput,
  { organizationId: string }
>({ module: "tenant.switch-organization" }, async (input) => {
  if (!input.organizationId) {
    throw new ValidationError("Organization is required");
  }

  await setOrganizationCookie(input.organizationId);
  return { organizationId: input.organizationId };
});

export type SwitchWorkspaceInput = {
  workspaceId: string;
};

export const switchWorkspaceAction = createAuthenticatedAction<
  SwitchWorkspaceInput,
  { workspaceId: string }
>({ module: "tenant.switch-workspace" }, async (input) => {
  if (!input.workspaceId) {
    throw new ValidationError("Workspace is required");
  }

  await setWorkspaceCookie(input.workspaceId);
  return { workspaceId: input.workspaceId };
});
