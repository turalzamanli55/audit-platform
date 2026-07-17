import { ValidationError } from "@/lib/errors";

export type ExportAndPortabilityInput = {
  organizationId: string;
  summary?: string;
};

export function assertExportAndPortabilityRequest(input: ExportAndPortabilityInput): void {
  if (!input.organizationId?.trim()) {
    throw new ValidationError("Organization is required for export-and-portability");
  }
}

export class ExportAndPortabilityEngine {
  assert(input: ExportAndPortabilityInput): void {
    assertExportAndPortabilityRequest(input);
  }
}
