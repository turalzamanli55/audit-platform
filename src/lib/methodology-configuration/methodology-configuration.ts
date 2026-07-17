import { ValidationError } from "@/lib/errors";

export type MethodologyConfigurationInput = {
  organizationId: string;
  summary?: string;
};

export function assertMethodologyConfiguration(input: MethodologyConfigurationInput): void {
  if (!input.organizationId?.trim()) {
    throw new ValidationError("Organization is required for methodology-configuration");
  }
}

export class MethodologyConfigurationEngine {
  assert(input: MethodologyConfigurationInput): void {
    assertMethodologyConfiguration(input);
  }
}
