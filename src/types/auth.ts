/**
 * Canonical platform roles — aligned with MASTER_PRD IAM model.
 * Sprint 2C: extended with database platform role slugs (Sprint 2B seed).
 */

export const ROLES = {
  ORGANIZATION_OWNER: "organization_owner",
  WORKSPACE_ADMINISTRATOR: "workspace_admin",
  ENGAGEMENT_PARTNER: "engagement_partner",
  AUDIT_MANAGER: "audit_manager",
  AUDIT_SENIOR: "audit_senior",
  AUDITOR: "auditor",
  FINANCIAL_CONTROLLER: "financial_controller",
  CLIENT_USER: "client_user",
  PLATFORM_OPERATOR: "platform_owner",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const PLATFORM_ROLE_SLUGS = {
  PLATFORM_OWNER: "platform_owner",
  ORGANIZATION_OWNER: "organization_owner",
  ORGANIZATION_ADMIN: "organization_admin",
  WORKSPACE_ADMIN: "workspace_admin",
  MANAGER: "manager",
  MEMBER: "member",
  VIEWER: "viewer",
} as const;

export type PlatformRoleSlug = (typeof PLATFORM_ROLE_SLUGS)[keyof typeof PLATFORM_ROLE_SLUGS];

export const CAPABILITIES = {
  READ: "read",
  CREATE: "create",
  EDIT: "edit",
  REVIEW: "review",
  APPROVE: "approve",
  EXPORT: "export",
  ADMINISTER: "administer",
  CONFIGURE: "configure",
} as const;

export type Capability = (typeof CAPABILITIES)[keyof typeof CAPABILITIES];

export const SCOPES = {
  ORGANIZATION: "organization",
  WORKSPACE: "workspace",
  ENGAGEMENT: "engagement",
  ENTITY: "entity",
} as const;

export type Scope = (typeof SCOPES)[keyof typeof SCOPES];

export type Permission = {
  capability: Capability;
  scope: Scope;
  resourceId?: string;
};

export type SessionUser = {
  id: string;
  email: string;
  displayName: string;
  organizationId: string;
  workspaceId: string;
  roles: Role[];
  roleSlugs: string[];
  permissions: Permission[];
  permissionCodes: string[];
  hasOrganization: boolean;
  locale: string;
  timezone: string;
};

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export type AuthSession = {
  status: AuthStatus;
  user: SessionUser | null;
  expiresAt: string | null;
};

export type AuthProviderId = "credentials" | "sso" | "magic_link";

export type AuthContextValue = {
  session: AuthSession;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
};
