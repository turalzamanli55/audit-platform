import { PLATFORM_DASHBOARD_PATH } from "@/config/auth";
import type { PlatformNavKey } from "@/i18n/platform-labels";

export type PlatformNavItem = {
  href: string;
  /** Stable key used to look up the interface translation in the shared dictionary. */
  key: PlatformNavKey;
  /** English label; also the fallback when a translation is unavailable. */
  label: string;
};

/**
 * Daily Platform Owner navigation. Routes are unchanged; only which items appear
 * in the primary sidebar is simplified. Advanced tools remain reachable from Settings.
 */
export const PLATFORM_PRIMARY_NAV: PlatformNavItem[] = [
  { href: PLATFORM_DASHBOARD_PATH, key: "dashboard", label: "Dashboard" },
  { href: `${PLATFORM_DASHBOARD_PATH}/tenants`, key: "companies", label: "Companies" },
  { href: `${PLATFORM_DASHBOARD_PATH}/users`, key: "users", label: "Users" },
  { href: `${PLATFORM_DASHBOARD_PATH}/monitoring`, key: "security", label: "Security" },
  { href: `${PLATFORM_DASHBOARD_PATH}/settings`, key: "settings", label: "Settings" },
];

/** Advanced tools surfaced from the Settings hub (routes preserved). */
export const PLATFORM_SETTINGS_TOOLS: PlatformNavItem[] = [
  { href: `${PLATFORM_DASHBOARD_PATH}/plans`, key: "plans", label: "Plans" },
  { href: `${PLATFORM_DASHBOARD_PATH}/modules`, key: "modules", label: "Modules" },
  { href: `${PLATFORM_DASHBOARD_PATH}/feature-flags`, key: "featureFlags", label: "Feature Flags" },
  { href: `${PLATFORM_DASHBOARD_PATH}/organizations`, key: "organizations", label: "Organizations" },
  { href: `${PLATFORM_DASHBOARD_PATH}/subscriptions`, key: "subscriptions", label: "Subscriptions" },
  { href: `${PLATFORM_DASHBOARD_PATH}/licenses`, key: "licenses", label: "Licenses" },
  { href: `${PLATFORM_DASHBOARD_PATH}/audit-logs`, key: "activity", label: "Activity" },
  { href: `${PLATFORM_DASHBOARD_PATH}/login-history`, key: "loginHistory", label: "Login History" },
  { href: `${PLATFORM_DASHBOARD_PATH}/database`, key: "database", label: "Database" },
  { href: `${PLATFORM_DASHBOARD_PATH}/devops`, key: "devops", label: "DevOps" },
];

/** Full catalog of console destinations (routes unchanged). */
export const PLATFORM_NAV_ITEMS: PlatformNavItem[] = [
  ...PLATFORM_PRIMARY_NAV,
  { href: `${PLATFORM_DASHBOARD_PATH}/search`, key: "search", label: "Search" },
  ...PLATFORM_SETTINGS_TOOLS,
];
