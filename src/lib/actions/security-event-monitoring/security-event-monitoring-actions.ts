"use server";

import { createAuthenticatedAction } from "@/lib/actions/authenticated-action";
import { assertSecurityEvent } from "@/lib/security-event-monitoring/security-event-monitoring";
import { ValidationError } from "@/lib/errors";

export type SecurityEventMonitoringActionInput = {
  organizationId: string;
  summary?: string;
};

export const recordSecurityEventMonitoringAction = createAuthenticatedAction<
  SecurityEventMonitoringActionInput,
  { organizationId: string; capability: string }
>({ module: "saas.security-event-monitoring.record" }, async (input) => {
  if (!input.organizationId) throw new ValidationError("Organization is required");
  assertSecurityEvent(input);
  return { organizationId: input.organizationId, capability: "security-event-monitoring" };
});
