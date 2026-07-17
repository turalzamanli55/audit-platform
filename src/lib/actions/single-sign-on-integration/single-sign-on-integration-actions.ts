"use server";

import { createAuthenticatedAction } from "@/lib/actions/authenticated-action";
import { assertSingleSignOnProvider } from "@/lib/single-sign-on-integration/single-sign-on-integration";
import { ValidationError } from "@/lib/errors";

export type SingleSignOnIntegrationActionInput = {
  organizationId: string;
  summary?: string;
};

export const configureSingleSignOnIntegrationAction = createAuthenticatedAction<
  SingleSignOnIntegrationActionInput,
  { organizationId: string; capability: string }
>({ module: "saas.single-sign-on-integration.configure" }, async (input) => {
  if (!input.organizationId) throw new ValidationError("Organization is required");
  assertSingleSignOnProvider(input);
  return { organizationId: input.organizationId, capability: "single-sign-on-integration" };
});
