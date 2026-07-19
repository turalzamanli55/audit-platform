import { PLATFORM_DASHBOARD_PATH } from "@/config/auth";
import type { NavKey } from "@/lib/platform-console/i18n";

export type PlatformNavItem = {
  href: string;
  /** Stable key used to look up an interface translation. */
  key: NavKey;
  /** English label; also the fallback when a translation is unavailable. */
  label: string;
};

/**
 * Platform Owner console navigation. Server-safe (no "use client").
 * Every item resolves under the protected `/app/platform` prefix.
 * `href` values are the source of truth for routing and must never change; the
 * `key`/`label` pair is purely presentational (see console i18n).
 */
export const PLATFORM_NAV_ITEMS: PlatformNavItem[] = [
  { href: PLATFORM_DASHBOARD_PATH, key: "dashboard", label: "Dashboard" },
  { href: `${PLATFORM_DASHBOARD_PATH}/search`, key: "search", label: "Search" },
  { href: `${PLATFORM_DASHBOARD_PATH}/tenants`, key: "companies", label: "Companies" },
  { href: `${PLATFORM_DASHBOARD_PATH}/organizations`, key: "organizations", label: "Organizations" },
  { href: `${PLATFORM_DASHBOARD_PATH}/users`, key: "users", label: "Users" },
  { href: `${PLATFORM_DASHBOARD_PATH}/subscriptions`, key: "subscriptions", label: "Subscriptions" },
  { href: `${PLATFORM_DASHBOARD_PATH}/licenses`, key: "licenses", label: "Licenses" },
  { href: `${PLATFORM_DASHBOARD_PATH}/plans`, key: "plans", label: "Plans" },
  { href: `${PLATFORM_DASHBOARD_PATH}/modules`, key: "modules", label: "Modules" },
  { href: `${PLATFORM_DASHBOARD_PATH}/feature-flags`, key: "featureFlags", label: "Feature Flags" },
  { href: `${PLATFORM_DASHBOARD_PATH}/monitoring`, key: "security", label: "Security Events" },
  { href: `${PLATFORM_DASHBOARD_PATH}/audit-logs`, key: "activity", label: "Activity" },
  { href: `${PLATFORM_DASHBOARD_PATH}/login-history`, key: "loginHistory", label: "Login History" },
  { href: `${PLATFORM_DASHBOARD_PATH}/database`, key: "database", label: "Database" },
  { href: `${PLATFORM_DASHBOARD_PATH}/devops`, key: "devops", label: "DevOps" },
  { href: `${PLATFORM_DASHBOARD_PATH}/settings`, key: "settings", label: "Settings" },
];
