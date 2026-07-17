import { ValidationError } from "@/lib/errors";

export type WorkspaceManagementInput = {
  organizationId: string;
  summary?: string;
};

export function assertWorkspaceManagementSettings(input: WorkspaceManagementInput): void {
  if (!input.organizationId?.trim()) {
    throw new ValidationError("Organization is required for workspace-management");
  }
}

export class WorkspaceManagementEngine {
  assert(input: WorkspaceManagementInput): void {
    assertWorkspaceManagementSettings(input);
  }
}
