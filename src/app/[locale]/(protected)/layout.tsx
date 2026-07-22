import type { ReactNode } from "react";
import { headers } from "next/headers";
import { ProtectedRouteGuard, OnboardingGuard } from "@/components/auth";
import { AppShellExperience } from "@/components/shell/app-shell-experience";
import { AiEverywhereLayoutBridge } from "@/components/ai-inline/shared/ai-everywhere-layout-bridge";
import { AI_EVERYWHERE_LABELS_EN } from "@/components/ai-inline/shared/labels";
import {
  coerceDashboardNavItems,
  COMPANIES_PATH,
  ENGAGEMENTS_PATH,
  IMPORT_INTELLIGENCE_PATH,
  AI_WORKSPACE_PATH,
  ADMINISTRATION_USERS_PATH,
  administrationNavItem,
  defaultDashboardNavItems,
} from "@/config/dashboard-navigation";
import { TenantProvider } from "@/providers/tenant-provider";
import { getTenantBootstrap, getCurrentUser } from "@/lib/auth/server";
import { authorizePermissionCodes } from "@/lib/auth/permissions";
import { MEMBERSHIP_PERMISSIONS } from "@/constants/membership";
import { resolveTenantLicenseAccess } from "@/lib/auth/license-access";
import { redirect } from "next/navigation";
import { readCompanySlugCookie, readEngagementSlugCookie } from "@/lib/auth/tenant-cookies";
import { loadCompanyList } from "@/lib/company/load-company-list";
import type { CompanyListLoadReason } from "@/lib/company/company-list-item";
import { loadEngagementList } from "@/lib/engagement/load-engagement-list";
import type { EngagementListLoadReason } from "@/lib/engagement/engagement-list-item";
import { getDictionary, isValidLocale, type Locale } from "@/i18n";
import { defaultLocale } from "@/i18n/config";

type ProtectedLayoutProps = {
  children: ReactNode;
};

export default async function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const headerStore = await headers();
  const localeHeader = headerStore.get("x-locale");
  const locale = (localeHeader && isValidLocale(localeHeader) ? localeHeader : defaultLocale) as Locale;
  const [dictionary, bootstrap, companyResult, engagementResult, preferredCompanySlug, preferredEngagementSlug, currentUser] =
    await Promise.all([
    getDictionary(locale),
    getTenantBootstrap(),
    loadCompanyList(),
    loadEngagementList(),
    readCompanySlugCookie(),
    readEngagementSlugCookie(),
    getCurrentUser(),
  ]);

  if (currentUser) {
    const licenseAccess = await resolveTenantLicenseAccess(currentUser.id);
    if (!licenseAccess.allowed) {
      redirect(`/${locale}/license-expired`);
    }
  }

  const tenantBootstrap = bootstrap ?? {
    organizations: [],
    workspaces: [],
    currentOrganizationId: null,
    currentWorkspaceId: null,
    hasOrganization: false,
    hasWorkspace: false,
    permissionCodes: [],
    roleSlugs: [],
  };

  const companies = companyResult.ok
    ? companyResult.items.map((item) => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
      }))
    : [];

  const engagements = engagementResult.ok
    ? engagementResult.items.map((item) => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        companyId: item.companyId,
        companyName: item.companyName,
        isArchived: item.isArchived,
      }))
    : [];

  const engagementEmptyHint =
    engagementResult.ok ? undefined
    : engagementResult.reason === "no_workspace" ? dictionary.engagements.noWorkspaceDescription
    : engagementResult.reason === "forbidden" ? dictionary.engagements.forbiddenDescription
    : undefined;

  const engagementsLoadReason: EngagementListLoadReason | undefined = engagementResult.ok
    ? undefined
    : engagementResult.reason;

  const companyEmptyHint =
    companyResult.ok ? undefined
    : companyResult.reason === "no_workspace" ? dictionary.companies.noWorkspaceDescription
    : companyResult.reason === "forbidden" ? dictionary.companies.forbiddenDescription
    : undefined;

  const companiesLoadReason: CompanyListLoadReason | undefined = companyResult.ok
    ? undefined
    : companyResult.reason;

  const canViewAdministration = authorizePermissionCodes(tenantBootstrap.permissionCodes, [
    MEMBERSHIP_PERMISSIONS.READ,
    MEMBERSHIP_PERMISSIONS.ADMINISTER,
  ]);

  const baseNav = [
    ...(Array.isArray(defaultDashboardNavItems) ? defaultDashboardNavItems : []),
    ...(canViewAdministration ? [administrationNavItem] : []),
  ];

  const navItems = coerceDashboardNavItems(
    baseNav.map((item) => ({
      ...item,
      label:
        item.href === COMPANIES_PATH
          ? dictionary.companies.navCompanies
          : item.href === ENGAGEMENTS_PATH
            ? dictionary.engagements.navEngagements
            : item.href === IMPORT_INTELLIGENCE_PATH
              ? dictionary.dashboard.navImportIntelligence
              : item.href === AI_WORKSPACE_PATH
                ? dictionary.dashboard.navAiWorkspace
                : item.href === ADMINISTRATION_USERS_PATH
                  ? dictionary.companyAdmin.navAdministration
                  : dictionary.dashboard.navDashboard,
    })),
  );

  return (
    <ProtectedRouteGuard>
      <OnboardingGuard
        hasOrganization={tenantBootstrap.hasOrganization}
        hasWorkspace={tenantBootstrap.hasWorkspace}
      >
        <TenantProvider
          key={`${tenantBootstrap.currentOrganizationId ?? "none"}-${tenantBootstrap.currentWorkspaceId ?? "none"}-${tenantBootstrap.hasOrganization}`}
          initial={tenantBootstrap}
        >
          <AppShellExperience
            locale={locale}
            navItems={navItems}
            companies={companies}
            preferredCompanySlug={preferredCompanySlug}
            companiesLoadReason={companiesLoadReason}
            companyEmptyHint={companyEmptyHint}
            engagements={engagements}
            preferredEngagementSlug={preferredEngagementSlug}
            engagementsLoadReason={engagementsLoadReason}
            engagementEmptyHint={engagementEmptyHint}
            labels={{
              organization: dictionary.dashboard.organization,
              workspace: dictionary.dashboard.workspace,
              company: dictionary.shell.companySwitcher,
              engagement: dictionary.shell.engagementSwitcher,
              themeLight: dictionary.dashboard.themeLight,
              themeDark: dictionary.dashboard.themeDark,
              theme: dictionary.dashboard.theme,
              language: dictionary.shell.language,
              notifications: dictionary.shell.notifications,
              notificationsEmpty: dictionary.shell.notificationsEmpty,
              markAllRead: dictionary.shell.markAllRead,
              userMenu: dictionary.shell.userMenu,
              profile: dictionary.shell.dashboardHome,
              signOut: dictionary.auth.signOut,
              openSearch: dictionary.shell.openSearch,
              workspaceRequired: dictionary.shell.workspaceRequired,
              accessRestricted: dictionary.shell.accessRestricted,
              toggleTheme: dictionary.shell.toggleTheme,
              drawerContextTitle: dictionary.shell.drawerContextTitle,
              searchPlaceholder: dictionary.shell.searchPlaceholder,
              commandPalette: dictionary.shell.commandPalette,
              expandSidebar: dictionary.shell.expandSidebar,
              collapseSidebar: dictionary.shell.collapseSidebar,
              navMainAria: dictionary.dashboard.navMainAria,
            }}
            dashboardCommands={dictionary.dashboardWorkspace.personalization.commands}
          >
            <AiEverywhereLayoutBridge labels={AI_EVERYWHERE_LABELS_EN}>
              {children}
            </AiEverywhereLayoutBridge>
          </AppShellExperience>
        </TenantProvider>
      </OnboardingGuard>
    </ProtectedRouteGuard>
  );
}
