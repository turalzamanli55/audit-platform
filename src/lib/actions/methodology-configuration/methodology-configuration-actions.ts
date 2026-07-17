"use server";

import { createAuthenticatedAction } from "@/lib/actions/authenticated-action";
import { assertMethodologyConfiguration } from "@/lib/methodology-configuration/methodology-configuration";
import { ValidationError } from "@/lib/errors";

export type MethodologyConfigurationActionInput = {
  organizationId: string;
  summary?: string;
};

export const upsertMethodologyConfigurationAction = createAuthenticatedAction<
  MethodologyConfigurationActionInput,
  { organizationId: string; capability: string }
>({ module: "saas.methodology-configuration.upsert" }, async (input) => {
  if (!input.organizationId) throw new ValidationError("Organization is required");
  assertMethodologyConfiguration(input);
  return { organizationId: input.organizationId, capability: "methodology-configuration" };
});
