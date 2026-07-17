import { ValidationError } from "@/lib/errors";

export type EntityManagementInput = {
  organizationId: string;
  summary?: string;
};

export function assertEntityManagementUnit(input: EntityManagementInput): void {
  if (!input.organizationId?.trim()) {
    throw new ValidationError("Organization is required for entity-management");
  }
}

export class EntityManagementEngine {
  assert(input: EntityManagementInput): void {
    assertEntityManagementUnit(input);
  }
}
