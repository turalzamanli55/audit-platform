import { PLATFORM_DASHBOARD_PATH } from "@/config/auth";

export type PlatformNavItem = {
  href: string;
  label: string;
};

/**
 * Platform Owner console navigation. Server-safe (no "use client").
 * Every item resolves under the protected `/app/platform` prefix.
 */
export const PLATFORM_NAV_ITEMS: PlatformNavItem[] = [
  { href: PLATFORM_DASHBOARD_PATH, label: "Dashboard" },
  { href: `${PLATFORM_DASHBOARD_PATH}/tenants`, label: "Tenants" },
  { href: `${PLATFORM_DASHBOARD_PATH}/organizations`, label: "Organizations" },
  { href: `${PLATFORM_DASHBOARD_PATH}/users`, label: "Users" },
  { href: `${PLATFORM_DASHBOARD_PATH}/subscriptions`, label: "Subscriptions" },
  { href: `${PLATFORM_DASHBOARD_PATH}/licenses`, label: "Licenses" },
  { href: `${PLATFORM_DASHBOARD_PATH}/plans`, label: "Plans" },
  { href: `${PLATFORM_DASHBOARD_PATH}/modules`, label: "Modules" },
  { href: `${PLATFORM_DASHBOARD_PATH}/feature-flags`, label: "Feature Flags" },
  { href: `${PLATFORM_DASHBOARD_PATH}/marketplace`, label: "Marketplace" },
  { href: `${PLATFORM_DASHBOARD_PATH}/billing`, label: "Billing" },
  { href: `${PLATFORM_DASHBOARD_PATH}/storage`, label: "Storage" },
  { href: `${PLATFORM_DASHBOARD_PATH}/monitoring`, label: "Monitoring" },
  { href: `${PLATFORM_DASHBOARD_PATH}/audit-logs`, label: "Audit Logs" },
  { href: `${PLATFORM_DASHBOARD_PATH}/impersonation`, label: "Impersonation" },
  { href: `${PLATFORM_DASHBOARD_PATH}/database`, label: "Database" },
  { href: `${PLATFORM_DASHBOARD_PATH}/devops`, label: "DevOps" },
  { href: `${PLATFORM_DASHBOARD_PATH}/settings`, label: "Settings" },
];
