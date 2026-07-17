"use server";

import { createAuthenticatedAction } from "@/lib/actions/authenticated-action";
import { assertLegalHoldPolicy } from "@/lib/legal-hold-and-retention/legal-hold-and-retention";
import { ValidationError } from "@/lib/errors";

export type LegalHoldAndRetentionActionInput = {
  organizationId: string;
  summary?: string;
};

export const configureLegalHoldAndRetentionAction = createAuthenticatedAction<
  LegalHoldAndRetentionActionInput,
  { organizationId: string; capability: string }
>({ module: "saas.legal-hold-and-retention.configure" }, async (input) => {
  if (!input.organizationId) throw new ValidationError("Organization is required");
  assertLegalHoldPolicy(input);
  return { organizationId: input.organizationId, capability: "legal-hold-and-retention" };
});
