import { ValidationError } from "@/lib/errors";

export type SessionManagementInput = {
  organizationId: string;
  summary?: string;
};

export function assertSessionManagementPolicy(input: SessionManagementInput): void {
  if (!input.organizationId?.trim()) {
    throw new ValidationError("Organization is required for session-management");
  }
}

export class SessionManagementEngine {
  assert(input: SessionManagementInput): void {
    assertSessionManagementPolicy(input);
  }
}
