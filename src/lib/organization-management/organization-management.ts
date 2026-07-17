import { ValidationError } from "@/lib/errors";

export type OrganizationManagementInput = {
  organizationId: string;
  summary?: string;
};

export function assertOrganizationManagementProfile(input: OrganizationManagementInput): void {
  if (!input.organizationId?.trim()) {
    throw new ValidationError("Organization is required for organization-management");
  }
}

export class OrganizationManagementEngine {
  assert(input: OrganizationManagementInput): void {
    assertOrganizationManagementProfile(input);
  }
}
