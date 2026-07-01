"use client";

import type { ReactNode } from "react";
import { DashboardBrand, DashboardHeaderActions } from "@/components/dashboard/dashboard-header";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { AppShell } from "@/components/layout/app-shell";
import { CommandPalette, type CommandPaletteItem } from "@/components/shell/command-palette";
import { GlobalSearchTrigger } from "@/components/shell/shell-nav";
import type { DashboardNavItem } from "@/config/dashboard-navigation";
import { COMPANIES_PATH } from "@/config/dashboard-navigation";
import { DASHBOARD_PATH } from "@/config/auth";

type AppShellExperienceLabels = {
  organization: string;
  workspace: string;
  themeLight: string;
  themeDark: string;
  theme: string;
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
};

function buildCommandItems(
  navItems: DashboardNavItem[],
  labels: AppShellExperienceLabels,
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
    },
    {
      id: "theme-dark",
      label: labels.themeDark,
      group: "settings",
      keywords: ["theme", "dark"],
    },
  ];
}

export function AppShellExperience({
  children,
  locale,
  navItems,
  labels,
}: AppShellExperienceProps) {
  const commandItems = buildCommandItems(navItems, labels);

  return (
    <AppShell
      brand={<DashboardBrand />}
      headerCenter={<GlobalSearchTrigger placeholder={labels.searchPlaceholder} />}
      headerRight={
        <DashboardHeaderActions
          labels={{
            organization: labels.organization,
            workspace: labels.workspace,
            themeLight: labels.themeLight,
            themeDark: labels.themeDark,
            theme: labels.theme,
          }}
        />
      }
      sidebar={<DashboardNav items={navItems} />}
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
