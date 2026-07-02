/**
 * Site-wide configuration.
 */
export const siteConfig = {
  name: "Audit Platform",
  description: "Enterprise AI Audit, IFRS Reporting, and Financial Intelligence Platform",
  defaultLocale: "az" as const,
  localeCookieName: "audit-locale",
  themeCookieName: "audit-theme",
  organizationCookieName: "audit-organization-id",
  workspaceCookieName: "audit-workspace-id",
  companyCookieName: "audit-company-slug",
  engagementCookieName: "audit-engagement-slug",
} as const;
