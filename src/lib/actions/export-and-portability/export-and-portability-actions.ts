"use server";

import { createAuthenticatedAction } from "@/lib/actions/authenticated-action";
import { assertExportAndPortabilityRequest } from "@/lib/export-and-portability/export-and-portability";
import { ValidationError } from "@/lib/errors";

export type ExportAndPortabilityActionInput = {
  organizationId: string;
  summary?: string;
};

export const requestExportAndPortabilityAction = createAuthenticatedAction<
  ExportAndPortabilityActionInput,
  { organizationId: string; capability: string }
>({ module: "saas.export-and-portability.request" }, async (input) => {
  if (!input.organizationId) throw new ValidationError("Organization is required");
  assertExportAndPortabilityRequest(input);
  return { organizationId: input.organizationId, capability: "export-and-portability" };
});
