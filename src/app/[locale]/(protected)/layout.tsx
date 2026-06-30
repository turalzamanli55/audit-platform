import type { ReactNode } from "react";
import { headers } from "next/headers";
import { ProtectedRouteGuard, OnboardingGuard } from "@/components/auth";
import { AppShell } from "@/components/layout";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import {
  coerceDashboardNavItems,
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
      label: dictionary.dashboard.navDashboard,
    })),
  );

  return (
    <ProtectedRouteGuard>
      <OnboardingGuard hasOrganization={tenantBootstrap.hasOrganization}>
        <TenantProvider initial={tenantBootstrap}>
          <AppShell
            header={
              <Header>
                <DashboardHeader
                  labels={{
                    organization: dictionary.dashboard.organization,
                    workspace: dictionary.dashboard.workspace,
                    themeLight: dictionary.dashboard.themeLight,
                    themeDark: dictionary.dashboard.themeDark,
                  }}
                />
              </Header>
            }
            sidebar={
              <Sidebar>
                <DashboardNav items={navItems} />
              </Sidebar>
            }
          >
            {children}
          </AppShell>
        </TenantProvider>
      </OnboardingGuard>
    </ProtectedRouteGuard>
  );
}
