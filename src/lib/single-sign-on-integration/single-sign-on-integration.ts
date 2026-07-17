import { ValidationError } from "@/lib/errors";

export type SingleSignOnIntegrationInput = {
  organizationId: string;
  summary?: string;
};

export function assertSingleSignOnProvider(input: SingleSignOnIntegrationInput): void {
  if (!input.organizationId?.trim()) {
    throw new ValidationError("Organization is required for single-sign-on-integration");
  }
}

export class SingleSignOnIntegrationEngine {
  assert(input: SingleSignOnIntegrationInput): void {
    assertSingleSignOnProvider(input);
  }
}
