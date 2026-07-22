/** Membership permission codes seeded in the platform role catalog. */
export const MEMBERSHIP_PERMISSIONS = {
  READ: "membership.read",
  ADMINISTER: "membership.administer",
} as const;

/** Audit log permission for company activity views. */
export const AUDIT_LOG_PERMISSIONS = {
  READ: "audit_log.read",
} as const;

/**
 * Roles a Company Administrator may assign inside their own tenant.
 * Excludes platform_owner and organization_owner to prevent privilege escalation.
 */
export const COMPANY_ADMIN_ASSIGNABLE_ROLES = [
  { value: "organization_admin", label: "Organization Admin" },
  { value: "workspace_admin", label: "Workspace Admin" },
  { value: "manager", label: "Manager" },
  { value: "member", label: "Member" },
  { value: "viewer", label: "Viewer" },
] as const;

export type CompanyAdminAssignableRole =
  (typeof COMPANY_ADMIN_ASSIGNABLE_ROLES)[number]["value"];

export const COMPANY_ADMINISTRATION_PATH = "/app/administration/users";
