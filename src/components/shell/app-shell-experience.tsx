"use client";

import { useMemo, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { DashboardBrand } from "@/components/dashboard/dashboard-header";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { AppShell } from "@/components/layout/app-shell";
import { CommandPalette, type CommandPaletteItem } from "@/components/shell/command-palette";
import { GlobalSearchTrigger } from "@/components/shell/shell-nav";
import {
  ShellHeaderActions,
  type ShellHeaderActionsLabels,
} from "@/components/shell/shell-header-actions";
import { MobileSearchTrigger } from "@/components/shell/mobile-search-trigger";
import {
  ShellDrawerContext,
  type ShellDrawerContextLabels,
} from "@/components/shell/shell-drawer-context";
import { ShellSidebarUserFooter } from "@/components/shell/shell-sidebar-user-footer";
import type { CompanySwitcherItem } from "@/components/shell/company-switcher";
import type { DashboardWorkspaceLabels } from "@/i18n/dashboard-workspace-types";
import type { DashboardNavItem } from "@/config/dashboard-navigation";
import { COMPANIES_PATH } from "@/config/dashboard-navigation";
import { DASHBOARD_PATH } from "@/config/auth";
import { useSettings, useTheme } from "@/providers";

type AppShellExperienceLabels = ShellHeaderActionsLabels & {
  searchPlaceholder: string;
  drawerContextTitle: string;
  commandPalette: {
    placeholder: string;
    empty: string;
    recent: string;
    navigation: string;
    actions: string;
    settings: string;
    close: string;
  };
};

type AppShellExperienceProps = {
  children: ReactNode;
  locale: string;
  navItems: DashboardNavItem[];
  labels: AppShellExperienceLabels;
  companies: CompanySwitcherItem[];
  dashboardCommands: DashboardWorkspaceLabels["personalization"]["commands"];
};

function buildCommandItems(
  navItems: DashboardNavItem[],
  labels: AppShellExperienceLabels,
  dashboardCommands: DashboardWorkspaceLabels["personalization"]["commands"],
  handlers: {
    setMode: (mode: "light" | "dark" | "system") => void;
    toggleTheme: () => void;
    toggleSidebar: () => void;
    customize: () => void;
    reset: () => void;
    searchCompanies: () => void;
    searchEngagements: () => void;
    openCalendar: () => void;
    openAi: () => void;
  },
): CommandPaletteItem[] {
  const navigation = navItems.map((item) => ({
    id: item.href,
    label: item.label,
    group: "navigation",
    href: item.href,
    keywords: [item.label, item.href],
  }));

  return [
    ...navigation,
    {
      id: "create-company",
      label: "Create company",
      description: "Register a new legal entity",
      group: "actions",
      href: `${COMPANIES_PATH}/new`,
      keywords: ["create", "company", "new"],
    },
    {
      id: "dashboard",
      label: "Go to dashboard",
      group: "recent",
      href: DASHBOARD_PATH,
      keywords: ["home", "dashboard"],
    },
    {
      id: "customize-dashboard",
      label: dashboardCommands.customizeDashboard,
      group: "actions",
      keywords: ["customize", "dashboard", "layout", "widgets"],
      onSelect: handlers.customize,
    },
    {
      id: "reset-dashboard",
      label: dashboardCommands.resetDashboard,
      group: "actions",
      keywords: ["reset", "dashboard", "default"],
      onSelect: handlers.reset,
    },
    {
      id: "search-companies",
      label: dashboardCommands.searchCompanies,
      group: "actions",
      keywords: ["search", "companies"],
      onSelect: handlers.searchCompanies,
    },
    {
      id: "search-engagements",
      label: dashboardCommands.searchEngagements,
      group: "actions",
      keywords: ["search", "engagements", "placeholder"],
      onSelect: handlers.searchEngagements,
    },
    {
      id: "open-calendar",
      label: dashboardCommands.openCalendar,
      group: "actions",
      keywords: ["calendar", "deadlines"],
      onSelect: handlers.openCalendar,
    },
    {
      id: "open-ai",
      label: dashboardCommands.openAi,
      group: "actions",
      keywords: ["ai", "assistant"],
      onSelect: handlers.openAi,
    },
    {
      id: "toggle-sidebar",
      label: dashboardCommands.toggleSidebar,
      group: "settings",
      keywords: ["sidebar", "toggle", "navigation"],
      onSelect: handlers.toggleSidebar,
    },
    {
      id: "theme-light",
      label: labels.themeLight,
      group: "settings",
      keywords: ["theme", "light"],
      onSelect: () => handlers.setMode("light"),
    },
    {
      id: "theme-dark",
      label: labels.themeDark,
      group: "settings",
      keywords: ["theme", "dark"],
      onSelect: () => handlers.setMode("dark"),
    },
    {
      id: "toggle-theme",
      label: dashboardCommands.toggleTheme,
      group: "settings",
      keywords: ["theme", "toggle"],
      onSelect: handlers.toggleTheme,
    },
  ];
}

export function AppShellExperience({
  children,
  locale,
  navItems,
  labels,
  companies,
  dashboardCommands,
}: AppShellExperienceProps) {
  const router = useRouter();
  const { setMode, resolvedTheme } = useTheme();
  const { dashboardCommands: dashboardHandlers } = useSettings();

  const commandItems = useMemo(
    () =>
      buildCommandItems(
        navItems,
        labels,
        dashboardCommands,
        {
          setMode,
          toggleTheme: () => setMode(resolvedTheme === "dark" ? "light" : "dark"),
          toggleSidebar: () => {
            if (dashboardHandlers?.toggleSidebar) {
              dashboardHandlers.toggleSidebar();
              return;
            }
            window.dispatchEvent(new CustomEvent("shell:toggle-sidebar"));
          },
          customize: () => dashboardHandlers?.customize?.(),
          reset: () => dashboardHandlers?.reset?.(),
          searchCompanies: () => {
            if (dashboardHandlers?.searchCompanies) {
              dashboardHandlers.searchCompanies();
              return;
            }
            router.push(`/${locale}${COMPANIES_PATH}`);
          },
          searchEngagements: () => dashboardHandlers?.searchEngagements?.(),
          openCalendar: () => dashboardHandlers?.openCalendar?.(),
          openAi: () => dashboardHandlers?.openAi?.(),
        },
      ),
    [
      navItems,
      labels,
      dashboardCommands,
      setMode,
      resolvedTheme,
      dashboardHandlers,
      router,
      locale,
    ],
  );

  const drawerContextLabels: ShellDrawerContextLabels = {
    organization: labels.organization,
    workspace: labels.workspace,
    company: labels.company,
    contextTitle: labels.drawerContextTitle,
  };

  return (
    <AppShell
      brand={<DashboardBrand />}
      headerMobileSearch={
        <MobileSearchTrigger
          placeholder={labels.searchPlaceholder}
          label={labels.openSearch}
        />
      }
      headerCenter={<GlobalSearchTrigger placeholder={labels.searchPlaceholder} />}
      headerRight={<ShellHeaderActions labels={labels} companies={companies} />}
      sidebar={<DashboardNav items={navItems} />}
      sidebarDesktopFooter={<ShellSidebarUserFooter />}
      mobileDrawerContext={
        <ShellDrawerContext labels={drawerContextLabels} companies={companies} />
      }
      overlay={
        <CommandPalette
          items={commandItems}
          locale={locale}
          labels={labels.commandPalette}
        />
      }
    >
      {children}
    </AppShell>
  );
}
