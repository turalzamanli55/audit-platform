import { ValidationError } from "@/lib/errors";

export type EncryptionInTransitAndAtRestInput = {
  organizationId: string;
  summary?: string;
};

export function assertEncryptionControls(input: EncryptionInTransitAndAtRestInput): void {
  if (!input.organizationId?.trim()) {
    throw new ValidationError("Organization is required for encryption-in-transit-and-at-rest");
  }
}

export class EncryptionInTransitAndAtRestEngine {
  assert(input: EncryptionInTransitAndAtRestInput): void {
    assertEncryptionControls(input);
  }
}
