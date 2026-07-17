import { ValidationError } from "@/lib/errors";

export type SecurityEventMonitoringInput = {
  organizationId: string;
  summary?: string;
};

export function assertSecurityEvent(input: SecurityEventMonitoringInput): void {
  if (!input.organizationId?.trim()) {
    throw new ValidationError("Organization is required for security-event-monitoring");
  }
}

export class SecurityEventMonitoringEngine {
  assert(input: SecurityEventMonitoringInput): void {
    assertSecurityEvent(input);
  }
}
