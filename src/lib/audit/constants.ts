export const AUDIT_ACTIONS = {
  REGISTER: "auth.register",
  LOGIN: "auth.login",
  LOGOUT: "auth.logout",
  ORGANIZATION_CREATED: "organization.created",
  WORKSPACE_CREATED: "workspace.created",
  MEMBERSHIP_CREATED: "membership.created",
  COMPANY_CREATED: "company.created",
  COMPANY_UPDATED: "company.updated",
  COMPANY_SETTINGS_UPDATED: "company.settings.updated",
  COMPANY_ARCHIVED: "company.archived",
  COMPANY_RESTORED: "company.restored",
} as const;
