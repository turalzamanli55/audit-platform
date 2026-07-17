import { ValidationError } from "@/lib/errors";

export type LegalHoldAndRetentionInput = {
  organizationId: string;
  summary?: string;
};

export function assertLegalHoldPolicy(input: LegalHoldAndRetentionInput): void {
  if (!input.organizationId?.trim()) {
    throw new ValidationError("Organization is required for legal-hold-and-retention");
  }
}

export class LegalHoldAndRetentionEngine {
  assert(input: LegalHoldAndRetentionInput): void {
    assertLegalHoldPolicy(input);
  }
}
