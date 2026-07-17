"use server";

import { createAuthenticatedAction } from "@/lib/actions/authenticated-action";
import { assertTemplateManagementItem } from "@/lib/template-management/template-management";
import { ValidationError } from "@/lib/errors";

export type TemplateManagementActionInput = {
  organizationId: string;
  summary?: string;
};

export const upsertTemplateManagementAction = createAuthenticatedAction<
  TemplateManagementActionInput,
  { organizationId: string; capability: string }
>({ module: "saas.template-management.upsert" }, async (input) => {
  if (!input.organizationId) throw new ValidationError("Organization is required");
  assertTemplateManagementItem(input);
  return { organizationId: input.organizationId, capability: "template-management" };
});
