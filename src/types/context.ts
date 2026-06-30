import type { Permission, Role } from "@/types/auth";

export type OrganizationContext = {
  organizationId: string | null;
  isResolved: boolean;
};

export type WorkspaceContext = {
  workspaceId: string | null;
  isResolved: boolean;
};

export type CompanyContext = {
  companyId: string | null;
  isResolved: boolean;
};

export type PermissionContext = {
  permissions: Permission[];
  isResolved: boolean;
};

export type RoleContext = {
  roles: Role[];
  isResolved: boolean;
};

export type TenantContext = {
  organization: OrganizationContext;
  workspace: WorkspaceContext;
  company: CompanyContext;
  permissions: PermissionContext;
  roles: RoleContext;
};

export type RepositoryContext = {
  tenant: TenantContext;
  userId: string | null;
  correlationId?: string;
};

export type { AuthSession, SessionUser, AuthStatus } from "./auth";
