import { ValidationError } from "@/lib/errors";

export type TemplateManagementInput = {
  organizationId: string;
  summary?: string;
};

export function assertTemplateManagementItem(input: TemplateManagementInput): void {
  if (!input.organizationId?.trim()) {
    throw new ValidationError("Organization is required for template-management");
  }
}

export class TemplateManagementEngine {
  assert(input: TemplateManagementInput): void {
    assertTemplateManagementItem(input);
  }
}
