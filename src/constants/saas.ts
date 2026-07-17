export const SAAS_PERMISSIONS = {
  PLATFORM_MANAGE: "saas.platform.manage",
  TENANT_PROVISION: "saas.tenant.provision",
  LICENSE_ASSIGN: "saas.license.assign",
  USER_INVITE: "saas.user.invite",
  ROLE_MANAGE: "saas.role.manage",
  WORKSPACE_MANAGE: "saas.workspace.manage",
  SESSION_MANAGE: "saas.session.manage",
  SSO_CONFIGURE: "saas.sso.configure",
  SECURITY_MONITOR: "saas.security.monitor",
  FEATURE_FLAG_MANAGE: "saas.feature-flag.manage",
  IMPERSONATE: "saas.impersonate",
} as const;

export const ROLE_AND_PERMISSION_MANAGEMENT_PERMISSIONS = {
  READ: SAAS_PERMISSIONS.ROLE_MANAGE,
  MANAGE: SAAS_PERMISSIONS.ROLE_MANAGE,
} as const;

export const TENANT_TYPES = ["solo", "business", "enterprise"] as const;
export type TenantType = (typeof TENANT_TYPES)[number];

export const SUBSCRIPTION_STATUSES = [
  "trial",
  "active",
  "expired",
  "suspended",
  "cancelled",
] as const;
