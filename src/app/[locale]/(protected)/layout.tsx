import type { ReactNode } from "react";
import { headers } from "next/headers";
import { ProtectedRouteGuard, OnboardingGuard } from "@/components/auth";
import { AppShellExperience } from "@/components/shell/app-shell-experience";
import {
  coerceDashboardNavItems,
  COMPANIES_PATH,
  defaultDashboardNavItems,
} from "@/config/dashboard-navigation";
import { TenantProvider } from "@/providers/tenant-provider";
import { getTenantBootstrap } from "@/lib/auth/server";
import { getDictionary, isValidLocale, type Locale } from "@/i18n";
import { defaultLocale } from "@/i18n/config";

type ProtectedLayoutProps = {
  children: ReactNode;
};

export default async function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const headerStore = await headers();
  const localeHeader = headerStore.get("x-locale");
  const locale = (localeHeader && isValidLocale(localeHeader) ? localeHeader : defaultLocale) as Locale;
  const dictionary = await getDictionary(locale);
  const bootstrap = await getTenantBootstrap();

  const tenantBootstrap = bootstrap ?? {
    organizations: [],
    workspaces: [],
    currentOrganizationId: null,
    currentWorkspaceId: null,
    hasOrganization: false,
    permissionCodes: [],
    roleSlugs: [],
  };

  const navItems = coerceDashboardNavItems(
    (Array.isArray(defaultDashboardNavItems) ? defaultDashboardNavItems : []).map((item) => ({
      ...item,
      label:
        item.href === COMPANIES_PATH
          ? dictionary.companies.navCompanies
          : dictionary.dashboard.navDashboard,
    })),
  );

  return (
    <ProtectedRouteGuard>
      <OnboardingGuard hasOrganization={tenantBootstrap.hasOrganization}>
        <TenantProvider
          key={`${tenantBootstrap.currentOrganizationId ?? "none"}-${tenantBootstrap.currentWorkspaceId ?? "none"}-${tenantBootstrap.hasOrganization}`}
          initial={tenantBootstrap}
        >
          <AppShellExperience
            locale={locale}
            navItems={navItems}
            labels={{
              organization: dictionary.dashboard.organization,
              workspace: dictionary.dashboard.workspace,
              themeLight: dictionary.dashboard.themeLight,
              themeDark: dictionary.dashboard.themeDark,
              theme: dictionary.dashboard.theme,
              searchPlaceholder: dictionary.shell.searchPlaceholder,
              commandPalette: dictionary.shell.commandPalette,
            }}
          >
            {children}
          </AppShellExperience>
        </TenantProvider>
      </OnboardingGuard>
    </ProtectedRouteGuard>
  );
}
