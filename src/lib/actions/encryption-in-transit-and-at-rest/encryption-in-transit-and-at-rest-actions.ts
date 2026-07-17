"use server";

import { createAuthenticatedAction } from "@/lib/actions/authenticated-action";
import { assertEncryptionControls } from "@/lib/encryption-in-transit-and-at-rest/encryption-in-transit-and-at-rest";
import { ValidationError } from "@/lib/errors";

export type EncryptionInTransitAndAtRestActionInput = {
  organizationId: string;
  summary?: string;
};

export const configureEncryptionInTransitAndAtRestAction = createAuthenticatedAction<
  EncryptionInTransitAndAtRestActionInput,
  { organizationId: string; capability: string }
>({ module: "saas.encryption-in-transit-and-at-rest.configure" }, async (input) => {
  if (!input.organizationId) throw new ValidationError("Organization is required");
  assertEncryptionControls(input);
  return { organizationId: input.organizationId, capability: "encryption-in-transit-and-at-rest" };
});
