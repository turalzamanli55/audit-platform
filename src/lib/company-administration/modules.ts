/**
 * Business-facing module catalog for Company Administration.
 * Maps plan entitlements + role permission prefixes — no new permission model.
 */

export const COMPANY_BUSINESS_MODULES = [
  {
    key: "planning",
    label: "Planning",
    entitlementKeys: ["planning"],
    permissionPrefixes: ["planning."],
  },
  {
    key: "working_papers",
    label: "Working Papers",
    entitlementKeys: ["working_papers", "lead_sheets"],
    permissionPrefixes: ["fieldwork.", "working_paper."],
  },
  {
    key: "financial_reporting",
    label: "Financial Reporting",
    entitlementKeys: ["reporting", "financial_statements", "ifrs_notes", "materiality"],
    permissionPrefixes: ["reporting.", "financialStatements.", "financial_reporting.", "materiality.", "ifrs_notes.", "fs_"],
  },
  {
    key: "risk_assessment",
    label: "Risk Assessment",
    entitlementKeys: ["risk"],
    permissionPrefixes: ["risk_assessment."],
  },
  {
    key: "analytics",
    label: "Analytics",
    entitlementKeys: ["analytics"],
    permissionPrefixes: ["analytics."],
  },
  {
    key: "ai",
    label: "AI",
    entitlementKeys: ["ai"],
    permissionPrefixes: ["ai."],
  },
] as const;

export type CompanyBusinessModuleKey = (typeof COMPANY_BUSINESS_MODULES)[number]["key"];

export type ModuleAccessState = "enabled" | "disabled" | "inherited";

export type ModuleAccessRow = {
  key: CompanyBusinessModuleKey;
  label: string;
  state: ModuleAccessState;
  reason: string;
};

function planHasEntitlement(
  entitlements: Record<string, boolean>,
  keys: readonly string[],
): boolean {
  return keys.some((key) => entitlements[key] === true);
}

function roleHasModulePermission(
  permissionCodes: string[],
  prefixes: readonly string[],
): boolean {
  return permissionCodes.some((code) => prefixes.some((prefix) => code.startsWith(prefix)));
}

/**
 * Resolves module availability for a user from plan entitlements + role permissions.
 * State meanings:
 * - disabled: plan does not include the module
 * - enabled: plan includes it and the role grants related permissions
 * - inherited: plan includes it; access comes from the assigned role (same as enabled, labeled for clarity)
 */
export function resolveModuleAccess(
  entitlements: Record<string, boolean>,
  permissionCodes: string[],
): ModuleAccessRow[] {
  return COMPANY_BUSINESS_MODULES.map((module) => {
    const onPlan = planHasEntitlement(entitlements, module.entitlementKeys);
    if (!onPlan) {
      return {
        key: module.key,
        label: module.label,
        state: "disabled" as const,
        reason: "Current plan does not include this module",
      };
    }

    const onRole = roleHasModulePermission(permissionCodes, module.permissionPrefixes);
    if (!onRole) {
      return {
        key: module.key,
        label: module.label,
        state: "disabled" as const,
        reason: "Not included in the assigned role",
      };
    }

    return {
      key: module.key,
      label: module.label,
      state: "inherited" as const,
      reason: "Inherited from role and company plan",
    };
  });
}

/** Friendly business labels for tenant roles (never expose platform terminology). */
export const COMPANY_ROLE_BUSINESS_LABELS: Record<string, { label: string; description: string }> = {
  organization_admin: {
    label: "Company Administrator",
    description: "Manages the company team, seats, workspaces, and daily access.",
  },
  workspace_admin: {
    label: "Workspace Lead",
    description: "Administers a workspace and its engagement team.",
  },
  manager: {
    label: "Manager",
    description: "Leads delivery work with elevated review access.",
  },
  member: {
    label: "Team Member",
    description: "Standard access to assigned audit work.",
  },
  viewer: {
    label: "Viewer",
    description: "Read-only access across assigned work.",
  },
};
