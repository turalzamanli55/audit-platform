"use client";

import { useMemo, type ReactNode } from "react";
import { DashboardBrand } from "@/components/dashboard/dashboard-header";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { AppShell } from "@/components/layout/app-shell";
import { CommandPalette, type CommandPaletteItem } from "@/components/shell/command-palette";
import { GlobalSearchTrigger } from "@/components/shell/shell-nav";
import {
  ShellHeaderActions,
  type ShellHeaderActionsLabels,
} from "@/components/shell/shell-header-actions";
import {
  ShellDrawerFooter,
  type ShellDrawerFooterLabels,
} from "@/components/shell/shell-drawer-footer";
import type { CompanySwitcherItem } from "@/components/shell/company-switcher";
import type { DashboardNavItem } from "@/config/dashboard-navigation";
import { COMPANIES_PATH } from "@/config/dashboard-navigation";
import { DASHBOARD_PATH } from "@/config/auth";
import { useTheme } from "@/providers";

type AppShellExperienceLabels = ShellHeaderActionsLabels & {
  searchPlaceholder: string;
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
};

function buildCommandItems(
  navItems: DashboardNavItem[],
  labels: AppShellExperienceLabels,
  setMode: (mode: "light" | "dark" | "system") => void,
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
      id: "theme-light",
      label: labels.themeLight,
      group: "settings",
      keywords: ["theme", "light"],
      onSelect: () => setMode("light"),
    },
    {
      id: "theme-dark",
      label: labels.themeDark,
      group: "settings",
      keywords: ["theme", "dark"],
      onSelect: () => setMode("dark"),
    },
  ];
}

export function AppShellExperience({
  children,
  locale,
  navItems,
  labels,
  companies,
}: AppShellExperienceProps) {
  const { setMode } = useTheme();
  const commandItems = useMemo(
    () => buildCommandItems(navItems, labels, setMode),
    [navItems, labels, setMode],
  );

  const drawerLabels: ShellDrawerFooterLabels = {
    organization: labels.organization,
    workspace: labels.workspace,
    company: labels.company,
    theme: labels.theme,
    themeLight: labels.themeLight,
    themeDark: labels.themeDark,
    language: labels.language,
    userMenu: labels.userMenu,
    profile: labels.profile,
    signOut: labels.signOut,
  };

  return (
    <AppShell
      brand={<DashboardBrand />}
      headerCenter={<GlobalSearchTrigger placeholder={labels.searchPlaceholder} />}
      headerRight={<ShellHeaderActions labels={labels} companies={companies} />}
      sidebar={<DashboardNav items={navItems} />}
      sidebarFooter={<ShellDrawerFooter labels={drawerLabels} companies={companies} />}
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
