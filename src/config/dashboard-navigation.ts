import { DASHBOARD_PATH } from "@/config/auth";

export const COMPANIES_PATH = "/app/companies";
export const COMPANIES_NEW_PATH = "/app/companies/new";
export const ENGAGEMENTS_PATH = "/app/engagements";
export const ENGAGEMENTS_NEW_PATH = "/app/engagements/new";

export const IMPORT_INTELLIGENCE_PATH = "/app/import-intelligence";
export const AI_WORKSPACE_PATH = "/ai";

export type DashboardNavItem = {
  href: string;
  label: string;
};

/**
 * Platform dashboard navigation catalog — server-safe (no "use client").
 * Import from here in Server Components; never from client modules.
 */
export const defaultDashboardNavItems: DashboardNavItem[] = [
  { href: DASHBOARD_PATH, label: "Dashboard" },
  { href: COMPANIES_PATH, label: "Companies" },
  { href: ENGAGEMENTS_PATH, label: "Engagements" },
  { href: IMPORT_INTELLIGENCE_PATH, label: "Import Intelligence" },
  { href: AI_WORKSPACE_PATH, label: "AI Workspace" },
];

export function coerceDashboardNavItems(items: unknown): DashboardNavItem[] {
  if (!Array.isArray(items)) {
    return [];
  }

  return items.filter(
    (item): item is DashboardNavItem =>
      typeof item === "object" &&
      item !== null &&
      "href" in item &&
      typeof item.href === "string" &&
      "label" in item &&
      typeof item.label === "string",
  );
}
